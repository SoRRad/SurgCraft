# Phase 0B — Part 1: Cleanup + Chat-First Foundation

> **What this does:** finishes Phase 0A cleanup, refactors the app to be chat-first (chat is the homepage), installs the Vercel AI SDK with Anthropic provider, and gets a basic streaming chat working with a real LLM. No tool use yet, no rich content rendering, no conversation history — that's Part 2 and 3.

> **What to do first:** make sure your existing repo state is committed and pushed. Tag it `phase0a-final`. Then run this prompt in Claude Code.

> **API key:** you'll need an Anthropic API key for testing. Get one at console.anthropic.com. Set a $20/month spending cap on the billing dashboard *before* you start. The app will still run without a key — it falls back to the mock provider.

---

## Prompt (paste into Claude Code as a fresh message)

```
I'm starting Phase 0B for SurgiCraft : Handcraft. We're redesigning the app to be chat-first AND wiring up a real LLM. This is Part 1 of 3: cleanup + foundation.

First, read these files to understand current state:
- README.md
- package.json
- app/layout.tsx, app/page.tsx, app/dashboard/page.tsx, app/chat/page.tsx (if it exists), app/onboarding/page.tsx
- components/shell/Header.tsx, Footer.tsx, AppShell.tsx
- lib/llm/* (the mock provider layer)
- lib/demo/*
- .env.local.example

Report what you found, then proceed.

═══════════════════════════════════════════
PART 1 — Cleanup + Chat-First Foundation
═══════════════════════════════════════════

## 1.1 Finish Phase 0A cleanup

These slipped through Phase 0A:
- package.json "name" field: change from "handcraft" to "surgicraft"
- Delete the stray file `publicillustrations.gitkeep` in the repo root if it exists
- Ensure `public/illustrations/.gitkeep` exists (proper path)
- Verify the rebrand to "SurgiCraft : Handcraft" is consistent everywhere: Header, Footer, metadata, onboarding, dashboard, About, README. Fix any inconsistencies.

## 1.2 Install Vercel AI SDK + Anthropic provider

Run:
```
npm install ai @ai-sdk/anthropic @ai-sdk/react zod
```

Verify versions match latest stable (ai v6+, @ai-sdk/anthropic latest, @ai-sdk/react latest).

## 1.3 Environment configuration

Replace .env.local.example with:
```
# SurgiCraft Phase 0B
# Without an Anthropic API key, the app falls back to the mock provider.

# LLM mode: "demo" (mock) or "live" (real Anthropic)
NEXT_PUBLIC_APP_MODE=demo

# Required only if APP_MODE=live
ANTHROPIC_API_KEY=

# Optional cost guard (server-side, default $0.50)
MAX_COST_PER_SESSION_USD=0.50

# Reserved for Phase 0C+ (Supabase)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

Update README to reflect: 
- App runs without an API key (mock mode)
- Set ANTHROPIC_API_KEY and NEXT_PUBLIC_APP_MODE=live in .env.local to use real Claude
- Note Anthropic billing cap recommendation ($20/month) for development

## 1.4 Refactor the LLM provider layer

Existing structure:
- lib/llm/types.ts
- lib/llm/provider.ts (the LLMProvider interface)
- lib/llm/mock-provider.ts
- lib/llm/local-demo-engine.ts
- lib/llm/index.ts (getProvider)

Add:
- lib/llm/anthropic-provider.ts — implements LLMProvider against Vercel AI SDK + @ai-sdk/anthropic. Each method calls `streamText` or `generateText` with Claude Sonnet 4.5 (model string: `claude-sonnet-4-5`). All methods are server-only — throw a clear error if imported in a client component.
- Update lib/llm/index.ts: `getProvider()` reads `process.env.NEXT_PUBLIC_APP_MODE`. If "live" AND `process.env.ANTHROPIC_API_KEY` is set, return anthropic-provider. Otherwise return mock-provider with a console warning.
- lib/llm/cost-guard.ts — utility to track per-session token usage and cost. Uses Sonnet 4.5 pricing (~$3/M input tokens, ~$15/M output tokens). Exports `estimateCost(usage)` and `checkSessionLimit(sessionId)`. Persist usage in memory for now (Map keyed by session ID) — Phase 0C will move it to the DB.

