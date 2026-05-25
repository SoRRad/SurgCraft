# ORION · Hand Specification

> Current product spec for the Phase 0B chat-first prototype. `ROADMAP.md` is the canonical phase plan.

ORION Surgery is an interactive surgical education platform. Hand is module 01, focused on hand surgery for medical students, residents, and fellows.

The app is educational only. It must not request PHI, and must never guide care for a real patient.

---

## 1. Vision

ORION · Hand helps learners practice hand surgery reasoning through conversation. The chat can answer educational questions, launch synthetic cases, quiz the learner, surface common mistakes, and point to do-not-miss red flags. The product should feel like a thoughtful senior resident who reads widely: warm, direct, concise, and honest about uncertainty.

Hand is the first module. The platform name matters because later ORION Surgery modules can reuse the same shell, provider layer, content governance, and faculty review workflows.

**Non-goals:**
- Clinical decision support for real patients
- Intake or storage of PHI
- Replacement for textbooks, ASPS/PSEN content, faculty teaching, or attending judgment
- Public scoring or punitive learner ranking
- Use of licensed textbook content without permission

---

## 2. Users

The first-launch intake remains intentionally lightweight and browser-local in Phase 0B.

| Field | Options |
|---|---|
| Role | M3 / M4 / Intern / PGY-2 / PGY-3 / PGY-4 / PGY-5 / Fellow / Attending |
| Specialty | Plastic Surgery / Orthopaedic Surgery / Emergency Med / Other |
| Current rotation | On hand service / Not on hand service |
| Primary goal this session | Pre-round prep / Case prep / In-service prep / Casual learning / Pimping drill |
| Self-rated comfort | 1-5 across anatomy, trauma, congenital, peripheral nerve, microsurgery |
| Anonymous handle | User-chosen, stored locally in Phase 0B |

The app may use the learner profile to adjust depth, but the user can override: "treat me like an M3 today, I'm rusty."

---

## 3. Chat-First Product Model

The primary route is `/c`. Chat is the platform surface.

- `/` redirects to onboarding or `/c`
- `/c` starts a new conversation
- `/c/[conversationId]` loads a local conversation
- `ChatLayout` provides a sidebar/library on desktop and a drawer on mobile
- Conversations persist in browser `localStorage` during Phase 0B
- The old dashboard route is removed

Modes are no longer separate top-level launch cards. Instead, they can be:
- launched inside chat by tool calls
- opened from sidebar/library pages
- referenced by suggested prompt chips

---

## 4. Learning Modes

### 4.1 Tutor Chat

Default free-form educational chat. Responses should be concise, role-aware, and citation-honest. If no curated source is available, the model labels the answer as an uncited educational overview needing faculty verification.

### 4.2 Case Unfolds

Synthetic progressive cases can launch inline from chat or be opened from `/case`. Each case reveals cards progressively:

- chief complaint
- history
- exam
- imaging
- labs when relevant
- management

Management is gated until enough information is uncovered or the learner explicitly asks to reveal it. Case endings include teaching points, local pearls, references, and Reasoning Autopsy.

### 4.3 Quiz / Pimping Drill

Quiz mode launches inside chat through the `start_quiz` tool. The current Phase 0B version asks and grades short educational questions in the conversation. Dedicated simulator pages are historical/deferred.

### 4.4 Mistake Museum

Common errors are available at `/mistakes` and can be surfaced inline through `show_mistake`. Entries are local demo content and need faculty verification.

### 4.5 Do-Not-Miss

High-stakes red flags are available at `/donotmiss` and can be surfaced inline through `show_donotmiss`. Every surfaced item must repeat the educational-only escalation warning.

### 4.6 Pearls

There are two concepts:

- authored local pearls from the demo registry, surfaced by `show_pearl`
- user-saved pearls from assistant messages, stored locally at `/pearls`

The model may not fabricate pearl text or attribution. It can only call `show_pearl` with known local pearl IDs.

---

## 5. Safety and Content Honesty

Hard rules:

- No PHI. Do not ask for names, MRNs, dates of birth, addresses, images with identifiers, or other identifiers.
- If the user describes a real patient or asks for clinical guidance, refuse clinical guidance and offer to convert the scenario into a synthetic educational case.
- Cite only curated context or static local references actually available to the app.
- Do not fabricate citations, source IDs, article details, DOIs, or faculty pearls.
- Label unverified local demo content clearly.
- All cases are synthetic.

