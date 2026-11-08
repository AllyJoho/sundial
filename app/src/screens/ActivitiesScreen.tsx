// Manage categories, activities, and sub-activities.
import { useState } from 'react';
import { createActivity, createCategory, updateActivity, updateCategory } from '../actions';
import { ChipChoice } from '../components/Choice';
import { Sheet } from '../components/Sheet';
import { db } from '../db';
import { UNCATEGORIZED_COLOR, type Library } from '../hooks';
import { CATEGORY_COLORS, colorVar, nextCategoryColor } from '../palette';
import type { Activity, Category } from '../types';


type Editing =
  | { kind: 'activity'; activity?: Activity; categoryId: string | null; parentId: string | null }
  | { kind: 'category'; category?: Category };

export function ActivitiesScreen({ lib }: { lib: Library }) {
  const [editing, setEditing] = useState<Editing | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const visible = (a: Activity) => showArchived || !a.archived;
  const categories = lib.categories.filter((c) => showArchived || !c.archived);
  const inCategory = (catId: string | null) =>
    lib.activities
      .filter((a) => visible(a) && !a.parentId)
      .filter((a) => (catId === null ? !a.categoryId || !lib.categoryById.has(a.categoryId) : a.categoryId === catId))
      .sort((a, b) => a.name.localeCompare(b.name));
  const subsOf = (id: string) => lib.activities.filter((a) => a.parentId === id && visible(a)).sort((a, b) => a.name.localeCompare(b.name));
  const uncategorized = inCategory(null);
  const archivedCount = lib.activities.filter((a) => a.archived).length + lib.categories.filter((c) => c.archived).length;

  const row = (a: Activity, sub = false) => (
    <li key={a.id} className={`act-row ${sub ? 'sub' : ''} ${a.archived ? 'archived' : ''}`}>
      <button
        className={`star ${a.favorite ? 'on' : ''}`}
        aria-label={a.favorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => updateActivity(a.id, { favorite: !a.favorite })}
      >
        {a.favorite ? '★' : '☆'}
      </button>
      <button className="act-name" onClick={() => setEditing({ kind: 'activity', activity: a, categoryId: a.categoryId, parentId: a.parentId })}>
        {lib.emoji(a)} {a.name}
        {a.archived && <span className="muted small"> (archived)</span>}
      </button>
      {!sub && (
        <button
          className="add-sub"
          onClick={() => setEditing({ kind: 'activity', categoryId: a.categoryId, parentId: a.id })}
          aria-label={`Add sub-activity to ${a.name}`}
        >
          + sub
        </button>
      )}
    </li>
  );
  const tree = (list: Activity[]) => list.flatMap((a) => [row(a), ...subsOf(a.id).map((s) => row(s, true))]);

  return (
    <div className="screen">
      <header className="day-header">
        <div className="day-title">Activities</div>
        <div className="muted">★ = always in "Your usual" on the home screen (otherwise it learns from what you use). Tap a name to edit.</div>
      </header>

      {uncategorized.length > 0 && (
        <section className="card cat-card" style={{ ['--tile-color' as string]: UNCATEGORIZED_COLOR }}>
          <div className="cat-header">
            <h3>Uncategorized</h3>
          </div>
          <p className="muted small">Quick-added things land here. Tap one to give it a category.</p>
          <ul className="act-list">{tree(uncategorized)}</ul>
        </section>
      )}

      {categories.map((c) => (
        <section key={c.id} className={`card cat-card ${c.archived ? 'archived' : ''}`} style={{ ['--tile-color' as string]: colorVar(c.color) }}>
          <div className="cat-header">
            <h3>
              {c.emoji} {c.name}
              {c.archived && <span className="muted small"> (archived)</span>}
            </h3>
            <button className="link-btn" onClick={() => setEditing({ kind: 'category', category: c })}>
              Edit
            </button>
          </div>
          <ul className="act-list">{tree(inCategory(c.id))}</ul>
          <button className="link-btn" onClick={() => setEditing({ kind: 'activity', categoryId: c.id, parentId: null })}>
            + Add activity
          </button>
        </section>
      ))}

      <div className="row-buttons">
        <button className="btn" onClick={() => setEditing({ kind: 'category' })}>
          + New category
        </button>
        {archivedCount > 0 && (
          <button className="btn" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? 'Hide archived' : `Show archived (${archivedCount})`}
          </button>
        )}
      </div>

      {editing?.kind === 'activity' && <ActivityEditor lib={lib} {...editing} onClose={() => setEditing(null)} />}
      {editing?.kind === 'category' && (
        <CategoryEditor category={editing.category} used={lib.categories.filter((c) => !c.archived).map((c) => c.color)} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function ActivityEditor({
  lib,
  activity,
  categoryId: initialCat,
  parentId: initialParent,
  onClose,
}: {
  lib: Library;
  activity?: Activity;
  categoryId: string | null;
  parentId: string | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(activity?.name ?? '');
  const [emoji, setEmoji] = useState(activity?.emoji ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(initialCat);
  const [parentId, setParentId] = useState<string | null>(initialParent);
  const [favorite, setFavorite] = useState(activity?.favorite ?? false);

  // Possible parents: top-level activities in the same category (and not this one).
  const hasSubs = !!activity && lib.activities.some((a) => a.parentId === activity.id);
  const parents = lib.activities.filter(
    (a) => !a.parentId && !a.archived && a.id !== activity?.id && a.id !== '#act-downtime' && a.categoryId === categoryId,
  );

  async function save() {
    const clean = name.trim();
    if (!clean) return;
    const fields = { name: clean, emoji: emoji.trim() || undefined, categoryId, parentId: hasSubs ? null : parentId, favorite };
    if (activity) {
      await db.transaction('rw', db.activities, async () => {
        await updateActivity(activity.id, fields);
        // Sub-activities follow their parent into the new category.
        if (activity.categoryId !== categoryId) await db.activities.where('parentId').equals(activity.id).modify({ categoryId });
      });
    } else {
      await createActivity(fields);
    }
    onClose();
  }

  async function toggleArchive() {
    if (!activity) return;
    await updateActivity(activity.id, { archived: !activity.archived, favorite: activity.archived ? activity.favorite : false });
    onClose();
  }

  return (
    <Sheet title={activity ? 'Edit activity' : parentId ? 'New sub-activity' : 'New activity'} onClose={onClose}>
      <div className="field-row">
        <label className="field emoji-field">
          <span>Emoji</span>
          <input value={emoji} onChange={(e) => setEmoji(oneEmoji(e.target.value))} aria-label="Emoji" />
        </label>
        <label className="field grow">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CS 235" autoFocus={!activity} />
        </label>
      </div>
      <ChipChoice<string | null>
        label="Category"
        value={categoryId}
        onChange={(v) => {
          setCategoryId(v);
          setParentId(null);
        }}
        options={[
          ...lib.categories
            .filter((c) => !c.archived || c.id === categoryId)
            .map((c) => ({ value: c.id, label: `${c.emoji ?? ''} ${c.name}`.trim() })),
          { value: null, label: 'Uncategorized' },
        ]}
      />
      {!hasSubs && parents.length > 0 && (
        <ChipChoice<string | null>
          label="Part of (optional)"
          value={parentId}
          onChange={setParentId}
          options={[
            { value: null, label: 'Nothing (its own activity)' },
            ...parents.map((p) => ({ value: p.id, label: `${p.emoji ?? ''} ${p.name}`.trim() })),
          ]}
        />
      )}
      <label className="check">
        <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
        Always show in "Your usual" (★)
      </label>
      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!name.trim()}>
          Save
        </button>
        {activity && (
          <button className="btn" onClick={toggleArchive}>
            {activity.archived ? 'Unarchive' : 'Archive'}
          </button>
        )}
      </div>
      {activity && !activity.archived && <p className="muted small">Archiving hides it but keeps all your past time.</p>}
    </Sheet>
  );
}

function CategoryEditor({ category, used, onClose }: { category?: Category; used: string[]; onClose: () => void }) {
  const [name, setName] = useState(category?.name ?? '');
  const [emoji, setEmoji] = useState(category?.emoji ?? '');
  const [color, setColor] = useState(category?.color ?? nextCategoryColor(used));

  async function save() {
    const clean = name.trim();
    if (!clean) return;
    const fields = { name: clean, emoji: emoji.trim() || undefined, color };
    if (category) await updateCategory(category.id, fields);
    else await createCategory(fields);
    onClose();
  }

  return (
    <Sheet title={category ? 'Edit category' : 'New category'} onClose={onClose}>
      <div className="field-row">
        <label className="field emoji-field">
          <span>Emoji</span>
          <input value={emoji} onChange={(e) => setEmoji(oneEmoji(e.target.value))} aria-label="Emoji" />
        </label>
        <label className="field grow">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Work" autoFocus={!category} />
        </label>
      </div>
      <div className="field">
        <span>Color</span>
        <div className="swatches">
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              className={`swatch ${c === color ? 'on' : ''}`}
              style={{ background: colorVar(c) }}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
      </div>
      <div className="sheet-actions">
        <button className="btn primary" onClick={save} disabled={!name.trim()}>
          Save
        </button>
        {category && (
          <button
            className="btn"
            onClick={async () => {
              await updateCategory(category.id, { archived: !category.archived });
              onClose();
            }}
          >
            {category.archived ? 'Unarchive' : 'Archive'}
          </button>
        )}
      </div>
    </Sheet>
  );
}

// Keep the emoji box to a single character. Emoji like 👍🏽 or 👨‍👩‍👧 are made of several pieces under
// the hood, so we count what you see on screen, not raw pieces. Keeps the newest one typed,
// so tapping a new emoji replaces the old one.
function oneEmoji(text: string): string {
  const t = text.trim();
  // Intl.Segmenter is built into iPhone Safari; the project's TypeScript settings just don't list it yet.
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: object) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  const parts = Seg ? [...new Seg(undefined, { granularity: 'grapheme' }).segment(t)].map((p) => p.segment) : Array.from(t);
  return parts.length ? parts[parts.length - 1] : '';
}
