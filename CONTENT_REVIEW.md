# Content review tracker — ORION Surgery (Hand module)

> **Status: pre-faculty review.** Every clinical claim in this repo was authored for the ORION Surgery Phase 0B.2 prototype and **has not been signed off by a hand surgery faculty member.** This file is the source of truth for what needs to be reviewed before any pilot use. It is rendered in-app at `/admin/review`.
>
> When a reviewer signs off on an entry, fill the **Reviewer**, **Date**, and **Status** columns. Statuses: `pending`, `approved`, `approved-with-edits`, `rejected`.

---

## How to use this document

1. **Faculty reviewer:** read each item linked below, mark status, leave brief notes if anything changes.
2. **Maintainer:** when an entry is `approved` or `approved-with-edits`, flip the corresponding `verified` field where applicable (e.g., `verified: true` in case JSONs and the pearls registry) and link the commit.
3. **Pilot gate:** no piece of content reaches a resident until its row here reads `approved` or `approved-with-edits`.

---

## A. Seed cases (`content/cases/*.json`)

| # | File | Title | Mechanism / focus | Reviewer | Date | Status |
|---|---|---|---|---|---|---|
| A1 | `content/cases/001-fight-bite.json` | The bar fight | Clenched-fist injury, MCP joint, Eikenella, OR washout | — | — | pending |
| A2 | `content/cases/002-mallet-finger.json` | The basketball drop | DIP terminal extensor avulsion, splinting protocol | — | — | pending |
| A3 | `content/cases/003-distal-radius.json` | FOOSH on the ice | Extra-articular distal radius, acute median nerve | — | — | pending |

## B. Mistake Museum — decision-time errors (`lib/demo/demo-content.ts` → `MISTAKE_MUSEUM`)

| # | ID | Mistake | Linked Do-Not-Miss | Reviewer | Date | Status |
|---|---|---|---|---|---|---|
| B1 | `fight-bite-closed` | Closing a fight bite primarily | `fight-bite-joint` | — | — | pending |
| B2 | `pip-splinted` | Immobilizing the PIP in mallet finger | — | — | — | pending |
| B3 | `median-nerve-watched` | Watching persistent median nerve symptoms after distal radius reduction | `acute-cts-distal-radius` | — | — | pending |
| B4 | `tenosynovitis-cellulitis` | Treating pyogenic flexor tenosynovitis with oral antibiotics | `pyogenic-tenosynovitis` | — | — | pending |
| B5 | `cascade-not-checked` | Not testing the resting cascade on hand lacerations | `tendon-laceration-abnormal-cascade` | — | — | pending |
| B6 | `scaphoid-normal-xray` | Dismissing snuffbox tenderness as "wrist sprain" | `scaphoid-occult` | — | — | pending |

## C. Do-Not-Miss — recognition-time red flags (`lib/demo/demo-content.ts` → `DO_NOT_MISS`)

