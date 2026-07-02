<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 3: Build a counter DO — Learn Durable Objects</title>
  <link rel="stylesheet" href="../assets/style.css">
  <style>
    /* Annotated code block */
    .annotated {
      margin: 1.5rem 0;
      border-left: 3px solid var(--accent);
      background: var(--code-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .annotated pre {
      margin: 0;
      border: none;
      border-radius: 0;
      border-left: none;
    }

    .annotation {
      font-family: sans-serif;
      font-size: 0.82rem;
      line-height: 1.5;
      padding: 0.6rem 1.25rem 0.75rem;
      border-top: 1px solid var(--border);
      background: #fff;
    }

    .annotation strong {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--accent-dark);
      margin-bottom: 0.2rem;
    }

    /* File label */
    .file-label {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--muted);
      padding: 0.45rem 1.25rem;
      border-bottom: 1px solid var(--border);
      background: #f0efe9;
    }

    /* Challenge box */
    .challenge {
      border: 1px solid var(--accent);
      border-radius: 4px;
      padding: 1rem 1.25rem;
      margin: 1.5rem 0;
      font-family: sans-serif;
      font-size: 0.9rem;
    }

    .challenge .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-dark);
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 700;
    }

    .challenge p { margin: 0 0 0.5rem; }
    .challenge p:last-child { margin-bottom: 0; }
  </style>
