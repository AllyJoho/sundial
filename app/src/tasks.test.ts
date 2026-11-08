// Automated checks for to-do logic. Run with: npm test
import { describe, expect, it } from 'vitest';
import { defaultCarry, describeDays, dueLabel, isOpen, nextOpening, openNow, sortLater, taskToIcs, todayTasks, windowStatus } from './tasks';
import type { Task, TaskWindow } from './types';

// Fri Nov 6 2026
const at = (date: number, hour: number, min = 0) => new Date(2026, 10, date, hour, min).getTime();
const weekdays9to5: TaskWindow = { days: [1, 2, 3, 4, 5], start: 9 * 60, end: 17 * 60 };
const task = (t: Partial<Task>): Task => ({ id: Math.random().toString(36).slice(2), title: 'x', list: 'today', createdAt: 0, ...t });

describe('open hours', () => {
  it('is open during the window on listed days only', () => {
    expect(isOpen(weekdays9to5, at(6, 10))).toBe(true); // Fri 10 AM
    expect(isOpen(weekdays9to5, at(6, 17))).toBe(false); // closes at 5
    expect(isOpen(weekdays9to5, at(7, 10))).toBe(false); // Saturday
  });

  it('handles windows that cross midnight', () => {
    const late: TaskWindow = { days: [5], start: 22 * 60, end: 2 * 60 }; // Fri 10 PM – 2 AM
    expect(isOpen(late, at(6, 23))).toBe(true);
    expect(isOpen(late, at(7, 1))).toBe(true); // early Saturday counts as Friday night
    expect(isOpen(late, at(7, 3))).toBe(false);
  });

  it('finds the next opening (over the weekend to Monday)', () => {
    expect(nextOpening(weekdays9to5, at(6, 18))).toBe(at(9, 9)); // Fri 6 PM → Mon 9 AM
    expect(windowStatus(weekdays9to5, at(6, 18)).text).toMatch(/^opens Mon 9/);
    expect(windowStatus(weekdays9to5, at(6, 7)).text).toMatch(/^opens 9/); // same day
    expect(windowStatus(weekdays9to5, at(6, 10)).text).toMatch(/^open now · until 5/);
  });

  it('describes days simply', () => {
    expect(describeDays([1, 2, 3, 4, 5])).toBe('Mon–Fri');
    expect(describeDays([0, 6])).toBe('Weekends');
    expect(describeDays([1, 3])).toBe('Mon, Wed');
  });
});

describe('due dates', () => {
  it('labels plainly, including after it passes', () => {
    expect(dueLabel('2026-11-06', at(6, 12))).toBe('due today');
    expect(dueLabel('2026-11-07', at(6, 12))).toBe('due tomorrow');
    expect(dueLabel('2026-11-10', at(6, 12))).toBe('due Tue');
    expect(dueLabel('2026-11-03', at(6, 12))).toBe('was due Tue');
  });

  it('sorts Later by due date, undated last', () => {
    const list = sortLater([task({ title: 'a' }), task({ title: 'b', due: '2026-12-01' }), task({ title: 'c', due: '2026-11-10' })]);
    expect(list.map((x) => x.title)).toEqual(['c', 'b', 'a']);
  });
});

describe('lists', () => {
  it("today's list keeps things done today and drops older done ones", () => {
    const tasks = [task({ title: 'open' }), task({ title: 'done today', doneAt: at(6, 11) }), task({ title: 'done before', doneAt: at(5, 11) }), task({ title: 'later', list: 'later' })];
    expect(todayTasks(tasks, at(6, 8)).map((x) => x.title)).toEqual(['open', 'done today']);
  });

  it('"open now" includes Later tasks too, but not done ones', () => {
    const tasks = [task({ title: 'call', list: 'later', window: weekdays9to5 }), task({ title: 'done call', window: weekdays9to5, doneAt: 1 })];
    expect(openNow(tasks, at(6, 10)).map((x) => x.title)).toEqual(['call']);
  });

  it('never piles up: 2+ unfinished default to Later', () => {
    expect(defaultCarry([task({})])).toBe('today');
    expect(defaultCarry([task({}), task({})])).toBe('later');
  });
});

describe('iPhone Calendar file', () => {
  it('schedules a window task at its next opening, with an alert', () => {
    const ics = taskToIcs(task({ id: 't1', title: 'Call Verizon, billing', notes: 'Account #1234\nAsk about the double charge', window: weekdays9to5 }), at(6, 18));
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain(`DTSTART:${new Date(at(9, 9)).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`);
    expect(ics).toContain('SUMMARY:Call Verizon\\, billing');
    expect(ics).toContain('DESCRIPTION:Account #1234\\nAsk about the double charge');
    expect(ics).toContain('BEGIN:VALARM');
  });
});
