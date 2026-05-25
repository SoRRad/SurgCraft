# SurgiCraft : Handcraft QA Checklist

Use this checklist before a faculty demo. SurgiCraft : Handcraft is educational only, uses synthetic/local demo content in Phase 0B, and must not receive PHI.

## Demo Mode

1. Remove `.env.local` or set `LLM_PROVIDER=mock` and `NEXT_PUBLIC_APP_MODE=demo`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Complete onboarding with a synthetic learner profile.
5. Confirm `/` redirects to `/c` after onboarding.
6. Ask: "How do I manage a fight bite?"
7. Ask: "Walk me through a fight bite case."
8. Ask: "Quiz me on flexor tendon zones."
9. Open Mistake Museum.
10. Open Do-Not-Miss.
11. Save a pearl from an assistant answer.
12. Unsave the pearl and confirm it disappears from `/pearls`.
13. Flag a message.
14. Confirm the flagged message appears in the local review section in Settings.
15. Export local data from Settings.
16. Clear conversations only from Settings.
17. Import local data from Settings.
18. Confirm the mobile sidebar opens and closes.

## Live Anthropic Mode

1. Set `LLM_PROVIDER=anthropic` or `NEXT_PUBLIC_APP_MODE=live`.
2. Set `ANTHROPIC_API_KEY`.
3. Run `npm run dev`.
4. Confirm Header and Settings show `Anthropic live`.
5. Send a chat message and confirm streaming.
6. Ask a real-patient-style prompt and confirm the tutor refuses clinical guidance and offers a synthetic educational case.
7. Confirm the No PHI warning is visible.
8. Confirm the cost guard does not break normal use.

## Build, Lint, Test

1. Run `npm run lint`.
2. Run `npm run build`.
3. Run `npm run test`.

## Content And Safety

1. Confirm pearls show faculty verification status.
2. Confirm unverified content says `Local demo content · needs faculty verification`.
3. Confirm no ASPS/textbook content is copied into the app.
4. Confirm educational-only disclaimer is visible.
5. Confirm no runtime route links point to removed legacy paths.
