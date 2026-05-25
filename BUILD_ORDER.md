# SurgiCraft : Handcraft Build Order

> Current implementation sequence. `ROADMAP.md` is the canonical phase plan.

The old Week 1-6 dashboard plan has been superseded by the chat-first Phase 0B architecture. Use this file as an execution checklist for the current repo.

---

## Phase 0A - Local Demo Foundation

Status: completed.

- [x] Rebrand to `SurgiCraft : Handcraft`
- [x] Run locally with no required API keys
- [x] Keep Supabase files as future infrastructure only
- [x] Add provider-agnostic LLM interface
- [x] Add mock provider and local demo engine
- [x] Add onboarding and local demo user state
- [x] Add three synthetic cases
- [x] Add case canvas and Reasoning Autopsy
- [x] Add Mistake Museum
- [x] Add Do-Not-Miss library
- [x] Add About/content ownership policy

---

## Phase 0B - Chat-First Prototype

Status: active.

- [x] Remove dashboard-centered flow
- [x] Make `/c` the chat home
- [x] Add `/c/[conversationId]`
- [x] Add `ChatLayout`
- [x] Add desktop sidebar and mobile drawer
- [x] Persist local conversations in `localStorage`
- [x] Add conversation title generation
- [x] Add saved pearls library
- [x] Add message actions: feedback, flag, save, copy
- [x] Add streaming `/api/chat`
- [x] Add mock streaming fallback
- [x] Add Anthropic as first live provider
- [x] Add provider selection and streaming provider config
- [x] Add request validation and input caps
- [x] Add development-only cost guard
- [x] Add tool definitions for inline learning content
- [x] Render inline case launchers, pearls, mistakes, do-not-miss cards, quiz starters, and follow-up chips
- [x] Add no-PHI and citation honesty rules to active prompt
- [x] Restrict `show_pearl` to known local pearl IDs

Demo checkpoint:

- Ask a tutor question in mock mode with no `.env.local`
- Launch a fight bite case from chat
- Ask for common mistakes in mallet finger
- Ask for a quiz on flexor tendon zones
- Save an assistant message to pearls
- Reload a conversation and confirm local persistence

---

## Phase 0B.1 - Stabilization Next

Status: next.

- [ ] Add route-level tests for `/api/chat`
- [ ] Add provider selection tests for mock fallback and Anthropic readiness
- [ ] Add fixtures for AI SDK UI message request validation
- [ ] Add regression test for static case imports in mock stream
- [ ] Add manual QA checklist for desktop and mobile
- [ ] Audit every library page for current "use in chat" behavior
- [ ] Confirm `null` tool outputs render nothing gracefully
- [ ] Confirm every unverified surfaced content card has a faculty verification label
- [ ] Move old prompt docs into historical/archive language
- [ ] Keep README, SPEC, FILE_STRUCTURE, BUILD_ORDER, and ROADMAP synchronized

Gate:

- `npm run build` passes
- `npm run lint` passes
- Mock mode works with no `.env.local`
- Live Anthropic mode is ready for API-key testing
- Faculty demo script can be followed by someone who did not build the app

---

## Phase 0B.2 - Ollama / Local Model Provider

Status: planned.

- [ ] Add `LLM_PROVIDER=ollama`
- [ ] Add server-only Ollama provider
- [ ] Add streaming config branch for local models
- [ ] Document recommended local model, install steps, and hardware expectations
- [ ] Preserve current mock fallback
- [ ] Keep tool schemas identical across providers

Gate:

- Local provider can stream through `/api/chat`
- Missing Ollama service fails safely
- No browser-exposed provider credentials or endpoints beyond the app server

---

## Phase 0B.3 - OpenAI Provider

Status: planned.

- [ ] Add `LLM_PROVIDER=openai`
- [ ] Add OpenAI package and server-only provider
- [ ] Add streaming config branch for OpenAI model selection
- [ ] Confirm tool calling compatibility
- [ ] Update `.env.local.example` and README provider table

Gate:

- Mock, Anthropic, and OpenAI can be selected without changing API route code
- Build and lint remain clean

---

## Phase 0C - RAG and Governance

Status: planned.

- [ ] Wire Supabase Auth
- [ ] Persist users, sessions, messages, cases, pearls, flags, and attempts
- [ ] Ingest `content/kb/**/*.md` into pgvector
- [ ] Replace uncited live answers with retrieval-grounded context where possible
- [ ] Add faculty verification workflow
- [ ] Add flagged response review
- [ ] Add DB-backed cost and usage guard
- [ ] Add content governance metadata and audit trail
- [ ] Add privacy contract persistence

Gate:

- Faculty can verify content without developer intervention
- Chat cites only retrieved curated sources
- Pilot data storage and privacy story are ready for Mayo review

---

## Phase 1 - Mayo Pilot Readiness

Status: future.

- [ ] Mayo-approved deployment path
- [ ] 10-20 learner cohort
- [ ] Faculty-reviewed content library
- [ ] Admin review workflow
- [ ] Analytics and outcome measures
- [ ] Pilot support process
- [ ] Incident response for incorrect or unsafe AI output

Gate:

- Attending champion agrees the app is ready for limited learner use
- Compliance path is clear
- Pilot success metrics are documented before launch
