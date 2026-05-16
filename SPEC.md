# Handcraft — Specification

> Working name. An interactive learning chatbot for hand surgery, piloting at Mayo Clinic. Designed for medical students, residents, and fellows.

---

## 1. Vision

A playful-academic web app that meets learners where they are: a sub-I wanting to not embarrass themselves on rounds, a PGY-2 cramming for the in-service, a hand fellow prepping for a tricky case tomorrow. The bot adapts its voice and depth to the user, grounds answers in a curated knowledge base, and turns passive reading into active reasoning — Socratic dialogue, unfolding cases, calibrated confidence, and faculty pearls.

**Non-goals (explicit):**
- Not clinical decision support for real patients
- Not a substitute for textbooks, ASPS modules, or attending teaching
- Not a public ranking system that competes with in-service exams

---

## 2. Users

Single intake form on first launch (≤6 questions). All answers editable later.

| Field | Options |
|---|---|
| Role | M3 / M4 / Intern / PGY-2 / PGY-3 / PGY-4 / PGY-5 / Fellow / Attending |
| Specialty | Plastic Surgery / Orthopaedic Surgery / Emergency Med / Other |
| Current rotation | On hand service / Not on hand service |
| Primary goal *this session* | Pre-round prep / Case prep / In-service prep / Casual learning / Pimping drill |
| Self-rated comfort | 1–5 across: anatomy, trauma, congenital, peripheral nerve, microsurgery |
| Anonymous handle | User-chosen (default: auto-generated, e.g. "DistalRadius42") |

The bot uses these to set baseline depth, vocabulary, and case complexity. The user can override per-session: "treat me like an M3 today, I'm rusty."

---

## 3. Core modes

Toggle via a mode switcher in the header. Default = **Tutor**.

### 3.1 Tutor (default Q&A)
Free-form chat. User asks; bot answers with citations and offers follow-up paths ("Want a quick case to apply this?"). Adjusts depth to user role.

### 3.2 Case Unfolds
Virtual patient appears in a **case canvas** (not chat). Cards reveal progressively as user asks:
- Chief complaint card (always visible)
- History card (unlocks on history questions)
- Exam card (unlocks on exam questions)
- Imaging card (unlocks on imaging request)
- Labs card (when relevant)
- Management card (final reveal)

Each card has subtle entrance animation. Right rail shows "What we've established" — a running clinical summary.

### 3.3 Pimping Simulator
Rapid-fire questions in attending voice. User picks topic + intensity (Gentle / Standard / Pyrotechnic). Optional countdown bar per question (off by default, on by toggle). Bot scores response and gives the "right way to answer on rounds" debrief.

### 3.4 Pre-Op Prep
User inputs: procedure + attending (optional) + their level. Bot returns:
- Anatomy refresher (1 paragraph + clickable SVG)
- Approach overview
- Likely intraoperative questions
- Common pitfalls and pearls
- Linked references

### 3.5 OR Debrief
User describes a case they saw. Bot asks reflective questions ("What was the indication?", "What would you do differently if you were primary?"). Fills knowledge gaps as they emerge.

### 3.6 Consult Mode (ED-to-hand)
Bot plays the ED resident: "Hey, I've got a 24M who punched a wall, swollen 5th MCP..." User must elicit the right info, give disposition, and justify it. Bot scores on completeness.

---

## 4. UI Features (all 8 selected, v1)

| Feature | Mode applied to | Implementation note |
|---|---|---|
| Case canvas (progressive card chart) | Case Unfolds | Cards fade/slide in; chart-like layout |
| Confidence slider before reveal | All quiz-style answers | 0–100% slider; tracked for calibration |
| Clickable anatomy SVG | Anatomy questions, Pre-op | v1: hand dorsal + palmar views, ~30 labeled structures |
| Pearl cards | Tutor sidebar, Case end | Collectible; attribution to faculty |
| Time-pressure mode | Pimping Simulator | Optional; calming timer, not panic-inducing |
| Two-pane Socratic | Case Unfolds, Tutor (toggle) | Right rail: running summary |
| Streak rings | Dashboard | 3 rings: question / case / review |
| Serif case stems | Case Unfolds, Pimping | Typography choice (Fraunces or Instrument Serif) |

---

## 5. Engagement & social

**Privacy contract (shown at onboarding, persistent in settings):**
> "Your individual responses are private. Faculty and program directors cannot see how you score. Aggregate anonymized data helps us improve the platform."

- **Leaderboards:** opt-in only, anonymous handles, cohort-scoped (your program / your PGY / hand fellows nationally). No global default ranking.
- **Achievement sharing:** completion-based ("I finished the Flexor Tendon module"), not score-based. Shareable as a styled image card.
- **Streak rings:** personal only; not visible to others.
- **Cohort goals:** "Mayo hand fellows collectively completed 500 cases this month" — collective, not competitive.
- **Stump-the-bot:** users submit interesting cases they saw; faculty-reviewed ones enter the corpus with attribution.

