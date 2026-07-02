# Lesson 1: The Coordination Problem — Learn Durable Objects

*15 minutes · No code required · Mental model only*

Before you can understand what a Durable Object *is*, you need to feel the problem it solves. This lesson is about that problem. We'll call it the **coordination problem**.

## Workers are stateless by design

A Cloudflare Worker is stateless. Every request spins up an isolated execution context, runs your code, and exits. There is no memory between requests. This is the right default: it means Workers fan out horizontally across Cloudflare's global network with no coordination overhead. Thousands of concurrent requests, each handled independently.

That statelessness is a feature until you need two requests to agree on something.

## The moment statelessness breaks down

Imagine a collaborative document editor. Two users open the same document. User A appends "Hello". User B appends "World". Each request hits a Worker. Each Worker reads the current document from a database, appends the new text, and writes it back.

Here's what can happen:

1. Worker A reads: "..."
2. Worker B reads: "..." (same value, A hasn't written yet)
3. Worker A writes: "...Hello"
4. Worker B writes: "...World" (clobbers A's write)

The final document contains only "World". Hello is gone.

This is a **read-modify-write race condition**. It happens because two Workers read the same value before either one writes. Neither Worker knows the other exists.

This class of bug is especially cruel: it only surfaces under load, and it's non-deterministic. Everything looks fine in development. It only breaks when real users hit the same resource at the same time.

## The standard fix: transactions

The traditional answer is database transactions. Wrap the read-modify-write in a transaction. The database serializes concurrent operations. Whoever commits first wins; the loser retries.

This works, but it has costs:

- Every write requires a round trip to the database, including network latency.
- Under contention, retries multiply. The more concurrent writers, the slower everything gets.
- For real-time applications (chat, multiplayer, live cursors), the latency floor matters. Even 20ms feels wrong when you're watching someone else's cursor.

Transactions solve correctness. They don't solve speed.

## The harder problem: real-time coordination

Now make it harder. Not just two writes to the same document — two users in the same chat room. Each connected via a WebSocket. When User A sends a message, Worker A needs to broadcast it to User B's Worker.

But Worker B's connection lives in a different isolate, on a different machine. There's no shared memory. There's no message bus built into Workers. You could publish to a queue and have each Worker poll it, but now you've introduced another system, latency, and complexity.

What you actually want is: **one place where all clients for this room meet**. A single address. Any Worker anywhere in the world that knows the room name can reach it. That address has memory. That address can broadcast to all connected clients.

That address is a Durable Object.

## The key insight

A Durable Object is the inverse of a stateless Worker. Instead of many independent Workers handling each request, a Durable Object is **one instance, handling all requests for a given identity**.

Two properties make this work:

1. **Global uniqueness.** A DO identified as `"room-42"` exists exactly once in the world. Every Worker that asks for `"room-42"` gets routed to the same instance, regardless of where in the world the Workers are running.

2. **Single-threaded execution.** Within that instance, code runs one thing at a time. No two requests can interleave their execution. The race condition above is structurally impossible inside a DO.

**The magic explained.** When a DO "just handles concurrency for you", this is what's happening: the runtime routes all requests for a given ID to the same single-threaded instance. There is no locking algorithm, no retry logic, no transactions (for in-memory state). There is just one thread. Concurrency is serialized by the runtime before it reaches your code.

## Why this doesn't feel like magic once you know it

Your existing mental model was mostly right: "a bunch of WebSocket-powered, database-backed individualized threads attached to individual users or sessions."

The amendment: it's not a thread per *user*. It's a thread per *coordination unit*. A room. A document. A game session. An order. Whatever the thing is that multiple clients need to agree on. One DO per thing-being-coordinated.

The "cognitive surrender" feeling comes from using DOs without understanding why one instance handles everything. Now you know why: it's the only structural way to eliminate the race condition without a database transaction on every operation.

---

## Quiz

**Q1:** Two Workers read the same counter value from a database, each increment it, and each write it back. What is this bug called?
- **Correct: A read-modify-write race condition** — Two independent reads before either write means the second write silently clobbers the first.
- Wrong: A network partition fault event
- Wrong: A distributed transaction rollback
- Wrong: A cache invalidation thundering herd

**Q2:** What is the core structural property that makes a Durable Object correct for coordination without database transactions?
- **Correct: One globally unique instance, running single-threaded** — Global uniqueness means all requests for a given ID arrive at the same instance. Single-threaded execution means they are serialized without locks.
- Wrong: Automatic retry logic built into the Workers runtime
- Wrong: Optimistic locking using compare-and-swap operations
- Wrong: Eventual consistency across replicated storage nodes

**Q3:** A chat app has 10,000 rooms, each with up to 50 active users. What is the right DO topology?
- **Correct: One DO per room, all 50 users routed to it** — The coordination unit is the room, not the user. 10,000 rooms = 10,000 DOs, each small and independent.
- Wrong: One DO per user, message fan-out via queue
- Wrong: One global DO for all rooms, partitioned by key
- Wrong: One DO per data center, replicated via consensus

---

*Primary source: "Durable Objects: Easy, Fast, Correct — Choose three" — Kenton Varda, Cloudflare Blog (2021)*
*https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/*
