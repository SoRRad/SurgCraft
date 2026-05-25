# SurgiCraft : Handcraft - Design System

> Current visual system for module 01 of SurgiCraft. The active app is chat-first: `/c` is the primary surface, with library views available from the sidebar.

Playful-academic. Editorial typography, asymmetric layouts, hand-drawn anatomical motifs. Warm, not clinical. Confident, not corporate.

---

## 1. Color palette

Off-white grounds, deep ink for text, anatomical accent, electric pop for interaction.

```css
/* Base */
--bg:           #FAF7F2;  /* warm off-white (paper) */
--bg-elevated:  #FFFFFF;  /* cards */
--ink:          #1A1A1A;  /* primary text */
--ink-muted:    #5C5C5C;  /* secondary text */
--rule:         #E8E2D7;  /* borders, dividers */

/* Anatomical accent */
--terracotta:       #C0593D;  /* primary accent - anatomy, headlines */
--terracotta-soft:  #F2D9CF;  /* backgrounds, highlights */

/* Electric pop (interaction) */
--electric:      #5B5CFF;  /* buttons, links, interactive states */
--electric-soft: #E0E0FF;

/* Semantic */
--correct:    #2E7D5B;
--correct-soft:#D4E8DC;
--warn:       #B8821A;
--warn-soft:  #F2E5C4;
--wrong:      #A8324A;
--wrong-soft: #F2D4DA;

/* Dark mode counterparts (lower priority for v1, but reserve tokens) */
--bg-dark:    #1C1815;
--ink-dark:   #F0EBE3;
```

**Usage rules:**
- Background is always `--bg`, never pure white. The warmth matters.
- Terracotta is for emphasis: section markers, key headlines, anatomical accent shapes. Never use it for "danger" - that's `--wrong`.
- Electric is for *anything the user can click or that's currently active*. Sparingly.
- Use soft layered shadows on elevated cards, drawers, and message bubbles. Keep borders quiet and use them as structure, not decoration.

---

## 2. Typography

```
Display / Headlines:  "Fraunces" (variable, opsz 9..144)  - serif, editorial, distinctive
Body / UI:            "Inter"   (variable)                 - clean grotesque
Case stems:           "Instrument Serif"                   - large, dramatic, textbook-feel
Mono / data:          "JetBrains Mono"                     - citations, IDs, code
```

**Type scale:**
| Token | Size | Line | Use |
|---|---|---|---|
| `text-display` | 64px | 1.05 | Hero, mode titles |
| `text-h1` | 40px | 1.15 | Page titles |
| `text-h2` | 28px | 1.25 | Section headers |
| `text-h3` | 20px | 1.35 | Card titles |
| `text-stem` | 24px | 1.5 | Case stems (Instrument Serif) |
| `text-body` | 16px | 1.6 | Default |
| `text-small` | 14px | 1.5 | Captions, metadata |
| `text-micro` | 12px | 1.4 | Labels, tags |

Headlines use generous tracking on Fraunces' display optical size. Body Inter at standard tracking. Case stems in Instrument Serif at `text-stem` with extra leading - they should feel like an exam question.

---

## 3. Layout

- **Grid:** 12-column, but break it on purpose. Many sections use a 7+5 split (text + sidebar), or text aligned to columns 2-8 with imagery in 9-12.
- **Margins:** Desktop = 64px outer minimum. Mobile = 20px.
- **Vertical rhythm:** 8px base unit. Section gaps = 96px desktop, 48px mobile.
- **Asymmetry:** Numbered section markers ("Section 02 - Anatomy") aligned left while content slightly indents. Pearls hang off the right margin.

---

## 4. Components (shadcn/ui base + custom)

