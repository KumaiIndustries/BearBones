import { useState } from 'react'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600&display=swap');

* { box-sizing: border-box; }

:root {
  --paper: #f6f4ef;
  --surface: #ffffff;
  --hairline: #e8e3da;
  --ink: #201d19;
  --ink-soft: #726c63;
  --ink-faint: #9b958b;
  --accent: #a6192e;
  --accent-wash: #a6192e14;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: var(--paper);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body { min-width: 320px; min-height: 100vh; margin: 0; }
input { font: inherit; }

.app-shell { min-height: 100vh; }

.dashboard {
  width: min(100% - 40px, 720px);
  margin: 0 auto;
  padding: 48px 0 96px;
}

.page-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 36px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--hairline);
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
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(32, 29, 25, 0.04);
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

/* --- Bottom navigation --- */

.nav-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 0 20px calc(18px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
}

.bottom-nav {
  display: flex;
  gap: 4px;
  padding: 6px;
  border-radius: 22px;
  background: var(--surface);
  border: 1px solid var(--hairline);
  box-shadow: 0 10px 28px rgba(32, 29, 25, 0.12), 0 2px 6px rgba(32, 29, 25, 0.06);
}

.nav-btn {
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
  .dashboard { width: calc(100% - 32px); padding-top: 32px; padding-bottom: 88px; }
  .page-heading { margin-bottom: 28px; }
  h1 { font-size: 28px; }
  .assignment-row, .todo-row { padding: 13px 14px; }
  .due-date, .todo-course { max-width: 40%; text-align: right; white-space: normal; }
  .nav-wrap { padding: 0 14px calc(14px + env(safe-area-inset-bottom, 0px)); }
  .nav-btn { width: 48px; padding: 10px 0; }
}
`

const upcomingAssignments = [
  { course: 'MATH 129', title: 'Problem Set 4', due: 'Today, 11:59 PM' },
  { course: 'ENGL 101', title: 'Reading response', due: 'Tomorrow, 5:00 PM' },
  { course: 'CHEM 151', title: 'Lab report 2', due: 'Monday, 11:59 PM' },
]

const initialTasks = [
  { id: 1, title: 'Review lecture notes', course: 'MATH 129', done: false },
  { id: 2, title: 'Read chapter 6', course: 'ENGL 101', done: false },
  { id: 3, title: 'Submit pre-lab questions', course: 'CHEM 151', done: false },
]

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
  { id: 'chat', label: 'AI chat', Icon: ChatIcon },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTab, setActiveTab] = useState('assignments')

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <main id="main" className="dashboard">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Your courses</p>
              <h1>Dashboard</h1>
            </div>
            <p className="term-name">Fall 2026</p>
          </div>

          <section className="dashboard-section" aria-labelledby="upcoming-title">
            <div className="section-heading">
              <h2 id="upcoming-title">Coming up</h2>
              <span className="item-count">{upcomingAssignments.length}</span>
            </div>
            <div className="assignment-list">
              {upcomingAssignments.map((assignment) => (
                <article className="assignment-row" key={assignment.title}>
                  <div>
                    <p className="course-name">{assignment.course}</p>
                    <h3>{assignment.title}</h3>
                  </div>
                  <p className="due-date">{assignment.due}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-section" aria-labelledby="todo-title">
            <div className="section-heading">
              <h2 id="todo-title">To do</h2>
              <span className="item-count">
                {tasks.filter((task) => !task.done).length}
              </span>
            </div>
            <ul className="todo-list">
              {tasks.map((task) => (
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
              ))}
            </ul>
          </section>
        </main>

        <div className="nav-wrap">
          <nav className="bottom-nav" aria-label="Primary">
            {navItems.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={id === activeTab ? 'nav-btn is-active' : 'nav-btn'}
                onClick={() => setActiveTab(id)}
                aria-current={id === activeTab ? 'page' : undefined}
                aria-label={label}
                title={label}
              >
                <Icon />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

export default App