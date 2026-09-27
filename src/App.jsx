import { useEffect, useRef, useState } from 'react'
import { LiquidGlass } from '@ybouane/liquidglass'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html { overscroll-behavior-y: none; }

:root {
  --paper: #f5f6f3;
  --surface: #ffffff;
  --hairline: #e3e6e1;
  --ink: #201d19;
  --ink-soft: #726c63;
  --ink-faint: #9b958b;
  --accent: #a6192e;
  --accent-wash: #a6192e14;
  --nav-height: 60px;
  --nav-bottom-gap: 18px;
  --visual-viewport-height: 100vh;
  --visual-viewport-top: 0px;
  --dashboard-bg-color: #e1e4e0;
  --dashboard-bg-image:
    radial-gradient(ellipse at 12% 10%, rgba(174, 132, 116, 0.28) 0%, transparent 42%),
    radial-gradient(ellipse at 88% 18%, rgba(121, 151, 142, 0.27) 0%, transparent 46%),
    radial-gradient(ellipse at 24% 68%, rgba(139, 158, 169, 0.23) 0%, transparent 48%),
    radial-gradient(ellipse at 82% 86%, rgba(191, 177, 148, 0.25) 0%, transparent 44%);
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: var(--paper);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body { min-width: 320px; min-height: 100dvh; margin: 0; }
input { font: inherit; }

/* This is the LiquidGlass root. Everything the glass should be able to
   refract (the dashboard) lives as a normal sibling of the glass nav,
   both as direct children of .app-shell. */
.app-shell { min-height: 100vh; position: relative; }

/* The background pattern lives directly on .dashboard (the single
   non-glass child) rather than on a separate overlapping sibling.
   Two overlapping positioned children was tripping up LiquidGlass's own
   stacking-context capture — it composited them in the wrong order even
   though the real page rendered fine. One child, no ambiguity. */
.dashboard {
  position: relative;
  padding: 0 0 96px;
  touch-action: pan-y;
  overscroll-behavior-x: none;
}

/* Background lives on a nested descendant, not on .dashboard itself.
   Painting it directly on the outermost captured element seems to get
   dropped by LiquidGlass's capture step (it composited fine right after
   we merged it into one element for the cards, but the background
   vanished) — moving it one level deeper, onto an ordinary child div,
   fixed it. */
.dashboard-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--dashboard-bg-image);
  background-color: var(--dashboard-bg-color);
  background-attachment: fixed;
}

/* Centered content column, nested inside the full-bleed .dashboard. */
.dashboard-inner {
  position: relative;
  z-index: 1;
  width: min(100% - 40px, 720px);
  margin: 0 auto;
}

.page-view--forward { animation: page-enter-forward 420ms cubic-bezier(0.2, 0.75, 0.25, 1) both; }
.page-view--backward { animation: page-enter-backward 420ms cubic-bezier(0.2, 0.75, 0.25, 1) both; }

