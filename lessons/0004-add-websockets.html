<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesson 4: Add WebSockets — Learn Durable Objects</title>
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
      background: var(--surface);
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
      background: var(--surface-alt);
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

    /* Lifecycle state table */
    .lifecycle-table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      font-family: sans-serif;
      font-size: 0.85rem;
    }

    .lifecycle-table th {
      text-align: left;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .lifecycle-table td {
      padding: 0.6rem 0.75rem 0.6rem 0;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }

    .lifecycle-table td:first-child {
      font-weight: 700;
      white-space: nowrap;
    }

    .lifecycle-table tr.hibernated td:first-child {
      color: var(--accent-dark);
    }
  </style>
</head>
<body>

  <p class="lesson-meta">
    <a href="../index.html">Learn Durable Objects</a> &rsaquo; Lesson 4 of 4
  </p>

  <h1>Add WebSockets</h1>
  <p style="font-family:sans-serif; font-size:0.88rem; color:var(--muted); margin-top:0.25rem;">
    15 minutes &nbsp;&middot;&nbsp; Hands-on code &nbsp;&middot;&nbsp; Hibernation &amp; broadcast
  </p>

  <div class="podcast">
    <p>Listen while you read &mdash; AI-generated podcast for this lesson</p>
    <audio controls src="https://github.com/zeke/learn-durable-objects/raw/main/lessons/0004-podcast.mp3"></audio>
  </div>

  <p>
    The counter from Lesson 3 only supported request/response: a client asks for the value,
    gets an answer, disconnects. This lesson extends it so that every connected client sees
    updates <em>live</em>, the moment anyone else changes the count &mdash; the same pattern
    behind chat rooms and multiplayer games. The interesting part isn&rsquo;t the WebSocket API
    itself, which you already know. It&rsquo;s what the DO runtime does with it: hibernation
    while idle, and a broadcast that is safe for the same reason
    <code>increment()</code> was safe in Lesson 3.
  </p>

  <h2>Two WebSocket APIs, one recommended</h2>

  <p>
    Cloudflare documents two ways for a DO to serve WebSockets: the <strong>Web Standard
    API</strong> (<code>server.accept()</code>, familiar <code>addEventListener</code> pattern)
    and the <strong>Hibernation API</strong> (<code>this.ctx.acceptWebSocket(server)</code>,
    handler methods instead of listeners). This lesson uses the Hibernation API exclusively
    because it is what Cloudflare recommends, and because it exposes the runtime mechanics this
    course cares about. The Standard API keeps a DO pinned in memory for as long as any socket
    is open &mdash; you pay for idle time. The Hibernation API does not.
  </p>

  <h2>The Durable Object class</h2>

  <div class="annotated">
    <div class="file-label">src/index.ts</div>
    <pre><code>export class Counter extends DurableObject {
  async fetch(request: Request): Promise&lt;Response&gt; {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);

    return new Response(null, { status: 101, webSocket: client });
  }</code></pre>
    <div class="annotation">
      <strong>acceptWebSocket, not accept</strong>
      <code>new WebSocketPair()</code> creates two linked ends of one socket: <code>client</code>
      goes back to the browser in the <code>101 Switching Protocols</code> response;
      <code>server</code> stays here. Calling <code>this.ctx.acceptWebSocket(server)</code>
      &mdash; instead of the standard <code>server.accept()</code> &mdash; registers the socket
      with the Hibernation API. That one call is the entire difference between a DO that must
      stay resident for the life of the connection and one that can go to sleep between
      messages.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== "string") return;

    if (message === "increment") await this.increment();
    if (message === "decrement") await this.decrement();
  }</code></pre>
    <div class="annotation">
      <strong>A handler method, not an event listener</strong>
      With the Hibernation API you never call <code>server.addEventListener("message", ...)</code>.
      Instead you define <code>webSocketMessage</code> as a method on the class, and the
      runtime calls it &mdash; on <em>any</em> socket accepted by this instance &mdash; when a
      message arrives. This is what makes hibernation possible: there is no live JS closure
      holding a reference to the listener while the DO is asleep. The runtime re-attaches the
      handler by re-running your class's constructor and looking up this method by name.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async increment(amount = 1): Promise&lt;number&gt; {
    let value = (await this.ctx.storage.get("value")) || 0;
    value += amount;
    await this.ctx.storage.put("value", value);
    this.broadcast(value);
    return value;
  }

  async decrement(amount = 1): Promise&lt;number&gt; {
    let value = (await this.ctx.storage.get("value")) || 0;
    value -= amount;
    await this.ctx.storage.put("value", value);
    this.broadcast(value);
    return value;
  }</code></pre>
    <div class="annotation">
      <strong>Same read-modify-write, one new line</strong>
      This is the exact <code>increment</code>/<code>decrement</code> from Lesson 3, still
      protected by the input gate, plus a single call to <code>this.broadcast(value)</code>.
      These methods are still callable as plain RPC too &mdash; a REST client and a WebSocket
      client can both trigger an increment on the same instance, and both trigger the same
      broadcast.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  broadcast(value: number) {
    const payload = JSON.stringify({ value });
    for (const ws of this.ctx.getWebSockets()) {
      ws.send(payload);
    }
  }</code></pre>
    <div class="annotation">
      <strong>this.ctx.getWebSockets()</strong>
      Returns every WebSocket currently accepted by this instance &mdash; including ones that
      were attached before the most recent hibernation cycle. You don't maintain your own
      array of open sockets; the runtime already tracks the set for you per-instance. Looping
      and calling <code>send()</code> here is synchronous, ordinary JavaScript.
    </div>
  </div>

  <div class="annotated">
    <pre><code>  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    ws.close(code, reason);
  }
}</code></pre>
    <div class="annotation">
      <strong>Cleanup handler</strong>
      Called when a client disconnects. <code>this.ctx.getWebSockets()</code> automatically
      stops returning a socket once it's closed &mdash; you don't need to remove it from any
      list yourself. As of the <code>web_socket_auto_reply_to_close</code> compatibility flag,
      the runtime auto-replies to Close frames, so calling <code>ws.close()</code> here is
      safe but no longer strictly required.
    </div>
  </div>

  <h2>Why the single-threaded guarantee matters here</h2>

  <p>
    <code>broadcast()</code> loops over every connected client and sends each one the new value.
    Between the moment the loop starts and the moment it finishes, could another
    <code>increment()</code> call run, change the stored value again, and have <em>its</em>
    broadcast interleave with this one &mdash; so some clients get stale values out of order?
  </p>

  <p>
    No. The input gate that protected the read-modify-write in Lesson 3 protects this exactly the
    same way. <code>increment()</code> is one handler invocation from the runtime's perspective:
    read storage, write storage, loop over sockets, send. No other handler &mdash; not another
    <code>increment()</code>, not a <code>webSocketMessage</code> from a different client, not an
    RPC call &mdash; runs until this one finishes (or hits its own <code>await</code> and yields
    cleanly). Every client sees updates in the same order the DO applied them, because there is
    only ever one call in flight at a time. Broadcasting to a thousand clients still needs no
    lock, no sequence number, no vector clock.
  </p>

  <h2>Hibernation: sleeping without disconnecting</h2>

  <p>
    A DO with open WebSocket connections does not need to stay in memory just because the
    sockets are open. If it satisfies all of the hibernation conditions &mdash; no standard
    WebSocket API in use, no pending timers, no request still being processed, no active
    outbound connections &mdash; the runtime evicts it from memory after about 10 seconds of
    inactivity. The sockets stay connected to Cloudflare's network the whole time. The next
    incoming message re-runs the constructor and wakes the instance back up.
  </p>

  <table class="lifecycle-table">
    <thead>
      <tr><th>State</th><th>What's true</th></tr>
    </thead>
    <tbody>
      <tr><td>Active, in-memory</td><td>Handling a request or event right now.</td></tr>
      <tr><td>Idle, hibernateable</td><td>Waiting, all hibernation conditions met. After ~10s, hibernates.</td></tr>
      <tr class="hibernated"><td>Hibernated</td><td>Removed from memory. WebSocket clients stay connected. In-memory state (anything not in <code>storage</code>) is gone.</td></tr>
      <tr><td>Active, in-memory</td><td>A message arrives &rarr; constructor re-runs &rarr; handler runs.</td></tr>
    </tbody>
  </table>

  <p>
    That "in-memory state is gone" line matters: if your DO kept, say, a per-connection username
    in a plain JS <code>Map</code>, it disappears every time the instance hibernates. Cloudflare's
    fix is <code>serializeAttachment()</code> and <code>deserializeAttachment()</code> &mdash; a
    small (16&nbsp;KB max) piece of state attached directly to the WebSocket object itself, which
    survives hibernation because it travels with the connection, not with the instance's memory.
  </p>

  <div class="annotated">
    <pre><code>  async fetch(request: Request): Promise&lt;Response&gt; {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") ?? "anonymous";

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);

    server.serializeAttachment({ name, joinedAt: Date.now() });

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string) {
    const { name } = ws.deserializeAttachment();
    // ...use `name` even if this instance just woke from hibernation
  }</code></pre>
    <div class="annotation">
      <strong>Attachments survive; local variables don't</strong>
      <code>serializeAttachment</code> is called once, right after accepting the socket.
      <code>deserializeAttachment()</code> reads it back in any later handler &mdash; even one
      that runs after a full hibernate/wake cycle re-ran the constructor. If you need more than
      16&nbsp;KB or data that must outlive the socket itself, store it in
      <code>this.ctx.storage</code> instead and keep only a lookup key as the attachment.
    </div>
  </div>

  <h2>The Worker (entry point)</h2>

  <div class="annotated">
    <pre><code>export default {
  async fetch(request: Request, env: Env): Promise&lt;Response&gt; {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const upgradeHeader = request.headers.get("Upgrade");

    if (!name) {
      return new Response("Add ?name=something to the URL", { status: 400 });
    }
    if (upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const id = env.COUNTERS.idFromName(name);
    const stub = env.COUNTERS.get(id);

    return stub.fetch(request);
  },
};</code></pre>
    <div class="annotation">
      <strong>fetch(), not an RPC method, for the upgrade</strong>
      The Worker validates the upgrade request <em>before</em> forwarding it &mdash; both
      Workers and DOs are billed per request, so rejecting malformed requests here avoids
      billing the DO for them. Note this calls <code>stub.fetch(request)</code>, the same
      generic HTTP entry point every DO has, rather than a custom RPC method. WebSocket upgrades
      are HTTP requests before they're anything else, and the 101 response with its attached
      socket has to travel back through that same <code>fetch()</code> call.
    </div>
  </div>

  <div class="callout">
    <p>
      <strong>Same wrangler config as Lesson 3.</strong> No new bindings are required for
      WebSockets &mdash; the <code>durable_objects.bindings</code> and
      <code>new_sqlite_classes</code> migration from the counter still apply unchanged. Hibernation
      is a runtime behavior of the class, not something you opt into via config.
    </p>
  </div>

  <h2>What happens end-to-end</h2>

  <ol style="margin: 0 0 1rem 1.5rem; padding: 0; line-height: 1.8;">
    <li>Client A opens a WebSocket to <code>/?name=lobby</code>. Worker validates the upgrade,
        gets the stub, forwards the request.</li>
    <li>DO cold-starts (if not already warm), accepts the socket via
        <code>this.ctx.acceptWebSocket(server)</code>, returns the 101 response.</li>
    <li>Client B connects the same way, to the same <code>name=lobby</code> &mdash; same
        <code>DurableObjectId</code>, same instance. Now two sockets are attached.</li>
    <li>Ten seconds pass with no messages. All hibernation conditions are met. The runtime
        evicts the instance from memory. Both sockets remain connected from the clients'
        perspective.</li>
    <li>Client A sends <code>"increment"</code>. The runtime re-runs the constructor,
        reattaches both sockets, and calls <code>webSocketMessage</code>.</li>
    <li><code>increment()</code> runs: reads storage, writes storage, calls
        <code>broadcast()</code>. Both A and B receive the new value &mdash; B did nothing to
        earn that message except staying connected.</li>
    <li>The instance goes idle again, and the hibernation clock restarts.</li>
  </ol>

  <hr style="margin: 2.5rem 0; border:none; border-top: 1px solid var(--border);">

  <h2>Challenge</h2>

  <div class="challenge">
    <span class="label">Hands-on</span>
    <p>
      Three clients are connected to the same counter room: Alice, Bob, and Carol. The DO has
      been idle for 12 seconds. Alice's client sends <code>"increment"</code> at the same
      instant Bob's client sends <code>"decrement"</code> &mdash; both messages arrive at the
      edge within the same millisecond. The counter is currently 10.
    </p>
    <p>
      Write down: does the DO need to be woken from hibernation first? What value(s) get
      broadcast, to whom, and in what order? Then check your reasoning below.
    </p>
    <details style="margin-top:0.75rem; font-size:0.88rem;">
      <summary style="cursor:pointer; font-family:sans-serif; color:var(--accent-dark);">Show answer</summary>
      <div style="margin-top:0.75rem; padding:0.75rem; background:var(--code-bg); border-radius:4px;">
        <p style="margin:0 0 0.5rem;">
          Yes &mdash; 12 idle seconds means the instance already hibernated, so the first
          message to arrive (Alice's or Bob's, whichever the runtime delivers first) re-runs the
          constructor and wakes it. Say Alice's <code>"increment"</code> is handled first:
          <code>webSocketMessage</code> runs, calls <code>increment()</code>, reads 10, writes
          11, and <code>broadcast()</code> sends <code>{value: 11}</code> to Alice, Bob, and
          Carol &mdash; all three, not just Alice.
        </p>
        <p style="margin:0;">
          Only once that whole handler invocation finishes does the input gate open for Bob's
          <code>"decrement"</code>. It reads 11 (not 10), writes 10, and broadcasts
          <code>{value: 10}</code> to all three again. Every client receives both updates, in
          the same order, with no interleaving &mdash; identical guarantee to Lesson 3's
          concurrent increments, now fanned out to three sockets instead of returned to one
          caller.
        </p>
      </div>
    </details>
  </div>

  <hr style="margin: 2.5rem 0; border:none; border-top: 1px solid var(--border);">

  <h2>Quiz</h2>
  <p style="font-family:sans-serif; font-size:0.85rem; color:var(--muted);">
    Select the best answer.
  </p>

  <div class="quiz" data-quiz="q1" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      What does calling <code>this.ctx.acceptWebSocket(server)</code> instead of
      <code>server.accept()</code> actually change?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">It registers the socket with the Hibernation API, so the instance can be evicted from memory without disconnecting the client</li>
      <li>It encrypts the WebSocket traffic between client and Durable Object</li>
      <li>It allows more than one client to connect to the same Durable Object instance</li>
      <li>It converts the WebSocket into an RPC-callable stub</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. Both methods accept the same socket. The difference is entirely about hibernation eligibility and how messages are delivered (handler methods vs. event listeners) — not encryption, not concurrency limits, not RPC."
       data-incorrect="Not quite. Multiple clients could already connect to one instance either way. Encryption is handled by the transport, not this call. The real difference is hibernation: acceptWebSocket() lets the runtime evict the instance from memory while keeping the client connected."
       hidden></p>
  </div>

  <div class="quiz" data-quiz="q2" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      Why is it safe for <code>broadcast()</code> to loop over every socket and call
      <code>send()</code> with no additional synchronization?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">The input gate ensures no other handler runs until this entire handler invocation completes</li>
      <li>WebSocket.send() is a blocking call that pauses all other Durable Objects globally</li>
      <li>Each socket has its own independent thread inside the Durable Object</li>
      <li>getWebSockets() automatically sorts sockets to prevent race conditions</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. It's the same input-gate guarantee from Lesson 3, applied to a loop instead of a single write: nothing else runs inside this instance until the current handler finishes, so the broadcast can't be interrupted by another state change."
       data-incorrect="Not quite. There's no cross-DO blocking, no per-socket threading, and no special sorting. The guarantee is the input gate serializing handler invocations within this one instance."
       hidden></p>
  </div>

  <div class="quiz" data-quiz="q3" style="margin-bottom:2rem;">
    <p class="quiz-question" style="font-family:sans-serif; font-size:0.95rem;">
      A Durable Object hibernates. What happens to a plain JavaScript variable (not stored via
      <code>storage</code> or an attachment) that was holding per-connection data?
    </p>
    <ul class="quiz-options">
      <li data-correct="true">It is lost — in-memory state is discarded on hibernation, and the constructor runs again on wake</li>
      <li>It is automatically moved into this.ctx.storage before hibernation</li>
      <li>It persists because the WebSocket connection itself keeps it alive</li>
      <li>It is preserved as long as the client's browser tab stays open</li>
    </ul>
    <p class="quiz-feedback"
       data-correct="Correct. Hibernation discards in-memory state entirely; only this.ctx.storage and serializeAttachment() data survive. That's exactly why the attachment API exists — to carry small pieces of per-connection state across a hibernation cycle."
       data-incorrect="Not quite. Nothing is auto-migrated to storage, the client's tab has no bearing on the server-side instance's memory, and the connection staying open doesn't preserve server-side variables. Hibernation wipes in-memory state; only storage and attachments survive it."
       hidden></p>
  </div>

  <div class="primary-source">
    <span class="label">Primary sources for this lesson</span>
    <a href="https://developers.cloudflare.com/durable-objects/best-practices/websockets/" target="_blank">
      Use WebSockets — Cloudflare Durable Objects docs
    </a> — The Hibernation and Web Standard WebSocket APIs, batching, and attachment methods.<br><br>
    <a href="https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/" target="_blank">
      Lifecycle of a Durable Object
    </a> — The full state machine: active, idle-hibernateable, hibernated, inactive, and the timing of each transition.
  </div>

  <div class="lesson-nav">
    <a href="0003-build-a-counter-do.html">&larr; Lesson 3: Build a counter DO</a>
    <a href="../index.html">Back to course home</a>
  </div>

  <div class="ask-teacher">
    <strong>Questions?</strong> Ask your teacher before moving on.
    Examples: &ldquo;What happens to a client's socket if the Durable Object moves to a
    different host?&rdquo; &ldquo;Can I use the Hibernation API and still call
    <code>setInterval</code>?&rdquo; &ldquo;How would I rate-limit messages from one noisy
    client without affecting the others?&rdquo;
  </div>

  <script src="../assets/quiz.js"></script>
</body>
</html>
