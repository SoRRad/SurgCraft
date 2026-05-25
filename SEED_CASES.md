# SurgiCraft : Handcraft - Seed Cases

Three synthetic cases for module 01. Format mirrors `content/cases/*.json`. Faculty should review/edit before pilot.

> Note: All cases are entirely fictional. No real patient data.
> Current app usage: cases can be opened from `/case` or launched inline from `/c` through the `launch_case` tool.

---

## Case 001 - Fight Bite

```json
{
  "id": "001-fight-bite",
  "title": "The bar fight",
  "difficulty": "intermediate",
  "tags": ["trauma", "infection", "metacarpal", "MCP"],
  "specialties": ["hand", "plastics", "ortho", "EM"],
  "estimatedMinutes": 12,
  "author": "Handcraft seed",
  "verified": false,
  "stem": "A 24-year-old right-hand-dominant male presents to the ED with a small wound over the dorsum of his right 5th MCP joint, sustained 'a couple nights ago' during what he reluctantly admits was a bar fight. He says it's gotten more swollen since yesterday.",
  "cards": {
    "chief_complaint": {
      "label": "Chief complaint",
      "alwaysVisible": true,
      "content": "24M with painful, swollen right 5th MCP wound, 2 days post-injury."
    },
    "history": {
      "label": "History",
      "unlockKeywords": ["history", "HPI", "when", "how", "PMH", "medications", "allergies", "vaccines"],
      "content": "Injury 2 days ago, struck another person's mouth with a closed fist. Initial wound was small (~5mm); he washed it at home and didn't seek care. Pain and swelling have progressively worsened. Now reports difficulty making a fist and pain with finger movement. No fevers reported but feels 'a little off.' PMH: none. Meds: none. Allergies: NKDA. Tetanus last >10 years ago. Social: occasional alcohol, no IVDU."
    },
    "exam": {
      "label": "Physical exam",
      "unlockKeywords": ["exam", "look", "inspect", "swelling", "ROM", "neurovascular", "tenderness"],
      "content": "Right hand: small (~5mm) wound over dorsal 5th MCP with surrounding erythema extending proximally to mid-metacarpal. Mild fluctuance. Diffuse dorsal swelling. Pain with passive flexion of 5th digit (worse than active). Tender along extensor tendon. Neurovascularly intact distally. No streaking up the forearm. Afebrile, vitals stable."
    },
    "imaging": {
      "label": "Imaging",
      "unlockKeywords": ["X-ray", "xray", "imaging", "radiograph", "CT"],
      "content": "Plain films of the right hand obtained (AP, lateral, oblique): No fracture identified. Soft tissue swelling over dorsal 5th MCP. No retained radio-opaque foreign body. No subcutaneous emphysema."
    },
    "labs": {
      "label": "Labs",
      "unlockKeywords": ["labs", "CBC", "WBC", "CRP", "ESR", "blood"],
      "content": "WBC 11.8 (mild leukocytosis), CRP 38 (elevated). Otherwise unremarkable."
    },
    "management": {
      "label": "Management",
      "isReveal": true,
      "content": "Diagnosis: Fight bite (clenched-fist injury) with likely MCP joint contamination and developing septic arthritis vs. deep space infection. Plan: Admit. IV antibiotics (e.g., ampicillin-sulbactam covering oral flora including *Eikenella corrodens*). Tetanus update. Hand surgery consult for OR washout - fight bites over the MCP are presumed to involve the joint until proven otherwise. Do NOT close primarily. Counsel patient that delayed presentation increases risk of stiffness and may require multiple washouts."
    }
  },
  "pearls": [
    {
      "id": "fight-bite-mcp",
      "text": "Any wound over the dorsal MCP in a young adult is a fight bite until proven otherwise - and the joint is involved until proven otherwise.",
      "attribution": "Hand service"
    },
    {
      "id": "eikenella",
      "text": "Eikenella corrodens is the bug you don't want to miss - and the reason ampicillin-sulbactam beats cephalexin here.",
      "attribution": "Hand service"
    }
  ],
  "teachingPoints": [
    "Mechanism dictates suspicion: clenched-fist injuries drive the tooth into the joint capsule, which then 'closes' as the hand extends, sealing the contamination inside.",
    "Plain films are still useful: look for retained tooth fragments and air in the joint.",
    "Never close a fight bite primarily.",
    "Patients underreport mechanism - the wound size lies about the depth."
  ],
  "references": [
    "Wolfe et al., Green's Operative Hand Surgery - chapter on hand infections",
    "Patzakis MJ et al., Management of human bite injuries of the hand"
  ]
}
```

