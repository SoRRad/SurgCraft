# ORION · Hand Roadmap

> Canonical project roadmap. If another markdown file disagrees with this one, treat this file as current and update the older document.

ORION Surgery is the parent surgical education platform. Hand is module 01, focused on hand surgery. The current product is a Phase 0B chat-first prototype: users enter through `/c`, learn through streaming conversation, and launch cases, quizzes, pearls, mistakes, and do-not-miss content inline through chat tools.

The app remains educational only. It must not guide real patient care, must not request PHI, and uses synthetic/local demo content until faculty review and Phase 0C governance are in place.

---

## Current State

**Phase:** 0B.2 faculty-demo polish
**Runtime dependency:** none in demo mode
**Persistence:** browser `localStorage` only
**Live LLM:** Anthropic Claude is the first live provider
**Architecture:** provider-agnostic LLM layer with mock fallback
**Database/RAG:** deferred to Phase 0C

The dashboard route has been removed. Chat is the primary surface at `/c`, with conversation-specific routes at `/c/[conversationId]`. Library views remain available from the sidebar: cases, Mistake Museum, Do-Not-Miss, and saved pearls.

---

## Completed Phase 0A

Phase 0A proved the local educational experience without external APIs.

- Rebrand from Hand-only to `ORION · Hand`
- Local-only mock LLM provider and provider interface
- Onboarding with local demo user profile
- Static tutor demo content for high-yield hand surgery topics
- Three synthetic seed cases:
  - `001-fight-bite`
  - `002-mallet-finger`
  - `003-distal-radius`
- Case canvas with progressive reveal and Reasoning Autopsy
- Mistake Museum and Do-Not-Miss libraries
- About page with content ownership and educational-use policy
- Supabase schema retained as future infrastructure, not runtime dependency

---

## Active Phase 0B

Phase 0B turns the app into a chat-first prototype with streaming AI and local conversation state.

- `/c` chat home and `/c/[conversationId]` conversation routes
- `ChatLayout` with desktop sidebar and mobile drawer
- `ChatExperience` using `@ai-sdk/react`
- Browser-local conversations in `lib/demo/conversations.ts`
- Chat title generation with mock fallback
- Inline tool results:
  - `launch_case`
  - `show_pearl`
  - `show_mistake`
  - `show_donotmiss`
  - `start_quiz`
  - `suggest_followups`
- Static case JSON imported safely by ID
- Provider-flexible streaming helper in `lib/llm/streaming-provider.ts`
- Provider resolution in `lib/llm/provider-selection.ts`
- Provider status endpoint at `/api/provider-status`
- Mock mode by default, Anthropic live mode when configured
- Request validation, message caps, output token caps, and development-only cost guard
- Local data import/export, saved pearls, local flags, and review-in-Settings flow
- Safety prompt hardened for no PHI, no real-patient guidance, honest citations, and no fabricated pearls

---

## Completed Phase 0B.1 - Stabilization

Goal: make the current prototype reliable enough for repeated faculty demos before adding more providers or persistence.

- Docs synchronized around the chat-first architecture
- Lightweight Vitest coverage for provider fallback, pearl tool schema safety, and local data helpers
- GitHub Actions CI for lint, test, and build
- Manual QA checklist for mock mode, Anthropic mode, safety, persistence, and mobile sidebar
- Saved pearl unbookmarking removes the saved pearl by assistant message ID
- Provider status is resolved server-side and shown in Header/Settings
- Surfaced local demo content keeps "needs faculty verification" labels
- Cost guard comments remain clear: in-memory only, development-only, DB required in Phase 0C

Gate:
- `npm run build` and `npm run lint` pass
- `npm run test` passes
- Mock mode works with no `.env.local`
- Anthropic live mode is ready for key-backed testing
- Faculty can demo the current flow without hidden setup

---

## Active Phase 0B.2 - Faculty Demo Polish

Goal: make the current Phase 0B experience crisp enough for hand-surgery faculty review without adding infrastructure.

- Walk through the QA checklist on desktop and mobile
- Polish copy, spacing, loading states, and empty states in chat and Settings
- Refine frontend hierarchy, navigation, case progress visuals, and demo usability
- Add a short scripted faculty demo path
- Validate that all local demo content is marked verified or needs faculty verification
- Improve mock responses only where they are confusing or brittle
- Keep all persistence browser-local

Gate:
- A faculty reviewer can complete onboarding, ask chat questions, launch a case, save/unsave a pearl, flag a response, and export/import local data without developer assistance
- No new provider, database, RAG, or login work is required

---

## Planned Phase 0B.3 - Ollama / Local Model Provider

Goal: support a no-cloud live model for development and demos where internet/API spending is undesirable.

- Add `LLM_PROVIDER=ollama`
- Create an Ollama provider implementation under `lib/llm/`
- Add streaming config for a local chat model
- Document recommended local model and hardware expectations
- Keep mock provider as deterministic fallback
- Preserve the same tool schemas and prompt boundaries

Gate:
- Local model can stream a tutor answer through `/api/chat`
- Provider fallback remains safe when Ollama is unavailable
- No code path exposes local or cloud provider credentials to the browser

---

## Planned Phase 0B.4 - OpenAI Provider

Goal: prove provider portability beyond Anthropic.

- Add `LLM_PROVIDER=openai`
- Add OpenAI provider package and server-only provider implementation
- Move provider-specific model names entirely behind the streaming/provider layer
- Confirm tool calling works with the same `allTools` schema
- Update README provider table and `.env.local.example`

Gate:
- Mock, Anthropic, and OpenAI can be selected by env var without route rewrites
- Provider-specific failures degrade to safe errors or mock fallback where appropriate

---

## Phase 0C - RAG and Content Governance

Goal: make the app governable and pilot-ready.

- Supabase Auth and database persistence
- Replace localStorage conversations with DB-backed sessions/messages
- pgvector knowledge base ingestion from `content/kb/`
- Retrieval-grounded chat with honest source chips
- Faculty verification workflow for KB entries, cases, pearls, and flagged responses
- Admin review queues:
  - flagged messages
  - KB verification
  - pearl approval
  - case verification
- Move cost guard and usage tracking from memory to the DB
- Add privacy contract tracking and user consent persistence
- Keep all patient-facing examples synthetic and prohibit PHI

Gate:
- Faculty can review and mark content verified without developer help
- RAG citations come only from curated content
- User data, flags, and usage tracking are persisted appropriately
- Mayo IT/compliance path is understood before resident use

---

## Phase 1 - Mayo Pilot Readiness

Goal: deploy to a small Mayo hand surgery learner cohort with governance, monitoring, and faculty oversight.

- Mayo-approved hosting/deployment path
- 10-20 residents/fellows enrolled
- Auth restricted as required by pilot governance
- Faculty-reviewed case and KB corpus
- Stable admin workflow for flagged outputs
- Analytics focused on engagement and learning, not punitive ranking
- Leaderboards and user rankings are not planned for pilot.
- Pre/post knowledge assessment plan
- Clear incident process for unsafe or incorrect AI output

Success metrics:
- 60% or more enrolled learners use it at least twice weekly
- 70% or more would recommend it to a co-resident
- Flag rate stays below 5% after faculty-reviewed content is in place
- Directionally positive knowledge gain

---

## Later

- Additional ORION Surgery modules beyond Hand
- Multi-institution architecture
- Mayo-approved internal model or self-hosted vLLM
- Voice mode
- Native mobile app or PWA polish
- EPIC integration scoping, only if governance supports it
