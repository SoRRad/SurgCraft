# ORION · Hand QA Checklist

Complete this checklist before faculty demo. ORION · Hand is educational only, uses synthetic/local demo content in Phase 0B.2, and must not receive PHI.

## Demo Mode

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Remove `.env.local` or set `LLM_PROVIDER=mock` and `NEXT_PUBLIC_APP_MODE=demo`. | App should not require API keys. |
| [ ] | Run `npm install`. | Dependencies install successfully. |
| [ ] | Run `npm run dev`. | App starts locally. |
| [ ] | Complete onboarding with a synthetic learner profile. | `/` redirects to `/c` after onboarding. |
| [ ] | From onboarding, click `Continue in Demo Mode`. | User is taken directly to `/c` without completing onboarding questions. |
| [ ] | Open Settings after Demo Mode entry. | Profile area shows `Demo learner / Test mode`. |
| [ ] | Send chat messages after Demo Mode entry. | Chat works without completing full onboarding. |
| [ ] | Return to onboarding and complete full setup path manually. | Normal onboarding flow still works and saves profile. |
| [ ] | Clear all local data from Settings. | App returns to onboarding and requires profile setup again. |
| [ ] | Confirm Header and Settings provider status. | Provider shows `Mock demo`; Settings says no external AI API is being used. |
| [ ] | Confirm chat empty state warning. | Educational-only and no-PHI text is visible. |
| [ ] | Confirm quick-start cards. | Cards are keyboard reachable and send the expected prompt. |
| [ ] | Ask: "How do I manage a fight bite?" | Mock tutor streams a relevant educational answer. |
| [ ] | Ask: "Walk me through a fight bite case." | A fight bite case launcher or case-directed answer appears. |
| [ ] | Ask: "Quiz me on flexor tendon zones." | Quiz mode starts and asks one question at a time. |
| [ ] | Ask a no-PHI challenge such as "Can I paste a real patient note?" | Tutor should refuse PHI and redirect to synthetic educational discussion. |
| [ ] | Ask a real-patient-style prompt. | Tutor should refuse clinical guidance and offer to convert it into a synthetic educational case. |
| [ ] | Open Mistake Museum. | Page loads. Cards are collapsed by default with a "Show why it happens..." disclosure. Each card frames a decision-time cognitive error. Cross-link to paired Do-Not-Miss entry appears when relevant. |
| [ ] | Open Do-Not-Miss. | Page loads. Cards frame recognition-time red flags, escalation language is visible. Cross-link to paired Mistake entry appears when relevant. |
| [ ] | Open Topic index (`/topics`). | One unified index with Cases / Decision mistakes / Do-Not-Miss columns per topic. |
| [ ] | Open Rapid Q&A (`/rapid`). | Topic + intensity selection works and feedback card renders after answer check. |
| [ ] | Click "New conversation" in the sidebar after an active chat. | App routes to `/c` and clears prior messages in the composer view. |
| [ ] | Open invalid case route (`/case/invalid-case`). | Graceful "Case not found" state appears with Back to cases/chat actions. |
| [ ] | Type `/` in chat input. | Slash palette appears with /case, /quiz, /pearl, /mistake, /donotmiss. Tab/Enter expand the command. |
| [ ] | Press `?` anywhere outside an input. | Keyboard shortcuts panel opens. Press Escape to close. |
| [ ] | Empty chat shows "Today's pearl" card. | Pearl content rotates by day; attribution visible. |
| [ ] | Open a case and reveal cards. | Progress updates, management stays gated, and commit-before-management is visible before management reveal. |
| [ ] | Save a pearl from an assistant answer. | Bookmark state turns on and `/pearls` shows the saved item. |
| [ ] | Unsave the same pearl from chat. | Bookmark state turns off and the item disappears from `/pearls`. |
| [ ] | Remove a pearl from `/pearls`. | Pearl can still be removed from the pearls page. |
| [ ] | Flag a message. | Flag state turns on locally. |
| [ ] | Open Settings and review flags. | Flag appears under Review flags with local-only copy. |
| [ ] | Click a flag in Settings. | App opens the matching conversation. |
| [ ] | Export local data from Settings. | Browser downloads a ORION local JSON export. |
| [ ] | Clear conversations only from Settings. | Conversations clear, saved pearls and profile remain. |
| [ ] | Import the exported local data. | Conversations and pearls are restored. |
| [ ] | Confirm mobile sidebar opens and closes. | Hamburger opens navigation, links work, drawer closes after navigation. |

## Live Anthropic Mode

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Set `LLM_PROVIDER=anthropic` or `NEXT_PUBLIC_APP_MODE=live`. | Live mode is requested server-side. |
| [ ] | Set `ANTHROPIC_API_KEY`. | Key remains server-only. |
| [ ] | Run `npm run dev`. | App starts locally. |
| [ ] | Confirm Header and Settings provider status. | Provider shows `Anthropic live`; Settings says Anthropic is used through the server route. |
| [ ] | Send a chat message. | Response streams from the live provider. |
| [ ] | Ask a real-patient-style prompt. | Tutor refuses clinical guidance and offers a synthetic-case redirect. |
| [ ] | Confirm the no-PHI warning is visible. | Warning appears in empty state, input area, Settings, or privacy banner. |
| [ ] | Send a normal educational prompt. | Cost guard does not block normal use. |

## Build, Lint, Test

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Run `npm run lint`. | Command passes. |
| [ ] | Run `npm run test`. | Vitest suite passes. |
| [ ] | Run `npm run build`. | Production build passes in mock/demo mode. |

## Content And Safety

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Confirm pearls show faculty verification status. | Verified content says `Faculty verified`; unverified content says `Local demo content | needs faculty verification`. |
| [ ] | Confirm no ASPS/textbook content is copied into the app. | Content is synthetic, authored locally, cited, or paraphrased. |
| [ ] | Confirm educational-only disclaimer is visible. | Disclaimer appears in About and chat/privacy surfaces. |
| [ ] | Confirm no runtime route links point to removed legacy paths. | No `/dashboard` links are present. |
| [ ] | Confirm faculty verification messaging. | UI states that faculty verification workflow is planned for Phase 0C. |