@keyframes page-enter-forward {
  from { opacity: 0.65; transform: translateX(16px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes page-enter-backward {
  from { opacity: 0.65; transform: translateX(-16px); }
  to { opacity: 1; transform: translateX(0); }
}

.app-masthead {
  position: sticky;
  top: 0;
  z-index: 25;
  display: flex;
  min-height: 78px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding: 24px 60px 16px 0;
  border-bottom: 1px solid var(--hairline);
  background-image: var(--dashboard-bg-image);
  background-color: var(--dashboard-bg-color);
  background-attachment: fixed;
}

.brand-lockup {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 11px;
}

.brand-mark {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 10px;
  background: #35483f;
  color: #fff;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 22px;
  font-weight: 600;
}

.brand-name {
  margin: 0;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
}

.brand-caption {
  margin: 3px 0 0;
  color: var(--ink-faint);
  font-size: 10px;
  font-weight: 600;
}

.masthead-term {
  margin: 0 14px 0 0;
  color: var(--ink-soft);
  font-size: 12px;
  font-weight: 500;
}

.settings-glass-button {
  position: fixed !important;
  top: calc(21px + env(safe-area-inset-top, 0px)) !important;
  right: max(20px, calc((100vw - 720px) / 2));
  transform: none !important;
  z-index: 30;
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  touch-action: manipulation;
}

.settings-glass-button svg { width: 21px; height: 21px; }

.settings-glass-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.top-menu {
  position: fixed;
  top: calc(78px + env(safe-area-inset-top, 0px));
  right: max(20px, calc((100vw - 720px) / 2));
  z-index: 35;
  width: 200px;
  padding: 6px;
  border: 1px solid var(--hairline);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 24px rgba(32, 29, 25, 0.14);
}

.top-menu-item {
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  padding: 0 11px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.top-menu-item:hover,
.top-menu-item:focus-visible { background: var(--paper); }

.page-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 0;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--ink-faint);
  font-size: 13px;
  font-weight: 500;
}

h1, h2, h3, p { margin-top: 0; }

h1 {
  margin-bottom: 0;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-weight: 600;
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.term-name { margin: 0; color: var(--ink-soft); font-size: 14px; }

.dashboard-section { margin-top: 32px; }

.section-heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.section-heading h2 {
  margin: 0;
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  font-size: 20px;
  font-weight: 600;
}

.item-count {
  color: var(--ink-faint);
  font-size: 14px;
}

.assignment-list,
.todo-list {
  margin: 0;
  padding: 0;
  background: var(--surface);
  border: 1px solid var(--hairline);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(32, 29, 25, 0.035);
}

.todo-list { list-style: none; }

.assignment-row,
.todo-row {
  min-height: 72px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.assignment-row + .assignment-row,
.todo-row + .todo-row { border-top: 1px solid var(--hairline); }

.course-name {
  margin: 0 0 3px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
}

.assignment-row h3 { margin: 0; color: var(--ink); font-size: 15px; font-weight: 500; }

.due-date,
.todo-course { flex: 0 0 auto; margin: 0; color: var(--ink-soft); font-size: 13px; }

.task-label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
  font-size: 14.5px;
  cursor: pointer;
}

.task-label input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: var(--accent);
}

.task-label.is-done span { color: var(--ink-faint); text-decoration: line-through; }

.search-field {
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  gap: 10px;
  margin: -18px 0 28px;
  padding: 0 13px;
  border: 1px solid var(--hairline);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.78);
  color: var(--ink-soft);
  transition: border-color 0.16s ease, background 0.16s ease;
}

.search-field:focus-within {
  border-color: #aab8af;
  background: var(--surface);
}

.search-field svg { width: 18px; height: 18px; flex: 0 0 auto; }

.search-field input {
  width: 100%;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font-size: 14px;
}

.search-field input::placeholder { color: var(--ink-faint); }

.calendar-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-toolbar button {
  min-width: 38px;
  height: 38px;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font: inherit;
  cursor: pointer;
}

.calendar-toolbar button:focus-visible,
.calendar-day:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.calendar-toolbar .today-button {
  padding: 0 12px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--surface);
}

