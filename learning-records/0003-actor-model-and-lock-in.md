# The Actor model predates DOs; lock-in is real but bounded

The DO pattern is a specific implementation of the Actor model (Carl Hewitt, MIT, 1973): isolate
state to a single-threaded, globally-addressable entity that processes messages one at a time.
This is not a Cloudflare invention. Microsoft Orleans (2014, open source, used in Halo/Xbox/Azure)
is the closest prior art — "grains" with globally unique keys, virtual existence, co-located state,
and auto-activation on demand. Erlang/Elixir processes and Akka are older relatives.

The pattern is becoming a standard building block, accelerated by the AI agent era. Rivet (YC,
a16z) explicitly implements "Actors" with identical properties (in-memory state, co-located SQLite,
hibernation, unique identity per key), runs on Node.js/Bun, and is self-hostable. PartyKit
(acquired by Cloudflare) abstracted the same pattern. The idea is converging across the industry.

Lock-in assessment: real at the API level, bounded in scope. The mental model transfers to any
Actor-model platform; the code does not. Migrating off Cloudflare DOs would mean rewriting
against Rivet, Orleans, or a custom implementation — non-trivial but not conceptually stranded.
The deeper concern is the integrated Cloudflare stack (DOs + Agents SDK + KV + R2 woven together),
not DOs in isolation.

**Implications for teaching:** The actor model framing should be introduced early (lesson 1 or 2)
as historical context — not as the primary teaching scaffold (Zeke has low familiarity with it)
but as a one-paragraph "this idea has a name and a 50-year history." This reframes DOs from
"Cloudflare magic" to "well-understood distributed systems pattern, Cloudflare's implementation."
It directly addresses the cognitive surrender concern. The lock-in discussion belongs after lesson
4, as its own section — cross-referencing Orleans and Rivet as migration targets.
