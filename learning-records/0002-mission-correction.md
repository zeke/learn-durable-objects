# Mission was written before the interview; corrected from actual answers

The initial MISSION.md was inferred from the meeting transcript rather than from a proper
interview. The corrected mission changes the primary goal from "advocate + build + teach" to
**teach and demystify first**, with building and arguing as secondary validation. The core gap
was also clarified: not "when to use a DO" but specifically "what the runtime actually does"
(input gates, output gates, hibernation, the single-threaded guarantee as a mechanism).

**Implications:** Lesson 1 stays (it's foundational context), but lessons 2 onwards should be
oriented toward explaining runtime mechanics in enough detail that Zeke could teach them to
someone else — not just use them. The Actor model framing should be avoided as scaffolding.
Vendor lock-in gets its own dedicated discussion after the mechanics land, not woven into lessons.
