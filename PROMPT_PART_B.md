# Phase 0A — Part B: Demo Pages and Features

> Run this *after* Part A is verified working. Don't paste both at once.

---

## Prompt (paste this into Claude Code after Part A is merged)

```
Part A is verified and merged. Now build Part B: the demo pages and features that make SurgiCraft: Handcraft Phase 0A a complete educational demo.

Read the existing repo first, especially:
- lib/llm/* (the new provider-agnostic layer)
- lib/demo/* (the demo content/progress helpers)
- components/shell/* (Header, Footer, AppShell)
- the new branding from Part A

Then do Part B as described below.

═══════════════════════════════════════════
PART B — Demo Pages and Features
═══════════════════════════════════════════

## B1. Tutor demo (app/chat/page.tsx)

Local-only Tutor mode. No API calls.

- User can type a hand surgery question
- The local demo engine matches keywords and returns a structured educational answer
- 5 demo topics (write these as static content in lib/llm/local-demo-engine.ts):
  1. fight bite
  2. mallet finger
  3. distal radius fracture
  4. flexor tendon zones
  5. Kanavel signs / flexor tenosynovitis

Each answer must include these labeled sections:
- Short explanation (2–3 sentences)
- Rounds one-liner (one sharp sentence)
- Common mistake (what learners typically get wrong)
- Likely attending follow-up (the pimping question that follows)
- Source label: "Local demo content · needs faculty verification"

Below each answer, render these branch buttons:
- "Teach me fast"
- "Quiz me"
- "Give me the rounds one-liner"
- "Show common mistake"
- "What would change my answer?"  ← NEW, see below

Each button triggers a local canned variation, not an API call. "What would change my answer?" reveals 3 follow-up cards per topic that show how the answer shifts under different conditions. Author these statically for all 5 topics. Examples:
- Mallet finger: "What if the fragment was >30%?" / "What if the patient was a concert pianist?" / "What if they presented 6 weeks late?"
- Fight bite: "What if the wound was on the volar side?" / "What if they were immunocompromised?" / "What if presentation was within 6 hours?"
- Each reveal shows a brief differential explanation in the same playful-academic visual style.

For unknown questions, return:
"I don't have a verified local demo answer for that yet. In Phase 0B this will be handled by a provider-agnostic LLM + curated knowledge base. For now, try: fight bite, mallet finger, distal radius fracture, flexor tendon zones, or Kanavel signs."

Prominent badge at top of page: "Demo mode · No AI API connected"

## B2. Case demo (app/case/page.tsx and app/case/[id]/page.tsx)

Use the 3 cases from SEED_CASES.md. Create JSON files at:
- content/cases/001-fight-bite.json
- content/cases/002-mallet-finger.json
- content/cases/003-distal-radius.json

(Translate the case content from SEED_CASES.md exactly. Preserve all fields: stem, cards, pearls, teachingPoints, references.)

/case/page.tsx is the index — list the 3 cases with title, difficulty, est. minutes, and tags.

/case/[id]/page.tsx is the experience. Two-pane layout:
- LEFT pane (main): case stem in serif (Instrument Serif), then revealable cards
  - Cards reveal via buttons: "Reveal History", "Reveal Exam", "Reveal Imaging", "Reveal Labs" (if present), "Reveal Management"
  - Management is gated: button disabled until ≥3 other cards revealed, with a small "Reveal management anyway" link to override
  - Reveal animation: slide-up 12px + fade in (420ms reveal easing per DESIGN_SYSTEM.md), respect prefers-reduced-motion
- RIGHT pane (sticky on desktop, collapsible on mobile): "What we know so far" — a running summary that appends a 1-sentence line each time a card is revealed
- At case end (after Management revealed), show:
  - Teaching Points (numbered list)
  - Faculty Pearls (each in a PearlCard component, attribution shown)
  - Reasoning Autopsy section (see B3)

## B3. Reasoning Autopsy (component, rendered at end of each case)

Create components/case/ReasoningAutopsy.tsx.

Renders at the end of each case with 6 fields, statically authored per case in the JSON:
1. What you should have noticed early
2. What changes management
3. What an attending may ask next
4. Best rounds one-liner
5. Common mistake
6. One pearl to remember

Update the 3 seed case JSON files to include a `reasoningAutopsy` object with these 6 fields. Author them from the existing teachingPoints and pearls — don't invent new clinical content; synthesize from what's already in the case.

Visually: section marker "§ 06 — Reasoning Autopsy" in Fraunces small caps; each field as a labeled block with the label in --terracotta, body in --ink.

## B4. Mistake Museum (app/mistakes/page.tsx)

Static educational page. Create content in lib/demo/demo-content.ts under `mistakeMuseum`.

Six mistakes, each with 5 fields:
1. Closing a fight bite primarily
2. Splinting the PIP joint in mallet finger
3. Missing median nerve symptoms after distal radius fracture
4. Treating flexor tenosynovitis like simple cellulitis
5. Forgetting to assess finger cascade after tendon injury
6. Missing scaphoid fracture when initial x-ray is normal

Fields per card:
- Mistake (the wrong thing learners do)
- Why learners make it (the cognitive trap)
- Why it matters (the clinical consequence)
- How to avoid it (the rule to remember)
- Best correction one-liner (the sentence to say on rounds when corrected)

Layout: asymmetric grid (some 1-column, some 2-column rows), section markers between, hand-mascot illustration in empty space. Each card is a 1px-bordered card on --bg-elevated. No drop shadows.

## B5. Do-Not-Miss (app/donotmiss/page.tsx)

Static educational page. Content in lib/demo/demo-content.ts under `doNotMiss`.

Eight red flags:
1. Fight bite over MCP
2. Acute carpal tunnel syndrome after distal radius fracture
3. Flexor tenosynovitis
4. Compartment syndrome
5. Scaphoid fracture with normal initial x-ray
6. Dysvascular digit
7. Open fracture
8. Tendon laceration with abnormal cascade

Fields per card:
- Diagnosis / red flag
- The clue that should raise suspicion
- Why it matters (the bad outcome if missed)
- The educational point
- **Clinical-care callout (loud, repeated, on every card):** "In a real clinical scenario, this is escalated to your senior and hand surgery — never managed from this app."

The clinical-care callout should be visually distinct: a small block at the bottom of each card with a --wrong-soft background, --wrong border-left 3px, --ink-muted text in italic. Same wording on every card. Repetition is the point.

Page header includes a one-paragraph reminder of the educational-use-only policy.

## B6. Placeholder pages for coming-soon modes

Create these as functioning routes with AppShell:
- app/pimping/page.tsx
- app/preop/page.tsx
- app/debrief/page.tsx
- app/consult/page.tsx
- app/pearls/page.tsx
- app/settings/page.tsx

Each placeholder:
- Uses AppShell, Header, Footer
- Has a serif page title ("Pimping Simulator", etc.)
- Has a section marker like "§ — Coming in Phase 0B"
- Describes what the feature will do in 2–3 sentences
- Has a Badge: "Coming soon · No AI API connected yet"
- Includes a small HandMascot illustration in a different pose per page (open, fist, ok, point — pick whatever you've stubbed)
- Has a "← Back to dashboard" link

## B7. Dashboard update

Update app/dashboard/page.tsx to be the mode launcher.

Top of page:
- Eyebrow: "§ SurgiCraft · Module 01"
- Headline: "Handcraft" (Fraunces display)
- Status line: "Phase 0A · local faculty-demo prototype · no external AI connected"

Mode cards (in a responsive grid, asymmetric — first row 2 large cards, second row 4 smaller cards, third row 2 medium):

Available now:
- Tutor Demo → /chat
- Case Unfolds Demo → /case
- Mistake Museum → /mistakes
- Do-Not-Miss Cards → /donotmiss

Coming soon (buttons disabled or labeled "Coming soon" linking to placeholder pages):
- Pimping Simulator → /pimping
- Pre-Op Prep → /preop
- OR Debrief → /debrief
- Consult Mode → /consult

For each card: title in Fraunces, 1-line description in Inter, small status badge (available / coming-soon), and an arrow indicator for available ones.

## B8. Header navigation

Add to Header.tsx, in this order:
- Dashboard (links /dashboard)
- Tutor (links /chat)
- Cases (links /case)
- Mistakes (links /mistakes)
- Do-Not-Miss (links /donotmiss)
- About (links /about)

Active route gets a 1px underline in --electric.

## B9. Final checks

- `npm run build` must pass
- `npm run lint` must pass
- All routes navigable from header and dashboard
- No 404s when clicking any link
- prefers-reduced-motion respected everywhere
- Keyboard navigation works (focus rings in --electric, 2px offset)

═══════════════════════════════════════════

When done, summarize:
1. Files created or changed
2. Build and lint pass/fail
3. Routes that work locally
4. Any content I should review for accuracy before showing faculty
5. Anything you couldn't implement and why
```
