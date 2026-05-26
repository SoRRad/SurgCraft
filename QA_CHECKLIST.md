# ORION · Hand QA Checklist

Complete this checklist before faculty demo. ORION · Hand is educational only, uses synthetic/local demo content in Phase 0B.2, and must not receive PHI.

## Demo Mode

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Remove `.env.local` or set `LLM_PROVIDER=mock` and `NEXT_PUBLIC_APP_MODE=demo`. | App does not require API keys. |
| [ ] | Run `npm install`. | Dependencies install successfully. |
| [ ] | Run `npm run dev`. | App starts locally. |
| [ ] | Open `/`. | Landing shows "Try the demo" and "Set up a learner profile" options. |
| [ ] | Click "Try the demo". | Lands directly in `/c` with a generic "Guest" profile, skipping onboarding. |
| [ ] | Click "Set up a learner profile". | Goes to onboarding form with a "Skip and try the demo" affordance at the top. |
| [ ] | Complete onboarding with a synthetic learner profile. | After submit, `/` redirects to `/c`. |
| [ ] | Confirm header provider badge + Settings provider status. | Provider shows `Mock demo`; Settings says no external AI API is used. |
| [ ] | Confirm chat empty state. | Welcome line, no-PHI line, "Start here" tiles, today's pearl card. |
| [ ] | Confirm quick-start tiles. | Tiles are keyboard reachable and send the expected prompt. |
| [ ] | Ask: "How do I manage a fight bite?" | Mock tutor streams a relevant educational answer. |
| [ ] | Ask: "Walk me through a fight bite case." | A fight-bite case launcher or case-directed answer appears. |
| [ ] | Ask: "Quiz me on flexor tendon zones." | Quiz mode starts and asks one question at a time. |
| [ ] | Ask a no-PHI challenge such as "Can I paste a real patient note?" | Tutor refuses PHI and redirects to synthetic discussion. |
| [ ] | Ask a real-patient-style prompt. | Tutor refuses clinical guidance and offers to convert it into a synthetic case. |
| [ ] | Open Common pitfalls (`/mistakes`). | Page loads. Cards are collapsed with a "Why it happens, why it matters, how to avoid" disclosure. Cross-link to paired red flag appears when relevant. |
| [ ] | Open Red flags (`/donotmiss`). | Page loads. Cards frame recognition-time presentations; escalation language is visible. Cross-link to paired pitfall appears when relevant. |
| [ ] | Open Topics (`/topics`). | Unified index with Cases / Common pitfalls / Red flags columns per topic. |
| [ ] | Open Modules (`/modules`). | Hand shows as Active; other modules show as In development with recruitment notes. |
| [ ] | Click any in-development module. | Loads `/m/[id]` placeholder with "what it will include at launch" + faculty recruitment CTA. |
| [ ] | Type `/` in chat input. | Slash palette appears with `/case`, `/quiz`, `/pearl`, `/mistake`, `/donotmiss`. Tab/Enter expand. |
| [ ] | Press `?` anywhere outside an input. | Keyboard shortcuts panel opens. Press Escape to close. |
| [ ] | Press `g` then `m` (outside an input). | Navigates to `/modules`. |
| [ ] | Empty chat shows "Today's pearl" card. | Pearl content rotates by day; attribution visible. |
| [ ] | Open Faculty review portal (`/admin/review`). | Renders `CONTENT_REVIEW.md` with stats cards. |
| [ ] | Open a case and reveal cards. | Progress updates; management stays gated; commit-before-management is visible. |
| [ ] | Save a pearl from an assistant answer. | Bookmark state turns on and `/pearls` shows the saved item. |
| [ ] | Unsave the same pearl from chat. | Bookmark state turns off; item disappears from `/pearls`. |
| [ ] | Flag a message. | Flag state turns on locally. |
| [ ] | Open Settings and review flags. | Flag appears under Review flags with local-only copy. |
| [ ] | Click a flag in Settings. | App opens the matching conversation. |
| [ ] | Export local data from Settings. | Browser downloads a JSON export. |
| [ ] | Clear conversations only from Settings. | Conversations clear; saved pearls and profile remain. |
| [ ] | Import the exported local data. | Conversations and pearls are restored. |
| [ ] | Confirm mobile sidebar opens and closes. | Hamburger opens drawer, links work, drawer closes after navigation. |
| [ ] | Resize the window to 360px wide. | Headings never overflow; no horizontal scroll appears. |

## Live Anthropic Mode

| Done | Check | Expected result |
|------|-------|-----------------|
| [ ] | Set `LLM_PROVIDER=anthropic` or `NEXT_PUBLIC_APP_MODE=live`. | Live mode is requested server-side. |
| [ ] | Set `ANTHROPIC_API_KEY`. | Key remains server-only. |
| [ ] | Run `npm run dev`. | App starts locally. |
| [ ] | Confirm header + Settings provider status. | Provider shows `Anthropic live`; Settings says Anthropic is used through the server route. |
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
| [ ] | Confirm pearls show faculty verification status. | Verified content says `Faculty verified`; unverified says `Local demo content · needs faculty verification`. |
| [ ] | Confirm no ASPS/textbook content is copied into the app. | Content is synthetic, authored locally, cited, or paraphrased. |
| [ ] | Confirm educational-only disclaimer is visible. | Disclaimer appears in About and chat/privacy surfaces. |
| [ ] | Confirm no leaderboards or public-ranking surfaces. | None exist; About says no leaderboards at any phase. |
| [ ] | Confirm faculty verification messaging. | UI states that faculty verification workflow is planned for Phase 0C. |

- [ ] Opportunity Hub: /opportunities, filters/search, save/compare, calendar export, slash commands.
