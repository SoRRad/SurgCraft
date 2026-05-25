# ORION Surgery file structure

> Phase 0B.2 chat-first structure. `ROADMAP.md` is the canonical phase plan.

Next.js 14 App Router + TypeScript + Tailwind + AI SDK + Vitest. Supabase files exist for Phase 0C+ but are not runtime dependencies in Phase 0B.

```text
orion-surgery/
├── README.md                        # ORION overview + setup
├── ROADMAP.md                       # Canonical phase roadmap
├── SPEC.md                          # Product spec
├── DESIGN_SYSTEM.md                 # Visual system, motion, tokens
├── BUILD_ORDER.md                   # Execution checklist
├── FILE_STRUCTURE.md                # This file
├── SEED_CASES.md                    # Synthetic case reference
├── OVERVIEW_API.md                  # Historical Phase 0B overview
├── DEMO_SCRIPT.md                   # Faculty demo path
├── QA_CHECKLIST.md                  # Pre-demo manual QA
├── CONTENT_REVIEW.md                # Faculty review tracker (also rendered at /admin/review)
├── .env.local.example
├── package.json                     # "name": "orion-surgery"
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── components.json                  # shadcn/ui config
│
├── .github/workflows/ci.yml         # CI: lint + test + build on push/PR
│
├── app/
│   ├── layout.tsx                   # Root layout + fonts + metadata
│   ├── globals.css                  # Tailwind base + design tokens
│   ├── page.tsx                     # Redirects to onboarding or /c
│   ├── onboarding/page.tsx          # Intake form + privacy contract
│   ├── c/
│   │   ├── page.tsx                 # Chat home / new conversation
│   │   └── [conversationId]/page.tsx # Existing local conversation
│   ├── case/
│   │   ├── page.tsx                 # Case library
│   │   └── [id]/page.tsx            # Case canvas (reveal + Reasoning Autopsy)
│   ├── mistakes/page.tsx            # Mistake Museum (decision-time errors)
│   ├── donotmiss/page.tsx           # Do-Not-Miss (recognition-time red flags)
│   ├── pearls/page.tsx              # Saved pearls (local)
│   ├── topics/page.tsx              # Cross-content topic index
│   ├── modules/page.tsx             # ORION module index (Hand active + 5 in dev)
│   ├── m/[moduleId]/page.tsx        # Placeholder pages for in-development modules
│   ├── admin/
│   │   ├── page.tsx                 # Redirects to /admin/review
│   │   └── review/page.tsx          # Faculty review portal (renders CONTENT_REVIEW.md)
│   ├── about/page.tsx               # About + acknowledgments + glossary
│   └── api/
│       ├── chat/
│       │   ├── route.ts             # Streaming chat (mock or Anthropic)
│       │   └── title/route.ts       # Auto-titling for new conversations
│       └── provider-status/route.ts # Current provider + reason (header badge)
│
├── components/
│   ├── ui/                          # shadcn primitives (button, dialog, sheet, ...)
│   ├── shell/
│   │   ├── AppShell.tsx             # Standard header+footer shell (onboarding/about)
│   │   ├── Header.tsx               # ORION wordmark + ModuleSwitcher + PHI pill + provider badge
│   │   ├── Footer.tsx               # ORION · Hand · Mayo Clinic Pilot
│   │   ├── ModuleSwitcher.tsx       # Header dropdown to switch modules
│   │   ├── SectionMarker.tsx        # "§ NN — Label" Fraunces small caps
│   │   ├── SettingsDrawer.tsx       # User + data + export/import
│   │   ├── useProviderStatus.tsx    # Provider status hook + label helper
│   │   └── KeyboardShortcuts.tsx    # Global ? help + n/g+letter chord
│   ├── chat/
│   │   ├── ChatExperience.tsx       # Core chat + empty state + streaming
│   │   ├── ChatLayout.tsx           # Sidebar + main + mobile drawer + KB shortcuts
│   │   ├── Sidebar.tsx              # Recent / Learning Library / Saved / Platform
│   │   ├── CitationChip.tsx         # Inline [Source, Year] chip
│   │   ├── TodaysPearl.tsx          # Daily rotating pearl on empty state
│   │   ├── SlashPalette.tsx         # /case /quiz /pearl /mistake /donotmiss
│   │   └── tool-results/            # Inline tool renderers (case, pearl, mistake, ...)
│   ├── case/
│   │   ├── CaseCanvas.tsx           # Inline embedded case from chat
│   │   ├── CaseCard.tsx             # Single reveal card
│   │   └── ReasoningAutopsy.tsx     # End-of-case postmortem
│   ├── interaction/                 # Phase 0C+ stubs (AnatomySVG, PimpingTimer, ConfidenceSlider)
│   ├── streaks/                     # Phase 0C+ stub (StreakRings)
│   ├── pearls/                      # Phase 0C+ stub (PearlCard, PearlGrid)
│   └── motif/HandMascot.tsx         # Hand SVG mascot
│
├── lib/
│   ├── orion/
│   │   ├── branding.ts              # PLATFORM, SAFETY constants
│   │   └── modules.ts               # MODULES registry (Hand active + 5 in dev)
│   ├── llm/
│   │   ├── index.ts                 # getProvider() factory
│   │   ├── provider.ts              # LLMProvider interface
│   │   ├── provider-selection.ts    # Mode detection + reason
│   │   ├── mock-provider.ts         # Deterministic mock
│   │   ├── anthropic-provider.ts    # Anthropic (server-only)
│   │   ├── mock-stream.ts           # Mock streaming with simulated tool calls
│   │   ├── local-demo-engine.ts     # KB entries + tutor answers + pimping questions
│   │   ├── tools.ts                 # Vercel AI SDK tool definitions
│   │   ├── cost-guard.ts            # Per-session token cost cap
│   │   └── types.ts                 # Shared types
│   ├── demo/
│   │   ├── conversations.ts         # localStorage conversations + pearls + flags + import/export
│   │   ├── demo-user.ts             # Anonymous learner profile
│   │   ├── demo-progress.ts         # Phase 0C+ stub (not imported)
│   │   └── demo-content.ts          # MISTAKE_MUSEUM, DO_NOT_MISS, PEARLS, TOPIC_INDEX, TUTOR_TOPICS
│   ├── analytics/events.ts          # Phase 1 stub
│   ├── rag/                         # Phase 0C+ stubs (embed, ingest, retrieve)
│   ├── scoring/                     # Phase 0C+ stubs (calibration, pimping)
│   ├── supabase/                    # Phase 0C+ clients (not wired)
│   └── utils.ts                     # cn() and small helpers
│
├── content/
│   ├── cases/                       # 3 seed cases (JSON; verified: false)
│   ├── kb/                          # Markdown knowledge base (anatomy, trauma)
│   └── pearls/seed-pearls.json      # Seed pearls
│
├── prompts/                         # Faculty-editable system prompts
│   └── tutor-chat.md
│
├── supabase/migrations/             # SQL migrations (not run in Phase 0B)
├── scripts/                         # CLI scripts (gen-types, ingest-kb, seed-db)
├── public/                          # Static assets
└── tests/conversations.test.ts      # Vitest suite (13 tests)
```

**Key principle:** content (`/content`), prompts (`/prompts`), and content-review tracking (`CONTENT_REVIEW.md`) are designed for faculty contributions without requiring code changes. The faculty review portal at `/admin/review` renders `CONTENT_REVIEW.md` directly.