</head>
<body>

  <p class="lesson-meta">
    <a href="../index.html">Learn Durable Objects</a> &rsaquo; Lesson 3 of 4
  </p>

  <h1>Build a counter DO</h1>
  <p style="font-family:sans-serif; font-size:0.88rem; color:#555; margin-top:0.25rem;">
    15 minutes &nbsp;&middot;&nbsp; Hands-on code &nbsp;&middot;&nbsp; Every line explained
  </p>

  <div class="podcast">
    <p>Listen while you read &mdash; AI-generated podcast for this lesson</p>
    <audio controls src="0003-podcast.mp3"></audio>
  </div>

  <p>
    Lessons 1 and 2 were about why and how. This lesson is about <em>doing</em>. You will read a
    complete, working counter DO and its companion Worker. Every line is annotated. Nothing is
    hand-waved.
  </p>

  <p>
    The counter: multiple clients can increment, decrement, and read a named counter. Each counter
    name gets its own DO instance. The value persists across requests and restarts. Concurrent
    increments are safe — no transactions, no locks.
  </p>

  <h2>The two files</h2>

  <p>
    A DO deployment always has at least two parts: the <strong>Durable Object class</strong>
    (the instance that holds state) and the <strong>Worker</strong> (the stateless entry point
    that routes requests to it). They live in the same file here, but they are conceptually
    distinct.
  </p>

  <h2>The Durable Object class</h2>

  <div class="annotated">
    <div class="file-label">src/index.ts</div>
    <pre><code>import { DurableObject } from "cloudflare:workers";</code></pre>
    <div class="annotation">
      <strong>Why this import</strong>
      The <code>DurableObject</code> base class is provided by the Workers runtime. Extending it
      gives your class access to <code>this.ctx</code> (state and storage) and
      <code>this.env</code> (bindings). You must call <code>super(ctx, env)</code> in your
      constructor — the base class does real work.
    </div>
  </div>

  <div class="annotated">
    <pre><code>export class Counter extends DurableObject {</code></pre>
    <div class="annotation">
      <strong>The export matters</strong>
      This class must be exported so the runtime can find it. The name here —
      <code>Counter</code> — must match the <code>class_name</code> in
      <code>wrangler.jsonc</code>. The runtime uses that binding to know which class to
      instantiate when a stub is created.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async getCounterValue(): Promise&lt;number&gt; {
    let value = (await this.ctx.storage.get("value")) || 0;
    return value;
  }</code></pre>
    <div class="annotation">
      <strong>this.ctx.storage</strong>
      <code>this.ctx.storage</code> is the DO's private KV-style storage API. <code>get()</code>
      returns a Promise that resolves to whatever was previously stored, or
      <code>undefined</code> if nothing was. The <code>|| 0</code> handles the first-ever
      read before anything is written. This read hits the in-memory cache if the value was
      recently accessed; otherwise it reads from the co-located SQLite database on the same
      machine.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async increment(amount = 1): Promise&lt;number&gt; {
    let value = (await this.ctx.storage.get("value")) || 0;
    value += amount;
    await this.ctx.storage.put("value", value);
    return value;
  }</code></pre>
    <div class="annotation">
      <strong>Read-modify-write — safe here, dangerous elsewhere</strong>
      In a normal async JavaScript context this pattern is a race condition: two concurrent
      callers could both read the same value before either writes. Inside a DO it is safe.
      The <strong>input gate</strong> from Lesson 2 blocks any other handler from running
      while this handler is awaiting the <code>get()</code> or the <code>put()</code>.
      By the time the second request's handler starts, the first has already finished its
      write. No lock, no transaction, no retry — the runtime serializes it structurally.
      <br><br>
      The comment in the official example says exactly this:
      <em>"You do not have to worry about a concurrent request having modified the value in
      storage. Input gates will automatically protect against unwanted concurrency."</em>
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async decrement(amount = 1): Promise&lt;number&gt; {
    let value = (await this.ctx.storage.get("value")) || 0;
    value -= amount;
    await this.ctx.storage.put("value", value);
    return value;
  }
}</code></pre>
    <div class="annotation">
      <strong>RPC methods</strong>
      <code>increment()</code>, <code>decrement()</code>, and <code>getCounterValue()</code> are
      plain async methods on the class. The Workers RPC system automatically exposes any
      <code>public</code> method as callable from a stub. There is no special decorator or
      registration step. The method name becomes the RPC name.
    </div>
  </div>

  <h2>The Worker (entry point)</h2>

  <div class="annotated">
    <pre><code>export default {
  async fetch(request: Request, env: Env): Promise&lt;Response&gt; {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (!name) {
      return new Response("Add ?name=something to the URL", { status: 400 });
    }</code></pre>
    <div class="annotation">
      <strong>The Worker is stateless — always</strong>
      This is a normal Worker fetch handler. It has no persistent state. It reads the request,
      decides which DO to talk to, talks to it, and returns the response. All state lives in
      the DO, not here.
    </div>
  </div>

  <div class="annotated">
    <pre><code>    const stub = env.COUNTERS.idFromName(name);
    const id = env.COUNTERS.get(stub);</code></pre>
    <div class="annotation">
      <strong>Two steps to get a stub</strong>
      <code>env.COUNTERS</code> is the DO namespace binding (declared in
      <code>wrangler.jsonc</code>). <code>idFromName(name)</code> converts the string name
      to a globally unique <code>DurableObjectId</code> — deterministically. The same name
      always produces the same ID, so the same instance. <code>.get(id)</code> returns a
      <em>stub</em>: a client object that knows how to route calls to that instance. The
      instance is not created or woken up yet — that happens when you call a method on the stub.
    </div>
  </div>

  <div class="annotated">
    <pre><code>    let count: number;
    switch (url.pathname) {
      case "/increment":
        count = await stub.increment();
        break;
      case "/decrement":
        count = await stub.decrement();
        break;
      case "/":
        count = await stub.getCounterValue();
        break;
      default:
        return new Response("Not found", { status: 404 });
    }

    return new Response(`Counter '${name}': ${count}`);
  },
};</code></pre>
    <div class="annotation">
      <strong>Calling RPC methods on the stub</strong>
      <code>stub.increment()</code> looks like a local method call but it is an RPC: the
      runtime serializes the call, routes it to the DO instance (waking it if hibernated),
      runs <code>increment()</code> in the DO's single-threaded context, serializes the return
      value, and resolves the Promise here. The Worker waits for the Promise before returning
      its response.
    </div>
  </div>

  <h2>The wrangler config</h2>

  <div class="annotated">
    <div class="file-label">wrangler.jsonc</div>
    <pre><code>{
  "name": "my-counter",
  "main": "src/index.ts",
  "durable_objects": {
    "bindings": [
      {
        "name": "COUNTERS",
        "class_name": "Counter"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["Counter"]
    }
  ]
}</code></pre>
    <div class="annotation">
      <strong>Two required config blocks</strong>
      <br>
      <code>durable_objects.bindings</code> — tells the runtime: "when this Worker references
      <code>env.COUNTERS</code>, route it to instances of the <code>Counter</code> class."
      The <code>name</code> here is what you use in your Worker code; the
      <code>class_name</code> must match the exported class name exactly.
      <br><br>
      <code>migrations</code> — required when creating a new DO class. The
      <code>new_sqlite_classes</code> array tells the runtime to provision a SQLite database
      for each instance of this class. You only declare a migration once per class creation.
      If you rename or delete a class later, you add another migration entry. Tags must be
      unique and sequential.
    </div>
  </div>

  <h2>What happens on the first request</h2>

  <ol style="margin: 0 0 1rem 1.5rem; padding: 0; line-height: 1.8;">
    <li>Worker receives <code>GET /?name=visits</code></li>
    <li>Worker calls <code>env.COUNTERS.idFromName("visits")</code> — deterministic ID computed</li>
    <li>Worker calls <code>env.COUNTERS.get(id)</code> — stub created, no network call yet</li>
    <li>Worker calls <code>await stub.getCounterValue()</code> — RPC sent to the DO</li>
    <li>Runtime finds no active instance for this ID, cold-starts it: constructor runs</li>
    <li><code>getCounterValue()</code> runs: <code>storage.get("value")</code> returns
        <code>undefined</code>, method returns <code>0</code></li>
    <li>Worker returns <code>"Counter 'visits': 0"</code></li>
    <li>DO stays alive in memory, waiting for more requests</li>
  </ol>

  <p>
    On the second request to <code>/increment?name=visits</code>, step 5 is skipped — the
    instance is already warm. The input gate ensures the read-modify-write in
    <code>increment()</code> is never interrupted by a concurrent call.
  </p>

  <hr style="margin: 2.5rem 0; border:none; border-top: 1px solid #ddd;">

  <h2>Challenge</h2>

  <div class="challenge">
    <span class="label">Hands-on</span>
    <p>
      Without running it, trace through what happens when two requests arrive at the same
      millisecond: <code>GET /increment?name=hits</code> and
      <code>GET /increment?name=hits</code>. The counter starts at 5.
    </p>
    <p>
      Write down: what value does each request return? What is stored after both complete?
      Then check your reasoning against the answer below.
    </p>
    <details style="margin-top:0.75rem; font-size:0.88rem;">
      <summary style="cursor:pointer; font-family:sans-serif; color:var(--accent-dark);">Show answer</summary>
      <div style="margin-top:0.75rem; padding:0.75rem; background:var(--code-bg); border-radius:4px;">
        <p style="margin:0 0 0.5rem;">
          One request wins the input gate. Say request A goes first. A reads 5, writes 6,
          returns 6. The input gate then opens. Request B reads 6 (not 5 — A's write is
          already confirmed), writes 7, returns 7.
        </p>
        <p style="margin:0;">
          Final stored value: <strong>7</strong>. No duplicate returns. No lost increment.
          Neither request needed to know the other existed.
        </p>
      </div>
    </details>
  </div>

  <hr style="margin: 2.5rem 0; border:none; border-top: 1px solid #ddd;">

  <h2>Quiz</h2>
  <p style="font-family:sans-serif; font-size:0.85rem; color:#555;">
    Select the best answer.
  </p>

  <div class="quiz" data-quiz="q1" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      What does <code>env.COUNTERS.idFromName("room-42")</code> return?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">A deterministic globally-unique ID that always maps to the same instance</li>
      <li>A random ID that creates a new instance each time it is called</li>
      <li>A string key used to look up the instance in a central registry</li>
      <li>An HTTP stub that immediately wakes the Durable Object instance</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. idFromName() is deterministic: the same name always produces the same DurableObjectId, which always routes to the same instance. No registry lookup, no network call."
       data-incorrect="Not quite. idFromName() is deterministic — not random, not a registry key, and it doesn't wake the DO. A stub is returned by .get(), and the DO wakes only when a method is called on it."
       hidden></p>
  </div>

  <div class="quiz" data-quiz="q2" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      Why is there no explicit transaction around the read-modify-write in
      <code>increment()</code>?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">The input gate serializes concurrent handlers so the sequence cannot be interrupted</li>
      <li>Single-threaded JS means two functions can never run at the same time in any context</li>
      <li>The storage.put() call includes an implicit compare-and-swap under the hood</li>
      <li>The counter value is cached in memory so storage is only written once at the end</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. The input gate holds back any new request while a storage operation is awaited. By the time the gate opens and the next handler starts, the write is already done. Serialization happens at the runtime level, not the application level."
       data-incorrect="Not quite. Single-threaded JS alone isn't enough — async gaps still allow interleaving. There's no CAS in storage.put(). The gate is the specific mechanism."
       hidden></p>
  </div>

  <div class="quiz" data-quiz="q3" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      When does the DO instance actually start (constructor runs) for the first time?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">When the first RPC method is called on its stub</li>
      <li>When env.COUNTERS.idFromName() is called in the Worker</li>
      <li>When the Worker script is deployed via wrangler deploy</li>
      <li>When env.COUNTERS.get(id) constructs the stub object</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. Creating an ID and getting a stub are local operations — no network, no instantiation. The DO cold-starts only when the first actual RPC call is dispatched to it."
       data-incorrect="Not quite. idFromName() is a local computation. get() creates a stub locally. deploy() sets up the class binding. The instance starts only when a method is actually called on the stub."
       hidden></p>
  </div>

  <div class="primary-source">
    <span class="label">Primary sources for this lesson</span>
    <a href="https://developers.cloudflare.com/durable-objects/examples/build-a-counter/" target="_blank">
      Build a counter — Cloudflare Docs example
    </a> — The canonical counter example this lesson is based on.<br><br>
    <a href="https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/" target="_blank">
      SQLite-backed Durable Object Storage API
    </a> — Full reference for <code>ctx.storage</code>, including KV and SQL methods, input/output gate options, and write coalescing.
  </div>

  <div class="lesson-nav">
    <a href="0002-anatomy-of-a-durable-object.html">&larr; Lesson 2: Anatomy of a Durable Object</a>
    <a href="0004-add-websockets.html">Lesson 4: Add WebSockets &rarr;</a>
  </div>

  <div class="ask-teacher">
    <strong>Questions?</strong> Ask your teacher before moving on.
    Examples: &ldquo;Why does the stub need two steps — idFromName then get?&rdquo;
    &ldquo;What happens if I store an object instead of a number?&rdquo;
    &ldquo;Can the Worker call methods on two different DOs in one request?&rdquo;
  </div>

  <script src="../assets/quiz.js"></script>
</body>
</html>
