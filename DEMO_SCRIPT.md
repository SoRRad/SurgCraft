# SurgiCraft : Handcraft Demo Script

Use this 5-minute path for a Phase 0B.2 faculty demo. Run in mock/demo mode unless you are intentionally testing Anthropic live mode.

## 5-Minute Demo Path

1. Open the app in demo/mock mode.
   - Suggested setup: `LLM_PROVIDER=mock`, `NEXT_PUBLIC_APP_MODE=demo`, then `npm run dev`.
   - Confirm no API key is required.
2. Complete onboarding as a PGY-2 or M4 using a synthetic learner profile.
3. Show the chat empty state.
   - Point out the educational-only and no-PHI warning.
   - Use the quick-start cards to show the chat-first navigation model.
4. Ask: "How do I manage a fight bite?"
   - Emphasize that this is educational only, not real patient guidance.
5. Ask: "Walk me through a fight bite case."
   - Show the inline case launcher if it appears.
6. Launch or open the fight bite case.
   - Reveal the case cards step by step.
   - Show the progress indicator and commit-before-management checkpoint.
7. Show Reasoning Autopsy.
   - Explain that the aim is to teach reasoning, not just the final answer.
8. Ask: "Common mistakes in mallet finger."
   - Show how the chat can surface high-yield error patterns.
9. Open Mistake Museum.
   - Highlight the mistake, why learners make it, and how to avoid it.
10. Open Do-Not-Miss.
   - Point out escalation language and educational scope.
11. Save a pearl, then open `/pearls`.
   - Show that saved pearls are local to this browser.
12. Flag a response, then open Settings.
   - Show local flag review and note that it is not sent to faculty yet.
13. Export local data from Settings.
   - Explain that export/import is browser-local for demo portability.
14. Close with current limitations.
   - Local demo content.
   - Needs faculty verification.
   - No PHI.
   - No real patient guidance.
   - RAG/content governance planned for Phase 0C.

## Faculty Feedback Questions

- Is the educational tone appropriate?
- Are the cases realistic?
- What high-yield hand surgery topics are missing?
- What should be faculty-verified first?
- Would this be useful for rotating learners?
- What would make you uncomfortable about resident use?