---

## 6. Content & knowledge

### 6.1 Sources (legality-first)
| Source | Use |
|---|---|
| Faculty-written notes & pearls | ✅ Full use, attributed |
| Mayo internal hand curriculum | ✅ Full use (Mayo-only deployment) |
| ASPS course catalog | 🔗 Link out only, do not ingest |
| Textbooks (Green's, Wolfe) | 🔗 Cite, never reproduce |
| Journal articles | 🔗 Cite via DOI, paraphrase findings |
| Open guidelines (AAOS, ASSH) | ✅ Cite and summarize |
| Patient data from EPIC | ❌ Not in pilot |
| Synthetic cases written by faculty | ✅ Primary case source |

### 6.2 Retrieval architecture
RAG pipeline:
1. Knowledge base = markdown files in `/content/kb/`, embedded into Supabase pgvector
2. On user query: embed → top-k retrieval → pass as context to Claude with citation instructions
3. Bot must cite source IDs from the KB; if no relevant chunk, says so plainly and offers to escalate

### 6.3 Quality safeguards
- Every bot response has a 👍 / 👎 / "flag for faculty" button
- Flagged responses queued for hand surgery attending review in a simple admin view
- Hallucination guard: bot uses an "I'm not sure" template when retrieval confidence is low
- Faculty can mark KB entries as "verified" (subtle badge on responses citing them)

---

## 7. Architecture

### 7.1 Stack
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth & DB:** Supabase (Postgres + pgvector + Auth)
- **LLM:** Anthropic API
  - Claude Opus → case generation, Socratic dialogue, pimping
  - Claude Sonnet → routine Q&A, summarization
- **Hosting:** Vercel (prototype) → Mayo-sanctioned env before resident pilot
- **Analytics:** PostHog (self-hosted option exists if needed for compliance)

### 7.2 Data model (Postgres)
```
users           id, handle, role, pgy, specialty, on_hand_service, comfort_jsonb, created_at
sessions        id, user_id, mode, started_at, ended_at, summary_jsonb
messages        id, session_id, role, content, citations_jsonb, confidence, created_at
cases           id, title, stem, cards_jsonb, difficulty, tags, author, verified, created_at
case_attempts   id, user_id, case_id, transcript_jsonb, score, completed_at
pearls          id, content, attribution, tags, verified, created_at
pearl_unlocks   id, user_id, pearl_id, unlocked_at
kb_chunks       id, content, embedding(vector), source, source_type, verified
streaks         id, user_id, question_ring, case_ring, review_ring, date
flags           id, message_id, user_id, reason, status, reviewed_by, reviewed_at
leaderboards    id, scope (program/pgy/national), period, jsonb_rankings, opt_in_user_ids[]
```

### 7.3 API routes (Next.js)
```
/api/chat              POST  streaming chat completion (Claude)
/api/case/start        POST  generate or load a case
/api/case/reveal       POST  reveal next card based on user query
/api/pimping           POST  generate question + grade response
/api/pearl/unlock      POST  award pearl
/api/flag              POST  flag a response
/api/leaderboard       GET   cohort-scoped
/api/streak            GET/POST
```

---

## 8. Build phases

| Phase | Timeline | Scope | Gate |
|---|---|---|---|
| **0 — Prototype** | ~6 weeks | Tutor + Case Unfolds, 5 cases, basic UI, no auth | Faculty demo |
| **1 — Pilot** | 3 months | All 6 modes, all 8 UI features, leaderboards, 20 cases, RAG | 10–20 residents at Mayo |
| **2 — Expand** | TBD | Wider Mayo deployment, 2nd subspecialty groundwork | Pilot success metrics met |

**Phase 1 success metrics:**
- ≥60% enrolled use ≥2x/week voluntarily
- ≥70% rate "would recommend to co-resident"
- <5% flag rate on bot responses
- Knowledge gain (pre/post quiz) directionally positive (secondary)

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Single confident hallucination kills trust | RAG + low-confidence template + faculty flag review |
| Public scoring increases burnout | Opt-in, anonymous, cohort-scoped only |
| Faculty don't engage with content review | Recruit 1 champion attending first, lightweight review UI |
| HIPAA concerns from real-feeling cases | Synthetic-only cases, prominent "educational use only" |
| Feature bloat dilutes pilot | Phase 0 ships only Tutor + Case Unfolds |
| ASPS / textbook IP exposure | Link-out policy, never ingest licensed content |

---

## 10. Open questions to revisit later

- Voice mode (v2)
- EPIC integration (v3+, governance-heavy)
- Multi-institution version (different product, different IP rules)
- Generative anatomy diagrams vs. licensed atlas integration
- Mobile native app vs. PWA
