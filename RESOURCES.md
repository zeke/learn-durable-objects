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