---

## Case 002 - Mallet Finger

```json
{
  "id": "002-mallet-finger",
  "title": "The basketball drop",
  "difficulty": "intro",
  "tags": ["trauma", "extensor", "DIP", "tendon"],
  "specialties": ["hand", "plastics", "ortho", "EM", "sports"],
  "estimatedMinutes": 8,
  "author": "Handcraft seed",
  "verified": false,
  "stem": "A 32-year-old recreational basketball player jammed his right middle finger catching a pass three days ago. He kept playing, but now can't straighten the tip of the finger.",
  "cards": {
    "chief_complaint": {
      "label": "Chief complaint",
      "alwaysVisible": true,
      "content": "32M with droopy DIP of right long finger, 3 days post-jam injury."
    },
    "history": {
      "label": "History",
      "unlockKeywords": ["history", "HPI", "when", "how", "PMH"],
      "content": "Axial-load injury to the tip of the right long finger while catching a basketball. Immediate pain at DIP, continued playing. Noticed by evening he couldn't straighten the fingertip. Mild swelling, mild pain, mostly cosmetic complaint now. No previous injury. Right-hand dominant. Office worker."
    },
    "exam": {
      "label": "Physical exam",
      "unlockKeywords": ["exam", "look", "inspect", "ROM", "neurovascular"],
      "content": "Right long finger: DIP held in ~40 deg flexion, cannot actively extend. Passive extension intact and painless. Mild dorsal swelling over DIP. No skin compromise. Tender over dorsal DIP. Sensation intact. PIP and MCP full ROM."
    },
    "imaging": {
      "label": "Imaging",
      "unlockKeywords": ["X-ray", "xray", "imaging", "radiograph"],
      "content": "Lateral radiograph of long finger: no DIP joint subluxation. A small (~15% of articular surface) dorsal avulsion fragment is present at the base of the distal phalanx. Joint congruent."
    },
    "management": {
      "label": "Management",
      "isReveal": true,
      "content": "Diagnosis: Bony mallet finger (small avulsion, <30% articular surface, joint congruent). Plan: DIP extension splinting (full-time) for 6 weeks, then nighttime for 2 weeks. Critical: counsel patient that the DIP must NEVER flex during the splinting period - even briefly during splint changes - or the clock resets. PIP must remain free. Surgical pinning generally reserved for large fragments (>30%), joint subluxation, or open injuries. Follow up at 2 weeks to assess splint fit and skin."
    }
  },
  "pearls": [
    {
      "id": "mallet-flex-resets-clock",
      "text": "If the DIP flexes even once during splinting, the clock starts over. Tell the patient. Tell them again.",
      "attribution": "Hand service"
    },
    {
      "id": "mallet-leave-pip",
      "text": "Splint the DIP only. Leaving the PIP free preserves function and improves compliance.",
      "attribution": "Hand service"
    }
  ],
  "teachingPoints": [
    "Mallet finger = disruption of terminal extensor tendon at its insertion on the dorsal distal phalanx.",
    "Tendinous vs. bony - both treated similarly for small fragments. Surgical threshold = large fragment (>30%), joint subluxation, or chronic untreated mallet with deformity.",
    "Untreated mallet can evolve into swan-neck deformity over time as the extensor force redistributes proximally.",
    "Splint type matters less than splint discipline."
  ],
  "references": [
    "Wolfe et al., Green's Operative Hand Surgery - extensor tendon injuries",
    "Lin JS, Samora JB. Surgical and Nonsurgical Management of Mallet Finger"
  ]
}
```

---

## Case 003 - Distal Radius Fracture