.calendar-weekday {
  padding: 12px 4px;
  border-bottom: 1px solid var(--hairline);
  color: var(--ink-faint);
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.calendar-day {
  display: flex;
  min-width: 0;
  min-height: 88px;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 9px 8px;
  border: 0;
  border-right: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
  background: var(--surface);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}

.calendar-day:nth-child(7n) { border-right: 0; }
.calendar-day.is-outside { color: var(--ink-faint); background: #faf9f7; }
.calendar-day.is-selected { background: var(--accent-wash); }

.calendar-day-number {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
  font-size: 13px;
}

.calendar-day.is-today .calendar-day-number {
  background: var(--accent);
  color: #fff;
}

.calendar-event-dot {
  width: 100%;
  overflow: hidden;
  color: var(--accent);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.calendar-agenda { margin-top: 28px; }
.calendar-agenda .assignment-list { margin-top: 12px; }
.calendar-empty,
.list-empty { padding: 18px 20px; color: var(--ink-soft); font-size: 14px; }

.findit-chat { display: flex; flex-direction: column; }
.findit-chat .page-heading { margin-bottom: 20px; }
.findit-conversation { display: flex; min-height: 140px; flex-direction: column; gap: 12px; margin-bottom: 18px; }
.findit-message { max-width: min(92%, 560px); padding: 12px 14px; border: 1px solid var(--hairline); border-radius: 8px; background: var(--surface); }
.findit-message--user { align-self: flex-end; border-color: #35483f; background: #35483f; color: #fff; }
.findit-message-label { margin: 0 0 5px; color: var(--ink-faint); font-size: 11px; font-weight: 600; }
.findit-message--user .findit-message-label { color: rgba(255, 255, 255, 0.72); }
.findit-message-content { margin: 0; font-size: 14px; line-height: 1.5; white-space: pre-line; }
.findit-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.findit-prompt { padding: 9px 12px; border: 1px solid var(--hairline); border-radius: 7px; background: rgba(255, 255, 255, 0.7); color: var(--ink-soft); font: inherit; font-size: 12px; text-align: left; cursor: pointer; }
.findit-prompt:hover { border-color: #aab8af; color: var(--ink); }
.findit-composer { display: flex; min-height: 54px; align-items: center; gap: 10px; padding: 6px 7px 6px 14px; border: 1px solid var(--hairline); border-radius: 9px; background: var(--surface); }
.findit-composer input { width: 100%; min-width: 0; padding: 8px 0; border: 0; outline: 0; background: transparent; color: var(--ink); font: inherit; font-size: 14px; }
.findit-composer input::placeholder { color: var(--ink-faint); }
.findit-send { display: grid; width: 40px; height: 40px; flex: 0 0 auto; place-items: center; border: 0; border-radius: 7px; background: #35483f; color: #fff; cursor: pointer; }
.findit-send:disabled { opacity: 0.45; cursor: default; }
.findit-send svg { width: 20px; height: 20px; }

.app-shell[data-reduce-motion="true"] .page-view--forward,
.app-shell[data-reduce-motion="true"] .page-view--backward { animation: none; }

.app-shell[data-compact-lists="true"] .assignment-row,
.app-shell[data-compact-lists="true"] .todo-row { min-height: 56px; padding-top: 10px; padding-bottom: 10px; }

.settings-list { margin: 0; padding: 0; border-top: 1px solid var(--hairline); list-style: none; }
.settings-row { display: flex; min-height: 74px; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 4px; border-bottom: 1px solid var(--hairline); cursor: pointer; }
.settings-copy { display: grid; gap: 4px; }
.settings-title { color: var(--ink); font-size: 14px; font-weight: 500; }
.settings-description { color: var(--ink-soft); font-size: 12px; line-height: 1.4; }
.settings-row input { width: 18px; height: 18px; flex: 0 0 auto; accent-color: var(--accent); }
.settings-back-button { display: inline-flex; min-height: 38px; align-items: center; gap: 7px; padding: 0 10px; border: 1px solid var(--hairline); border-radius: 7px; background: transparent; color: var(--ink-soft); font: inherit; font-size: 13px; cursor: pointer; }
.settings-back-button:hover { border-color: #aab8af; color: var(--ink); }
.settings-back-button svg { width: 17px; height: 17px; }

/* --- Bottom navigation (LiquidGlass element) --- */
/* This element gets handed to LiquidGlass.init() as a glassElement, so its
   background/border/shadow are produced by the WebGL shader instead of CSS.
   It must stay a direct child of .app-shell (the LiquidGlass root). */

.bottom-nav {
  position: fixed;
  top: calc(var(--visual-viewport-top) + var(--visual-viewport-height) - var(--nav-height) - var(--nav-bottom-gap) - env(safe-area-max-inset-bottom, env(safe-area-inset-bottom, 0px)));
  left: 50%;
  bottom: auto;
  transform: translateX(-50%);
  display: flex;
  height: var(--nav-height);
  gap: 4px;
  padding: 6px;
  border-radius: 22px;
  z-index: 20;
  /* Fallback look in case LiquidGlass hasn't initialized yet (or fails) —
     the shader output paints over this once the instance is ready. */
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 28px rgba(32, 29, 25, 0.14);
}

.nav-btn {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  padding: 12px 0;
  border: none;
  border-radius: 16px;
  background: transparent;
  color: var(--ink-soft);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-btn svg { width: 24px; height: 24px; }

.nav-btn.is-active { color: var(--accent); background: var(--accent-wash); }

.nav-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 540px) {
  :root { --nav-height: 56px; --nav-bottom-gap: 14px; }
  .dashboard { padding-bottom: 88px; }
  .dashboard-inner { width: calc(100% - 32px); }
  .app-masthead { min-height: 74px; margin-bottom: 24px; padding: 20px 56px 16px 0; }
  .masthead-term { display: none; }
  .settings-glass-button {
    top: calc(17px + env(safe-area-inset-top, 0px)) !important;
    right: 16px;
    width: 44px;
    height: 44px;
  }
  .top-menu { top: calc(74px + env(safe-area-inset-top, 0px)); right: 16px; }
  .page-heading { margin-bottom: 24px; }
  h1 { font-size: 28px; }
  .assignment-row, .todo-row { padding: 13px 14px; }
  .due-date, .todo-course { max-width: 40%; text-align: right; white-space: normal; }
  .nav-btn { width: 48px; padding: 10px 0; }
  .calendar-day { min-height: 66px; padding: 6px 4px; gap: 3px; }
  .calendar-event-dot { font-size: 9px; }
  .calendar-weekday { padding: 10px 2px; font-size: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .page-view--forward, .page-view--backward { animation: none; }
}
`

const upcomingAssignments = [
  { course: 'MATH 129', title: 'Problem Set 4', due: 'Today, 11:59 PM', dayOffset: 0 },
  { course: 'ENGL 101', title: 'Reading response', due: 'Tomorrow, 5:00 PM', dayOffset: 1 },
  { course: 'CHEM 151', title: 'Lab report 2', due: 'Monday, 11:59 PM', dayOffset: 2 },
]

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const initialTasks = [
  { id: 1, title: 'Review lecture notes', course: 'MATH 129', done: false },
  { id: 2, title: 'Read chapter 6', course: 'ENGL 101', done: false },
  { id: 3, title: 'Submit pre-lab questions', course: 'CHEM 151', done: false },
]

function findItAnswer(query, tasks) {
  const normalizedQuery = query.toLocaleLowerCase()
  const courses = [...new Set([
    ...upcomingAssignments.map((assignment) => assignment.course),
    ...tasks.map((task) => task.course),
  ])]
  const course = courses.find((name) => normalizedQuery.includes(name.toLocaleLowerCase()))

  if (course) {
    const assignments = upcomingAssignments.filter((assignment) => assignment.course === course)
    const openTasks = tasks.filter((task) => task.course === course && !task.done)
    const details = [
      ...assignments.map((assignment) => `Due: ${assignment.title} - ${assignment.due}`),
      ...(openTasks.length ? [`To do: ${openTasks.map((task) => task.title).join(', ')} (no due date listed)`] : []),
    ]
    return details.length ? `${course}\n${details.join('\n')}` : `I couldn't find upcoming items for ${course}.`
  }

  const requestedDay = ['today', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    .find((day) => normalizedQuery.includes(day))
  if (requestedDay || /\b(due|deadline|when)\b/.test(normalizedQuery)) {
    const matchingAssignments = requestedDay
      ? upcomingAssignments.filter((assignment) => assignment.due.toLocaleLowerCase().startsWith(requestedDay))
      : upcomingAssignments
    return matchingAssignments.length
      ? matchingAssignments.map((assignment) => `${assignment.course}: ${assignment.title} - ${assignment.due}`).join('\n')
      : `Nothing is listed as due ${requestedDay}.`
  }

  if (/\b(timeline|schedule|week|upcoming|next)\b/.test(normalizedQuery)) {
    const assignmentLines = upcomingAssignments.map((assignment) => `${assignment.course}: ${assignment.title} - ${assignment.due}`)
    const openTasks = tasks.filter((task) => !task.done)
    const taskLine = openTasks.length
      ? `To do (no due dates listed): ${openTasks.map((task) => task.title).join(', ')}`
      : 'No open to-dos.'
    return [`Upcoming`, ...assignmentLines, taskLine].join('\n')
  }

  const terms = normalizedQuery.split(/[^a-z0-9]+/).filter((term) => term.length > 2)
  const matchingItems = [
    ...upcomingAssignments.map((assignment) => `${assignment.course}: ${assignment.title} - ${assignment.due}`),
    ...tasks.map((task) => `${task.course}: ${task.title}${task.done ? ' (complete)' : ' (no due date listed)'}`),
  ].filter((item) => terms.some((term) => item.toLocaleLowerCase().includes(term)))

  return matchingItems.length
    ? matchingItems.join('\n')
    : 'I couldn\'t find a match in the current course data. Try a course code, assignment, due date, or timeline question.'
}

function AssignmentsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3.5" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 3.5V5.5H15V3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8.5 10.5H15.5M8.5 13.5H15.5M8.5 16.5H12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 9.5H20" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3V6.5M16 3V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8.5" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="12" cy="13.5" r="1.1" fill="currentColor" />
      <circle cx="8.5" cy="17" r="1.1" fill="currentColor" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.5 15.5 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M5 7.5H19M5 12H19M5 16.5H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12c0-4.14 3.58-7.5 8-7.5s8 3.36 8 7.5-3.58 7.5-8 7.5c-1.02 0-1.99-.18-2.88-.5L5 20.5l1.2-3.6C4.8 15.7 4 13.93 4 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="0.9" fill="currentColor" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" />
      <circle cx="15" cy="12" r="0.9" fill="currentColor" />
    </svg>
  )
}

const navItems = [
  { id: 'assignments', label: 'Assignments', Icon: AssignmentsIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalendarIcon },
  { id: 'chat', label: 'Find-It', Icon: ChatIcon },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTab, setActiveTab] = useState('assignments')
  const [pageDirection, setPageDirection] = useState('forward')
  const [searchQuery, setSearchQuery] = useState('')
  const [findItDraft, setFindItDraft] = useState('')
  const [findItMessages, setFindItMessages] = useState([
    { id: 0, role: 'assistant', content: 'Hi, I’m Find-It. Ask me about a course, due date, or your upcoming timeline.' },
  ])
  const [menuOpen, setMenuOpen] = useState(false)
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bearbones-preferences') ?? '{}')
      return { reduceMotion: saved.reduceMotion === true, compactLists: saved.compactLists === true }
    } catch {
      return { reduceMotion: false, compactLists: false }
    }
  })
  const [today] = useState(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  })
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight)

  const rootRef = useRef(null)
  const dashboardRef = useRef(null)
  const menuRef = useRef(null)
  const navRef = useRef(null)
  const settingsRef = useRef(null)
  const lastMenuTouchRef = useRef(0)
  const glassInstanceRef = useRef(null)
  const touchStartRef = useRef(null)
  const findItMessageIdRef = useRef(1)
  const settingsReturnTabRef = useRef('assignments')

  useEffect(() => {
    localStorage.setItem('bearbones-preferences', JSON.stringify(preferences))
  }, [preferences])

  useEffect(() => {
    if (!menuOpen) return

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target) && !settingsRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        settingsRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  // Set up LiquidGlass once, on mount.
  useEffect(() => {
    let cancelled = false

    async function setupGlass() {
      if (!rootRef.current || !navRef.current || !settingsRef.current) return

      try {
        const instance = await LiquidGlass.init({
          root: rootRef.current,
          glassElements: [navRef.current, settingsRef.current],
          defaults: {
            blurAmount: 0.18,
            refraction: 0.65,
            chromAberration: 0.06,
            edgeHighlight: 0.12,
            specular: 0.18,
            fresnel: 1,
            cornerRadius: 22,
            zRadius: 20,
            opacity: 1,
            shadowOpacity: 0.22,
            shadowSpread: 14,
            shadowOffsetY: 2,
            button: false, // hover brightens, press flattens the bevel — nice for nav buttons
          },
        })

        if (cancelled) {
          instance.destroy()
          return
        }
        glassInstanceRef.current = instance
      } catch (err) {
        // Falls back to the CSS blur/translucency on .bottom-nav above.
        console.error('LiquidGlass failed to initialize:', err)
      }
    }

    setupGlass()

    return () => {
      cancelled = true
      glassInstanceRef.current?.destroy()
      glassInstanceRef.current = null
    }
  }, [])

  // The library only auto-recaptures the background on layout/DOM mutation
  // triggers it can see. Scrolling changes what's visually behind the pill
  // without firing one of those, so nudge it manually, rate-limited to rAF.
  useEffect(() => {
    let ticking = false
    function handleScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        glassInstanceRef.current?.markChanged(dashboardRef.current)
        ticking = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const visualViewport = window.visualViewport
    const root = document.documentElement
    function updateVisualViewport() {
      root.style.setProperty('--visual-viewport-height', `${visualViewport?.height ?? window.innerHeight}px`)
      root.style.setProperty('--visual-viewport-top', `${visualViewport?.offsetTop ?? 0}px`)
    }
    updateVisualViewport()
    visualViewport?.addEventListener('resize', updateVisualViewport)
    visualViewport?.addEventListener('scroll', updateVisualViewport)
    window.addEventListener('resize', updateVisualViewport)
    return () => {
      visualViewport?.removeEventListener('resize', updateVisualViewport)
      visualViewport?.removeEventListener('scroll', updateVisualViewport)
      window.removeEventListener('resize', updateVisualViewport)
    }
  }, [])

  useEffect(() => {
  function updateHeight() {
    setViewportHeight(window.innerHeight)
    glassInstanceRef.current?.markChanged()
  }
  window.addEventListener('resize', updateHeight)
  return () => window.removeEventListener('resize', updateHeight)
}, [])

  useEffect(() => {
    let nextFrame
    const firstFrame = requestAnimationFrame(() => {
      nextFrame = requestAnimationFrame(() => glassInstanceRef.current?.markChanged())
    })
    return () => {
      cancelAnimationFrame(firstFrame)
      if (nextFrame) cancelAnimationFrame(nextFrame)
    }
  }, [activeTab])

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
    // Strikethrough text under the pill would otherwise stay stale until
    // the next auto-triggered recapture.
    glassInstanceRef.current?.markChanged()
  }

  function navigateToTab(nextTab) {
    if (nextTab === activeTab) return

    const pageOrder = [...navItems.map((item) => item.id), 'settings']
    const currentIndex = pageOrder.indexOf(activeTab)
    const nextIndex = pageOrder.indexOf(nextTab)
    setPageDirection(nextIndex > currentIndex ? 'forward' : 'backward')
    setActiveTab(nextTab)
  }

  function openSettingsPage() {
    if (activeTab !== 'settings') settingsReturnTabRef.current = activeTab
    setMenuOpen(false)
    navigateToTab('settings')
  }

  function returnFromSettings() {
    navigateToTab(settingsReturnTabRef.current)
  }

  function handleMenuPointerUp(event) {
    if (event.pointerType !== 'touch') return
    lastMenuTouchRef.current = Date.now()
    setMenuOpen((open) => !open)
  }

  function handleMenuClick(event) {
    if (event.detail > 0 && Date.now() - lastMenuTouchRef.current < 500) return
    setMenuOpen((open) => !open)
  }

  function submitFindIt(question = findItDraft) {
    const content = question.trim()
    if (!content) return

    const messageId = findItMessageIdRef.current
    findItMessageIdRef.current += 2
    setFindItMessages((current) => [
      ...current,
      { id: messageId, role: 'user', content },
      { id: messageId + 1, role: 'assistant', content: findItAnswer(content, tasks) },
    ])
    setFindItDraft('')
  }

  function handleTouchStart(event) {
    if (event.touches.length !== 1) {
      touchStartRef.current = null
      return
    }

    if (
      event.target.closest('button, input, textarea, select, a, [role="button"]') &&
      !event.target.closest('.calendar-day')
    ) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return
    if (activeTab === 'settings') {
      if (deltaX > 0) returnFromSettings()
      return
    }

    const currentIndex = navItems.findIndex((item) => item.id === activeTab)
    const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1
    if (nextIndex >= 0 && nextIndex < navItems.length) navigateToTab(navItems[nextIndex].id)
  }

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    firstDay.setDate(firstDay.getDate() - firstDay.getDay() + index)
    return firstDay
  })
  const assignmentsForDate = (date) => upcomingAssignments.filter((assignment) => {
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + assignment.dayOffset)
    return dateKey(dueDate) === dateKey(date)
  })
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const matchesSearch = (item) => [item.title, item.course, item.due ?? '']
    .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
  const filteredAssignments = upcomingAssignments.filter(matchesSearch)
  const filteredTasks = tasks.filter(matchesSearch)
  const selectedAssignments = assignmentsForDate(selectedDate).filter(matchesSearch)
  return (
    <>
      <style>{styles}</style>
      {/* LiquidGlass root: the pill's siblings here are what it refracts. */}
      <div
        className="app-shell"
        ref={rootRef}
        data-reduce-motion={preferences.reduceMotion}
        data-compact-lists={preferences.compactLists}
      >
        <main
          id="main"
          className="dashboard"
          ref={dashboardRef}
          style={{ minHeight: viewportHeight }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => { touchStartRef.current = null }}
        >
          <div className="dashboard-bg" aria-hidden="true" />
          <div className="dashboard-inner">
          <div className="app-masthead">
            <div className="brand-lockup">
              <span className="brand-mark" aria-hidden="true">B</span>
              <div>
                <p className="brand-name">BearBones</p>
                <p className="brand-caption">STUDENT WORKSPACE</p>
              </div>
            </div>
            <p className="masthead-term">Fall 2026</p>
          </div>
          <div
            key={activeTab}
            className={`page-view--${pageDirection}`}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) glassInstanceRef.current?.markChanged()
            }}
          >
          {activeTab === 'calendar' ? (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Your courses</p>
                  <h1>Calendar</h1>
                </div>
                <div className="calendar-toolbar" aria-label="Calendar controls">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                  >
                    &#8249;
                  </button>
                  <button
                    type="button"
                    className="today-button"
                    onClick={() => {
                      setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                      setSelectedDate(today)
                    }}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                  >
                    &#8250;
                  </button>
                </div>
              </div>

              <label className="search-field">
                <SearchIcon />
                <input
                  type="search"
                  aria-label="Search coursework"
                  placeholder="Search coursework"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>

              <section aria-label="Monthly calendar">
                <div className="section-heading">
                  <h2>
                    {visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </h2>
                </div>
                <div className="calendar-grid" role="grid" aria-label={visibleMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}>
                  {weekdays.map((day) => (
                    <div className="calendar-weekday" role="columnheader" key={day}>{day}</div>
                  ))}
                  {calendarDays.map((date) => {
                    const dayAssignments = assignmentsForDate(date).filter(matchesSearch)
                    const isSelected = dateKey(date) === dateKey(selectedDate)
                    const isToday = dateKey(date) === dateKey(today)
                    const dayClass = [
                      'calendar-day',
                      date.getMonth() !== visibleMonth.getMonth() && 'is-outside',
                      isSelected && 'is-selected',
                      isToday && 'is-today',
                    ].filter(Boolean).join(' ')

                    return (
                      <button
                        className={dayClass}
                        type="button"
                        role="gridcell"
                        aria-pressed={isSelected}
                        aria-label={`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}${dayAssignments.length ? `, ${dayAssignments.length} assignment${dayAssignments.length === 1 ? '' : 's'}` : ''}`}
                        key={dateKey(date)}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="calendar-day-number">{date.getDate()}</span>
                        {dayAssignments.map((assignment) => (
                          <span className="calendar-event-dot" key={assignment.title}>{assignment.title}</span>
                        ))}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="calendar-agenda" aria-labelledby="agenda-title">
                <div className="section-heading">
                  <h2 id="agenda-title">
                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <span className="item-count">{selectedAssignments.length}</span>
                </div>
                {selectedAssignments.length ? (
                  <div className="assignment-list">
                    {selectedAssignments.map((assignment) => (
                      <article className="assignment-row" key={assignment.title}>
                        <div>
                          <p className="course-name">{assignment.course}</p>
                          <h3>{assignment.title}</h3>
                        </div>
                        <p className="due-date">{assignment.due}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="assignment-list calendar-empty">Nothing scheduled</div>
                )}
              </section>
            </>
          ) : activeTab === 'chat' ? (
            <section className="findit-chat" aria-label="Find-It assistant">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Academic assistant</p>
                  <h1>Find-It</h1>
                </div>
              </div>

              <div className="findit-conversation" role="log" aria-live="polite" aria-relevant="additions">
                {findItMessages.map((message) => (
                  <article
                    className={`findit-message findit-message--${message.role}`}
                    key={message.id}
                  >
                    <p className="findit-message-label">{message.role === 'assistant' ? 'Find-It' : 'You'}</p>
                    <p className="findit-message-content">{message.content}</p>
                  </article>
                ))}
              </div>

              {findItMessages.length === 1 && (
                <div className="findit-suggestions" aria-label="Suggested questions">
                  {['What’s due next?', 'Show my timeline', 'What’s up in MATH 129?'].map((question) => (
                    <button className="findit-prompt" key={question} type="button" onClick={() => submitFindIt(question)}>
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <form
                className="findit-composer"
                onSubmit={(event) => {
                  event.preventDefault()
                  submitFindIt()
                }}
              >
                <input
                  aria-label="Ask Find-It about your courses"
                  placeholder="Ask about a course or due date"
                  value={findItDraft}
                  onChange={(event) => setFindItDraft(event.target.value)}
                />
                <button className="findit-send" type="submit" aria-label="Send question" disabled={!findItDraft.trim()}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </section>
          ) : activeTab === 'settings' ? (
            <section className="settings-page" aria-label="Settings">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Preferences</p>
                  <h1>Settings</h1>
                </div>
                <button className="settings-back-button" type="button" onClick={returnFromSettings}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Back</span>
                </button>
              </div>

              <section className="dashboard-section" aria-labelledby="display-settings-title">
                <div className="section-heading">
                  <h2 id="display-settings-title">Display</h2>
                </div>
                <ul className="settings-list">
                  <li>
                    <label className="settings-row">
                      <span className="settings-copy">
                        <span className="settings-title">Reduce page motion</span>
                        <span className="settings-description">Turn off page transition animations.</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={preferences.reduceMotion}
                        onChange={(event) => setPreferences((current) => ({ ...current, reduceMotion: event.target.checked }))}
                      />
                    </label>
                  </li>
                  <li>
                    <label className="settings-row">
                      <span className="settings-copy">
                        <span className="settings-title">Compact course lists</span>
                        <span className="settings-description">Show more assignments and tasks at once.</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={preferences.compactLists}
                        onChange={(event) => setPreferences((current) => ({ ...current, compactLists: event.target.checked }))}
                      />
                    </label>
                  </li>
                </ul>
              </section>
            </section>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Your courses</p>
                  <h1>Dashboard</h1>
                </div>
              </div>

              <label className="search-field">
                <SearchIcon />
                <input
                  type="search"
                  aria-label="Search assignments and to-dos"
                  placeholder="Search assignments and to-dos"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </label>

              <section className="dashboard-section" aria-labelledby="upcoming-title">
                <div className="section-heading">
                  <h2 id="upcoming-title">Coming up</h2>
                  <span className="item-count">{filteredAssignments.length}</span>
                </div>
                <div className="assignment-list">
                  {filteredAssignments.length ? filteredAssignments.map((assignment) => (
                    <article className="assignment-row" key={assignment.title}>
                      <div>
                        <p className="course-name">{assignment.course}</p>
                        <h3>{assignment.title}</h3>
                      </div>
                      <p className="due-date">{assignment.due}</p>
                    </article>
                  )) : <div className="list-empty">No matching assignments</div>}
                </div>
              </section>

              <section className="dashboard-section" aria-labelledby="todo-title">
                <div className="section-heading">
                  <h2 id="todo-title">To do</h2>
                  <span className="item-count">
                    {filteredTasks.filter((task) => !task.done).length}
                  </span>
                </div>
                <ul className="todo-list">
                  {filteredTasks.length ? filteredTasks.map((task) => (
                    <li className="todo-row" key={task.id}>
                      <label className={task.done ? 'task-label is-done' : 'task-label'}>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleTask(task.id)}
                        />
                        <span>{task.title}</span>
                      </label>
                      <span className="todo-course">{task.course}</span>
                    </li>
                  )) : <li className="todo-row list-empty">No matching to-dos</li>}
                </ul>
              </section>
            </>
          )}
          </div>
          </div>
        </main>

        <button
          className="settings-glass-button"
          type="button"
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-controls="app-menu"
          title="Open menu"
          data-config='{"cornerRadius":24,"floating":false}'
          ref={settingsRef}
          onPointerUp={handleMenuPointerUp}
          onClick={handleMenuClick}
        >
          <SettingsIcon />
        </button>

        {menuOpen && (
          <div className="top-menu" id="app-menu" ref={menuRef}>
            <button className="top-menu-item" type="button" onClick={openSettingsPage}>
              Settings
            </button>
          </div>
        )}

        {/* Direct child of .app-shell, as LiquidGlass requires. */}
        <nav className="bottom-nav" aria-label="Primary" ref={navRef}>
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={id === activeTab ? 'nav-btn is-active' : 'nav-btn'}
              onClick={() => navigateToTab(id)}
              aria-current={id === activeTab ? 'page' : undefined}
              aria-label={label}
              title={label}
            >
              <Icon />
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}

export default App