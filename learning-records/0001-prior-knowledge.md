# Prior knowledge established at session start

Zeke has strong web fundamentals and Cloudflare Workers experience. He understands WebSockets,
SSE, fetch, HTTP, and TypeScript. He has used Durable Objects in practice but via cognitive
surrender — he can spin them up but cannot explain what the runtime does on his behalf.

His going-in mental model: "a bunch of WebSocket-powered, database-backed individualized threads
that can be attached to individual users or sessions, each with an LLM attached." This is
partially correct (the per-identity isolation is right; the WebSocket connection model is roughly
right) but missing the key insight: the single-threaded execution guarantee and why that matters
for coordination. Future lessons should build on the correct parts rather than discard them.

**Implications:** Skip Web fundamentals. Skip Workers basics. Start directly with the coordination
problem that motivated the DO design. Do not re-explain TypeScript or Workers syntax.