### Standard (shadcn/ui)
`Button`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Toast`, `Tooltip`, `Slider`, `Input`, `Textarea`, `Select`, `Switch`, `Avatar`, `Badge`, `Progress`.

### Custom (SurgiCraft : Handcraft-specific)
```
<ChatLayout />           // Chat-first shell with sidebar + main area
<Sidebar />              // Conversations, library links, settings/about
<ChatExperience />       // Streaming conversation surface
<CaseCanvas />          // Two-pane case mode with progressive cards
<CaseCard />            // Single revealable card (CC, History, Exam, etc.)
<ConfidenceSlider />    // Pre-answer 0-100% with delayed reveal
<PearlCard />           // Faculty pearl with attribution
<StreakRings />         // 3-ring daily goal display
<AnatomySVG />          // Interactive labeled hand diagram
<ModeSwitcher />        // Header mode selector
<MessageBubble />       // Chat message with citation chips
<CitationChip />        // Inline source reference
<CaseLauncher />        // Inline chat tool result for case launch
<InlinePearlCard />     // Inline known local pearl tool result
<InlineMistakeCard />   // Inline mistake tool result
<DoNotMissCard />       // Inline red-flag tool result
<QuizStarter />         // Inline quiz mode starter
<FollowupChips />       // Tool-rendered quick reply chips
<PimpingTimer />        // Calming countdown bar
<RunningSummary />      // Right-rail case summary
<SectionMarker />       // "Section 02 - Anatomy" header style
<HandMascot />          // SVG mascot, varied poses
<EmptyState />          // Illustrated empty states
```

---

## 5. Motion

Subtle, considered. Things settle. No bounce.

```
Standard:  cubic-bezier(0.22, 0.61, 0.36, 1)  - 280ms
Reveal:    cubic-bezier(0.16, 1, 0.3, 1)      - 420ms (cards, pearls)
Micro:     cubic-bezier(0.4, 0, 0.2, 1)       - 160ms (hover, focus)
```

- Card reveals: slide-up 12px + fade in.
- Pearl unlocks: slight scale (0.96->1) + fade, plus a one-time terracotta glow that decays.
- Pimping timer: continuous linear, color shifts from `--electric` toward `--warn` only in the final 20%.
- Anatomy SVG hover: structures gain a 1.5px terracotta stroke with 160ms ease.
- Streak ring close: a single celebratory pulse, then quiet.

---

## 6. Voice & microcopy

- Confident, warm, never cute. The model voice should feel like a senior resident who reads.
- Achievement names have wit but are domain-grounded: "Kanavel Connoisseur", "Tendon Whisperer", "Scaphoid Scholar", "Nerve Cartographer".
- Empty states have personality. e.g. "Nothing here yet. Even a hand has to start as a limb bud."
- Error states never blame the user. "We lost that one. Try again?"
- Citations are honest: cite only curated/static sources available to the app. If no source is available, label the answer as an uncited educational overview needing faculty verification.
- Disclaimer (footer, every page): *Educational use only. Not for clinical decision-making.*

---

## 7. Illustrations & motif

- A **stylized hand line drawing** is the recurring visual motif. Different poses (open palm, OK sign, pointing, fist) for different states (loading, empty, success, error). Single-weight line, terracotta.
- **Anatomical engravings** (public-domain reference, redrawn in-house) as section dividers. Used sparingly.
- **Numbered section markers** ("Section 02") in Fraunces small caps - a recurring print-design motif.

For v1, commission/draw 4-6 hand-pose SVGs and 2 anatomical engraving-style SVGs. Until then, ship with placeholders that match the line-art aesthetic.

---

## 8. Accessibility

- Color contrast: all text >=4.5:1 against its background (verified).
- Keyboard navigation: full coverage; focus rings use `--electric` at 2px offset.
- Reduced motion: respect `prefers-reduced-motion`; replace reveals with instant fades.
- Screen readers: case cards announce as headings; confidence slider has accessible label and current value; anatomy SVG structures are labeled `role="button"` with `aria-label`.
- All interactive anatomy structures must have a text-only fallback list view.



