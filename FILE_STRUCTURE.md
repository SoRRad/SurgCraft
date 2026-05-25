# SurgiCraft : Handcraft File Structure

> Current Phase 0B chat-first structure. `ROADMAP.md` is the canonical phase plan.

Next.js App Router + TypeScript + Tailwind + AI SDK. Supabase files exist for Phase 0C+ but are not runtime dependencies in Phase 0B.

```text
SurgCraft/
├── README.md
├── ROADMAP.md                       # Canonical phase roadmap
├── SPEC.md                          # Product spec, synchronized to chat-first architecture
├── DESIGN_SYSTEM.md                 # Visual system and interaction language
├── BUILD_ORDER.md                   # Current execution checklist
├── FILE_STRUCTURE.md                # This file
├── SEED_CASES.md                    # Synthetic case reference
├── OVERVIEW_API.md                  # Historical Phase 0B overview
├── .env.local.example               # Provider/env examples
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx                   # Root layout and fonts
│   ├── globals.css                  # Tailwind + design tokens
│   ├── page.tsx                     # Redirects to onboarding or /c
│   ├── onboarding/page.tsx          # Intake form, local demo user
│   ├── c/
│   │   ├── page.tsx                 # Chat home / new conversation
│   │   └── [conversationId]/page.tsx# Existing local conversation
│   ├── case/
│   │   ├── page.tsx                 # Cases library
│   │   └── [id]/page.tsx            # Full case canvas
│   ├── mistakes/page.tsx            # Mistake Museum library
│   ├── donotmiss/page.tsx           # Do-Not-Miss library
│   ├── pearls/page.tsx              # Locally saved learner pearls
│   ├── about/page.tsx               # Safety/content ownership
│   ├── leaderboard/page.tsx         # Placeholder/future
│   ├── admin/
│   │   ├── page.tsx                 # Placeholder/future faculty admin
│   │   ├── flags/page.tsx
│   │   └── kb/page.tsx
│   └── api/
│       ├── chat/route.ts            # Validated streaming chat endpoint
│       ├── chat/title/route.ts      # Conversation title generation
│       ├── provider-status/route.ts # Resolved mock/Anthropic provider status
│       ├── case/start/route.ts      # Legacy/demo helper
│       ├── case/reveal/route.ts     # Legacy/demo helper
│       ├── flag/route.ts            # Placeholder until Phase 0C
│       ├── pearl/unlock/route.ts    # Placeholder until Phase 0C
│       ├── rag/search/route.ts      # Stub until Phase 0C
│       ├── leaderboard/route.ts
│       ├── pimping/route.ts
│       ├── preop/route.ts
│       └── streak/route.ts
│
├── components/
│   ├── chat/
│   │   ├── ChatExperience.tsx       # Main streaming chat UI
│   │   ├── ChatLayout.tsx           # Sidebar + main shell
│   │   ├── Sidebar.tsx              # Conversations and library links
│   │   ├── CitationChip.tsx         # Inline citation rendering
│   │   ├── ChatInput.tsx            # Legacy/small input component
│   │   ├── MessageBubble.tsx        # Legacy/small message component
│   │   ├── ModeSwitcher.tsx         # Legacy/future mode switcher
│   │   └── tool-results/
│   │       ├── CaseLauncher.tsx
│   │       ├── DoNotMissCard.tsx
│   │       ├── FollowupChips.tsx
│   │       ├── InlineMistakeCard.tsx
│   │       ├── InlinePearlCard.tsx
│   │       └── QuizStarter.tsx
│   ├── case/
│   │   ├── CaseCanvas.tsx           # Full/embedded progressive case
│   │   ├── CaseCard.tsx
│   │   ├── CaseStem.tsx
│   │   ├── RunningSummary.tsx
│   │   └── ReasoningAutopsy.tsx
│   ├── shell/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AppShell.tsx             # Legacy/non-chat shell
│   │   ├── SettingsDrawer.tsx
│   │   ├── useProviderStatus.ts     # Client-side provider status fetch/display helper
│   │   └── SectionMarker.tsx
│   ├── interaction/                 # Deferred/future interaction components
│   ├── motif/
│   ├── pearls/
│   ├── streaks/
│   └── ui/
│
├── lib/
│   ├── llm/
│   │   ├── provider.ts              # LLMProvider interface
│   │   ├── types.ts                 # Provider input/output types
│   │   ├── index.ts                 # getProvider()
│   │   ├── provider-selection.ts    # LLM_PROVIDER/NEXT_PUBLIC_APP_MODE resolver
│   │   ├── streaming-provider.ts    # model/system/tools/mode for streaming route
│   │   ├── mock-provider.ts
│   │   ├── mock-stream.ts
│   │   ├── anthropic-provider.ts
│   │   ├── local-demo-engine.ts
│   │   ├── tools.ts                 # AI SDK tool schemas
│   │   └── cost-guard.ts            # Development-only in-memory guard
│   ├── demo/
│   │   ├── conversations.ts         # localStorage conversation layer
│   │   ├── demo-user.ts
│   │   ├── demo-progress.ts
│   │   └── demo-content.ts          # Mistakes, do-not-miss, known pearls
│   ├── supabase/                    # Phase 0C+ only
│   ├── rag/                         # Phase 0C+ only
│   ├── scoring/
│   ├── analytics/
│   └── utils.ts
│
├── tests/                            # Vitest utility tests
│   ├── provider-selection.test.ts
│   ├── pearl-tool-safety.test.ts
│   └── conversations.test.ts
│
├── .github/workflows/ci.yml          # GitHub Actions lint/build CI
│
├── content/
│   ├── cases/
│   │   ├── 001-fight-bite.json
│   │   ├── 002-mallet-finger.json
│   │   └── 003-distal-radius.json
│   ├── kb/                          # Draft KB markdown, not yet pgvector-wired
│   └── pearls/seed-pearls.json
│
├── prompts/
│   ├── tutor-chat.md                # Active Phase 0B system prompt
│   ├── tutor.md                     # Historical/non-streaming prompt
│   ├── case-unfolds.md              # Planned/deferred
│   ├── pimping.md                   # Planned/deferred
│   ├── preop.md                     # Planned/deferred
│   ├── debrief.md                   # Planned/deferred
│   └── consult.md                   # Planned/deferred
│
├── public/
├── scripts/
└── supabase/                        # Phase 0C+ migrations
```

Removed routes:

- The legacy dashboard route was removed in the chat-first redesign.
- `/chat` was replaced by `/c`.
- Standalone `/pimping`, `/preop`, `/debrief`, `/consult`, and `/settings` placeholders were removed from the active app surface; those modes now launch inside chat or remain deferred.

Key current principles:

- Runtime chat goes through server API routes, never direct browser provider calls.
- `content/` remains separate from code so faculty can review it.
- Local demo content must be labeled as needing faculty verification.
- Supabase/pgvector are planned Phase 0C dependencies, not Phase 0B requirements.