| # | ID | Red flag | Linked Mistake | Reviewer | Date | Status |
|---|---|---|---|---|---|---|
| C1 | `fight-bite-joint` | Fight bite / MCP joint contamination | `fight-bite-closed` | — | — | pending |
| C2 | `acute-cts-distal-radius` | Acute CTS after distal radius reduction | `median-nerve-watched` | — | — | pending |
| C3 | `pyogenic-tenosynovitis` | Pyogenic flexor tenosynovitis (Kanavel's signs) | `tenosynovitis-cellulitis` | — | — | pending |
| C4 | `compartment-syndrome` | Upper-extremity compartment syndrome | — | — | — | pending |
| C5 | `scaphoid-occult` | Occult scaphoid fracture with normal initial x-ray | `scaphoid-normal-xray` | — | — | pending |
| C6 | `dysvascular-digit` | Dysvascular digit | — | — | — | pending |
| C7 | `open-fracture` | Open fracture with under-recognized soft tissue injury | — | — | — | pending |
| C8 | `tendon-laceration-abnormal-cascade` | Tendon laceration with abnormal resting cascade | `cascade-not-checked` | — | — | pending |

## D. Knowledge-base markdown (`content/kb/`)

| # | File | Topic | Reviewer | Date | Status |
|---|---|---|---|---|---|
| D1 | `content/kb/anatomy/flexor-tendon-zones.md` | Flexor tendon zones I–V | — | — | pending |
| D2 | `content/kb/anatomy/extensor-compartments.md` | Six dorsal compartments | — | — | pending |
| D3 | `content/kb/anatomy/scaphoid-anatomy.md` | Scaphoid blood supply, Herbert classification | — | — | pending |
| D4 | `content/kb/trauma/distal-radius-approach.md` | Henry approach, fixation principles | — | — | pending |
| D5 | `content/kb/trauma/kanavel-signs.md` | Kanavel's 4 signs, organisms, OR drainage | — | — | pending |

## E. Pearls (`lib/demo/demo-content.ts` → `PEARLS`)

| # | ID | Pearl topic | Reviewer | Date | Status |
|---|---|---|---|---|---|
| E1 | `fight-bite-mcp` | Dorsal MCP wound = fight bite until proven otherwise | — | — | pending |
| E2 | `eikenella` | Eikenella resistance, ampicillin-sulbactam | — | — | pending |
| E3 | `mallet-flex-resets-clock` | DIP flex during splinting resets the clock | — | — | pending |
| E4 | `mallet-leave-pip` | Splint DIP only, leave PIP free | — | — | pending |
| E5 | `acute-cts-distal-radius` | Persistent median nerve symptoms = urgent CTR | — | — | pending |
| E6 | `distal-radius-not-just-a-wrist-fracture` | Sentinel-event framing for osteoporosis workup | — | — | pending |
| E7 | `mayo-distal-radius-elderly` | Mayo Clinic Proceedings: shared decision in elderly DRF | — | — | pending — Mayo public cite |
| E8 | `mayo-fragility-fracture` | Mayo Clinic osteoporosis program / fragility-fracture framing | — | — | pending — Mayo public cite |

## F. Tutor system prompt (`prompts/tutor-chat.md`)

| # | Section | Reviewer | Date | Status |
|---|---|---|---|---|
| F1 | Hard rules (real-patient redirect, no-PHI, cite-or-omit) | — | — | pending |
| F2 | Response shape (rounds one-liner, common mistake, attending follow-up) | — | — | pending |
| F3 | Topics in scope (Phase 0B Hand module) | — | — | pending |
| F4 | Tool guidance (when to call which tool) | — | — | pending |

## G. Sources cited

These are the only sources currently referenced. Anything cited should be summarized / paraphrased, never reproduced verbatim, per the content ownership policy in `/about`.

- Wolfe et al., *Green's Operative Hand Surgery* — chapters on hand infections, extensor tendon injuries, distal radius
- AAOS Clinical Practice Guideline on Distal Radius Fractures
- AAOS Clinical Practice Guideline on Carpal Tunnel Syndrome
- ASSH (American Society for Surgery of the Hand) — guidelines and patient education
- Patzakis MJ et al., Management of human bite injuries of the hand
- Lin JS, Samora JB, Surgical and Nonsurgical Management of Mallet Finger
- Mayo Clinic — Osteoporosis / bone health (public clinician portal at mayoclinic.org)
- Mayo Clinic Proceedings — peer-reviewed journal, open links at mayoclinicproceedings.org
- (Various) "general clinical knowledge" — fallback label for claims without a specific source

### Mayo-internal materials (placeholders — awaiting faculty content)

| ID | Topic | Reviewer | Date | Status |
|---|---|---|---|---|
| M1 | Mayo internal: Hand-trauma intake protocol | — | — | awaiting upload |
| M2 | Mayo internal: Resident-curriculum module on PIP-joint injuries | — | — | awaiting upload |
| M3 | Mayo internal: Microsurgical replant pathway | — | — | awaiting upload |

Any future content addition that cites a textbook, journal, or guideline must add the citation to this list and confirm the use is compliant with the source's license.

---

## H. Maintenance log

| Date | Who | What changed |
|---|---|---|
| 2026-05-24 | Claude (cleanup pass) | Initial creation during the SurgiCraft polish pass. |
| 2026-05-25 | Claude (ORION rebrand) | Rebrand to ORION Surgery; added cross-link columns to Mistake / Do-Not-Miss tables; portal at /admin/review. |
| 2026-05-25 | Claude (navy refresh + library merge) | Repalette to navy + dark mode; module selector on landing; merged /topics, /mistakes, /donotmiss into /library with search; added /resources; added voice TTS/STT; added Mayo affiliation + public-Mayo pearls E7/E8 + Mayo-internal placeholder section. |

## Opportunity Hub Content
Tracks local curated/static opportunity records with reviewStatus and source trust labels; deadlines/eligibility/funding must be verified on official websites before submission.

Opportunity Hub Content
- total records: 15
- conferences/meetings: 7
- grants/funding/awards: 6
- travel scholarships/resident opportunities: 2
- needs review: 15
- placeholder count: 15
- source trust: local demo placeholder; verify official sites for deadlines, eligibility, and amounts.
