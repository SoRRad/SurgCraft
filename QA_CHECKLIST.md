# SurgiCraft : Handcraft QA Checklist

> Use this checklist after every Codex/Claude change before showing the prototype to faculty. The app is educational only and should never be used for real patient care.

## 1. Local setup

- [ ] `npm install` completes without dependency errors.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] App starts with `npm run dev`.
- [ ] App works with no `.env.local` file in mock/demo mode.
- [ ] App does not require Supabase, Anthropic, OpenAI, Ollama, or any paid service in demo mode.

## 2. Onboarding and routing

- [ ] Visiting `/` redirects to `/onboarding` when no demo user exists.
- [ ] Completing onboarding stores a local demo profile and redirects to `/c`.
- [ ] Visiting `/` after onboarding redirects to `/c`.
- [ ] Settings drawer can edit handle and role.
- [ ] Clearing all local data returns the user to onboarding.
- [ ] No route links to `/dashboard`.

## 3. Chat in mock mode

- [ ] `/c` loads the empty chat state with suggested prompts.
- [ ] A prompt such as “What are Kanavel signs?” streams a local response.
- [ ] A prompt such as “Walk me through a fight bite case” renders a case launcher tool result.
- [ ] A prompt such as “Common mistakes in mallet finger” renders a mistake card.
- [ ] A prompt such as “Quiz me on flexor tendon zones” starts quiz mode.
- [ ] Follow-up chips render only when useful and do not overwhelm the answer.
- [ ] Unknown topics return a safe demo-mode fallback, not invented content.

## 4. Chat persistence

- [ ] Starting a new conversation creates a local conversation record.
- [ ] Reloading `/c/[conversationId]` restores the conversation.
- [ ] Recent conversations appear in the sidebar.
- [ ] Deleting a conversation removes it from the sidebar.
- [ ] Message copy works.
- [ ] Thumbs up/down state persists locally.
- [ ] Flag state persists locally.
- [ ] Bookmarking an answer saves it to My Pearls.

## 5. Library pages

- [ ] `/case` lists the three seed cases.
- [ ] `/case/001-fight-bite` opens and reveals cards progressively.
- [ ] `/case/002-mallet-finger` opens and reveals cards progressively.
- [ ] `/case/003-distal-radius` opens and reveals cards progressively.
- [ ] Management reveal is gated until enough cards are opened, with an intentional override.
- [ ] Reasoning Autopsy appears after management when available.
- [ ] `/mistakes` renders all mistake cards.
- [ ] `/donotmiss` renders all do-not-miss cards and includes educational-only warnings.
- [ ] `/pearls` shows saved pearls or a useful empty state.
- [ ] `/about` explains scope, no PHI, content ownership, and pilot roadmap.

## 6. Safety checks

- [ ] Footer/header or page copy makes clear: educational use only, not clinical decision support.
- [ ] The chat refuses real-patient management requests.
- [ ] The chat does not ask for names, MRNs, DOBs, dates, photos with identifiers, or other PHI.
- [ ] The chat offers to convert real-patient descriptions into synthetic educational cases.
- [ ] The chat labels uncited content as needing faculty verification.
- [ ] The chat does not fabricate citations, DOIs, textbook editions, or faculty pearls.
- [ ] The `show_pearl` tool only accepts known local pearl IDs.

## 7. Live Anthropic mode, optional

Only run this section when testing paid/live mode.

- [ ] `.env.local` contains `LLM_PROVIDER=anthropic` or `NEXT_PUBLIC_APP_MODE=live`.
- [ ] `.env.local` contains `ANTHROPIC_API_KEY`.
- [ ] A billing cap is set in the provider console before testing.
- [ ] Live chat streams a response.
- [ ] Token/output caps are enforced.
- [ ] Large messages are rejected gracefully.
- [ ] Cost guard errors are understandable.
- [ ] Live mode still refuses real-patient care requests.

## 8. Mobile and accessibility

- [ ] Sidebar collapses into a hamburger drawer on mobile width.
- [ ] Chat input remains usable on mobile.
- [ ] Keyboard navigation works for primary controls.
- [ ] Focus rings are visible.
- [ ] Reduced-motion users do not see excessive animation.
- [ ] Cards, buttons, and links have accessible labels where needed.

## 9. Faculty demo readiness

- [ ] Clear browser localStorage before demo or use a clean profile.
- [ ] Demo path: onboarding → `/c` → fight bite question → launch case → mistake card → Do-Not-Miss page → My Pearls.
- [ ] Explicitly tell faculty all cases/content are synthetic and need final faculty verification.
- [ ] Do not demo with real patient data.
- [ ] Keep live LLM mode off unless specifically testing AI quality.

## 10. Known limitations to disclose

- Current persistence is local browser storage only.
- Mock mode is deterministic keyword-based content, not a true LLM.
- Anthropic is the first optional live provider, not the final Mayo-approved architecture.
- RAG, source-grounded citations, faculty review queues, and database persistence are Phase 0C.
- Content has not been formally faculty-verified unless explicitly marked otherwise.
