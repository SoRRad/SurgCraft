# Phase 0A — Part A: Rebrand + No-API Foundation

> Run this in Claude Code *first*. Verify with `npm run dev` and `npm run build` before running Part B.

---

## Context

This repo currently contains the Week 1 scaffold for "Handcraft," a hand surgery education app. We are now:

1. Rebranding to **SurgiCraft** (parent platform) with **Handcraft** as the first module.
2. Removing all external API dependencies. Phase 0A is a no-cost, fully local, faculty-demo prototype. No Anthropic, no OpenAI, no Supabase runtime, no embeddings, no RAG.
3. Establishing a provider-agnostic LLM interface that ships with a mock provider only.
4. Keeping Supabase files in the repo as future infrastructure, not active dependencies.

The full original spec is in `SPEC.md`, `DESIGN_SYSTEM.md`, and `BUILD_ORDER.md`. Read those first — but note the spec mentions Anthropic and Supabase, which are deferred to Phase 0B/0C. The design system applies as written.

---

## Prompt (paste this into Claude Code as your first message)

```
I'm pivoting this repo from a single-module "Handcraft" app to a platform-and-module structure called "SurgiCraft: Handcraft," and removing all external API dependencies for a Phase 0A no-cost local demo.

Before any changes, please:
1. Read SPEC.md, DESIGN_SYSTEM.md, FILE_STRUCTURE.md, BUILD_ORDER.md, SEED_CASES.md, and README.md
2. Survey the existing repo: list every file under app/, components/, lib/, supabase/, and the config files in root
3. Confirm what you see before making changes

Once confirmed, do Part A of the Phase 0A revision (Part B is a separate prompt I'll send after this is verified).

═══════════════════════════════════════════
PART A — Rebrand + No-API Foundation
═══════════════════════════════════════════

## A1. Rebrand to "SurgiCraft: Handcraft"

Branding hierarchy: Handcraft is the *module* (the thing users use). SurgiCraft is the *platform* (the house it lives in). In UI hierarchy, "Handcraft" is bigger; "SurgiCraft" is a small eyebrow above it. The platform name matters for stakeholders and future expansion; the module name matters for users.

- package.json: rename "handcraft" → "surgicraft"
- app/layout.tsx metadata:
  - title: "SurgiCraft: Handcraft"
  - description: "Interactive surgical education platform. First module: hand surgery for medical students, residents, and fellows. Educational use only."
- components/shell/Header.tsx:
  - Small eyebrow text "SurgiCraft" in --ink-muted, text-micro, tracking-wider, uppercase
  - Larger wordmark "Handcraft" in Fraunces, text-h2, --ink
  - To the right of the wordmark: a Badge "Handcraft module · Phase 0A"
  - Add a small Badge: "Demo mode · No AI API connected" — visible but understated
- components/shell/Footer.tsx:
  - Replace text with: "SurgiCraft: Handcraft · Mayo Clinic Pilot · Phase 0A"
  - Keep the disclaimer "Educational use only. Not for clinical decision-making." prominent
- app/onboarding/page.tsx:
  - Page title: "Welcome to SurgiCraft"
  - Subtitle: "Today's module: Handcraft — hand surgery"
- app/dashboard/page.tsx:
  - Headline: "Handcraft" (Fraunces display)
  - Eyebrow above headline: "§ SurgiCraft · Module 01"
  - A subtle status line: "Phase 0A · local faculty-demo prototype · no external AI connected"

## A2. Strip external API requirements

The app must run with `npm install && npm run dev` with zero env vars set.

- Replace .env.local.example with exactly:
```
# SurgiCraft Phase 0A — no external APIs required.
# The app runs locally using mock/local demo mode.

NEXT_PUBLIC_APP_MODE=demo

# Optional future settings — not required in Phase 0A
# ANTHROPIC_API_KEY=
# OPENAI_API_KEY=
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

- If lib/anthropic/client.ts exists, replace its contents with a single comment:
  `// Deprecated in Phase 0A. Use lib/llm provider interface instead. See PHASE_0A.md.`
- Do NOT remove lib/supabase/ — but in both client.ts and server.ts, wrap createClient in a function that returns null and logs a warning if env vars are missing, so importing these files doesn't crash the app. Add a top-of-file comment: `// NOT WIRED IN PHASE 0A. Supabase is reserved for Phase 0C+.`
- Do NOT remove supabase/migrations/ either. Leave the SQL in place.

