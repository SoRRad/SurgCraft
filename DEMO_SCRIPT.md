# ORION · Hand demo script

Use this ~6-minute path for a Phase 0B.2 faculty demo. Run in mock/demo mode unless you are intentionally testing Anthropic live mode.

## Setup (30 seconds)

- `LLM_PROVIDER=mock`, `NEXT_PUBLIC_APP_MODE=demo`, then `npm run dev`.
- Confirm no API key is required.
- Open <http://localhost:3000>.

## Walk-through (5–6 minutes)

1. **Landing.** Show the two entry paths: **Try the demo** (skip onboarding, generic resident profile — what a faculty reviewer would pick) and **Set up a learner profile** (for residents who want personalized tutor depth).
2. **Chat empty state.** Welcome line, input with `/` palette hint, "Start here" tiles, today's pearl. The sidebar carries the ORION brand and module label; the header carries the PHI pill and provider badge.
3. **Slash commands.** Type `/` in the input — the slash palette appears. Try `/case fight bite` and Tab/Enter to expand.
4. **First chat.** Ask: "How do I manage a fight bite?" Emphasize that this is educational only.
5. **Inline case launcher.** Ask: "Walk me through a fight bite case." Click the launcher to expand the case inline. Reveal cards step by step. Point out the **progress bar** and the **commit-before-management** checkpoint.
6. **Case debrief.** At end of case, scroll to the postmortem-style debrief. The point is teaching reasoning, not the final answer.
7. **Common pitfalls.** Open `/mistakes` (sidebar → Common pitfalls). Decision-time reasoning errors. Expand a card to see why the trap happens, what goes wrong, and the round-ready correction.
8. **Red flags.** Open `/donotmiss` (sidebar → Red flags). Recognition-time presentations you cannot miss at first contact. The two libraries are strictly separated; cross-links connect paired topics.
9. **Topics.** Open `/topics`. One unified index linking every topic to its case, pitfall, and red flag.
10. **Modules.** Open `/modules`. Hand is active; Bariatric, Foot & Ankle, Plastic, Pediatric, Vascular are placeholders awaiting faculty champions.
11. **Faculty review portal.** Open `/admin/review`. Renders `CONTENT_REVIEW.md` and stats — every authored claim is tracked.
12. **Save a pearl.** Bookmark an assistant answer. Open `/pearls`. Pearls are local to this browser.
13. **Flag a response.** Settings → Review flags. Flags are local in Phase 0B; not yet routed to faculty.
14. **Export / Settings.** Show export/import in Settings. Close with the keyboard shortcut panel (press `?`).

## Talking points for close

- Local demo content; no real patient data.
- Faculty verification visible at `/admin/review` and `CONTENT_REVIEW.md`.
- No PHI; not for clinical decisions.
- No leaderboards, no public ranking, no faculty-visible scores — by design at every phase.
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

## Optional 3-minute Opportunity Hub demo
1) Open Opportunity Hub 2) Filter Hand Surgery 3) Show open deadlines 4) Filter Funding/Grants 5) Save one 6) Compare two 7) Export ICS 8) Ask ORION about hand meetings/grants deadlines.

Opportunity Hub QA demo: verify local/static dataset browsing, save/compare/export, and chat prompts (/opportunities, /grants) with no fabricated opportunities.
