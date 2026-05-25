# ORION Surgery

**ORION** — **O**perative **R**easoning and **I**nteractive **O**nline **N**avigator.
A multi-module surgical education platform for medical students, residents, and fellows.

Piloting at Mayo Clinic. Phase 0B.2: chat-first, local-first, deterministic mock provider by default.

---

> **Educational use only. Not for clinical decision-making.**
> Do not enter PHI (names, MRNs, DOBs, images, or any patient identifiers).
> No content here should guide the care of a real patient.

---

## Modules

ORION is built as a platform that hosts multiple surgical subspecialty modules. Each module ships its own knowledge base, cases, and tutoring content.

| Module | Status | Scope |
|---|---|---|
| **Hand** | ✅ Active | Hand trauma, infection, tendon, nerve, and fracture education. Current Phase 0B.2 surface. |
| Bariatric | 🟡 In development | Pre-operative selection, operative anatomy, post-operative complications. |
| Foot & Ankle | 🟡 In development | Ankle fractures, foot trauma, diabetic foot, reconstructive principles. |
| Plastic & Reconstructive | 🟡 In development | Reconstructive ladder, flap selection, wound coverage. |
| Pediatric | 🟡 In development | Common pediatric surgical conditions, age-specific differentials. |
| Vascular | 🟡 In development | Limb ischemia, aneurysmal disease, access surgery. |

In-development modules show a faculty-recruitment page. We are actively seeking a faculty champion per module.

---

## What the Hand module includes

- **Tutor (chat).** Free-form Q&A with role-aware depth, inline citations, and the option to surface tools (case launcher, pearl card, mistake card, do-not-miss card, quiz starter, follow-up chips).
- **Cases.** Three seed cases (fight bite, mallet finger, distal radius FOOSH) with progressive card reveal, management gated by exploration, end-of-case teaching points and pearls, and a *Reasoning Autopsy* postmortem.
- **Mistake Museum.** Decision-time cognitive errors — what learners commonly get wrong at the management step.
- **Do-Not-Miss.** Recognition-time red flags — high-stakes diagnoses where delayed recognition causes irreversible harm.
- **Pearls.** Save any assistant answer or content pearl to a local library.
- **Local-only.** All conversations, pearls, flags, and the learner profile live in your browser's localStorage. Export/import via Settings.

---

## What this is not

- Not clinical decision support.
- Not a substitute for textbooks, ASPS modules, or attending teaching.
- Not connected to any EMR or real patient data.
- Not a public ranking system (no leaderboards; individual scores are never visible to faculty).

---

## Run it locally (mock/demo mode — no API key required)

```bash
npm install
npm run dev
```

Open http://localhost:3000. You'll land on onboarding, then the chat interface. The app ships with a deterministic mock provider that uses keyword matching and canned hand surgery content.

## Run it with real Claude (live mode)

```bash
cp .env.local.example .env.local
# Edit .env.local:
#   NEXT_PUBLIC_APP_MODE=live
#   ANTHROPIC_API_KEY=sk-ant-...
#   LLM_PROVIDER=anthropic
npm run dev
```

The Anthropic key is server-only. The app never exposes it to the browser. A per-session cost guard (default `$0.50/session`) is enforced in `lib/llm/cost-guard.ts`.

> **Recommended:** set a billing cap (~$20/month) on the Anthropic console for peace of mind during development.

If `NEXT_PUBLIC_APP_MODE=live` is set but `ANTHROPIC_API_KEY` is missing, ORION falls back to the mock provider with a console warning.

---

## Provider-agnostic LLM layer

`lib/llm/` exposes a `getProvider()` factory. In demo mode it returns `MockProvider`; in live mode it returns `AnthropicProvider`. New providers (OpenAI, Azure, Bedrock, Vertex, Mayo-hosted) implement the same interface — no app code changes are needed.

| Provider | Notes |
|---|---|
| Mock | Default. Deterministic. No external calls. |
| Anthropic (Claude) | Current real provider (`claude-sonnet-4-5`). |
| Azure OpenAI / AWS Bedrock / Vertex AI | Viable enterprise paths. Add a new file in `lib/llm/`. |
| Mayo-approved internal endpoint | Recommended for the pilot once procurement allows. |

---

## Phase roadmap

