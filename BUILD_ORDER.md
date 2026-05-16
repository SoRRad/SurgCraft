# Handcraft — Build Order

Suggested sequence for Phase 0 (prototype, ~6 weeks). Each block is ~3–5 days for one person working part-time, faster if full-time.

---

## Week 1 — Foundation

**Goal:** scaffold runs locally, design tokens visible, intake form works.

- [ ] Scaffold Next.js + TS + Tailwind + shadcn/ui
- [ ] Set up Supabase project; run migrations `0001_init.sql`
- [ ] Load fonts (Fraunces, Inter, Instrument Serif, JetBrains Mono)
- [ ] Implement CSS variables from DESIGN_SYSTEM.md in `globals.css`
- [ ] Build `<AppShell>`, `<Header>`, `<Footer>` with educational-use disclaimer
- [ ] Build `<SectionMarker>`, `<HandMascot>` (placeholder SVG OK)
- [ ] Intake form at `/onboarding` → saves to `users` table
- [ ] Anonymous handle generator
- [ ] Privacy contract modal (must be acknowledged before first session)

**Demo checkpoint:** open app, complete onboarding, land on empty dashboard.

---

## Week 2 — Tutor mode (Q&A) end-to-end

**Goal:** user can ask hand surgery questions and get cited answers.

- [ ] Anthropic SDK setup (`lib/anthropic/client.ts`)
- [ ] System prompt for tutor mode (`prompts/tutor.md`) — emphasizes role-awareness, citations, "I'm not sure" template
- [ ] `/api/chat` streaming route
- [ ] `<MessageBubble>`, `<CitationChip>`, `<ChatInput>`
- [ ] Chat UI at `/chat` with streaming
- [ ] Basic RAG: hardcode 5–10 KB markdown files for now, naive top-k retrieval (can defer pgvector embedding to week 3)
- [ ] Flag button on every assistant message → writes to `flags` table

**Demo checkpoint:** ask "what are the flexor tendon zones?" → get a cited answer.

---

## Week 3 — Case canvas (the showpiece)

**Goal:** all 3 seed cases playable with progressive card reveal.

- [ ] Load `content/cases/*.json` (start with the 3 seed cases)
- [ ] `<CaseCanvas>`, `<CaseCard>`, `<CaseStem>` (Instrument Serif)
- [ ] `<RunningSummary>` right-rail
- [ ] `/api/case/start` and `/api/case/reveal` — bot uses Claude to interpret user query, match against `unlockKeywords` semantically, decide which card to reveal
- [ ] Card reveal animations (slide-up 12px + fade)
- [ ] Final management card gated by ≥3 cards uncovered OR explicit ask
- [ ] Pearls awarded at case end → `<PearlCard>` modal with terracotta glow

**Demo checkpoint:** play all 3 cases start to finish, pearls unlock, summary builds.

---

## Week 4 — Interaction polish + RAG

**Goal:** real RAG pipeline; 3 of the 8 UI features feel finished.

- [ ] pgvector migration; `scripts/ingest-kb.ts`; ingest seed KB
- [ ] Swap `/api/rag/search` to real pgvector retrieval
- [ ] `<ConfidenceSlider>` — pre-answer commit, calibration tracking math in `lib/scoring/calibration.ts`
- [ ] `<PearlCard>` + `<PearlGrid>` at `/pearls`
- [ ] `<StreakRings>` on dashboard with 3-ring close logic
- [ ] Wire ring updates on session end

**Demo checkpoint:** confidence sliders feel good; pearls collectible; streak rings close satisfyingly.

---

## Week 5 — Pimping + Pre-op

**Goal:** two more modes online. Three UI features ship in this week.

- [ ] `<ModeSwitcher>` in header
- [ ] Pimping at `/pimping`:
  - Topic + intensity selector
  - System prompt (`prompts/pimping.md`)
  - `<PimpingTimer>` (off by default, opt-in toggle)
  - Response grading via Claude (`lib/scoring/pimping.ts`)
  - Debrief screen with "the right way to answer"
- [ ] Pre-op prep at `/preop`:
  - Procedure + attending + level inputs
  - Single LLM call returns structured prep doc
  - Markdown renderer for output
- [ ] `<AnatomySVG>` (hand dorsal view, ~15 structures clickable) — surfaces in tutor + pre-op responses

**Demo checkpoint:** all four modes playable; anatomy SVG works on dorsum.

---

## Week 6 — Faculty admin, polish, demo prep

**Goal:** faculty can review flagged content; everything looks finished.

- [ ] Admin at `/admin`:
  - `/admin/flags` — review queue, mark resolved
  - `/admin/kb` — view KB entries, mark `verified`
- [ ] Achievement-share image generator (no scores, just completion)
- [ ] Empty states with hand mascot variations
- [ ] Reduced-motion respect
- [ ] Accessibility pass: keyboard nav, focus rings, ARIA on anatomy SVG
- [ ] Loading states everywhere
- [ ] Faculty demo deck

**Demo checkpoint:** show to 1–2 hand attendings, gather feedback.

---

## Deferred to Phase 1

- OR debrief mode
- ED consult mode
- Leaderboards (build the UI, gate behind opt-in)
- Anatomy palmar view + more structures
- Pimping intensity calibration with actual attending recordings
- Cohort goals
- Stump-the-bot submission flow
- PostHog instrumentation
- Mayo-sanctioned env migration

## Deferred to Phase 2

- Voice mode
- EPIC integration scoping
- Multi-institution architecture
- Second subspecialty

---

## Feature-by-feature status note

| UI feature | Phase 0 status |
|---|---|
| Case canvas | ✅ Scaffold + polished |
| Confidence slider | ✅ Scaffold + polished |
| Clickable anatomy SVG | ⚠️ Dorsum only, palmar deferred |
| Pearl cards | ✅ Scaffold + polished |
| Time-pressure pimping | ⚠️ Functional, intensity calibration deferred |
| Two-pane Socratic | ✅ Scaffold + polished |
| Streak rings | ✅ Scaffold + polished |
| Serif case stems | ✅ Scaffold + polished |
