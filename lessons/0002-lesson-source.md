# Lesson 2: Anatomy of a Durable Object — Learn Durable Objects

*15 minutes · No hands-on code · Runtime mechanics*

Lesson 1 established why a DO exists. This lesson is about what the runtime actually does on your behalf. The goal: after this lesson you could explain the mechanics to someone else without notes.

A Durable Object has five runtime properties that work together. None of them are magic once you can name them.

| Property | What the runtime does |
|---|---|
| Global uniqueness | Routes all requests for a given ID to exactly one instance, anywhere in the world |
| Single-threaded execution | Serializes request handling inside that instance — no two handlers run concurrently |
| Co-located storage | Gives each instance a private SQLite database on the same machine as the instance |
| Input & output gates | Prevents new events from arriving and new responses from leaving while storage writes are in flight |
| Hibernation | Evicts idle instances from memory while keeping WebSocket connections alive |

## 1. Global uniqueness

When a Worker asks for a DO by name — say `env.ROOMS.get(id)` — the runtime resolves that name to a specific Cloudflare data center and routes the request there. The same name always resolves to the same location. Any Worker, in any data center in the world, asking for the same name gets routed to the same single instance.

The routing is deterministic and handled entirely by the runtime. Your code never decides where an instance lives — you just use the name.

**IDs vs. names.** You can address a DO by a random ID (`env.ROOMS.newUniqueId()`) or by a name you choose (`env.ROOMS.idFromName("room-42")`). Both resolve to a globally unique instance. Name-based IDs are deterministic: the same name always produces the same ID, which always routes to the same instance.

## 2. Single-threaded execution

Inside a DO instance, JavaScript runs single-threaded — the same as in a browser. Only one thing runs at a time. But JavaScript is async, which means a handler can `await` something and yield, allowing another handler to start running.

This is where the race condition from Lesson 1 would re-enter. Two concurrent handlers could both read a value, both modify it, both write — and you're back to the same problem.

The runtime prevents this with **input gates**.

## 3. Input & output gates

These are the runtime mechanism that makes single-threaded async code actually correct.

**Input gate:** While a storage operation is in flight (during an `await`), the runtime holds back any new incoming events — requests, responses to outbound fetches, anything. The gate opens only when the storage operation completes and the current JavaScript turn finishes. This means your read-modify-write sequence cannot be interrupted by another request sneaking in between the read and the write.

**Output gate:** While a storage write is in flight, the runtime holds back any outgoing network messages — responses to the client, outbound `fetch()` calls. If the write fails, the held-back messages are dropped and the DO restarts. This means you can fire a `storage.put()` without `await`ing it and still be safe: the runtime will not let a "success" response reach the client before the write lands on disk.

**Why this matters for teaching.** When someone says a DO "automatically handles concurrency", this is the specific mechanism they mean. It is not magic. It is two runtime-enforced gates that prevent events from entering or responses from leaving during a storage operation. You can now name the mechanism.

There is one important caveat. If you deliberately start two async operations from the same synchronous turn — `const p1 = this.getUniqueNumber(); const p2 = this.getUniqueNumber();` — the gates cannot protect you, because there is no incoming event to block. You initiated both calls yourself in the same turn. This is a deterministic bug and easy to catch in testing.

## 4. Co-located storage

Each DO instance has a private SQLite database that lives on the same machine as the instance. Reads and writes do not leave the machine. This is why storage feels fast compared to a traditional database: there is no network hop.

The storage is private to one instance. No other DO can read it. No Worker can access it directly. The only way in is through the DO's own methods.

Writes are also cached in memory automatically. A `storage.put()` writes to the in-memory cache immediately and returns. The cache is flushed to disk asynchronously. The output gate ensures the client never sees a confirmation before the flush succeeds.

## 5. Lifecycle and hibernation

A DO instance starts cold — the constructor runs on the first request. It stays alive in memory as long as requests keep arriving. When it goes idle:

**Active, in-memory** → requests finish → **Idle, in-memory (non-hibernateable)** if it has open WebSockets (Standard API), pending timers, or outbound connections. Billed. Evicted after 70–140 s of inactivity.

**Active, in-memory** → 10 s of inactivity with no blockers → **Hibernated**: removed from memory. In-memory state lost. WebSocket connections (Hibernation API) stay alive. Free. Constructor re-runs on next request.

A DO can only hibernate if there are no pending timers, no in-progress awaited fetches, no active outbound connections, and no WebSockets opened with the standard WebSocket API. If you use the Hibernation WebSocket API instead, the runtime can hibernate the instance while keeping client connections alive.

**The implication for your code:** in-memory state does not survive hibernation. Anything you need across requests must be in storage. Anything you keep in `this.someVar` is a cache, not a source of truth.

## Putting it together

1. A Worker constructs a stub using the DO's name or ID.
2. The runtime routes the request to the unique instance for that ID (global uniqueness).
3. The instance's handler starts. No other handler can run at the same time (single-threaded).
4. If the handler reads or writes storage, the input gate holds back new events and the output gate holds back responses until the write is confirmed (gates).
5. Storage reads and writes hit the co-located SQLite database, usually from in-memory cache (co-located storage).
6. If the DO goes idle with no blockers, it hibernates after 10 seconds, freeing memory without dropping WebSocket clients (hibernation).

That is the full runtime contract. No other mechanism is involved in the coordination story.

---

## Quiz answers

**Q1:** A DO handler awaits a storage.get(). A second request arrives at that exact moment. What does the runtime do with it?
- **Correct: Holds it behind the input gate until the storage op finishes**
- Wrong: Runs it concurrently in a separate async context in the same thread
- Wrong: Queues it in a database-backed request buffer for durability
- Wrong: Rejects it with a 503 and tells the client to retry later

**Q2:** A DO calls storage.put("key", value) without awaiting it, then immediately returns a 200. What actually happens?
- **Correct: The output gate holds the 200 until the write is confirmed on disk**
- Wrong: The 200 is sent immediately and the write completes in the background, possibly lost
- Wrong: The runtime throws because unawaited storage writes are not allowed in DOs
- Wrong: The write is batched and confirmed only on the next request to the same DO

**Q3:** A DO has 50 WebSocket clients connected using the standard WebSocket API. It goes idle. What happens after 10 seconds?
- **Correct: It stays in memory, non-hibernateable, billed, until evicted at 70–140 s**
- Wrong: It hibernates immediately, disconnecting all 50 WebSocket clients gracefully
- Wrong: It hibernates and keeps connections alive via the Hibernation WebSocket API
- Wrong: It remains active and billed indefinitely until all clients disconnect

**Q4:** A DO stores `this.count = 42` in a handler. The DO hibernates. A new request arrives. What is this.count?
- **Correct: Undefined — in-memory state is lost on hibernation**
- Wrong: 42 — the runtime serializes instance variables before hibernating
- Wrong: 42 — the runtime keeps a warm standby with the prior in-memory state
- Wrong: 0 — the runtime resets numeric instance variables to their default

---

*Primary sources:*
- *"Durable Objects: Easy, Fast, Correct — Choose three" — Kenton Varda, Cloudflare Blog (2021)*
- *"Lifecycle of a Durable Object" — Cloudflare Docs*
- *"In-memory state in a Durable Object" — Cloudflare Docs*
