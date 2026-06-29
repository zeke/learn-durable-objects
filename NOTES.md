# Notes

## Learner preferences

- 15-minute sessions
- Quizzes + hands-on coding (both — not one or the other)
- Wants to advocate, build, and teach — not just consume
- Has strong background in web fundamentals (WebSockets, SSE, fetch, HTTP) — do not re-explain these
- Comfortable with TypeScript and Workers syntax — use that for code examples
- Dislikes cognitive surrender: every abstraction should be explained, not just used

## Interview answers (2026-06-29)

- Primary goal: **teach and demystify** — not advocate or build (those are secondary validation)
- Core gap: **what the runtime actually does** — input gates, output gates, hibernation, the single-threaded guarantee as a mechanism
- Actor model: heard of it, never used it — don't use it as primary scaffolding; mention it briefly but don't build lessons around it
- Vendor lock-in: a **separate concern** from understanding the mechanics — address it explicitly after the fundamentals, not as part of them
- Success signal: explain it (to Aly, without notes) + build it + argue it

## Context from transcript (2026-06-17)

- Skip-level Aly Cabral challenged Zeke to "lean into the discomfort"
- Aly deliberately withheld her own DO explanation to let Zeke discover independently
- Zeke's own rough mental model going in: "a bunch of WebSocket-powered, database-backed
  individualized threads that can be attached to individual users or sessions, each with an LLM"
  — partially correct, worth building on rather than discarding

## Lesson conventions

- Audio player goes at the top of every lesson, immediately after the title/meta block, before the first paragraph. Use the `.podcast` div from style.css. The `src` attribute should point to the sibling `NNNN-podcast.mp3` file.

## Teaching notes

- Start from the problem, not the solution. Zeke said the thing that makes DOs feel like magic
  is their capabilities — so show the problem first, let the solution feel inevitable.
- The "cognitive surrender" framing is Addy Osmani's term; Zeke knows it well. Use it as a
  reference point when naming what the lessons are trying to prevent.
- Each lesson: open in browser immediately after writing. Wait for reaction before next lesson.