The interface stays the same; only the implementations change. Existing pages calling `getProvider().respondToTutorQuestion()` continue to work, but in live mode they now hit Anthropic.

For Part 1, focus on `respondToTutorQuestion` only. Other methods (revealCaseCard, etc.) can stay mock for now — wire them up in Part 2.

## 1.5 The chat-first routing refactor

Major change: chat becomes the homepage.

- `app/page.tsx` → if user has completed onboarding (check localStorage demo-user), redirect to `/c` (the chat home). If not, redirect to `/onboarding`.
- `app/c/page.tsx` → new chat homepage (no specific conversation). Shows empty state with greeting and suggested prompts.
- `app/c/[conversationId]/page.tsx` → specific conversation view (created in Part 2; for now just a placeholder that loads the same chat UI).
- `app/dashboard/page.tsx` → DELETE. The dashboard is gone in chat-first. The mode launcher concept is replaced by suggested prompts + sidebar library access.
- `app/chat/page.tsx` → DELETE if it exists (the old tutor demo page). Its logic moves to `/c`.

Keep these existing pages as references (still navigable from the sidebar in Part 2):
- `app/case/page.tsx`, `app/case/[id]/page.tsx`
- `app/mistakes/page.tsx`
- `app/donotmiss/page.tsx`
- `app/about/page.tsx`
- `app/onboarding/page.tsx`

Delete:
- `app/pimping/page.tsx`, `app/preop/page.tsx`, `app/debrief/page.tsx`, `app/consult/page.tsx`, `app/pearls/page.tsx`, `app/settings/page.tsx` — these placeholder pages are obsolete in a chat-first design. The features they were placeholders for now happen *inside the chat*. (Settings will come back in Part 2 as a small drawer.)

## 1.6 Build the chat UI (basic version, Part 1 scope)

Use `useChat` from `@ai-sdk/react` for streaming.

`app/c/page.tsx` and `app/c/[conversationId]/page.tsx` share a layout. Build a single `<ChatExperience>` component used by both.

Layout requirements:
- **Empty state (no messages):**
  - Centered vertically
  - Eyebrow: "§ SurgiCraft · Handcraft"
  - Big headline in Fraunces: "What are we working on today, {handle}?" (uses demo-user handle, falls back to "doctor")
  - Sub-line in --ink-muted: "Ask a question, work through a case, or quiz yourself."
  - LARGE chat input — full width up to ~720px, multi-line auto-expand, prominent
  - Below the input: 4 suggested prompt chips (clickable, fills input):
    - "Walk me through a fight bite case"
    - "Quiz me on flexor tendon zones"
    - "Common mistakes in mallet finger"
    - "What is acute carpal tunnel syndrome?"
- **Conversation state (has messages):**
  - Messages stack from top
  - Input drops to a slim fixed bar at the bottom of the chat area
  - Subtle scroll-to-bottom button when scrolled up
  - Auto-scroll on new tokens during streaming

Mobile (< 768px):
- Single column, full-width
- Empty state input is large but fits the viewport
- Input fixed to bottom of viewport in conversation state
- Sidebar is hidden behind a hamburger menu in the Header

API route `app/api/chat/route.ts`:
- POST handler, accepts `{ messages, conversationId? }`
- Calls `getProvider().respondToTutorQuestion()` 
- For live mode: uses `streamText` with Anthropic model
- For mock mode: simulates streaming by chunking the canned response into ~20-character pieces with small delays
- System prompt loaded from `prompts/tutor-chat.md` (create this file — see 1.7)
- Returns a streaming response via `result.toDataStreamResponse()`
- Includes session token cap check from cost-guard

## 1.7 System prompt (CRITICAL — review this carefully)

Create `prompts/tutor-chat.md`. This is the single most important file in the project from a safety standpoint. Draft:

