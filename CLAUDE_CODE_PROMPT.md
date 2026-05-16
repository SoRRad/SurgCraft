# Handcraft — Claude Code Scaffold Prompt

## How to use this

1. Create a new empty folder for your project
2. Drop **all five markdown files** from this drop into the root of that folder:
   - `SPEC.md`
   - `DESIGN_SYSTEM.md`
   - `FILE_STRUCTURE.md`
   - `SEED_CASES.md`
   - `BUILD_ORDER.md`
3. Open the folder in VS Code
4. Open Claude Code in the terminal in that folder
5. Paste the prompt below as your first message

Claude Code will read the spec files and scaffold from there. Use the follow-up prompts after for each phase.

---

## Scaffold prompt (paste this first)

```
I'm building Handcraft — an interactive learning chatbot for hand surgery at Mayo Clinic. The full specification, design system, file structure, seed cases, and build order are in the following markdown files in this directory:

- SPEC.md — product spec, modes, data model, architecture
- DESIGN_SYSTEM.md — colors, typography, components, motion, voice
- FILE_STRUCTURE.md — exact folder layout
- SEED_CASES.md — three JSON-format hand surgery cases
- BUILD_ORDER.md — phased build plan

Please read all five files first before writing any code.

For this initial scaffold, do **Week 1 only** from BUILD_ORDER.md. That means:

1. Scaffold a Next.js 14 App Router project with TypeScript and Tailwind CSS
2. Initialize shadcn/ui (set components.json, install Button, Card, Dialog, Sheet, Tabs, Input, Textarea, Slider, Switch, Badge, Progress to start)
3. Set up the folder structure described in FILE_STRUCTURE.md — create empty directories and placeholder files as needed
4. Implement globals.css with the full CSS variable design tokens from DESIGN_SYSTEM.md (colors, type scale via Tailwind extend)
5. Load Fraunces, Inter, Instrument Serif, JetBrains Mono via next/font/google
6. Build app/layout.tsx with proper font variables
7. Build the AppShell, Header, Footer components (Footer must include the disclaimer "Educational use only. Not for clinical decision-making.")
8. Build the SectionMarker component (renders "§ NN — Label" in Fraunces small caps)
9. Build a HandMascot placeholder SVG component (single-weight line, terracotta, accepts a `pose` prop with at least "open" as a stub)
10. Build the /onboarding page with the 6-question intake form from SPEC.md section 2
11. Build the /dashboard page as a static placeholder (just shows "Welcome, {handle}" + a placeholder for streak rings)
12. Set up Supabase client files (lib/supabase/client.ts and server.ts) and write the supabase/migrations/0001_init.sql file with the schema from SPEC.md section 7.2 (do NOT try to run the migration — just write it)
13. Create .env.local.example with required keys: ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
14. Write a README.md with: project description, setup instructions, env var notes, scripts

Important constraints:
- Use the warm off-white background (--bg: #FAF7F2), never pure white
- All interactive elements use --electric (#5B5CFF)
- Section markers and headlines can use --terracotta (#C0593D)
- No drop shadows on cards — use 1px borders with --rule
- Respect prefers-reduced-motion
- Everything must be keyboard-accessible

Do not implement chat, RAG, case canvas, or any LLM calls yet — those are for later weeks.

Confirm you've read the spec files and then proceed. When done, summarize what you built and what to test.
```

---

## Follow-up prompts (use after each week works)

### Week 2 prompt

```
Week 1 looks good. Now do Week 2 from BUILD_ORDER.md: Tutor mode end-to-end.

Read SPEC.md section 3.1 and prompts/ folder if I've added any prompts. Build the /chat page with streaming Anthropic chat, MessageBubble, CitationChip, ChatInput, and a stub RAG retrieval that reads from 5 hardcoded markdown files in content/kb/ (you create them — flexor tendon zones, extensor compartments, scaphoid anatomy, Kanavel signs, distal radius approach overview). Add a flag button on every assistant message that posts to /api/flag.

System prompt for tutor mode must:
- Adjust depth to user role (M3 → conceptual; PGY-4 → operative-detail)
- Cite KB sources inline as [source-id]
- Use "I'm not sure based on what I have — want me to flag this for faculty?" when retrieval is weak
- Never give clinical advice for real patients; redirect to "for a real patient, this needs a hand surgeon"
```

### Week 3 prompt

```
Week 2 works. Now Week 3 from BUILD_ORDER.md: Case canvas with the 3 seed cases from SEED_CASES.md.

Save the 3 seed cases as content/cases/001-fight-bite.json, 002-mallet-finger.json, 003-distal-radius.json. Build CaseCanvas (two-pane: left dialogue, right RunningSummary), CaseCard (revealable), CaseStem (Instrument Serif, large). Build /api/case/start and /api/case/reveal — the reveal endpoint uses Claude to semantically match the user query against each card's unlockKeywords to decide what to surface. Management card gated by ≥3 cards uncovered OR explicit ask. At case end, fire a pearl unlock animation.
```

### Week 4 prompt

```
Now Week 4: real RAG + interaction polish.

Migrate to pgvector. Write scripts/ingest-kb.ts that walks content/kb/, embeds each chunk via OpenAI text-embedding-3-small (or Voyage if preferred), and upserts to Supabase. Replace the stub retrieval in /api/chat with real pgvector top-k. Build ConfidenceSlider with calibration tracking (lib/scoring/calibration.ts — Brier score per topic). Build StreakRings on dashboard with the close logic from SPEC. Build /pearls page.
```

### Week 5 prompt

```
Now Week 5: Pimping + Pre-op modes, plus AnatomySVG.

Build ModeSwitcher in Header. Build /pimping with topic + intensity selector, PimpingTimer (opt-in), and Claude-graded responses with a debrief screen. Build /preop as a wizard. Build AnatomySVG for the dorsal hand — start with these structures clickable: EPL, EPB, APL, EDC slips to index/long/ring/small, EIP, EDM, ECRL, ECRB, ECU, Lister's tubercle, radial styloid, ulnar styloid. Each has a label + 1-sentence clinical pearl on click.
```

### Week 6 prompt

```
Final week of Phase 0: admin UI + polish + demo prep.

Build /admin/flags (review queue) and /admin/kb (verify entries). Build the achievement-share image generator (returns a stylized PNG of "Completed: Mallet Finger" without scores). Pass through every page and ensure: empty states use HandMascot in varied poses, loading states exist everywhere, reduced-motion is respected, all interactive elements are keyboard-accessible, AnatomySVG has a text-list fallback. Run a final accessibility audit and write me a list of anything you couldn't fix.
```

---

## Tips for working with Claude Code on this

- **Always paste the relevant week's prompt fresh** rather than letting the model decide what's next. The week boundaries are deliberate.
- **Run the app between every week** and check the demo checkpoint before moving on.
- **When you add or edit a spec file, tell Claude Code explicitly** ("I've updated SPEC.md section 3.2 — please re-read it before continuing").
- **Push back when something feels off.** If a generated component doesn't match the playful-academic vibe, say "this looks too clinical — re-read DESIGN_SYSTEM.md section 7 and try again."
- **Don't merge what you haven't read.** Read every file Claude Code generates before committing. This is medical content; accuracy and tone matter.
- **Commit per week.** Tag commits as `phase0-week-1`, etc. Easier to roll back if a later week breaks things.