| Phase | Status | Description |
|---|---|---|
| **0A** | ✅ Done | Local mock LLM, onboarding, synthetic cases, Mistake Museum, Do-Not-Miss library. |
| **0B.1** | ✅ Done | Stabilization: request validation, provider status, local persistence, saved pearls, local flags, tests, CI, QA checklist. |
| **0B.2** | ✅ Active | Faculty-demo polish + ORION rebrand + multi-module foundation + Mistake/Do-Not-Miss separation + dropdown patterns + new features (slash commands, keyboard shortcuts, topic index, today's pearl, faculty review portal). |
| **0C** | Planned | Supabase database, pgvector RAG, user accounts, faculty verification workflow, governed flagged-output review. |
| **1 (Pilot)** | Future | 10–20 residents at Mayo. Faculty-reviewed content. Mayo-sanctioned hosting. Learning analytics focused on education, not ranking. |
| **2+** | Future | Multi-institution scoping. Additional modules ship as faculty champions are recruited. |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run lint` | ESLint check |
| `npm run test` | Vitest suite |
| `npm run build` | Production build |
| `npm run start` | Start the production server |

CI runs lint + test + build on every push and PR to `main` (see `.github/workflows/ci.yml`).

---

## Folder structure (high level)

```
app/                  Next.js App Router pages and API routes
components/           React components
  chat/               Chat experience, sidebar, tool-result renderers
  shell/              Header, Footer, AppShell, FacultyReviewBanner, SectionMarker
  case/               Case canvas + Reasoning Autopsy
  ui/                 shadcn primitives
lib/
  orion/              Branding constants, module registry
  llm/                Provider-agnostic LLM layer (mock + Anthropic)
  demo/               Local persistence (conversations, pearls, flags) + demo content
  supabase/           Database clients (not wired until Phase 0C)
content/
  cases/              Seed cases (3 cases, JSON)
  kb/                 Markdown knowledge base (not yet wired to RAG)
  pearls/             Seed pearl JSON
prompts/              System prompts (faculty-editable Markdown)
supabase/migrations/  SQL migrations (not run until Phase 0C)
tests/                Vitest suite
.github/workflows/    CI pipeline
```

`content/`, `prompts/`, and `CONTENT_REVIEW.md` are designed for faculty contributions without requiring code changes. See `CONTENT_REVIEW.md` for the central tracking of every authored clinical claim and its review status.

---

## Content ownership policy

| Source | Use |
|---|---|
| Faculty-written notes & pearls | ✅ Full use after explicit approval; attributed |
| Mayo internal curriculum | ✅ Full use (Mayo-only deployment); per-section approval |
| ASPS / PSEN course content | 🔗 Link out only; never ingested |
| Textbooks (Green's, Wolfe, etc.) | 🔗 Cite and paraphrase; never reproduce verbatim |
| Journal articles | 🔗 Cite via DOI and paraphrase conclusions |
| Open guidelines (AAOS, ASSH) | ✅ Cite and summarize; brief excerpts allowed with attribution |
| Real patient data (EMR) | ❌ Never. Not in any phase. |

Full policy + faculty workflow expectations are in `/about` inside the running app.

---

## Faculty review

Every authored clinical claim is centrally tracked in [`CONTENT_REVIEW.md`](./CONTENT_REVIEW.md) with columns for reviewer, date, and status. No piece of content reaches a pilot resident until its row reads `approved` or `approved-with-edits`.

An in-app faculty review portal is available at `/admin/review` and renders directly from `CONTENT_REVIEW.md`.

---

## Contributing

1. Tag commits by phase: `phase0a`, `phase0b`, `phase0c`, etc.
2. Read every generated file before committing — this is medical education content; accuracy matters.
3. When you update `SPEC.md`, `DESIGN_SYSTEM.md`, `FILE_STRUCTURE.md`, or `ROADMAP.md`, note it in your PR description so the AI assistant re-reads them before continuing.
4. Never ingest licensed textbook content verbatim.
5. All cases must remain `"verified": false` until a hand surgery attending signs off (Phase 0C: in the admin UI; today: in `CONTENT_REVIEW.md`).
6. Storage keys in `localStorage` retain the legacy `surgicraft:*` namespace by design — to preserve existing learner data through the rebrand. Do not rename them without a migration plan.

---

## Acknowledgments

ORION Surgery is being built as a pilot in collaboration with Mayo Clinic faculty. Specific contributors will be acknowledged in `/about` as content is reviewed and approved.
