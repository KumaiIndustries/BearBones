import { useCallback, useEffect, useRef, useState } from 'react'
import { saveJSON, loadJSON } from './storage.js';
import { CapacitorHttp } from '@capacitor/core';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Inter:wght@400;500;600&display=swap');

* {
	box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
}

html, body, #root {
	width: 100%;
	height: 100%;
	margin: 0;
	overflow: hidden;
}

.app-shell {
	position: relative;
	width: 100%;
	height: 100dvh;
	overflow: hidden;

	background-color: var(--dashboard-bg-color);
	background-image: var(--dashboard-bg-image);
	background-size: cover;
}

.dashboard {
	position: absolute;
	inset: 0;

	overflow-y: auto;
	overflow-x: hidden;

	-webkit-overflow-scrolling: touch;
	overscroll-behavior-y: auto;

	padding: 0 0 96px;
	touch-action: pan-y;
}

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

input { font: inherit; }

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

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
	.bottom-nav,
	.settings-glass-button { background: rgba(255, 255, 255, 0.85); }
}

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
.settings-canvas-key { display: grid; gap: 12px; padding: 16px 4px; border-bottom: 1px solid var(--hairline); }
.settings-canvas-key input[type="password"] { width: 100%; min-height: 40px; padding: 0 10px; border: 1px solid var(--hairline); border-radius: 7px; background: var(--surface); color: var(--ink); font: inherit; font-size: 13px; outline: none; }
.settings-canvas-key input[type="password"]:focus { border-color: var(--accent); }
.settings-key-status { display: flex; min-height: 40px; align-items: center; justify-content: space-between; gap: 12px; padding: 0 10px; border: 1px solid var(--hairline); border-radius: 7px; background: var(--surface); color: var(--ink-soft); font-size: 13px; }
.settings-key-status span { display: inline-flex; align-items: center; gap: 8px; }
.settings-key-status span::before { width: 8px; height: 8px; border-radius: 50%; background: #527761; content: ""; }
.settings-key-edit { padding: 5px 7px; border: 0; background: transparent; color: #35483f; font: inherit; font-size: 13px; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.settings-key-actions { display: flex; justify-content: flex-end; gap: 8px; }
.settings-test-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 4px; }
.settings-test-button { flex: 0 0 auto; min-height: 38px; padding: 0 12px; border: 1px solid var(--hairline); border-radius: 7px; background: var(--surface); color: var(--ink); font: inherit; font-size: 13px; cursor: pointer; }
.settings-test-button:hover { border-color: #aab8af; }

.info-dialog-backdrop { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 24px; background: rgba(32, 29, 25, 0.36); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); }
.info-dialog { display: flex; width: min(100%, 460px); max-height: min(78dvh, 680px); overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 16px; background: var(--paper); box-shadow: 0 20px 60px rgba(32, 29, 25, 0.22); }
.info-dialog-scroll-area { position: relative; display: flex; min-width: 0; min-height: 0; flex: 1 1 auto; margin: 12px 8px 12px 12px; }
.info-dialog-scroll { min-width: 0; min-height: 0; flex: 1 1 auto; padding: 12px 18px 12px 12px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; -ms-overflow-style: none; }
.info-dialog-scroll::-webkit-scrollbar { display: none; }
.info-dialog-content { min-height: 100%; }
.custom-scrollbar { position: absolute; top: 12px; right: 0; bottom: 12px; width: 12px; opacity: 0; pointer-events: none; touch-action: none; user-select: none; }
.custom-scrollbar.is-visible { opacity: 1; pointer-events: auto; }
.custom-scrollbar::before { position: absolute; top: 0; bottom: 0; left: 5px; width: 2px; border-radius: 2px; background: #e3e6e1; content: ""; }
.custom-scrollbar-thumb { position: absolute; left: 2px; width: 8px; min-height: 28px; border: 2px solid var(--paper); border-radius: 8px; background: #87978a; cursor: grab; touch-action: none; }
.custom-scrollbar-thumb:hover { background: #6f8374; }
.custom-scrollbar-thumb:active { background: #526b59; cursor: grabbing; }
.info-dialog-kicker { margin: 0 0 8px; color: #35483f; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
.info-dialog h2 { margin: 0; color: var(--ink); font-family: 'Newsreader', Georgia, serif; font-size: 25px; font-weight: 600; line-height: 1.2; }
.info-dialog-message { margin: 12px 0 22px; color: var(--ink-soft); font-size: 14px; line-height: 1.55; white-space: pre-line; overflow-wrap: anywhere; }
.info-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
.info-dialog-dismiss { min-height: 40px; padding: 0 16px; border: 0; border-radius: 8px; background: #35483f; color: #fff; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; }
.info-dialog-dismiss:disabled { opacity: 0.45; cursor: default; }
.info-dialog-dismiss:focus-visible, .settings-test-button:focus-visible, .setup-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.setup-steps { display: grid; gap: 14px; margin: 20px 0; padding: 0; list-style: none; counter-reset: setup-step; }
.setup-steps li { position: relative; display: grid; gap: 4px; padding-left: 36px; color: var(--ink-soft); font-size: 13px; line-height: 1.5; counter-increment: setup-step; }
.setup-steps li::before { position: absolute; left: 0; top: 0; display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: #35483f; color: #fff; font-size: 12px; font-weight: 600; content: counter(setup-step); }
.setup-steps strong { color: var(--ink); font-weight: 500; }
.setup-link { display: inline-block; margin: 0 0 18px; color: #35483f; font-size: 13px; font-weight: 500; text-underline-offset: 3px; }
.setup-privacy { margin: -4px 0 16px; color: var(--ink-soft); font-size: 12px; line-height: 1.5; }
.setup-token-field { display: grid; gap: 7px; margin: 0 0 20px; color: var(--ink); font-size: 13px; font-weight: 500; }
.setup-token-field input { width: 100%; min-height: 42px; padding: 0 11px; border: 1px solid var(--hairline); border-radius: 7px; background: var(--surface); color: var(--ink); font: inherit; font-weight: 400; }
.setup-token-field input:focus { border-color: var(--accent); outline: 2px solid var(--accent-wash); }
.help-topic { margin: 18px 0; }
.help-topic h3 { margin: 0 0 6px; color: var(--ink); font-size: 14px; font-weight: 500; }
.help-topic p { margin: 0; color: var(--ink-soft); font-size: 13px; line-height: 1.5; }



.bottom-nav {
	position: absolute;
	left: 50%;
	bottom: calc(
		var(--nav-bottom-gap) +
		env(safe-area-inset-bottom, 0px)
	);
	top: auto;

	transform: translateX(-50%);
	display: flex;
	height: var(--nav-height);
	gap: 4px;
	padding: 6px;
	border-radius: 22px;
	z-index: 20;
}

.bottom-nav,
.settings-glass-button {
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.14) 100%);
	backdrop-filter: blur(6px) saturate(190%) brightness(1.05);
	-webkit-backdrop-filter: blur(6px) saturate(190%) brightness(1.05);
	box-shadow:
		inset 0 1px 0 rgba(255, 255, 255, 0.85),
		inset 0 -1px 0 rgba(255, 255, 255, 0.25),
		inset 0 0 0 1px rgba(255, 255, 255, 0.22),
		inset 0 -10px 16px -10px rgba(255, 255, 255, 0.35),
		0 1px 2px rgba(32, 29, 25, 0.08),
		0 10px 28px rgba(32, 29, 25, 0.14);
}

.bottom-nav::before,
.settings-glass-button::before {
	content: "";
	position: absolute;
	inset: 0;
	border-radius: inherit;
	padding: 1.5px;
	background: linear-gradient(135deg,
		rgba(255, 255, 255, 0.9) 0%,
		rgba(255, 255, 255, 0) 35%,
		rgba(255, 255, 255, 0) 65%,
		rgba(255, 255, 255, 0.55) 100%);
	-webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite: xor;
	mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
	pointer-events: none;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
	.bottom-nav,
	.settings-glass-button { background: rgba(255, 255, 255, 0.85); }
}





/* No backdrop-filter support: more opaque so text/icons stay legible */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
	.bottom-nav { background: rgba(255, 255, 255, 0.85); }
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
	.info-dialog { max-height: min(56dvh, calc(var(--visual-viewport-height, 100dvh) - 48px)); }
	.info-dialog-scroll-area { margin-right: 6px; }
	.info-dialog-scroll { padding-right: 18px; }
	.settings-test-row { align-items: flex-start; }
	.setup-steps { gap: 8px; margin: 12px 0; }
	.help-topic { margin: 14px 0; }
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

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(date) {
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

const initialTasks = [
//	{ id: 1, title: 'Review lecture notes', course: 'MATH 129', done: false },
//	{ id: 2, title: 'Read chapter 6', course: 'ENGL 101', done: false },
//	{ id: 3, title: 'Submit pre-lab questions', course: 'CHEM 151', done: false },
]

function findItAnswer(query, tasks, upcomingAssignments) {
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

function parseDateTime(date, time) {
	// Parse date (DD/MM/YYYY)
	const [day, month, year] = date.split('/').map(Number);
	
	// Parse time only if it exists and is not empty/null/undefined
	let hours = null;
	let minutes = null;
	if (time) {
		const timeParts = time.split(/:|\//).map(Number);
		hours = timeParts[0];
		minutes = timeParts[1];
	}
	
	// Create target Date object (default to midnight if no time)
	const dueDate = new Date(year, month - 1, day, hours || 0, minutes || 0);
	
	// Get current date normalized to midnight for accurate day difference calculation
	const now = new Date();
	const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dueMidnight = new Date(year, month - 1, day);
	
	// Calculate dayOffset (difference in days)
	const diffTime = dueMidnight - todayMidnight;
	const daystilldue = Math.round(diffTime / (1000 * 60 * 60 * 24));
	
	// Format time to 12-hour AM/PM string only if time is provided
	let formattedTime = '';
	if (hours !== null && !isNaN(hours) && minutes !== null && !isNaN(minutes)) {
		const period = hours >= 12 ? 'PM' : 'AM';
		const hour12 = hours % 12 || 12;
		const formattedMinutes = String(minutes).padStart(2, '0');
		formattedTime = `${hour12}:${formattedMinutes} ${period}`;
	}
	
	// Determine the base date text
	let datePart = '';
	if (daystilldue === 0) {
		datePart = 'Today';
	} else if (daystilldue === 1) {
		datePart = 'Tomorrow';
	} else if (daystilldue > 1 && daystilldue < 7) {
		datePart = dueDate.toLocaleDateString('en-US', { weekday: 'long' });
	} else {
		datePart = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
	
	// Combine date and time, excluding the time part if it doesn't exist
	const duetext = formattedTime ? `${datePart}, ${formattedTime}` : datePart;
	
	return [duetext, daystilldue];
}

function CustomScrollArea({ children, scrollRef }) {
	const trackRef = useRef(null)
	const dragRef = useRef(null)
	const [scrollbar, setScrollbar] = useState({ visible: false, height: 0, top: 0 })

	const updateScrollbar = useCallback(() => {
		const scrollElement = scrollRef.current
		const trackElement = trackRef.current
		if (!scrollElement || !trackElement) return

		const trackHeight = trackElement.clientHeight
		const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight
		const thumbHeight = Math.min(trackHeight, Math.max(28, trackHeight * scrollElement.clientHeight / scrollElement.scrollHeight))
		const thumbRange = Math.max(0, trackHeight - thumbHeight)
		setScrollbar({
			visible: scrollRange > 0,
			height: thumbHeight,
			top: scrollRange > 0 ? scrollElement.scrollTop / scrollRange * thumbRange : 0,
		})
	}, [scrollRef])

	useEffect(() => {
		updateScrollbar()
		const scrollElement = scrollRef.current
		const contentElement = scrollElement?.firstElementChild
		if (!scrollElement || !contentElement || typeof ResizeObserver === 'undefined') return

		const observer = new ResizeObserver(updateScrollbar)
		observer.observe(scrollElement)
		observer.observe(contentElement)
		return () => observer.disconnect()
	}, [scrollRef, updateScrollbar])

	function handleTrackPointerDown(event) {
		if (event.target !== trackRef.current) return
		const scrollElement = scrollRef.current
		const trackElement = trackRef.current
		if (!scrollElement || !trackElement) return

		const trackRect = trackElement.getBoundingClientRect()
		const thumbRange = trackRect.height - scrollbar.height
		const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight
		if (thumbRange <= 0 || scrollRange <= 0) return

		const thumbPosition = Math.max(0, Math.min(thumbRange, event.clientY - trackRect.top - scrollbar.height / 2))
		scrollElement.scrollTop = thumbPosition / thumbRange * scrollRange
	}

	function handleThumbPointerDown(event) {
		const scrollElement = scrollRef.current
		if (!scrollElement) return
		event.preventDefault()
		event.stopPropagation()
		event.currentTarget.setPointerCapture(event.pointerId)
		dragRef.current = {
			pointerId: event.pointerId,
			startY: event.clientY,
			startScrollTop: scrollElement.scrollTop,
		}
	}

	function handleThumbPointerMove(event) {
		const drag = dragRef.current
		const scrollElement = scrollRef.current
		const trackElement = trackRef.current
		if (!drag || drag.pointerId !== event.pointerId || !scrollElement || !trackElement) return

		const thumbRange = trackElement.clientHeight - scrollbar.height
		const scrollRange = scrollElement.scrollHeight - scrollElement.clientHeight
		if (thumbRange <= 0) return
		scrollElement.scrollTop = drag.startScrollTop + (event.clientY - drag.startY) * scrollRange / thumbRange
	}

	function handleThumbPointerEnd(event) {
		if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
	}

	return (
		<div className="info-dialog-scroll-area">
			<div className="info-dialog-scroll" ref={scrollRef} onScroll={updateScrollbar}>
				<div className="info-dialog-content">{children}</div>
			</div>
			<div
				className={scrollbar.visible ? 'custom-scrollbar is-visible' : 'custom-scrollbar'}
				ref={trackRef}
				aria-hidden="true"
				onPointerDown={handleTrackPointerDown}
			>
				{scrollbar.visible && (
					<div
						className="custom-scrollbar-thumb"
						style={{ height: `${scrollbar.height}px`, top: `${scrollbar.top}px` }}
						onPointerDown={handleThumbPointerDown}
						onPointerMove={handleThumbPointerMove}
						onPointerUp={handleThumbPointerEnd}
						onPointerCancel={handleThumbPointerEnd}
					/>
				)}
			</div>
		</div>
	)
}

function App() {
	const [upcomingAssignments, setUpcomingAssignments] = useState([]);
	const [tasks, setTasks] = useState(initialTasks)
	const [activeTab, setActiveTab] = useState('assignments')
	const [pageDirection, setPageDirection] = useState('forward')
	const [searchQuery, setSearchQuery] = useState('')
	const [findItDraft, setFindItDraft] = useState('')
	const [findItMessages, setFindItMessages] = useState([
		{ id: 0, role: 'assistant', content: 'Hi, I’m Find-It. Ask me about a course, due date, or your upcoming timeline.' },
	])
	const [menuOpen, setMenuOpen] = useState(false)
	const [infoDialog, setInfoDialog] = useState(null)
	const [canvasSetupOpen, setCanvasSetupOpen] = useState(false)
	const [canvasSetupDraft, setCanvasSetupDraft] = useState('')
	const [helpOpen, setHelpOpen] = useState(false)
	const [preferences, setPreferences] = useState(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('bearbones-preferences') ?? '{}')
			return { reduceMotion: saved.reduceMotion === true, compactLists: saved.compactLists === true, canvasToken: saved.canvasToken ?? "" }
		} catch {
			return { reduceMotion: false, compactLists: false, canvasToken: "" }
		}
	})
	const [settingsCanvasEditing, setSettingsCanvasEditing] = useState(() => {
		try {
			const saved = JSON.parse(localStorage.getItem('bearbones-preferences') ?? '{}')
			return !saved.canvasToken
		} catch {
			return true
		}
	})
	const [settingsCanvasDraft, setSettingsCanvasDraft] = useState('')
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
	const infoDialogDismissRef = useRef(null)
	const activeModalTitleRef = useRef(null)
	const infoDialogScrollRef = useRef(null)
	const canvasSyncRef = useRef(null)
	const lastMenuTouchRef = useRef(0)
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

	useEffect(() => {
		if (!infoDialog) return

		infoDialogDismissRef.current?.focus()
		function handleKeyDown(event) {
			if (event.key === 'Escape') setInfoDialog(null)
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [infoDialog])

	useEffect(() => {
		if (!canvasSetupOpen && !helpOpen) return

		infoDialogScrollRef.current?.scrollTo({ top: 0 })
		activeModalTitleRef.current?.focus({ preventScroll: true })
		function handleKeyDown(event) {
			if (event.key === 'Escape') {
				setCanvasSetupOpen(false)
				setHelpOpen(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [canvasSetupOpen, helpOpen])
	
	
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
		}
		window.addEventListener('resize', updateHeight)
		return () => window.removeEventListener('resize', updateHeight)
	}, [])

	function toggleTask(id) {
		setTasks((currentTasks) =>
			currentTasks.map((task) =>
				task.id === id ? { ...task, done: !task.done } : task,
			),
		)
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
		setCanvasSetupOpen(false)
		setHelpOpen(false)
		navigateToTab('settings')
	}

	function openCanvasSetup() {
		setMenuOpen(false)
		setHelpOpen(false)
		setCanvasSetupDraft(preferences.canvasToken)
		setCanvasSetupOpen(true)
	}

	function openHelp() {
		setMenuOpen(false)
		setCanvasSetupOpen(false)
		setHelpOpen(true)
	}

	function saveCanvasSetup(event) {
		event.preventDefault()
		const canvasToken = canvasSetupDraft.trim()
		if (!canvasToken) return

		setPreferences((current) => ({ ...current, canvasToken }))
		setSettingsCanvasDraft(canvasToken)
		setSettingsCanvasEditing(false)
		setCanvasSetupOpen(false)
		void canvasSyncRef.current?.(canvasToken)
	}

	function editSettingsCanvasKey() {
		setSettingsCanvasDraft(preferences.canvasToken)
		setSettingsCanvasEditing(true)
	}

	function saveSettingsCanvasKey(event) {
		event.preventDefault()
		const canvasToken = settingsCanvasDraft.trim()
		if (!canvasToken) return

		setPreferences((current) => ({ ...current, canvasToken }))
		setSettingsCanvasEditing(false)
		void canvasSyncRef.current?.(canvasToken)
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
			{ id: messageId + 1, role: 'assistant', content: findItAnswer(content, tasks, upcomingAssignments) },
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
		const start = touchStartRef.current;
		touchStartRef.current = null;
		if (!start) return;

		const touch = event.changedTouches[0];
		const deltaX = touch.clientX - start.x;
		const deltaY = touch.clientY - start.y;
		if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
		if (activeTab === 'settings') {
			if (deltaX > 0) returnFromSettings()
			return
		}

		const currentIndex = navItems.findIndex((item) => item.id === activeTab)
		const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1
		if (nextIndex >= 0 && nextIndex < navItems.length) navigateToTab(navItems[nextIndex].id)
	}
	
	useEffect(() => {
		async function updateUI(data) {
			let newAssignments = [];
			const courses = data['courses'] || [];
			
			for (const course of courses) {
				const coursename = course['course_name'];
				// Assuming events are nested inside each course:
				const events = course['events'] || []; 
				
				for (const e of events) {
					const title = e['title'];
					const dates = e['dates'] || [];
					
					for (const d of dates) {
						let event_name = title;
						const date_name = d['info'];
						if (event_name != date_name) {
							event_name += " • " + date_name;
						}
						
						const date = d['date']; // DD/MM/YYYY
						const time = d['time']; // HH/mm
						
						if (!d['show']) {
							continue;
						}
						
						const [duetext, daystilldue] = parseDateTime(date, time);
						
						const event = {
							course: coursename,
							title: event_name,
							due: duetext,
							dayOffset: daystilldue
						};
						
						newAssignments.push(event);
					}
				}
			}
			
			newAssignments.sort((a, b) => a.dayOffset - b.dayOffset); // keeps earliest first
			
			setUpcomingAssignments(newAssignments);
		}
		
		async function checkForSync(token = preferences.canvasToken) {
			try {
				const options = {
					url: 'https://bearbones.duckdns.org:3982/sync',
					headers: { 'Content-Type': 'application/json' },
					data: { token }
				};
				const response = await CapacitorHttp.post(options);
				return response.data;
			} catch (error) {
				console.error('Failed to sync assignments', error);
				return null;
			}
		}
		
		async function start(token = preferences.canvasToken) {
			console.log("Start");
			let localdata = await loadJSON("events");
			
			if (localdata) {
				await updateUI(localdata);
			}
			
			let changed_data = await checkForSync(token);
			if (changed_data) {
				if (!changed_data['token_good']) {
					setInfoDialog({
						title: 'Canvas key needs attention',
						message: 'Your Canvas API key is missing or may have expired. Add a valid key in Settings to access course information.',
					});
				}else{
					let unindexedCourses = [];
					for (const c of changed_data['courses']) {
						if (c['last_update'] == -1) {
							unindexedCourses.push(c['course_name']);
						}
					}
					if (unindexedCourses.length != 0) {
						let didbegin = "not begun.";
						if (changed_data['started_index_of_course']) {
							didbegin = "begun.";
						}
						
						let coursenames = unindexedCourses.join(', ');
						
						setInfoDialog({
							title: 'Courses still indexing',
							message: `Indexing has ${didbegin} Courses: ${coursenames}. Please check back in a few minutes.`,
						});
					}
				}
				
				await saveJSON("events", changed_data)
				await updateUI(changed_data);
			}
		}
		
		canvasSyncRef.current = start;
		start();
		
	}, []);


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
	const normalizedQueryList = searchQuery.trim().toLocaleLowerCase().split(' ')
	const matchesSearch = (item) => {
		const searchin = ((item.title ?? '') + " " + (item.course ?? '') + " " + (item.due ?? '')).toLocaleLowerCase();
		
		// requires the: title, coursename, and due date to 
		// collectively contain *all* of the words within the search
		
		for (const item of normalizedQueryList) {
			if (!searchin.includes(item)) {
				return false;
			}
		}
		return true;
	}
	const filteredAssignments = upcomingAssignments.filter((item) => item.dayOffset >= 0 && matchesSearch(item))
	const filteredTasks = tasks.filter(matchesSearch)
	const selectedAssignments = assignmentsForDate(selectedDate).filter(matchesSearch)
	
	return (
		<>
			<style>{styles}</style>
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
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}
					onTouchCancel={() => { touchStartRef.current = null }}
				>
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
													<span className="calendar-event-dot" key={`${assignment.course}-${assignment.title}-${assignment.due}`}>{assignment.title}</span>
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
											<article className="assignment-row" key={`${assignment.course}-${assignment.title}-${assignment.due}`}>
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

							<section className="dashboard-section" aria-labelledby="canvas-settings-title">
								<div className="section-heading">
									<h2 id="canvas-settings-title">Canvas</h2>
								</div>
								<ul className="settings-list">
									<li>
										<form className="settings-canvas-key" onSubmit={saveSettingsCanvasKey}>
											<div className="settings-copy">
												<span className="settings-title">Canvas API Key</span>
												<span className="settings-description">Required for accessing course information.</span>
											</div>
											{preferences.canvasToken && !settingsCanvasEditing ? (
												<div className="settings-key-status">
													<span>Key already added</span>
													<button className="settings-key-edit" type="button" onClick={editSettingsCanvasKey}>Edit</button>
												</div>
											) : (
												<>
													<input
														type="password"
														value={settingsCanvasEditing ? settingsCanvasDraft : preferences.canvasToken}
														onChange={(event) => setSettingsCanvasDraft(event.target.value)}
														placeholder="Enter your Canvas API key"
														autoComplete="off"
													/>
													<div className="settings-key-actions">
														{preferences.canvasToken && (
															<button className="settings-test-button" type="button" onClick={() => setSettingsCanvasEditing(false)}>
																Cancel
															</button>
														)}
														<button className="info-dialog-dismiss" type="submit" disabled={!settingsCanvasDraft.trim()}>
															Save key
														</button>
													</div>
												</>
											)}
										</form>
									</li>
									<li>
										<div className="settings-test-row">
											<div className="settings-copy">
												<span className="settings-title">Need help connecting?</span>
												<span className="settings-description">Follow the guided Canvas setup.</span>
											</div>
											<button className="settings-test-button" type="button" onClick={openCanvasSetup}>
												Setup guide
											</button>
										</div>
									</li>
								</ul>
							</section>

							<section className="dashboard-section" aria-labelledby="messages-settings-title">
								<div className="section-heading">
									<h2 id="messages-settings-title">Messages</h2>
								</div>
								<ul className="settings-list">
									<li>
										<div className="settings-test-row">
											<div className="settings-copy">
												<span className="settings-title">Info popup</span>
												<span className="settings-description">Preview the style used for app messages.</span>
											</div>
											<button
												className="settings-test-button"
												type="button"
												onClick={() => setInfoDialog({
													title: 'Your info popup is working',
													message: 'This is a preview of the helpful messages you’ll see in BearBones.',
												})}
											>
												Test popup
											</button>
										</div>
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
										<article className="assignment-row" key={`${assignment.course}-${assignment.title}-${assignment.due}`}>
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
						<button className="top-menu-item" type="button" onClick={openCanvasSetup}>
							Set up Canvas
						</button>
						<button className="top-menu-item" type="button" onClick={openHelp}>
							Help
						</button>
					</div>
				)}

				{canvasSetupOpen && (
					<div
						className="info-dialog-backdrop"
						onClick={(event) => {
							if (event.target === event.currentTarget) setCanvasSetupOpen(false)
						}}
					>
						<section className="info-dialog" role="dialog" aria-modal="true" aria-labelledby="canvas-setup-title">
							<CustomScrollArea scrollRef={infoDialogScrollRef}>
							<p className="info-dialog-kicker">Canvas · Setup</p>
							<h2 id="canvas-setup-title" ref={activeModalTitleRef} tabIndex="-1">Connect your Canvas account</h2>
							<ol className="setup-steps">
								<li>
									<strong>Open your school’s Canvas site.</strong>
									Sign in and open Account → Settings.
								</li>
								<li>
									<strong>Create an access token.</strong>
									Choose “+ New Access Token” under Approved Integrations and name it BearBones. Set the expiry as far ahead as your school permits, then generate the token.
								</li>
								<li>
									<strong>Copy it and add it below.</strong>
									Canvas shows the token once. Treat it like a password and don’t share it.
								</li>
							</ol>
							<a
								className="setup-link"
								href="https://canvas.instructure.com/doc/api/file.oauth.html#manual-token-generation"
								target="_blank"
								rel="noopener noreferrer"
							>
								Read Canvas token instructions
							</a>
							{preferences.canvasToken ? (
								<>
									<p className="setup-privacy">A Canvas key is already added. To change or replace it, go to Settings → Canvas.</p>
									<div className="info-dialog-actions">
										<button className="info-dialog-dismiss" type="button" onClick={openSettingsPage}>
											Go to Settings
										</button>
									</div>
								</>
							) : (
								<>
									<p className="setup-privacy">Your key is saved on this device and sent to the BearBones sync server to retrieve course information. Only continue if you trust this app with your Canvas account.</p>
									<form onSubmit={saveCanvasSetup}>
										<label className="setup-token-field">
											Canvas API key
											<input
												type="password"
												autoComplete="off"
												value={canvasSetupDraft}
												onChange={(event) => setCanvasSetupDraft(event.target.value)}
												placeholder="Paste your token"
											/>
										</label>
										<div className="info-dialog-actions">
											<button className="settings-test-button" type="button" onClick={() => setCanvasSetupOpen(false)}>
												Cancel
											</button>
											<button className="info-dialog-dismiss" type="submit" disabled={!canvasSetupDraft.trim()}>
												Save key
											</button>
										</div>
									</form>
								</>
							)}
							</CustomScrollArea>
						</section>
					</div>
				)}

				{helpOpen && (
					<div
						className="info-dialog-backdrop"
						onClick={(event) => {
							if (event.target === event.currentTarget) setHelpOpen(false)
						}}
					>
						<section className="info-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
							<CustomScrollArea scrollRef={infoDialogScrollRef}>
							<p className="info-dialog-kicker">BearBones · Help</p>
							<h2 id="help-title" ref={activeModalTitleRef} tabIndex="-1">How can we help?</h2>
							<div className="help-topic">
								<h3>Getting started</h3>
								<p>Choose “Set up Canvas” from the app menu for the guided steps, or visit Settings → Canvas to update your key.</p>
							</div>
							<div className="help-topic">
								<h3>Canvas key not working?</h3>
								<p>Check that the key was copied in full and hasn’t expired. Create a new key in your Canvas account if needed, then replace the saved key in Settings.</p>
							</div>
							<div className="help-topic">
								<h3>Courses still indexing?</h3>
								<p>New course information can take a few minutes to become available. Return to BearBones and check again shortly.</p>
							</div>
							<div className="info-dialog-actions">
								<button className="settings-test-button" type="button" onClick={openCanvasSetup}>
									Set up Canvas
								</button>
								<button className="info-dialog-dismiss" type="button" onClick={() => setHelpOpen(false)}>
									Close
								</button>
							</div>
							</CustomScrollArea>
						</section>
					</div>
				)}

				{infoDialog && (
					<div
						className="info-dialog-backdrop"
						onClick={(event) => {
							if (event.target === event.currentTarget) setInfoDialog(null)
						}}
					>
						<section
							className="info-dialog"
							role="dialog"
							aria-modal="true"
							aria-labelledby="info-dialog-title"
							aria-describedby="info-dialog-message"
						>
							<CustomScrollArea scrollRef={infoDialogScrollRef}>
							<p className="info-dialog-kicker">BearBones · Information</p>
							<h2 id="info-dialog-title">{infoDialog.title}</h2>
							<p className="info-dialog-message" id="info-dialog-message">{infoDialog.message}</p>
							<div className="info-dialog-actions">
								<button
									className="info-dialog-dismiss"
									type="button"
									ref={infoDialogDismissRef}
									onClick={() => setInfoDialog(null)}
								>
									Got it
								</button>
							</div>
							</CustomScrollArea>
						</section>
					</div>
				)}

				{/* Direct child of .app-shell */}
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
	
	start();
}

export default App