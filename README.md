# SurgiCraft : Handcraft

Interactive surgical education platform. First module: hand surgery.  
Piloting at Mayo Clinic with medical students, residents, and fellows.

---

> **Educational use only. Not for clinical decision-making.**  
> No content in this application should guide the care of a real patient.

---

## What this is

**SurgiCraft** is a platform for interactive surgical education. It meets learners where they are: a sub-I who doesn't want to embarrass themselves on rounds, a PGY-2 cramming for the in-service, a hand fellow prepping for a tricky case. The Phase 0B prototype is chat-first, local-first, and defaults to a deterministic mock provider.

**Handcraft** is the first module - focused on hand surgery. It includes:
- **Tutor mode:** free-form Q&A with citations and role-aware depth
- **Case Unfolds:** progressive clinical case reveal (Socratic, card-by-card)
- **Pimping Simulator:** attending-voice rapid-fire with graded debrief
- **Pre-Op Prep:** anatomy, approach, intra-op questions, and pearls
- **Mistake Museum:** common errors with the "right move" (Phase 0A feature)
- **Do-Not-Miss:** high-stakes diagnoses with mechanism and consequence (Phase 0A feature)

## What this is not

- Not real-patient care guidance
- Not a substitute for textbooks, ASPS modules, or attending teaching
- Not a public ranking system (leaderboards are opt-in, anonymous, cohort-scoped only)
- Not connected to any real patient data - all cases are entirely synthetic

---

## Phase 0B - provider-flexible streaming chat, no database

This is the **chat-first phase**. The app can stream from a local mock provider or from a live
LLM provider. Anthropic Claude is the first live provider wired for Phase 0B, but the chat route
is designed to select providers through `lib/llm/` rather than hardcoding one vendor. It still
requires no database and no accounts. Supabase, pgvector, RAG, OpenAI, Ollama, and Mayo login are
deferred to later phases.

### Running in demo mode (no API key required)

```bash
npm install && npm run dev
```

Open http://localhost:3000. You'll land on onboarding, then the chat interface. The app ships with
a mock LLM provider that uses keyword matching and canned hand surgery content.

### Running with real Claude through Anthropic (live mode)

1. Copy the example env file:

```bash
cp .env.local.example .env.local
```

2. Add your Anthropic API key and select the Anthropic provider:

```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_MODE=live
```

`LLM_PROVIDER=anthropic` is the preferred server-side switch. `NEXT_PUBLIC_APP_MODE=live` is still
supported for compatibility and currently maps to Anthropic. If Anthropic is selected without an
API key, SurgiCraft falls back to the mock provider.

3. Start the dev server:

```bash
npm run dev
```

**Recommended:** Set a billing cap in the Anthropic console ($20/month is reasonable for development).
The app also has a built-in per-session cost guard (default $0.50) - see `lib/llm/cost-guard.ts`.

---

## Future API strategy - provider-agnostic from day one

The app's LLM layer lives in `lib/llm/`. It exports a single `getProvider()` function that returns an
`LLMProvider` interface implementation. Streaming chat also uses a provider resolver in
`lib/llm/streaming-provider.ts` so the API route can request `model`, `systemPrompt`, `tools`, and
`mode` without knowing vendor-specific setup. In demo mode, that's the `MockProvider`. In live
Anthropic mode, it's the `AnthropicProvider`/Claude stack. No app code changes are needed to add
the next provider.

| Provider | Notes |
|----------|-------|
| Anthropic (Claude) | First live provider - Phase 0B |
| OpenAI (GPT-4o, etc.) | Planned alternative provider |
| Ollama | Local/offline development option for future prototypes |
| vLLM | Self-hosted/institution-hosted inference option |
| Azure OpenAI | Required if Mayo mandates Azure infrastructure |
| AWS Bedrock | Another viable enterprise path |
| Vertex AI | Google Cloud option |
| Mayo-approved internal LLM endpoint | If Mayo deploys its own model |

---

## Phase roadmap

`ROADMAP.md` is the canonical roadmap. Short version:

| Phase | Status | Description |
|-------|--------|-------------|
| **0A** | Done | Local demo, mock LLM, no external dependencies |
| **0B** | Active | Chat-first UI, local conversations, tools, mock + Anthropic provider |
| **0B.1** | Done | Stabilization, tests, CI, QA checklist, docs alignment |
| **0B.2** | Active | Faculty demo polish, frontend/UI refinement, and demo usability |
| **0B.3** | Planned | Optional Ollama/local model provider |
| **0B.4** | Planned | Optional OpenAI provider |
| **0C** | Planned | Supabase database, pgvector RAG, content governance |
| **1 (Pilot)** | Future | 10-20 residents at Mayo, all 6 modes, admin UI, opt-in leaderboards |
| **2+** | Future | Wider Mayo deployment, second subspecialty module |

---

## Active Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run test` | Lightweight Vitest utility tests |

### Phase 0C Placeholder Scripts

These scripts are present as future scaffolding and are not part of the active Phase 0B.2 demo flow.
They require Phase 0C Supabase/pgvector setup before use.

| Command | Status |
|---------|--------|
| `npx tsx scripts/seed-db.ts` | Phase 0C placeholder |
| `npx tsx scripts/ingest-kb.ts` | Phase 0C placeholder |
| `npx tsx scripts/gen-types.ts` | Phase 0C placeholder |

---

## Folder structure

```
app/              Next.js App Router pages and API routes, including /c chat routes
components/       React components (chat layout/sidebar/tool-results, case, shell, ui)
lib/llm/          Provider-agnostic LLM layer (mock, Anthropic, future providers)
lib/demo/         Local demo state (user, conversations, progress, content)
lib/supabase/     Supabase clients (not wired until Phase 0C)
lib/              Other utilities (scoring, analytics, RAG helpers)
content/          Markdown KB (content/kb/) and seed cases (content/cases/)
prompts/          System prompts per mode - faculty-editable markdown
supabase/         SQL migrations (not run until Phase 0C)
scripts/          Phase 0C placeholder CLI tools for DB seeding and KB ingestion
public/           Static assets (illustrations, anatomy SVGs)
```

**Key principle:** content (`/content`) is separate from code. Faculty can edit KB markdown files
via PR or a future admin UI without touching the app. System prompts live in `/prompts` and can
be reviewed and edited by faculty without touching code.

GitHub Actions CI runs `npm ci`, `npm run lint`, `npm run test`, and `npm run build` on pushes and
pull requests to `main`. CI uses mock/demo mode and requires no API keys.

---

## Content ownership

All knowledge base content is governed by the following policy:

- **Faculty-written notes and pearls:** usable in full after explicit faculty approval; attributed
- **Mayo internal curriculum:** usable in full (Mayo-only deployment); faculty approval per section
- **ASPS / PSEN course content:** link out only; do not ingest unless explicitly licensed
- **Textbooks (Green's, Wolfe):** cite and paraphrase; never reproduce verbatim
- **Journal articles:** cite via DOI and paraphrase conclusions
- **Open guidelines (AAOS, ASSH):** cite and summarize
- **Real patient data:** never; not in any phase of this pilot

See `/about` in the running app for the full content ownership policy.

---

## Contributing

1. Each phase's work should be tagged: `phase0a`, `phase0b`, `phase0c`, `phase1`
2. Read every generated file before committing - this is medical education content; accuracy matters
3. When updating SPEC.md or DESIGN_SYSTEM.md, note it explicitly so the AI assistant re-reads them
4. Never ingest licensed textbook content verbatim
5. All cases must be marked `"verified": false` until a hand surgery attending signs off in the admin UI



