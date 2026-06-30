# Agent instructions: learn-durable-objects

## What this repo is

A self-paced course on Cloudflare Durable Objects, built using the /teach skill workflow.
Each lesson is a self-contained HTML file in `lessons/`. Each has a companion podcast (`*-podcast.mp3`).

## Working in this repo

- Read `PLAN.md` first to understand the lesson sequence and process.
- Read `MISSION.md` to understand who this is for and what success looks like.
- Read `NOTES.md` for learner preferences and teaching notes.
- Read existing `learning-records/` before deciding what to teach next.
- Always fetch primary sources (Cloudflare DO docs) before writing lesson content. Never rely on
  parametric knowledge for technical claims.

## Homepage

- `index.html` at the repo root is the course homepage. It lists every lesson by number and title.
- When a new lesson is written, update `index.html`: change its status from "Coming soon" to "Ready".
- Lesson titles in `index.html` must match the `<h1>` in the lesson file exactly.

## Lesson conventions

- Each lesson is `lessons/NNNN-slug.html`, numbered sequentially.
- Each lesson links `../assets/style.css` and `../assets/quiz.js`.
- The breadcrumb at the top of each lesson links `../index.html` (not PLAN.md or any other file).
- The `<h1>` lesson title must match what's listed in `index.html`.
- Each lesson must include: an audio player at the top (`.podcast` div, `src="NNNN-podcast.mp3"`),
  concept explanation, at least one quiz, a primary source link, and a prompt to ask the agent followup questions.
- Lessons are Tufte-style: clean typography, tight scope, completable in ~15 minutes.
- Each lesson has a companion podcast at `lessons/NNNN-podcast.mp3` generated via NotebookLM.

## Assets

- `assets/style.css` — shared stylesheet. Every lesson links it. Do not inline styles in lessons.
- `assets/quiz.js` — reusable quiz widget. Import it; do not duplicate its logic in lessons.

## Git

- Commit and push to `main` after each lesson is complete (lesson + podcast).
- Commit messages use semantic prefixes: `feat:`, `docs:`, `fix:`.
- This is a scratch/learning repo. Pushing to main is intentional and fine.

## Self-update

Update this `AGENTS.md` whenever conventions, file structure, or tooling changes.
