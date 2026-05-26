# ORION Surgery

**ORION** — **O**perative **R**easoning and **I**nteractive **O**nline **N**avigator.
An educational chatbot and case-reasoning platform for surgical training, designed for a planned Mayo Clinic pilot.

The **Hand** module is the live Phase 0B.2 surface. Bariatric, Foot & Ankle, Plastic, Pediatric, and Vascular modules are placeholders awaiting faculty champions.

---

> **Educational use only. Not for clinical decision-making.**
> Do not enter PHI (names, MRNs, DOBs, images, or any patient identifier).
> No content here should guide the care of a real patient. No leaderboards, no public ranking, no faculty-visible scores.

---

## Try it in 30 seconds

```bash
npm install
npm run dev
```

Open <http://localhost:3000> and pick **Try the demo**. The demo skips onboarding and uses a generic resident profile, so faculty reviewers and visitors can land directly in chat. Choose **Set up a learner profile** if you want the tutor to adapt to your level.

The default ships with a deterministic mock provider — no API key required.

## Run with live Anthropic

```bash
cp .env.local.example .env.local
# Edit .env.local:
#   NEXT_PUBLIC_APP_MODE=live
#   ANTHROPIC_API_KEY=sk-ant-...
#   LLM_PROVIDER=anthropic
npm run dev
```

The Anthropic key is server-only. A per-session cost guard is enforced in `lib/llm/cost-guard.ts`. If `NEXT_PUBLIC_APP_MODE=live` is set but `ANTHROPIC_API_KEY` is missing, ORION falls back to the mock provider with a console warning.

---

## What the Hand module includes

- **Tutor (chat)** — free-form Q&A with role-aware depth, inline citations, and tool surfaces (case launcher, pearl card, pitfall card, red-flag card, quiz starter, follow-up chips).
- **Cases** — three seed cases (fight bite, mallet finger, distal radius FOOSH) with progressive card reveal, management gated by exploration, and an end-of-case debrief.
- **Common pitfalls** — decision-time reasoning errors. What learners commonly get wrong after the diagnosis is visible.
- **Red flags** — recognition-time presentations you cannot miss at first contact.
- **Saved pearls** — bookmark any assistant answer to a local library.
- **Local-only persistence** — conversations, pearls, flags, and the learner profile live in your browser's localStorage. Export/import via Settings.

---

## What this is not

- Not clinical decision support.
- Not a substitute for textbooks, ASPS/PSEN content, or attending teaching.
- Not connected to any EMR or real patient data.
- Not a public ranking system, ever.

---

## Modules

| Module | Status | Scope |
|---|---|---|
| **Hand** | Active | Trauma, infection, tendon, nerve, fracture education. |
| Bariatric | In development | Pre-op selection, anatomy, post-op complications. |
| Foot & Ankle | In development | Ankle fractures, foot trauma, diabetic foot, reconstruction. |
| Plastic & Reconstructive | In development | Reconstructive ladder, flap selection, wound coverage. |
| Pediatric | In development | Common pediatric conditions, age-specific differentials. |
| Vascular | In development | Limb ischemia, aneurysmal disease, access surgery. |

In-development modules show a faculty-recruitment page. We are actively seeking a faculty champion per module.

---

## Provider-agnostic LLM layer

`lib/llm/` exposes a `getProvider()` factory. New providers (OpenAI, Azure, Bedrock, Vertex, Mayo-hosted) implement the same interface — no app code changes are needed.

| Provider | Notes |
|---|---|
| Mock | Default. Deterministic. No external calls. |
| Anthropic (Claude) | Current real provider (`claude-sonnet-4-5`). |
| Mayo-approved internal endpoint | Recommended for the pilot once procurement allows. |

---

## Phase roadmap

| Phase | Status | Description |
|---|---|---|
| **0A** | Done | Local mock LLM, onboarding, synthetic cases, pitfalls + red flags. |
| **0B.1** | Done | Stabilization: validation, provider status, local persistence, saved pearls, local flags, tests, CI, QA. |
| **0B.2** | Active | Faculty-demo polish, ORION rebrand, multi-module foundation, redesign, demo-mode skip-onboarding. |
| **0C** | Planned | Supabase database, pgvector RAG, accounts, faculty verification workflow. |
| **1 (Pilot)** | Future | 10–20 residents at Mayo. Faculty-reviewed content. Mayo-sanctioned hosting. |
| **2+** | Future | Multi-institution scoping; additional modules as faculty champions sign on. |

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
components/           React components (chat, case, shell, ui)
lib/
  orion/              Branding constants, module registry
  llm/                Provider-agnostic LLM layer (mock + Anthropic)
  demo/               Local persistence + demo content
  supabase/           Database clients (not wired until Phase 0C)
content/              Seed cases, KB drafts, pearls
prompts/              System prompts (faculty-editable Markdown)
supabase/migrations/  SQL migrations (not run until Phase 0C)
tests/                Vitest suite
.github/workflows/    CI pipeline
PRODUCT.md            Strategic context (users, voice, anti-references)
DESIGN.md             Visual system (palette, typography, components)
```

---

## Content ownership policy

| Source | Use |
|---|---|
| Faculty-written notes & pearls | Full use after explicit approval; attributed |
| Mayo internal curriculum | Full use (Mayo-only deployment); per-section approval |
| ASPS / PSEN course content | Link out only; never ingested |
| Textbooks (Green's, Wolfe, etc.) | Cite and paraphrase; never reproduce verbatim |
| Journal articles | Cite via DOI and paraphrase conclusions |
| Open guidelines (AAOS, ASSH) | Cite and summarize; brief excerpts allowed with attribution |
| Real patient data (EMR) | Never. Not in any phase. |

Full policy + faculty workflow expectations are in `/about` inside the running app.

---

## Faculty review

Every authored clinical claim is centrally tracked in [`CONTENT_REVIEW.md`](./CONTENT_REVIEW.md) with columns for reviewer, date, and status. No piece of content reaches a pilot resident until its row reads `approved` or `approved-with-edits`.

---

## Contributing

1. Tag commits by phase: `phase0a`, `phase0b`, `phase0c`, etc.
2. Read every generated file before committing — this is medical education content; accuracy matters.
3. When you update `SPEC.md`, `DESIGN.md`, `FILE_STRUCTURE.md`, or `ROADMAP.md`, note it in your PR description.
4. Never ingest licensed textbook content verbatim.
5. All cases must remain `"verified": false` until a hand-surgery attending signs off.
6. `localStorage` keys retain the legacy `surgicraft:*` namespace by design to preserve existing learner data through the rebrand. Do not rename without a migration plan.

---

## Acknowledgments

ORION Surgery is being developed for Mayo Clinic pilot evaluation in collaboration with Mayo Clinic faculty. Specific contributors will be acknowledged in `/about` as content is reviewed and approved.

## Opportunity Hub (Phase 0B.3)
Local/static research opportunities for conferences, deadlines, grants/funding, bundles, saved, compare, and ICS/CSV export. Uses the existing ORION chat/provider layer only; no live web search. Always verify official sources.
