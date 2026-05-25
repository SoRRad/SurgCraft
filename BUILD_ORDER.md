# SurgiCraft : Handcraft Build Order

> Current implementation sequence. `ROADMAP.md` is the canonical phase plan.

The old calendar-based dashboard plan has been superseded by the chat-first Phase 0B architecture. Use this file as an execution checklist for the current repo.

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

Status: completed.

- [x] Add provider selection tests for mock fallback and Anthropic readiness
- [x] Add pearl tool schema safety tests
- [x] Add local conversation/import/export helper tests
- [x] Add GitHub Actions CI for lint/build
- [x] Add manual QA checklist for demo mode, live mode, safety, persistence, and mobile
- [x] Audit every library page for current "use in chat" behavior
- [x] Confirm `null` tool outputs render nothing gracefully
- [x] Confirm every unverified surfaced content card has a faculty verification label
- [x] Move old prompt docs into historical/archive language
- [x] Keep README, SPEC, FILE_STRUCTURE, BUILD_ORDER, and ROADMAP synchronized

Gate:

- `npm run build` passes
- `npm run lint` passes
- `npm run test` passes
- Mock mode works with no `.env.local`
- Live Anthropic mode is ready for API-key testing
- Faculty demo script can be followed by someone who did not build the app

---

## Phase 0B.2 - Faculty Demo Polish

Status: next.

- [ ] Run the full QA checklist on desktop
- [ ] Run the full QA checklist on mobile width
- [ ] Polish copy, spacing, loading states, and empty states in chat and Settings
- [ ] Prepare a 5-minute faculty demo script
- [ ] Verify every local content card is marked verified or needs faculty verification
- [ ] Keep mock mode deterministic and no-key
- [ ] Keep this phase free of new providers, Supabase, RAG, and login work

Gate:

- A faculty reviewer can complete the demo path without developer assistance
- No real patient data is entered or requested
- No hidden setup is required for mock mode

---

## Phase 0B.3 - Ollama / Local Model Provider

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

## Phase 0B.4 - OpenAI Provider

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
