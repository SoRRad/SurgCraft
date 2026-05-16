# SurgiCraft — Phase Roadmap (post-0A)

A clearer phase plan now that 0A is a no-API local demo. The split between 0B and 0C is deliberate: bring the AI online first, then add persistence and faculty workflows. Each phase has a clear gate.

---

## Phase 0A — No-API local demo *(current)*

**Status:** in progress. See PROMPT_PART_A.md and PROMPT_PART_B.md.

**Deliverables:**
- Rebrand to SurgiCraft : Handcraft
- Provider-agnostic LLM layer with mock-only implementation
- Tutor demo (5 topics) with "What would change my answer?" branching
- Case demo (3 cases) with Reasoning Autopsy
- Mistake Museum, Do-Not-Miss pages
- About page with content ownership policy
- Placeholder pages for coming-soon modes
- README rewritten, no API keys required

**Gate (before Phase 0B):**
- Demo to 1–2 hand surgery attendings at Mayo
- Get their reaction on tone, accuracy of static content, and pedagogy
- Confirm they'd be willing to contribute pearls/review content in Phase 0C
- Update seed cases and KB drafts based on their feedback
- Document what specifically convinced them (or what they wanted changed)

This gate is the most important one in the project. Don't skip it. If faculty don't engage with the static version, an AI version won't fix the underlying issues.

---

## Phase 0B — Real LLM, still no database *(~2 weeks after 0A gate passes)*

**Goal:** swap the mock provider for a real one; everything else stays local.

The provider-agnostic layer means this is a *one-file change* per provider, plus the API routes that call it. Don't refactor anything else.

**Deliverables:**
- New file `lib/llm/anthropic-provider.ts` implementing `LLMProvider` against the Anthropic SDK (or your final choice — see "Provider choice" below)
- `lib/llm/index.ts` updated to read `NEXT_PUBLIC_APP_MODE` and route to the right provider:
  - `demo` → mock-provider (unchanged)
  - `live` → live provider (new)
- API routes (server-side): `/api/chat`, `/api/case/reveal`, `/api/pimping/grade`, `/api/preop`, `/api/debrief`
  - Streaming for chat
  - Each route uses `getProvider()` from `lib/llm`
  - Each route enforces a server-side system prompt (in `prompts/*.md`) that includes: educational use only, role-aware depth, citation requirement, "I'm not sure" template for low-confidence answers
- Token / cost guard: a simple per-session token cap, returns a friendly "session limit reached" message if hit
- Live mode toggle in the UI (settings page): "Demo mode" vs "Live AI" — defaults to demo if no API key present
- Replace the static answer flow in Tutor with provider-backed flow when in live mode
- Replace the static reveal-card logic with semantic provider-backed flow when in live mode
- Update About page to reflect that AI is now (optionally) connected

**Important architectural decision — thin proxy:** Even in 0B, the LLM call should go through a *single Next.js API route on your server*, not directly from the browser. Browser-side calls expose your API key. Make this rule explicit in `lib/llm/anthropic-provider.ts`: provider methods only work server-side; throw if called from client code.

