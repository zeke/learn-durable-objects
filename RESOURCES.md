# Durable Objects Resources

## Knowledge

- [Cloudflare Durable Objects docs](https://developers.cloudflare.com/durable-objects/)
  The primary source. Covers the programming model, storage API, WebSocket hibernation, lifecycle,
  and wrangler config. Use for: everything. Read before writing any lesson.

- [Durable Objects: Easy, Fast, Correct — Choose three (Cloudflare blog, 2020)](https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/)
  The original design rationale post by Kenton Varda. Explains the coordination problem DOs were
  built to solve and why the single-threaded-per-instance model is the key insight.
  Use for: lesson 1 (the problem) and lesson 2 (the design).

- [Workers runtime source (open source)](https://github.com/cloudflare/workerd)
  The actual runtime that runs Workers and DOs. Use for: verifying claims about what the runtime
  actually does (hibernation, storage, etc.). Not needed for early lessons.

- [Durable Objects storage API reference](https://developers.cloudflare.com/durable-objects/api/storage-api/)
  Complete API surface for `this.ctx.storage`. Use for: lesson 3 onwards.

- [WebSocket hibernation API](https://developers.cloudflare.com/durable-objects/api/websockets/)
  Explains the hibernation model and how DOs can sleep between WebSocket messages without losing
  connections. Use for: lesson 4.

- [workerd (open source Workers runtime)](https://github.com/cloudflare/workerd)
  The actual runtime that runs Workers and DOs, open source under Apache 2.0. The DO implementation
  is in here. Use for: verifying claims about what the runtime does, understanding self-hosting
  options, and confirming that the code (if not the infrastructure) is portable.

- [Microsoft Orleans overview](https://learn.microsoft.com/en-us/dotnet/orleans/overview)
  The closest prior art to Durable Objects — "grains" with globally unique string keys, virtual
  existence, co-located state, and auto-activation on demand. Used in production at Microsoft for
  Halo, Xbox, Azure, Skype. Use for: showing that the DO pattern is a well-established distributed
  systems primitive, not Cloudflare-specific magic.

- [Rivet Actors](https://rivet.gg/docs/actors)
  A newer platform (YC, a16z) that implements the same Actor model pattern — in-memory state,
  co-located SQLite, hibernation, unique identity per key — but runs on Node.js/Bun, is
  self-hostable as a single binary, and deploys to Cloudflare, Vercel, Railway, AWS, Kubernetes,
  or your own VMs. The most direct answer to "what would I migrate to if I left Cloudflare?"
  Use for: the lock-in discussion; understanding what is Cloudflare-specific vs. pattern-level.

- [Actor model (Wikipedia)](https://en.wikipedia.org/wiki/Actor_model)
  The 1973 Carl Hewitt paper that defines the pattern DOs implement. Use for: grounding the
  "this is not new" framing when explaining DOs to users.

## Wisdom (Communities)

- [Cloudflare Workers Discord #durable-objects channel](https://discord.gg/cloudflaredev)
  Active community with Cloudflare engineers present. Good for: real-world pattern questions,
  edge cases, "is this the right tool" conversations.

- [Cloudflare Community forums](https://community.cloudflare.com/c/developers/workers/40)
  Higher signal-to-noise than generic forums for Workers/DO questions.

## Gaps

- No good independent "internals" writeup exists outside of the workerd source and the 2020 blog
  post. The primary source IS the Cloudflare docs. That's actually fine — it means the docs are
  the ground truth and there's less risk of conflicting information.