```
You are the SurgiCraft : Handcraft tutor — an educational assistant for medical students, residents, and fellows learning hand surgery. You are NOT clinical decision support and never offer advice for real patients.

## Identity and tone
- You are knowledgeable, warm, and direct — like a senior resident who reads widely.
- You adjust depth to the learner's role. Defaults: M3/M4 = conceptual, with a one-line application. PGY-2/3 = mechanism + management. PGY-4+ / Fellow = operative detail and nuance.
- You never condescend.

## Hard rules
- If the user describes a real patient or asks for advice on a specific clinical situation: respond ONLY with "I can't help with real patient care — call your senior and the hand service. I'm here for educational discussion only. If you want, I can walk through this as an educational case."
- If you don't know something or your information is dated, say so. Never invent.
- Never reproduce copyrighted material (textbook passages, journal article paragraphs, song lyrics, poems).
- Always cite a source when stating a clinical fact. Use the format [Source, Year] inline. Acceptable sources for now: Wolfe's Operative Hand Surgery, Green's Operative Hand Surgery, AAOS Clinical Practice Guidelines, ASSH position statements, peer-reviewed journals with DOI.
- If a citation isn't available for a claim, label it as "general clinical knowledge" or omit the claim.

## Response shape
For tutor-style questions, your response should usually include:
1. A short, direct explanation (2–4 sentences).
2. A "rounds one-liner" — the single sentence to say if pimped on rounds.
3. A common mistake learners make on this topic.
4. The likely attending follow-up question.
5. 1–2 inline citations.

Be concise. Med learners are time-poor.

## When to ask a clarifying question
Only one clarification at a time, and only when truly necessary. Examples that warrant one: ambiguous mechanism, missing PGY level, unclear which specific anatomy is meant. Do not ask for clarification on simple factual questions.

## What you can do
You can answer questions, walk through educational cases, quiz the learner, surface common mistakes, and discuss anatomy. In later versions of this app you'll be able to launch interactive cases and render visual content — for now, focus on text-based Socratic teaching.

## Safety reminder (every response, implicit)
This is educational only. Not for clinical decision-making.
```

This prompt should be passed as the `system` parameter on every Anthropic call.

## 1.8 Citation rendering

Inline citations in the streaming response should render as small chips. Create `components/chat/CitationChip.tsx` — a rounded badge with `--terracotta` text on `--terracotta-soft` background, 12px font, that contains the source label. On hover, shows a tooltip with the full citation. For Part 1, parse `[Source, Year]` patterns in the message text and replace them with `<CitationChip>` elements during render.

## 1.9 Onboarding stays as-is, but with one tweak

After the user submits the intake form, redirect them to `/c` (not `/dashboard`). The dashboard is gone.

## 1.10 Header changes

Header in chat-first design:
- LEFT: Hamburger icon (only visible on mobile — toggles sidebar drawer)
- LEFT-MIDDLE: small eyebrow "SurgiCraft" + larger "Handcraft" wordmark (these link to `/c`)
- CENTER: nothing (let the chat breathe)
- RIGHT: small "Demo mode" or "Live AI" badge depending on env mode, then About link

Remove the previous full navigation (Tutor, Cases, Mistakes, Do-Not-Miss links). Those move to the sidebar in Part 2.

## 1.11 Run checks

- `npm run build` must pass
- `npm run lint` must pass
- Verify the app runs in mock mode with no .env.local
- If you have an ANTHROPIC_API_KEY set in your environment, test live mode by setting NEXT_PUBLIC_APP_MODE=live — confirm streaming works

═══════════════════════════════════════════

When done, report:
1. Files changed/added/deleted
2. npm run build pass/fail
3. npm run lint pass/fail
4. The system prompt — paste it back so I can review it
5. Anything you skipped or punted, and why
6. Manual test checklist (what should I click through to verify?)

DO NOT yet build: sidebar with conversation history, conversation persistence beyond a single page load, tool use for case launching, library views, message feedback (thumbs up/down/flag), conversation title auto-generation. All of that is Part 2 and Part 3.
```
