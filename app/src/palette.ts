// Category colors. These come from a tested chart palette: every pair next to each other in this
// order stays distinguishable with common color blindness (checked with a validator, not by eye).
// Each color has a light-mode and a dark-mode version (CSS variables --cat-1 … --cat-8 in styles.css),
// plus the text color ("ink") that reads best on top of it.

/** The stored value for each slot (the light-mode hex). New categories take the next slot in order. */
export const CATEGORY_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948'];

/** Sundial's first palette (before v4), mapped to the closest new slot, so old data upgrades cleanly. */
export const OLD_COLOR_TO_NEW: Record<string, string> = {
  '#4f7cac': '#2a78d6', // blue → blue
  '#5f9e6e': '#008300', // green → green
  '#c0794b': '#eb6834', // orange → orange
  '#9a7bb5': '#6250d6', // purple → violet
  '#c4a23a': '#eda100', // mustard → yellow
  '#c06070': '#e87ba4', // rose → magenta
  '#4a9a9a': '#1baf7a', // teal → aqua
  '#7a8a5a': '#e34948', // olive → red
};

/** A color for use in styles: palette colors become CSS variables so they switch with dark mode. */
export function colorVar(hex: string): string {
  const i = CATEGORY_COLORS.indexOf(hex.toLowerCase());
  return i >= 0 ? `var(--cat-${i + 1})` : hex;
}

/** The text color to put on top of a category color. */
export function inkVar(hex: string): string {
  const i = CATEGORY_COLORS.indexOf(hex.toLowerCase());
  return i >= 0 ? `var(--cat-${i + 1}-ink)` : '#ffffff';
}

/** The next unused palette slot (cycles only if you have more than 8 categories). */
export function nextCategoryColor(existing: string[]): string {
  return CATEGORY_COLORS.find((c) => !existing.includes(c)) ?? CATEGORY_COLORS[existing.length % CATEGORY_COLORS.length];
}
