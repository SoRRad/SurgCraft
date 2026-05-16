# SurgiCraft: Handcraft

Interactive surgical education platform. First module: hand surgery.  
Piloting at Mayo Clinic with medical students, residents, and fellows.

---

> **Educational use only. Not for clinical decision-making.**  
> No content in this application should guide the care of a real patient.

---

## What this is

**SurgiCraft** is a platform for interactive surgical education. It meets learners where they are — a sub-I who doesn't want to embarrass themselves on rounds, a PGY-2 cramming for the in-service, a hand fellow prepping for a tricky case. The platform adapts its voice and depth to the learner, grounds answers in a curated knowledge base, and turns passive reading into active reasoning.

**Handcraft** is the first module — focused on hand surgery. It includes:
- **Tutor mode:** free-form Q&A with citations and role-aware depth
- **Case Unfolds:** progressive clinical case reveal (Socratic, card-by-card)
- **Pimping Simulator:** attending-voice rapid-fire with graded debrief
- **Pre-Op Prep:** anatomy, approach, intra-op questions, and pearls
- **Mistake Museum:** common errors with the "right move" (Phase 0A feature)
- **Do-Not-Miss:** high-stakes diagnoses with mechanism and consequence (Phase 0A feature)

## What this is not

- Not clinical decision support
- Not a substitute for textbooks, ASPS modules, or attending teaching
- Not a public ranking system (leaderboards are opt-in, anonymous, cohort-scoped only)
- Not connected to any real patient data — all cases are entirely synthetic

---

## Phase 0A status — fully local, no API keys required

This is a **no-cost local demo prototype**. It runs entirely in your browser with:

```bash
npm install && npm run dev
```

No API keys. No cloud accounts. No environment variables required. The app ships with a mock LLM provider that uses keyword matching and canned hand surgery content to simulate all five modes.

**Why no real AI in Phase 0A?**
- Avoids infrastructure cost during early educational validation
- Avoids compliance complexity before a Mayo-sanctioned environment is established
- Makes faculty demos frictionless — hand a laptop to any attending, no setup
- Lets us validate the educational UX and content before committing to a model integration

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
# You'll land on the onboarding form. Complete it to reach the dashboard.
```

No `.env.local` required. If you want to experiment with future API settings, copy the example:

```bash
cp .env.local.example .env.local
```

---

## Future API strategy — provider-agnostic from day one

The app's LLM layer lives in `lib/llm/`. It exports a single `getProvider()` function that returns an `LLMProvider` interface implementation. In Phase 0A, that's the `MockProvider`. In later phases, it will be a real provider — but **no app code changes** are needed to swap it.

This design means we can connect to any of the following without rewriting the app:

| Provider | Notes |
|----------|-------|
| Anthropic (Claude) | First real-provider candidate |
| OpenAI (GPT-4o, etc.) | Viable alternative |
| Azure OpenAI | Required if Mayo mandates Azure infrastructure |
| AWS Bedrock | Another viable enterprise path |
| Vertex AI | Google Cloud option |
| Mayo-approved internal LLM endpoint | If Mayo deploys its own model |

The choice of provider is a deployment decision, not an architectural one.

---

## Phase roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **0A** | ✅ Active | Local demo, mock LLM, no external dependencies |
| **0B** | Planned | Live LLM via provider interface, streaming chat, no database |
| **0C** | Planned | Supabase database, pgvector RAG, user accounts, progress tracking |
| **1 (Pilot)** | Future | 10–20 residents at Mayo, all 6 modes, admin UI, opt-in leaderboards |
| **2+** | Future | Wider Mayo deployment, second subspecialty module |

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npx tsx scripts/seed-db.ts` | Seed cases and pearls to Supabase (Phase 0C+) |
| `npx tsx scripts/ingest-kb.ts` | Embed KB markdown → pgvector (Phase 0C+) |
| `npx tsx scripts/gen-types.ts` | Regenerate Supabase TypeScript types (Phase 0C+) |

---

## Folder structure

```
app/              Next.js App Router pages and API routes
components/       React components (ui/, shell/, case/, chat/, etc.)
lib/llm/          Provider-agnostic LLM layer (mock → real in Phase 0B)
lib/demo/         Local demo state (user, progress, content)
lib/supabase/     Supabase clients (not wired until Phase 0C)
lib/              Other utilities (scoring, analytics, RAG helpers)
content/          Markdown KB (content/kb/) and seed cases (content/cases/)
prompts/          System prompts per mode — faculty-editable markdown
supabase/         SQL migrations (not run until Phase 0C)
scripts/          DB seeding and KB ingestion CLI tools
public/           Static assets (illustrations, anatomy SVGs)
```

**Key principle:** content (`/content`) is separate from code. Faculty can edit KB markdown files via PR or a future admin UI without touching the app.

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
2. Read every generated file before committing — this is medical education content; accuracy matters
3. When updating SPEC.md or DESIGN_SYSTEM.md, note it explicitly so the AI assistant re-reads them
4. Never ingest licensed textbook content verbatim
5. All cases must be marked `"verified": false` until a hand surgery attending signs off in the admin UI
