# Handcraft

Interactive learning chatbot for hand surgery. Piloting at Mayo Clinic. Built for medical students, residents, and fellows.

> **Educational use only. Not for clinical decision-making.**

---

## What this is

Handcraft meets learners where they are — a sub-I who doesn't want to embarrass themselves on rounds, a PGY-2 cramming for the in-service, a fellow prepping for a tricky case. The bot adapts its voice and depth to the user, grounds answers in a curated knowledge base, and turns passive reading into active reasoning via Socratic dialogue, unfolding cases, calibrated confidence, and faculty pearls.

**Not:** clinical decision support, a textbook replacement, or a public ranking system.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Auth & DB | Supabase (Postgres + pgvector + Auth) |
| LLM | Anthropic API (Claude Opus/Sonnet) |
| Hosting | Vercel (prototype) → Mayo-sanctioned env pre-pilot |

---

## Setup

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic API key](https://console.anthropic.com)

### 2. Clone and install

```bash
git clone <repo-url>
cd handcraft
npm install
```

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Database setup

Run migrations via the Supabase CLI:

```bash
npx supabase db push
```

Or manually apply `supabase/migrations/` in order using the Supabase SQL editor.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on the onboarding form.

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npx tsx scripts/seed-db.ts` | Seed cases and pearls to Supabase |
| `npx tsx scripts/ingest-kb.ts` | Embed KB markdown → pgvector (Week 4) |
| `npx tsx scripts/gen-types.ts` | Regenerate Supabase TypeScript types |

---

## Build phases

| Week | Focus | Status |
|------|-------|--------|
| 1 | Foundation: scaffold, design tokens, onboarding, shell | ✅ Done |
| 2 | Tutor mode: streaming chat, RAG stub, citations | 🔜 |
| 3 | Case canvas: 3 seed cases, progressive reveal, pearls | 🔜 |
| 4 | Real RAG (pgvector), confidence slider, streak rings | 🔜 |
| 5 | Pimping + Pre-Op modes, anatomy SVG | 🔜 |
| 6 | Admin UI, polish, accessibility pass, faculty demo | 🔜 |

---

## Folder structure

```
app/           Next.js App Router pages and API routes
components/    React components (ui/, shell/, case/, chat/, etc.)
lib/           Supabase client, Anthropic client, RAG helpers, scoring
content/       Markdown KB (content/kb/) and seed cases (content/cases/)
prompts/       System prompts per mode — faculty-editable markdown
supabase/      SQL migrations
scripts/       DB seeding and KB ingestion CLI tools
public/        Static assets (illustrations, anatomy SVGs)
```

**Key principle:** content (`/content`) is separate from code. Faculty can edit KB markdown files via PR or a future admin UI without touching the app.

---

## Content guidelines

- All KB content in `content/kb/` must be reviewed by a hand surgery attending before pilot
- Cases in `content/cases/` are **entirely fictional** — no real patient data
- Mark content `"verified": true` only after faculty sign-off in the admin UI
- Never ingest licensed textbook content (Green's, Wolfe) verbatim — cite and paraphrase only
- ASPS course content: link out only, do not ingest

---

## Privacy

Individual responses are private. Faculty and program directors cannot see how individual users score. Aggregate anonymized data is used to improve the platform.

Leaderboards are opt-in only, use anonymous handles, and are cohort-scoped (not global).

---

## Contributing

1. Each week's work should be tagged: `phase0-week-1`, `phase0-week-2`, etc.
2. Read every file Claude Code generates before committing — this is medical education content
3. Test the demo checkpoint before moving to the next week
4. When updating SPEC.md or DESIGN_SYSTEM.md, tell Claude Code explicitly so it re-reads the relevant sections
