# ORION Surgery file structure

> Phase 0B.2 chat-first structure. `ROADMAP.md` is the canonical phase plan.

Next.js 14 App Router + TypeScript + Tailwind + AI SDK + Vitest. Supabase files exist for Phase 0C+ but are not runtime dependencies in Phase 0B.

```text
orion-surgery/
├── README.md                        # ORION overview + setup
├── ROADMAP.md                       # Canonical phase roadmap
├── SPEC.md                          # Product spec
├── PRODUCT.md                       # Strategic context (impeccable)
├── DESIGN.md                        # Visual system (impeccable)
├── FILE_STRUCTURE.md                # This file
├── DEMO_SCRIPT.md                   # Faculty demo path
├── QA_CHECKLIST.md                  # Pre-demo manual QA
├── CONTENT_REVIEW.md                # Faculty review tracker
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
│   ├── layout.tsx                   # Root layout + viewport + metadata
│   ├── globals.css                  # Tailwind base + design tokens + fluid type
│   ├── page.tsx                     # Landing: Try demo vs Set up profile
│   ├── onboarding/page.tsx          # Intake form + skip-to-demo affordance
│   ├── c/                           # Chat
│   ├── case/                        # Case library + canvas
│   ├── mistakes/page.tsx            # Common pitfalls (decision-time errors)
│   ├── donotmiss/page.tsx           # Red flags (recognition-time)
│   ├── pearls/page.tsx              # Saved pearls (local)
│   ├── topics/page.tsx              # Topic index
│   ├── modules/page.tsx             # Module index
│   ├── m/[moduleId]/page.tsx        # In-development module placeholder
│   ├── admin/page.tsx               # Redirects to /admin/review
│   ├── about/page.tsx               # About + glossary
│   └── api/                         # Streaming chat + provider-status
│
├── components/
│   ├── ui/                          # shadcn primitives
│   ├── shell/                       # AppShell, Header, Footer, Settings
│   ├── chat/                        # ChatExperience, Sidebar, ChatLayout, tools
│   ├── case/                        # CaseCanvas, ReasoningAutopsy
│   ├── interaction/                 # Phase 0C+ stubs
│   ├── pearls/                      # Phase 0C+ stub
│   └── motif/HandMascot.tsx
│
├── lib/
│   ├── orion/                       # branding + modules registry
│   ├── llm/                         # Provider-agnostic LLM layer
│   ├── demo/                        # Local persistence + content (no progress/streaks)
│   ├── analytics/                   # Phase 1 stub
│   ├── rag/                         # Phase 0C+ stubs
│   ├── scoring/                     # Phase 0C+ stubs
│   ├── supabase/                    # Phase 0C+ clients (not wired)
│   └── utils.ts
│
├── content/                         # Cases, KB drafts, pearls (faculty-editable)
├── prompts/                         # System prompts (faculty-editable)
├── supabase/migrations/             # SQL migrations (not run in Phase 0B)
├── scripts/                         # CLI scripts (gen-types, ingest-kb, seed-db)
├── public/                          # Static assets
└── tests/                           # Vitest suite
```

**Key principle:** `content/`, `prompts/`, and `CONTENT_REVIEW.md` are designed for faculty contributions without requiring code changes.
