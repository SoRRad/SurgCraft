# Phase 0B Overview - Chat-First + Provider-Flexible AI

> Historical overview, updated to match the current architecture. For canonical sequencing, use `ROADMAP.md`.

Phase 0B made SurgiCraft : Handcraft a chat-first prototype. The app still runs with no API key in mock mode, but it can also stream from a live provider through the server-side provider layer.

---

## What Changed From Phase 0A

| Phase 0A | Current Phase 0B |
|---|---|
| Dashboard with mode cards | Chat home at `/c`; dashboard removed |
| Tutor demo as a standalone page | Chat is the primary surface |
| Mock provider only | Mock provider plus Anthropic live provider |
| Static keyword answers | Streaming chat with optional tool calls |
| No conversation history | Local `localStorage` conversations |
| Pages as separate experiences | Modes can launch inline in chat and remain visible in sidebar libraries |
| No tool rendering | Inline cases, quizzes, pearls, mistakes, do-not-miss cards, follow-up chips |

---

## Current Provider Strategy

Provider selection lives under `lib/llm/`.

- `LLM_PROVIDER=mock` for deterministic local demo mode
- `LLM_PROVIDER=anthropic` for Claude via Anthropic
- `NEXT_PUBLIC_APP_MODE=live` is still supported for compatibility and maps to Anthropic
- Missing live credentials fall back to mock behavior

Provider-specific model selection belongs in `lib/llm/streaming-provider.ts`, not in API route business logic.

Planned provider extensions:

- Ollama/local model in Phase 0B.2
- OpenAI in Phase 0B.3
- vLLM or institution-hosted models later if needed

---

## Current Safety Position

- Educational use only
- No clinical decision support
- No PHI and no patient identifiers
- Synthetic cases only
- Citation honesty: cite only curated/static sources available to the app
- Uncited answers must be labeled as educational overviews needing faculty verification
- Tool boundaries prevent fabricated faculty pearls by requiring known `pearl_id` values

---

## Cost Expectations

Mock mode is free. Live Anthropic mode uses real API calls.

Rough development expectations:

| Activity | Rough cost |
|---|---|
| Single tutor Q&A | ~$0.01-0.03 |
| Tutor Q&A with tool use | ~$0.02-0.05 |
| 10-turn case conversation | ~$0.10-0.20 |
| 5-question quiz | ~$0.05-0.10 |
| 30-minute study session | ~$0.30-0.60 |

Recommendations:

- Set a monthly provider billing cap before live testing
- Keep `.env.local` out of git
- Keep the in-memory Phase 0B cost guard enabled
- Move cost tracking to the database in Phase 0C

---

## Deferred to Phase 0C+

- Supabase Auth
- DB-backed conversations
- pgvector RAG
- Faculty verification UI
- Flagged response review workflow
- Verified citation source chips
- DB-backed cost and usage tracking
- Pilot analytics and governance

---

## Demo Checklist

- Start with no `.env.local`; confirm mock mode streams
- Ask "Walk me through a fight bite case"
- Ask "Quiz me on flexor tendon zones"
- Ask "Common mistakes in mallet finger"
- Save a message to pearls
- Reload and confirm the conversation persists
- With a real API key, set `LLM_PROVIDER=anthropic` and confirm live streaming
