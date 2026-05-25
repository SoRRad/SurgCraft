# ORION · Hand demo script

Use this ~6-minute path for a Phase 0B.2 faculty demo. Run in mock/demo mode unless you are intentionally testing Anthropic live mode.

## Setup (30 seconds)

- `LLM_PROVIDER=mock`, `NEXT_PUBLIC_APP_MODE=demo`, then `npm run dev`.
- Confirm no API key is required.
- Open http://localhost:3000.

## Walk-through (5–6 minutes)

1. **First-run onboarding.** Complete as a PGY-2 or M4 using a synthetic learner profile. Show the privacy contract and the "edit later in Settings" affordance.
2. **Chat empty state.** Point out:
   - The ORION wordmark and the "Hand" module chip in the header (clickable — opens the **Module switcher**).
   - The "Educational only · No PHI" pill in the header.
   - **Today's Pearl** card under the input.
   - Quick-start cards + topic-index link.
3. **Slash commands.** Type `/` in the input — the slash palette appears. Try `/case fight bite` and Tab/Enter to expand.
4. **First chat.** Ask: "How do I manage a fight bite?" Emphasize that this is educational only.
5. **Inline case launcher.** Ask: "Walk me through a fight bite case." Click the launcher to expand the case inline. Reveal cards step by step. Point out the **progress bar** and the **commit-before-management** checkpoint.
6. **Reasoning Autopsy.** At end of case, scroll to the postmortem-style debrief. The point is teaching reasoning, not the final answer.
7. **Mistake Museum.** Open `/mistakes`. The Mistake Museum is **decision-time cognitive errors only**. Click "Show details" on a card to expand. Point out the cross-link to the paired Do-Not-Miss entry.
8. **Do-Not-Miss.** Open `/donotmiss`. These are **recognition-time red flags only**. The two libraries are strictly separated by intent; cross-links connect paired topics.
9. **Topic index.** Open `/topics`. One unified index linking every topic to its case, decision mistake, and recognition red flag.
10. **Modules.** Open `/modules` (or click the chip in the header). Hand is active; Bariatric, Foot & Ankle, Plastic, Pediatric, Vascular are placeholders awaiting faculty champions. Click one to see the recruitment page.
11. **Save a pearl.** Bookmark an assistant answer. Open `/pearls` to see it. Pearls are local to this browser.
12. **Flag a response.** Open Settings → Review flags. Note that flags are local in Phase 0B and not yet routed to faculty.
13. **Export / Settings.** Show export/import in Settings. Close with the keyboard shortcut panel (press `?`).

## Talking points for close

- Local demo content; no real patient data.
- Needs faculty verification — tracked in `CONTENT_REVIEW.md` and module content labels.
- No PHI; not for clinical decisions.
- Modules are intentionally a separate concept so ORION can grow beyond Hand as faculty champions sign on.
- RAG, accounts, faculty admin UI, and persisted analytics planned for Phase 0C.

## Faculty feedback questions

- Is the educational tone appropriate?
- Are the cases realistic?
- What high-yield hand surgery topics are missing?
- What should be faculty-verified first?
- Would this be useful for rotating learners?
- What would make you uncomfortable about resident use?
- Are you (or do you know) a faculty member who could champion another module (Bariatric, Foot & Ankle, Plastic, Pediatric, Vascular)?