## A3. Provider-agnostic LLM layer

Create:
- lib/llm/types.ts — shared TypeScript types for provider input/output
- lib/llm/provider.ts — exports a `LLMProvider` interface with methods:
  - `respondToTutorQuestion(input: TutorInput): Promise<TutorResponse>`
  - `revealCaseCard(input: CaseRevealInput): Promise<CaseRevealResponse>`
  - `gradePimpingAnswer(input: PimpingInput): Promise<PimpingResponse>`
  - `generatePreOpPrep(input: PreOpInput): Promise<PreOpResponse>`
  - `summarizeDebrief(input: DebriefInput): Promise<DebriefResponse>`
  Each input/output should be properly typed. Defer the actual shapes to your judgment but keep them simple.
- lib/llm/mock-provider.ts — implements LLMProvider using only static/local logic. No fetch, no SDK, no network.
- lib/llm/local-demo-engine.ts — the underlying keyword-matching + canned-content engine that mock-provider delegates to.
- lib/llm/index.ts — exports `getProvider()` which returns the mock provider in Phase 0A. (Later phases will branch on env vars.)

Do not install any LLM SDK. The mock provider must work with no external dependencies.

## A4. Demo content + progress layer

Create:
- lib/demo/demo-user.ts — getDemoUser(), saveDemoUser(user), clearDemoUser(). Uses localStorage. Type: { handle, role, pgy, specialty, onHandService, comfort, createdAt }.
- lib/demo/demo-progress.ts — getDemoProgress(), saveDemoProgress(p). Tracks completed cases, unlocked pearls, viewed mistakes, etc. Uses localStorage.
- lib/demo/demo-content.ts — re-exports the static tutor topics, mistake museum entries, and do-not-miss entries from a single source of truth. Keep authored content close to where it's used.

All localStorage access must be SSR-safe (`typeof window !== "undefined"` guards).

## A5. About page + safety/ownership statement

Create app/about/page.tsx with:
- What SurgiCraft is (platform) vs Handcraft (first module)
- Educational-use-only disclaimer, repeated and prominent
- No PHI rule
- No real patient data; synthetic cases only
- No clinical decision support
- Content ownership policy:
  - Mayo/faculty content: usable after explicit approval
  - ASPS/PSEN/course content: link-out only unless licensed
  - Textbooks (Green's, Wolfe): cite, never reproduce
  - Journal articles and open guidelines: paraphrase and cite
- Phase plan summary (0A current, 0B/0C/Phase 1 future)
- Add "About" to Header navigation

## A6. Repo hygiene

- Delete the stray file `publicillustrations.gitkeep` in the repo root if it exists
- Ensure `public/illustrations/.gitkeep` exists (proper folder structure)
- Verify `npm run build` and `npm run lint` both pass with zero errors after all changes
- Update README.md per the spec in section A7 below

## A7. README rewrite

Replace README.md entirely. Sections:
- Title: "SurgiCraft: Handcraft"
- One-line description: interactive surgical education platform; first module hand surgery; piloting at Mayo
- Educational-use disclaimer (prominent, near the top)
- "What this is" and "What this is not"
- Phase 0A status — fully local, no API keys required
- Setup (just `npm install && npm run dev`)
- Why no API in Phase 0A: avoids cost, avoids compliance complexity, easier faculty demo, lets us validate the educational experience before model integration
- Future API strategy: provider-agnostic LLM layer means we can later support Anthropic, OpenAI, Azure OpenAI, AWS Bedrock, Vertex AI, or a Mayo-approved internal endpoint, without rewriting the app
- Phase roadmap (0A, 0B, 0C, Phase 1)
- Content ownership policy (1-paragraph summary, link to /about for detail)
- Contributing notes

Do NOT describe the app as Claude-dependent or Anthropic-dependent anywhere in the README.

═══════════════════════════════════════════

When done, report back:
1. List of changed files
2. Whether `npm run build` passed
3. Whether `npm run lint` passed
4. Any TypeScript errors you couldn't resolve
5. What I should verify in the browser

Do NOT yet build the Tutor demo page, Case demo page, Mistake Museum, Do-Not-Miss, or placeholder pages. Those are Part B.
```