**Provider choice:** Anthropic (Claude) is still the natural pick, but a few options now worth considering for the pilot:
- Anthropic direct (simple, fast to integrate)
- Anthropic via AWS Bedrock (if Mayo prefers AWS contracts) — same model, different procurement path
- Azure OpenAI (if Mayo's contracts go that way) — different model, similar API patterns
- A local model via Ollama (free, runs on your laptop) — useful for early dev without burning credits

I'd recommend Anthropic direct for 0B development, then switch to Bedrock or a Mayo-approved endpoint in Phase 1 if that's the procurement path. The provider layer means this is a *new file*, not a rewrite.

**Gate (before Phase 0C):**
- Live AI Tutor and Case modes work end-to-end
- Cost per session measured (rough $/session budget)
- A hand attending has tested the live version and signed off on tone/accuracy
- A list of failure modes documented (when does the model hallucinate? when does it give clinically wrong info?)

---

## Phase 0C — Persistence, auth, faculty workflows *(~3 weeks after 0B gate)*

**Goal:** make it pilot-ready. Add Supabase, auth, faculty review UI, basic analytics.

**Deliverables:**
- Wire up Supabase using the existing `supabase/migrations/` SQL. Run the migration.
- Supabase Auth (magic-link email, restricted to Mayo email domains for the pilot)
- Replace localStorage demo-user/demo-progress with real DB-backed user + sessions + messages tables
- Faculty admin at `/admin`:
  - Flagged response review queue (`/admin/flags`)
  - KB entry verification (`/admin/kb`)
  - Pearl approval queue
  - Cohort analytics dashboard (aggregate, no individual scores)
- Pearl unlock + collection flow (the visual feature spec'd in DESIGN_SYSTEM.md)
- Streak rings on dashboard, backed by DB
- Confidence slider with calibration tracking (Brier score per topic)
- Hosting: still Vercel, but with environment variables now in place

**Gate (before Phase 1):**
- 1–2 attendings have used the admin UI and confirmed it's not a burden
- Auth works reliably with Mayo email domains
- Privacy contract clearly displayed and acknowledged on first sign-in
- A Mayo IT / compliance conversation has happened (or is scheduled)

---

## Phase 1 — Mayo pilot *(~3 months running)*

**Goal:** real residents, real usage, real data.

**Deliverables:**
- Migrate to Mayo-sanctioned hosting environment (likely not Vercel by this point)
- RAG layer: ingest the curated KB (faculty-authored, no licensed content), pgvector retrieval, citation chips in every response
- 10–20 residents enrolled
- PostHog or equivalent analytics, self-hosted if compliance requires
- Weekly check-in cadence with hand surgery faculty
- Pre/post knowledge assessment (secondary metric)
- Continuous content addition: 20+ cases, 50+ KB chunks, growing pearl library

**Success metrics (from original spec):**
- ≥60% enrolled use ≥2x/week voluntarily
- ≥70% rate "would recommend to co-resident"
- <5% flag rate on bot responses
- Knowledge gain (pre/post) directionally positive

---

## Phase 2+ — beyond Handcraft

This is where the "SurgiCraft" naming starts paying off:
- Module 02: a second subspecialty (likely whatever module fits Mayo's other surgical strengths and where a champion attending exists)
- Shared platform features: cross-module pearl library, cross-module mistake museum, learner profile with cross-module progress
- Potential expansion outside Mayo (different product, different licensing, different IP rules — defer planning)
- Voice mode, mobile native, EPIC integration scoping all live here

---

## Cross-cutting decisions to think about *before* Phase 0B

These don't block 0A but you'll want to have thought about them by the time 0A faculty demos finish:

1. **Which LLM provider for 0B?** Anthropic, OpenAI, Bedrock, Azure, or local for dev. Recommend Anthropic for dev, plan for Bedrock or Mayo endpoint in Phase 1.
2. **Thin proxy yes/no?** Recommend yes. One day of work; lets you log, cap costs, swap providers without app changes, and add prompt-injection guards.
3. **Citation source of truth?** In 0B with no RAG yet, citations have to come from somewhere. Options: (a) bake citations into the system prompt as a curated list ("when discussing mallet finger, cite Wolfe ch. X"); (b) skip citations in 0B and add them with RAG in 0C; (c) instruct the model to never cite unless certain. Recommend (a) — manually curated citations are more honest than model-generated ones.
4. **Hallucination guard policy.** When does the model say "I don't know"? Recommend a confidence threshold via self-reflection: ask the model to rate its confidence 1–5 in the system prompt, and template responses below a threshold as "I'm not sure — flag this for faculty?" This will fire too often at first; tune in 0C.
5. **Per-session cost cap.** Anthropic billing can spike. Cap at ~$0.50/user/session in 0B; reassess in pilot.

---

## Two things to do this week *outside the code*

1. **Pick 1 hand surgery attending at Mayo who's a likely champion.** Send them a 2-paragraph email describing SurgiCraft : Handcraft, the Phase 0A demo, and ask if they'd give 30 minutes to react to it once 0A ships. Even a soft yes here is huge.
2. **Schedule a 15-minute intro with Mayo IT / compliance.** Don't ask permission yet; just introduce yourself and the project. The relationship needs to exist before you have something to deploy. Frame it as "I'm building an educational tool, I want to do this right, what do I need to know?"

Both of these are far higher leverage than any line of code you'll write this month.
