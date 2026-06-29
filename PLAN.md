# Plan: Learning Durable Objects

## Context

This repo exists because Zeke mentioned in a 1:1 with his skip-level manager (Aly Cabral, June 17 2026)
that he experiences "cognitive surrender" when using Durable Objects. He can use them, but doesn't
understand what the runtime is doing. This is both a personal frustration and a professional signal:
if a Cloudflare DevRel engineer feels this way, users probably do too.

Aly challenged him to lean into that discomfort and report back.

## Mission

Zeke is a Cloudflare DevRel engineer. When he understands DOs deeply, he will be able to:

1. **Advocate** — recommend or reject DOs with clear reasoning, not just vibes
2. **Build** — write DO code himself and know what the runtime does on his behalf
3. **Teach** — explain the internals to users who feel the same confusion he does

Success = he can do all three without reaching for AI to paper over gaps in his understanding.

## Constraints

- 15 minutes per lesson session
- Quizzes + hands-on coding (both, for storage strength)
- Out of scope for now: Agents SDK, Project Think/Flu — understand the primitive first

## Lesson Sequence

Each lesson is a self-contained HTML file in `lessons/`. Each lesson also has a companion
NotebookLM audio podcast (`podcast.mp3`) generated from the lesson content.

| # | File | Concept |
|---|------|---------|
| 1 | `0001-the-coordination-problem.html` | Why stateless Workers fan-out breaks shared state; the gap DOs fill |
| 2 | `0002-anatomy-of-a-durable-object.html` | Single-threaded guarantee, one instance per ID, co-located SQLite, lifecycle |
| 3 | `0003-build-a-counter-do.html` | Hands-on: minimal counter DO from scratch, line by line |
| 4 | `0004-add-websockets.html` | Extend the counter to broadcast to clients; why single-threading matters |

## Process Per Lesson

1. Fetch primary sources (Cloudflare DO docs) before writing
2. Write the lesson HTML — Tufte-style, ~15 min completable, quiz + hands-on
3. Create a NotebookLM notebook, add the lesson as a source, generate a deep-dive podcast
4. Download `podcast.mp3` into the lesson directory, link it from the HTML
5. Open lesson in browser
6. Wait for questions/reaction before writing the next lesson

## File Structure

```
learn-durable-objects/
  PLAN.md                  ← this file
  MISSION.md               ← grounded learning goal
  RESOURCES.md             ← curated primary sources
  NOTES.md                 ← teacher scratchpad
  AGENTS.md                ← instructions for AI agents working in this repo
  assets/
    style.css              ← shared stylesheet (Tufte-inspired)
    quiz.js                ← reusable quiz widget
  learning-records/
    0001-prior-knowledge.md
  lessons/
    0001-the-coordination-problem.html
    0001-podcast.mp3
    0002-anatomy-of-a-durable-object.html
    0002-podcast.mp3
    ...
  reference/
    glossary.html          ← DO terminology, grows across lessons
```
