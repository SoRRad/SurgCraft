# Phase 0B Overview — Chat-First Redesign + Real LLM

## What changes from Phase 0A

| Phase 0A | Phase 0B |
|---|---|
| Dashboard with 8 mode cards | Chat is the homepage, dashboard is gone |
| Tutor mode is one page among many | Chat *is* the platform |
| Mock provider only | Real Anthropic LLM (with mock fallback) |
| Pages don't share state | Conversations persist in localStorage with sidebar list |
| Static keyword-matched answers | Streaming Claude responses with citations |
| Modes accessed via top nav | Modes invoked *by the bot* via tool use (case launch, quiz, pearl, etc.) |
| Cases / Mistakes / Do-Not-Miss as separate pages | Same content accessible via sidebar library AND surface-able inline in chat |
| Dashboard mode-launcher visual | Empty-state chat with suggested prompts, mobile-first |

## Run order

| Part | What | Verify before continuing |
|---|---|---|
| **Part 1** | Cleanup + chat foundation + basic streaming | Streaming chat works in both mock and live mode |
| **Part 2** | Sidebar + conversation history + feedback + pearls library | Multiple conversations persist, mobile drawer works |
| **Part 3** | Tool use + inline cases + quiz mode + rich content | Bot can launch cases inline; quiz mode runs |

Run each part as a separate Claude Code session. Verify with `npm run dev` + manual testing before moving on. Tag git commits as `phase0b-part-1`, `phase0b-part-2`, `phase0b-part-3`.

## Cost expectations

Phase 0B is the first phase where you'll actually pay for AI calls. Rough numbers using Claude Sonnet 4.5:

| Activity | Cost per event |
|---|---|
| Single tutor Q&A (no tool use) | ~$0.01–0.03 |
| Tutor Q&A with 1 tool call | ~$0.02–0.05 |
| Walking through a case (10 turns) | ~$0.10–0.20 |
| Quiz of 5 questions | ~$0.05–0.10 |
| Full study session (30 min, ~20 turns) | ~$0.30–0.60 |

**Hard recommendations:**
1. Set a **$20/month cap** on the Anthropic billing dashboard before you start. Better to hit a cap than a surprise bill.
2. **Never commit your API key.** `.env.local` is gitignored — verify that.
3. **Cost guard in code** — Part 1 adds a per-session cost limit (default $0.50). Adjust if needed but don't disable.

For a faculty demo (3 attendings, 30 min each, exploring the app): expect ~$3–5 total. Trivial.

For a Phase 1 pilot (20 residents, 2x/week, 3 months): expect $200–500/month depending on engagement. Worth budgeting now.

## Things that intentionally aren't in 0B

These are deferred to 0C or later:
- Real database (still localStorage)
- User accounts (still anonymous handles)
- Faculty admin UI (flag review, KB verification)
- RAG (curated knowledge base with retrieval)
- Streak rings and achievement system
- Confidence slider with calibration tracking
- Anatomy SVG (clickable hand diagram)
- Pre-op prep mode (deferred — too distinct from the chat flow)
- Multi-institution support

Don't be tempted to slip these into 0B. The faculty demo for 0B should be tight: "Look how naturally a resident can learn through conversation, with the bot driving toward cases and quizzes when useful."

## After Phase 0B: what's next

1. **Faculty demo** — show 1–2 hand surgery attendings. Get their reaction to:
   - Tone (is the bot's voice right for residents?)
   - Accuracy (did anything sound clinically wrong?)
   - Pedagogy (does the flow help learning, or just feel like a fancy chat?)
   - Pearl/case content (would they contribute their own pearls?)
2. **Pause and decide:**
   - If faculty are excited: move to Phase 0C (database, auth, admin)
   - If faculty want changes: iterate on 0B before scaling
   - If faculty are lukewarm: serious reconsideration — what would have to change?
3. **Mayo IT/compliance intro** — if not done already, schedule the 15-min meeting *now*. With a working live app to show, the conversation is much easier.

## Risk callouts for Phase 0B specifically

- **First time real money flows.** Watch the Anthropic dashboard daily for the first week.
- **First time real hallucinations possible.** Even Sonnet 4.5 occasionally invents things. The system prompt is your first line of defense — review it carefully. Test edge cases: "Tell me about Smith's modified Brunelli technique for SLAC wrist" (does it admit if it's unsure?). 
- **First time the app could give clinically wrong info.** This is why every response should be cited and the disclaimer should be loud. Faculty review the content before any resident pilot.
- **Tool use can be unpredictable.** Sometimes the model calls a tool when it shouldn't, or vice versa. Tune via the tool descriptions (these are read by the LLM as part of the prompt). Iterate.
- **Mobile is hard with streaming.** Test on a real phone, not just narrow browser. iOS Safari has occasional quirks with EventSource streams.

## Two human-side action items (still high leverage)

1. **Confirm your champion attending.** If you haven't yet, identify and reach out to 1 hand surgery attending at Mayo who could be a faculty advocate for this project. After Phase 0B is done, you want someone you can show it to within a week.
2. **Mayo IT/compliance intro meeting.** 15 minutes. Just introduce the project and yourself. Don't ask permission for anything yet. Build the relationship.

Code is the easy part of this project. The faculty buy-in and Mayo deployment path are the hard parts. Don't let the engineering distract from them.
