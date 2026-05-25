# Product

## Register

product

## Users

Medical students (M3/M4), surgical interns, and surgery residents (PGY-1 through fellow) rotating through hand surgery at a Mayo-affiliated program. They open ORION between cases, before rounds, late at night studying for in-service exams, or for ten quiet minutes between consults. They are time-poor, image-rich learners who already use Up-To-Date, OrthoBullets, and PSEN; they want the next layer up — a tutor that reasons with them, not a wiki to scroll.

Faculty (hand surgery attendings) are a secondary user. They drop in to spot-check content for accuracy, approve seed cases, and flag anything misleading. They never see a learner's individual scores.

## Product Purpose

ORION is an educational chatbot and case-reasoning platform for hand surgery training. A learner asks a question, walks through a synthetic case, takes a focused quiz, or reviews common reasoning errors and red-flag presentations. Everything is authored or paraphrased by the team; nothing comes from a licensed textbook; no real patient data ever enters the system.

Success looks like a resident saying "I felt sharper on rounds because I rehearsed this case last night," and a faculty member saying "the content is right and the tone is right." The Hand module is the live pilot; Bariatric, Foot & Ankle, Plastic, Pediatric, and Vascular modules are placeholders awaiting faculty champions.

## Brand Personality

Three words: **academic**, **calm**, **earnest**. The voice is the senior resident who explains things clearly without showing off. Quiet typography in a navy and blue-grey palette that aligns with the Mayo Clinic visual language. Confident but never flashy. No gamified streaks, no leaderboards, no badges. The interface should feel closer to a well-typeset academic journal than to a SaaS dashboard or a study app.

Emotional goals: confidence (the learner trusts the answer), respect (the tool treats them as an adult professional), and focus (one thing at a time, no clutter).

## Affiliation

ORION Surgery is being developed for a Mayo Clinic pilot. The Mayo Clinic name and shield are used with permission on the landing page and About surface. Public Mayo Clinic resources (mayoclinic.org clinician portal, Mayo Clinic Proceedings) are cited and linked under Resources; faculty-curated internal materials are added only after explicit sign-off and tracked in `CONTENT_REVIEW.md`.

## Anti-references

- **Duolingo, Quizlet, Anki:** gamified streaks, mascots cheering, score-shaming. We rejected the streak rings and leaderboards explicitly.
- **Generic SaaS dashboards** with the hero-metric template (big number, small label, gradient accent). No KPI cards on the chat home.
- **Crypto/AI maximalist landing pages** with neon, gradients, glassmorphism. Reads as untrustworthy in a clinical context.
- **Healthcare templates** with stock teal/navy and rounded photos of smiling clinicians.
- **Markdown-on-grey developer aesthetics** (cold mono, low contrast, raw code blocks). Too engineering, not enough humanities.

## Design Principles

1. **One thing at a time.** Empty states give the learner a single question to answer; case canvases reveal one card at a time; quizzes ask one question. No dashboards.
2. **Plain academic language.** Labels are what a textbook chapter would call them. Avoid invented internal terms like "Mistake Museum" or "Reasoning Autopsy" in user-facing surfaces; reserve them for code identifiers if at all.
3. **Educational only, visibly.** The privacy-and-PHI contract is never more than a glance away. The provider mode (mock vs live) is always honestly labelled.
4. **No punitive scoring.** Personal progress is local and private. No public ranking, no faculty-visible scores, no leaderboards in any form.
5. **Faculty-verifiable.** Every authored claim is reviewable. Content lives in `/content` and `/prompts` so faculty can edit without code.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Specific commitments:

- All interactive targets reach 44×44 CSS pixels on touch.
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI affordances.
- Full keyboard nav with visible `:focus-visible` rings (electric blue, 2px offset).
- `prefers-reduced-motion` respected — transitions collapse to 0.01ms.
- Screen-reader-friendly: every icon button has `aria-label`; status changes use `aria-live`.
- Typography scales fluidly from 360px to 1440px without overflow; no fixed pixel fonts in headings.