Quality controls planned for Phase 0C:

- faculty verification badges
- flagged response review
- KB verification workflow
- source-grounded RAG
- persisted audit trails for content changes

---

## 6. Engagement and Privacy

Phase 0B is local-first:

- Conversations stay in browser `localStorage`
- Saved pearls stay in browser `localStorage`
- No accounts
- No database
- No faculty-visible individual scoring

Future pilot privacy contract:

> Your individual responses are private. Faculty and program directors cannot see how you score. Aggregate anonymized data helps improve the platform.

Leaderboards, if built, must be opt-in, anonymous, cohort-scoped, and non-punitive.

---

## 7. Architecture

### 7.1 Current Stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, shadcn-style primitives
- **Chat:** `@ai-sdk/react` on the client, AI SDK streaming route on the server
- **LLM providers:** provider-agnostic layer under `lib/llm/`
- **Demo state:** browser `localStorage` under `lib/demo/`
- **Content:** static JSON cases and markdown KB drafts under `content/`
- **Database:** Supabase files retained, not wired in Phase 0B

### 7.2 Provider-Agnostic LLM Layer

Provider selection is centralized:

- `lib/llm/provider-selection.ts`
- `lib/llm/streaming-provider.ts`
- `lib/llm/index.ts`
- `lib/llm/provider.ts`
- `/api/provider-status`

Supported now:

- `mock`
- `anthropic`

Planned:

- `ollama`
- `openai`
- self-hosted or institution-hosted providers such as vLLM

`LLM_PROVIDER` is the preferred server-side selection variable. `NEXT_PUBLIC_APP_MODE=live` is supported for compatibility and currently maps to Anthropic. If a live provider lacks credentials, the app falls back to mock behavior. Header and Settings read `/api/provider-status` so the UI reflects the server-resolved provider rather than guessing from public env alone.

### 7.3 API Routes

Current important routes:

```text
/api/chat              POST streaming chat
/api/chat/title        POST conversation title generation
/api/provider-status   GET resolved provider status, no secrets
/api/case/start        POST legacy/demo case start
/api/case/reveal       POST legacy/demo reveal helper
/api/flag              POST flag placeholder
/api/pearl/unlock      POST pearl unlock placeholder
/api/rag/search        POST stub until Phase 0C
```

The chat route validates request shape with zod, caps newest user input length, passes only the last 20 messages to the model, enforces development-only cost guards, and sets `maxOutputTokens`.

### 7.4 Phase 0C Data Model

Supabase/Postgres is Phase 0C+, not required for Phase 0B. The eventual tables remain:

```text
users
sessions
messages
cases
case_attempts
pearls
pearl_unlocks
kb_chunks
streaks
flags
leaderboards
```

`kb_chunks` will use pgvector for retrieval-grounded responses.

---

## 8. Build Phases

See `ROADMAP.md` for the canonical phase plan.

Short form:

- **0A complete:** local demo, static content, mock provider
- **0B active:** chat-first streaming prototype, local conversations, tools, Anthropic first live provider
- **0B.1 complete:** stabilization, tests, CI, QA, docs
- **0B.2 planned:** faculty demo polish
- **0B.3 planned:** optional Ollama/local provider
- **0B.4 planned:** optional OpenAI provider
- **0C planned:** Supabase, RAG, content governance, faculty workflows
- **Phase 1 future:** Mayo pilot readiness

---

## 9. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Real-patient use | Prominent disclaimers, no-PHI prompt rules, refusal templates |
| Hallucinated citations | Cite only curated/static sources; label uncited overviews |
| Fabricated pearls | Tool accepts known `pearl_id` only |
| Tool overreach | Narrow schemas and null-safe UI renderers |
| Cost spikes | Development cost guard now; DB-backed guard in Phase 0C |
| Faculty trust | Verification labels and faculty review workflow before pilot |
| IP exposure | Link out to licensed material; paraphrase and cite |

---

## 10. Open Questions

- Which provider should be used for Mayo-approved deployment?
- How much local/offline capability is needed for demos?
- What is the minimum faculty admin workflow for Phase 0C?
- Which hand surgery attending will own content verification?
- How much analytics is acceptable for the pilot?
