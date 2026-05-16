# Handcraft — File Structure

Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui + Supabase.

```
handcraft/
├── README.md
├── SPEC.md                          # Copy of full spec
├── DESIGN_SYSTEM.md                 # Copy of design system
├── BUILD_ORDER.md                   # Phased build plan
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── postcss.config.mjs
├── components.json                  # shadcn config
│
├── app/
│   ├── layout.tsx                   # Root layout, font loading, providers
│   ├── globals.css                  # Tailwind + CSS variables (design tokens)
│   ├── page.tsx                     # Landing → onboarding or dashboard
│   ├── onboarding/
│   │   └── page.tsx                 # Intake form (6 questions)
│   ├── dashboard/
│   │   └── page.tsx                 # Streak rings, recent activity, mode launcher
│   ├── chat/
│   │   └── page.tsx                 # Tutor mode (default chat)
│   ├── case/
│   │   ├── page.tsx                 # Case index
│   │   └── [id]/page.tsx            # Case canvas (progressive reveal)
│   ├── pimping/
│   │   └── page.tsx                 # Pimping simulator
│   ├── preop/
│   │   └── page.tsx                 # Pre-op prep wizard
│   ├── debrief/
│   │   └── page.tsx                 # OR debrief
│   ├── consult/
│   │   └── page.tsx                 # ED consult mode
│   ├── leaderboard/
│   │   └── page.tsx                 # Cohort-scoped, opt-in
│   ├── pearls/
│   │   └── page.tsx                 # Collected pearls
│   ├── settings/
│   │   └── page.tsx                 # Profile, privacy, opt-ins
│   ├── admin/
│   │   ├── page.tsx                 # Admin dashboard (faculty)
│   │   ├── flags/page.tsx           # Flagged response review
│   │   └── kb/page.tsx              # Knowledge base editor
│   └── api/
│       ├── chat/route.ts            # Streaming chat (Claude)
│       ├── case/
│       │   ├── start/route.ts
│       │   └── reveal/route.ts
│       ├── pimping/route.ts
│       ├── preop/route.ts
│       ├── flag/route.ts
│       ├── pearl/unlock/route.ts
│       ├── leaderboard/route.ts
│       ├── streak/route.ts
│       └── rag/search/route.ts      # pgvector retrieval
│
├── components/
│   ├── ui/                          # shadcn primitives (generated)
│   ├── case/
│   │   ├── CaseCanvas.tsx
│   │   ├── CaseCard.tsx             # CC, History, Exam, Imaging, Labs, Mgmt
│   │   ├── RunningSummary.tsx       # Right-rail summary
│   │   └── CaseStem.tsx             # Serif stem block
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── CitationChip.tsx
│   │   ├── ChatInput.tsx
│   │   └── ModeSwitcher.tsx
│   ├── interaction/
│   │   ├── ConfidenceSlider.tsx
│   │   ├── PimpingTimer.tsx
│   │   └── AnatomySVG.tsx           # Clickable hand diagram
│   ├── pearls/
│   │   ├── PearlCard.tsx
│   │   └── PearlGrid.tsx
│   ├── streaks/
│   │   └── StreakRings.tsx
│   ├── shell/
│   │   ├── AppShell.tsx             # Layout wrapper, nav
│   │   ├── Header.tsx
│   │   ├── Footer.tsx               # Includes educational-use disclaimer
│   │   └── SectionMarker.tsx        # "§ 02 — Anatomy"
│   └── motif/
│       ├── HandMascot.tsx           # SVG, pose prop
│       └── Engraving.tsx            # Decorative anatomical SVG
│
├── lib/
│   ├── anthropic/
│   │   ├── client.ts                # Anthropic SDK init
│   │   ├── prompts.ts               # System prompts per mode
│   │   └── streaming.ts             # SSE helpers
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server client
│   │   └── types.ts                 # Generated DB types
│   ├── rag/
│   │   ├── embed.ts                 # Embedding generation
│   │   ├── retrieve.ts              # pgvector top-k
│   │   └── ingest.ts                # KB content ingestion script
│   ├── analytics/
│   │   └── events.ts                # PostHog event taxonomy
│   ├── scoring/
│   │   ├── calibration.ts           # Confidence vs correctness math
│   │   └── pimping.ts               # Response grading
│   └── utils.ts                     # cn(), formatters
│
├── content/
│   ├── kb/                          # Markdown knowledge base, ingested to pgvector
│   │   ├── anatomy/
│   │   │   ├── flexor-tendon-zones.md
│   │   │   ├── extensor-compartments.md
│   │   │   └── ...
│   │   ├── trauma/
│   │   ├── nerve/
│   │   ├── congenital/
│   │   └── micro/
│   ├── cases/                       # Seed cases (JSON or MDX)
│   │   ├── 001-fight-bite.json
│   │   ├── 002-mallet-finger.json
│   │   └── 003-distal-radius.json
│   └── pearls/
│       └── seed-pearls.json
│
├── prompts/                         # System prompts per mode (markdown, for review)
│   ├── tutor.md
│   ├── case-unfolds.md
│   ├── pimping.md
│   ├── preop.md
│   ├── debrief.md
│   └── consult.md
│
├── public/
│   ├── fonts/                       # If self-hosting Fraunces/Instrument Serif
│   ├── illustrations/
│   │   ├── hand-open.svg
│   │   ├── hand-ok.svg
│   │   ├── hand-fist.svg
│   │   └── engraving-01.svg
│   └── anatomy/
│       ├── hand-dorsal.svg          # Labeled, interactive
│       └── hand-palmar.svg
│
├── supabase/
│   ├── migrations/
│   │   ├── 0001_init.sql            # users, sessions, messages, cases, etc.
│   │   ├── 0002_pgvector.sql        # vector extension + kb_chunks
│   │   └── 0003_rls.sql             # Row-level security policies
│   └── seed.sql                     # Optional: load seed cases/pearls
│
└── scripts/
    ├── ingest-kb.ts                 # Walk content/kb/, embed, upsert to pgvector
    ├── seed-db.ts                   # Load seed cases and pearls
    └── gen-types.ts                 # Generate Supabase types
```

**Key principle:** content (`/content`) is separate from code. Faculty can edit markdown knowledge base files via PR or admin UI without touching the app.
