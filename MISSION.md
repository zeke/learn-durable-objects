# Mission: Durable Objects

## Why

Zeke is a Cloudflare DevRel engineer whose primary job is to teach and demystify. He uses Durable
Objects through cognitive surrender: he can spin them up but can't explain what the runtime does
on his behalf. His skip-level manager challenged him to resolve that. The goal is not just personal
understanding — it's being able to explain the internals to developers who feel the same confusion.

## Success looks like

- Can explain the runtime mechanics to a confused developer without notes (teach and demystify)
- Can build a DO from scratch and explain every line (validate the understanding is real)
- Can make a confident case for or against DOs in a design review (argue either way)

## Core gap

The runtime mechanics. Not "when would I use a DO" — the specific question is: what does the
runtime actually do? Input gates, output gates, hibernation, the single-threaded guarantee as a
mechanism, not just a property. The fog is there.

## Constraints

- 15 minutes per lesson session
- Quizzes + hands-on coding (both)
- Primary sources only: Cloudflare docs, not pre-trained LLM knowledge
- Actor model: heard of it, never used it — don't use it as primary scaffolding

## Out of scope (for now)

- Vendor lock-in — a separate concern, addressed after the mechanics are clear
- Agents SDK (abstraction layer on top of DOs — learn the primitive first)
- Project Think / Flu (adjacent agent frameworks)
- DO pricing, limits, and production ops
