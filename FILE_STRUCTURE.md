# SurgiCraft : Handcraft File Structure

> Current Phase 0B chat-first structure. `ROADMAP.md` is the canonical phase plan.

Next.js App Router + TypeScript + Tailwind + AI SDK. Supabase files exist for Phase 0C+ but are not runtime dependencies in Phase 0B.

```text
SurgCraft/
â”œ-- README.md
â”œ-- ROADMAP.md                       # Canonical phase roadmap
â”œ-- SPEC.md                          # Product spec, synchronized to chat-first architecture
â”œ-- DESIGN_SYSTEM.md                 # Visual system and interaction language
â”œ-- BUILD_ORDER.md                   # Current execution checklist
â”œ-- FILE_STRUCTURE.md                # This file
â”œ-- SEED_CASES.md                    # Synthetic case reference
â”œ-- OVERVIEW_API.md                  # Historical Phase 0B overview
â”œ-- .env.local.example               # Provider/env examples
â”œ-- package.json
â”œ-- next.config.mjs
â”œ-- tailwind.config.ts
â”œ-- tsconfig.json
â”‚
â”œ-- app/
â”‚   â”œ-- layout.tsx                   # Root layout and fonts
â”‚   â”œ-- globals.css                  # Tailwind + design tokens
â”‚   â”œ-- page.tsx                     # Redirects to onboarding or /c
â”‚   â”œ-- onboarding/page.tsx          # Intake form, local demo user
â”‚   â”œ-- c/
â”‚   â”‚   â”œ-- page.tsx                 # Chat home / new conversation
â”‚   â”‚   â””-- [conversationId]/page.tsx# Existing local conversation
â”‚   â”œ-- case/
â”‚   â”‚   â”œ-- page.tsx                 # Cases library
â”‚   â”‚   â””-- [id]/page.tsx            # Full case canvas
â”‚   â”œ-- mistakes/page.tsx            # Mistake Museum library
â”‚   â”œ-- donotmiss/page.tsx           # Do-Not-Miss library
â”‚   â”œ-- pearls/page.tsx              # Locally saved learner pearls
â”‚   â”œ-- about/page.tsx               # Safety/content ownership
â”‚   â”œ-- leaderboard/page.tsx         # Placeholder/future
â”‚   â”œ-- admin/
â”‚   â”‚   â”œ-- page.tsx                 # Placeholder/future faculty admin
â”‚   â”‚   â”œ-- flags/page.tsx
â”‚   â”‚   â””-- kb/page.tsx
â”‚   â””-- api/
â”‚       â”œ-- chat/route.ts            # Validated streaming chat endpoint
â”‚       â”œ-- chat/title/route.ts      # Conversation title generation
â”‚       â”œ-- provider-status/route.ts # Resolved mock/Anthropic provider status
â”‚       â”œ-- case/start/route.ts      # Legacy/demo helper
â”‚       â”œ-- case/reveal/route.ts     # Legacy/demo helper
â”‚       â”œ-- flag/route.ts            # Placeholder until Phase 0C
â”‚       â”œ-- pearl/unlock/route.ts    # Placeholder until Phase 0C
â”‚       â”œ-- rag/search/route.ts      # Stub until Phase 0C
â”‚       â”œ-- leaderboard/route.ts
â”‚       â”œ-- pimping/route.ts
â”‚       â”œ-- preop/route.ts
â”‚       â””-- streak/route.ts
â”‚
â”œ-- components/
â”‚   â”œ-- chat/
â”‚   â”‚   â”œ-- ChatExperience.tsx       # Main streaming chat UI
â”‚   â”‚   â”œ-- ChatLayout.tsx           # Sidebar + main shell
â”‚   â”‚   â”œ-- Sidebar.tsx              # Conversations and library links
â”‚   â”‚   â”œ-- CitationChip.tsx         # Inline citation rendering
â”‚   â”‚   â”œ-- ChatInput.tsx            # Legacy/small input component
â”‚   â”‚   â”œ-- MessageBubble.tsx        # Legacy/small message component
â”‚   â”‚   â”œ-- ModeSwitcher.tsx         # Legacy/future mode switcher
â”‚   â”‚   â””-- tool-results/
â”‚   â”‚       â”œ-- CaseLauncher.tsx
â”‚   â”‚       â”œ-- DoNotMissCard.tsx
â”‚   â”‚       â”œ-- FollowupChips.tsx
â”‚   â”‚       â”œ-- InlineMistakeCard.tsx
â”‚   â”‚       â”œ-- InlinePearlCard.tsx
â”‚   â”‚       â””-- QuizStarter.tsx
â”‚   â”œ-- case/
â”‚   â”‚   â”œ-- CaseCanvas.tsx           # Full/embedded progressive case
â”‚   â”‚   â”œ-- CaseCard.tsx
â”‚   â”‚   â”œ-- CaseStem.tsx
â”‚   â”‚   â”œ-- RunningSummary.tsx
â”‚   â”‚   â””-- ReasoningAutopsy.tsx
â”‚   â”œ-- shell/
â”‚   â”‚   â”œ-- Header.tsx
â”‚   â”‚   â”œ-- Footer.tsx
â”‚   â”‚   â”œ-- AppShell.tsx             # Legacy/non-chat shell
â”‚   â”‚   â”œ-- SettingsDrawer.tsx
â”‚   â”‚   â”œ-- useProviderStatus.ts     # Client-side provider status fetch/display helper
â”‚   â”‚   â””-- SectionMarker.tsx
â”‚   â”œ-- interaction/                 # Deferred/future interaction components
â”‚   â”œ-- motif/
â”‚   â”œ-- pearls/
â”‚   â”œ-- streaks/
â”‚   â””-- ui/
â”‚
â”œ-- lib/
â”‚   â”œ-- llm/
â”‚   â”‚   â”œ-- provider.ts              # LLMProvider interface
â”‚   â”‚   â”œ-- types.ts                 # Provider input/output types
â”‚   â”‚   â”œ-- index.ts                 # getProvider()
â”‚   â”‚   â”œ-- provider-selection.ts    # LLM_PROVIDER/NEXT_PUBLIC_APP_MODE resolver
â”‚   â”‚   â”œ-- streaming-provider.ts    # model/system/tools/mode for streaming route
â”‚   â”‚   â”œ-- mock-provider.ts
â”‚   â”‚   â”œ-- mock-stream.ts
â”‚   â”‚   â”œ-- anthropic-provider.ts
â”‚   â”‚   â”œ-- local-demo-engine.ts
â”‚   â”‚   â”œ-- tools.ts                 # AI SDK tool schemas
â”‚   â”‚   â””-- cost-guard.ts            # Development-only in-memory guard
â”‚   â”œ-- demo/
â”‚   â”‚   â”œ-- conversations.ts         # localStorage conversation layer
â”‚   â”‚   â”œ-- demo-user.ts
â”‚   â”‚   â”œ-- demo-progress.ts
â”‚   â”‚   â””-- demo-content.ts          # Mistakes, do-not-miss, known pearls
â”‚   â”œ-- supabase/                    # Phase 0C+ only
â”‚   â”œ-- rag/                         # Phase 0C+ only
â”‚   â”œ-- scoring/
â”‚   â”œ-- analytics/
â”‚   â””-- utils.ts
â”‚
â”œ-- tests/                            # Vitest utility tests
â”‚   â”œ-- provider-selection.test.ts
â”‚   â”œ-- pearl-tool-safety.test.ts
â”‚   â””-- conversations.test.ts
â”‚
â”œ-- .github/workflows/ci.yml          # GitHub Actions lint/build CI
â”‚
â”œ-- content/
â”‚   â”œ-- cases/
â”‚   â”‚   â”œ-- 001-fight-bite.json
â”‚   â”‚   â”œ-- 002-mallet-finger.json
â”‚   â”‚   â””-- 003-distal-radius.json
â”‚   â”œ-- kb/                          # Draft KB markdown, not yet pgvector-wired
â”‚   â””-- pearls/seed-pearls.json
â”‚
â”œ-- prompts/
â”‚   â”œ-- tutor-chat.md                # Active Phase 0B system prompt
â”‚   â”œ-- tutor.md                     # Historical/non-streaming prompt
â”‚   â”œ-- case-unfolds.md              # Planned/deferred
â”‚   â”œ-- pimping.md                   # Planned/deferred
â”‚   â”œ-- preop.md                     # Planned/deferred
â”‚   â”œ-- debrief.md                   # Planned/deferred
â”‚   â””-- consult.md                   # Planned/deferred
â”‚
â”œ-- public/
â”œ-- scripts/
â””-- supabase/                        # Phase 0C+ migrations
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