```json
{
  "id": "003-distal-radius",
  "title": "FOOSH on the ice",
  "difficulty": "intermediate",
  "tags": ["trauma", "distal-radius", "fracture", "wrist"],
  "specialties": ["hand", "plastics", "ortho", "EM"],
  "estimatedMinutes": 14,
  "author": "Handcraft seed",
  "verified": false,
  "stem": "A 58-year-old woman slipped on icy steps this morning and fell onto her outstretched left hand. She presents to the ED with wrist pain and an obvious deformity.",
  "cards": {
    "chief_complaint": {
      "label": "Chief complaint",
      "alwaysVisible": true,
      "content": "58F, left wrist pain and deformity after FOOSH."
    },
    "history": {
      "label": "History",
      "unlockKeywords": ["history", "HPI", "when", "how", "PMH", "medications", "hand", "dominance"],
      "content": "Slip on ice ~2 hours ago, fell onto outstretched left hand. Immediate pain and deformity. No LOC, no other injuries. Right-hand dominant. Retired teacher, gardener. PMH: hypertension, osteopenia (last DEXA 2 years ago). Meds: amlodipine, calcium/D. No anticoagulation. NKDA. Tetanus current."
    },
    "exam": {
      "label": "Physical exam",
      "unlockKeywords": ["exam", "look", "inspect", "ROM", "neurovascular", "median"],
      "content": "Left wrist: classic 'dinner fork' deformity with dorsal angulation. Moderate swelling. Skin intact (closed). Tender along distal radius. Limited active ROM, pain-limited. Median nerve: sensation slightly diminished over volar thumb, index, long fingers compared to contralateral side; reports pins-and-needles. Radial pulse 2+. Capillary refill <2s. Compartments soft."
    },
    "imaging": {
      "label": "Imaging",
      "unlockKeywords": ["X-ray", "xray", "imaging", "radiograph", "CT"],
      "content": "PA and lateral wrist radiographs: extra-articular distal radius fracture with 25 deg dorsal angulation, 6mm radial shortening, and 18 deg radial inclination loss. No intra-articular extension. No DRUJ widening. Concurrent ulnar styloid fracture (non-displaced)."
    },
    "management": {
      "label": "Management",
      "isReveal": true,
      "content": "Diagnosis: Closed distal radius fracture (extra-articular, dorsally displaced) with acute median nerve symptoms - concerning for acute carpal tunnel syndrome. Initial plan: Hematoma block + closed reduction in ED, sugar-tong splint. Re-examine median nerve post-reduction - if symptoms resolve, observe; if persistent, urgent carpal tunnel release. Repeat radiographs to confirm acceptable alignment. Hand/ortho follow-up within 1 week. Definitive management likely operative (volar locked plate) given displacement, age, functional demand, and incomplete restoration with reduction is common in this pattern. Discuss osteoporosis workup."
    }
  },
  "pearls": [
    {
      "id": "acute-cts-distal-radius",
      "text": "Median nerve symptoms after a distal radius fracture demand re-examination *after* reduction. Persistent symptoms = urgent carpal tunnel release, not a watch-and-wait.",
      "attribution": "Hand service"
    },
    {
      "id": "distal-radius-not-just-a-wrist-fracture",
      "text": "A distal radius fracture in a 58-year-old woman is a sentinel event. Recommend DEXA and consider osteoporosis workup - the next fracture is often the hip.",
      "attribution": "Hand service"
    }
  ],
  "teachingPoints": [
    "Acceptable closed reduction parameters (general): <5 deg dorsal angulation, <5mm radial shortening, articular step-off <2mm. These tighten with younger, higher-demand patients.",
    "DRUJ instability changes the surgical plan - always assess.",
    "Median nerve symptoms before reduction may resolve with reduction; symptoms that persist or develop after reduction are an emergency.",
    "Volar locked plating is the most common contemporary fixation for displaced extra-articular fractures requiring surgery."
  ],
  "references": [
    "AAOS Clinical Practice Guideline on Distal Radius Fractures",
    "Wolfe et al., Green's Operative Hand Surgery - distal radius chapter"
  ]
}
```

---

## Format notes for adding more cases

- `unlockKeywords` are matched semantically (via embedding similarity) at runtime, not literal string match. The list seeds intent recognition.
- `isReveal: true` cards are gated until the user has either explicitly asked for management OR uncovered >=3 other cards.
- `verified: true` only after a faculty hand surgeon signs off in the admin UI.
- Faculty pearls written into cases earn the `attribution` field; `Handcraft seed` is the current placeholder author value in `content/cases/*.json` until reviewed.


