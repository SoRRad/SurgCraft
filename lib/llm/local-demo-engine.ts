// Local demo engine — keyword matching + canned content.
// Zero network calls. Runs entirely in-process.
// This is what makes Phase 0A a no-cost demo.

// ── Knowledge bank ────────────────────────────────────────────────────────────

export type KBEntry = {
  id: string
  keywords: string[]
  shortAnswer: string
  fullAnswer: string
  citations: Array<{ id: string; label: string }>
  followUps: string[]
}

export const KB_ENTRIES: KBEntry[] = [
  {
    id: "flexor-tendon-zones",
    keywords: ["flexor", "tendon", "zone", "zones", "fds", "fdp", "no man"],
    shortAnswer: "The flexor tendons are divided into 5 zones that predict surgical complexity and prognosis.",
    fullAnswer: `The flexor tendons are divided into five zones:\n\n**Zone I** — Distal to the FDS insertion. FDP avulsion (jersey finger) is the classic injury here.\n\n**Zone II** — A1 pulley to the FDS insertion ("no man's land"). The most surgically complex zone: both FDS and FDP run within a tight tendon sheath, and pulleys must be preserved.\n\n**Zone III** — Palm. Distal edge of carpal tunnel to the A1 pulley. Better prognosis; intrinsic muscle origins here.\n\n**Zone IV** — Within the carpal tunnel. All 9 flexor tendons (4 FDS, 4 FDP, 1 FPL) in a confined space.\n\n**Zone V** — Proximal to the carpal tunnel (forearm). Multiple tendons plus nerve and vessel injuries are common here.\n\nClinical pearl: Zone II ("no man's land") has historically the worst prognosis due to pulley system complexity. Primary repair within 24 hours is ideal; delayed repair remains possible up to ~3 weeks.`,
    citations: [{ id: "flexor-tendon-zones", label: "Flexor Tendon Zones — KB" }],
    followUps: ["Want to drill zone II injuries in more detail?", "Should I run a quick pimping question on this?"],
  },
  {
    id: "extensor-compartments",
    keywords: ["extensor", "compartment", "compartments", "epl", "epb", "apl", "edc", "eip", "edm", "ecu", "ecrl", "ecrb", "lister"],
    shortAnswer: "Six dorsal compartments contain the extensor tendons at the wrist, held by the extensor retinaculum.",
    fullAnswer: `There are six dorsal wrist compartments:\n\n**1** — APL + EPB (radial styloid; de Quervain's)\n**2** — ECRL + ECRB (radial to Lister's tubercle)\n**3** — EPL (ulnar to Lister's tubercle — wraps around it as a pulley)\n**4** — EIP + EDC (central dorsum)\n**5** — EDM (ulnar; extensor to small finger)\n**6** — ECU (ulnar groove; DRUJ stabilizer)\n\n**Lister's tubercle pearl:** The EPL wraps around Lister's tubercle as a mechanical pulley. Attrition rupture of the EPL can occur weeks after a minimally displaced distal radius fracture — watch for "dropped thumb" at PIP/thumb extension.`,
    citations: [{ id: "extensor-compartments", label: "Extensor Compartments — KB" }],
    followUps: ["Want me to quiz you on which tendon is in which compartment?", "Should I explain de Quervain's in detail?"],
  },
  {
    id: "scaphoid",
    keywords: ["scaphoid", "snuffbox", "avascular", "avn", "waist", "proximal pole", "herbert", "navicular"],
    shortAnswer: "The scaphoid is the most commonly fractured carpal bone; its retrograde blood supply makes proximal pole fractures high-risk for AVN.",
    fullAnswer: `**Key anatomy:** ~80% of the scaphoid's blood supply enters distally via the dorsal ridge branches of the radial artery. The proximal pole is an end-vascular territory, making it vulnerable to avascular necrosis (AVN) after fracture.\n\n**Herbert classification (simplified):**\n- A1/A2: Stable (incomplete, tubercle or waist)\n- B2: Unstable complete waist — most common fracture\n- B3: Proximal pole — highest AVN risk\n- B4: Perilunate fracture-dislocation\n\n**Diagnosis pearls:**\n- Plain films miss ~20% of acute scaphoid fractures\n- MRI is the gold standard for occult fracture\n- Anatomical snuffbox tenderness = scaphoid until proven otherwise\n- DISI deformity on lateral x-ray → suspect ligamentous instability`,
    citations: [{ id: "scaphoid-anatomy", label: "Scaphoid Anatomy — KB" }],
    followUps: ["Want to go through the surgical indications?", "Should I quiz you on the Herbert classification?"],
  },
  {
    id: "kanavel",
    keywords: ["kanavel", "tenosynovitis", "pyogenic", "flexor sheath", "sausage", "fusiform", "digit", "infection", "sheath"],
    shortAnswer: "Kanavel's 4 signs diagnose pyogenic flexor tenosynovitis — a hand surgery emergency.",
    fullAnswer: `**Kanavel's four cardinal signs of pyogenic flexor tenosynovitis:**\n\n1. **Symmetric fusiform swelling** of the entire finger (sausage digit)\n2. **Flexed posture** of the finger at rest\n3. **Tenderness** along the flexor tendon sheath (entire volar finger)\n4. **Pain with passive extension** of the finger — the most *sensitive* sign\n\n**Why it matters:** Pyogenic tenosynovitis is a surgical emergency. Delay of 24–48 hours significantly worsens outcomes.\n\n**Common organisms:** *S. aureus* (most common), GAS, *Eikenella corrodens* (fight bite), *Pasteurella multocida* (animal bite).\n\n**Treatment:** IV antibiotics + OR irrigation of the flexor tendon sheath.\n\n**vs. Fight bite:** Fight bite → MCP joint. Pyogenic tenosynovitis → runs the length of the flexor sheath. Both are emergencies.`,
    citations: [{ id: "kanavel-signs", label: "Kanavel's Signs — KB" }],
    followUps: ["Should I explain the surgical approach to sheath irrigation?", "Want to compare this to fight bite?"],
  },
  {
    id: "fight-bite",
    keywords: ["fight", "bite", "clenched", "fist", "mcp", "eikenella", "human bite", "bar fight", "punch"],
    shortAnswer: "Any wound over the dorsal MCP in a young adult is a fight bite until proven otherwise — and the joint is involved until proven otherwise.",
    fullAnswer: `**Mechanism:** When the fist is clenched, the tooth enters the MCP joint capsule. As the hand extends, the capsule "closes," sealing contamination inside the joint.\n\n**Key bugs:** *Eikenella corrodens* is the pathogen you can't miss. It's resistant to cephalexin but sensitive to ampicillin-sulbactam.\n\n**Treatment:**\n- Admit\n- IV ampicillin-sulbactam (covers oral flora including *Eikenella*)\n- Tetanus update\n- Hand surgery consult for OR washout — fight bites over the MCP are presumed to involve the joint until proven otherwise\n- Never close primarily\n\n**Radiology:** Plain films look for retained tooth fragment and air in the joint (both are rare but important).\n\n**Pearl:** The wound size lies about the depth. A 5mm skin wound can be a through-and-through joint capsule violation.`,
    citations: [{ id: "fight-bite-mcp", label: "Fight Bite — KB" }],
    followUps: ["Want to work through the fight bite case?", "Should I explain the OR washout steps?"],
  },
  {
    id: "mallet-finger",
    keywords: ["mallet", "droop", "dip", "extensor", "terminal", "avulsion", "splint", "jersey", "drop", "baseball", "basketball"],
    shortAnswer: "Mallet finger = terminal extensor tendon disruption at the dorsal distal phalanx. Treat with DIP extension splinting full-time ×6 weeks.",
    fullAnswer: `**Definition:** Mallet finger = disruption of the terminal extensor tendon at its insertion on the dorsal distal phalanx.\n\n**Tendinous vs. bony:**\n- Tendinous: pure tendon avulsion\n- Bony: avulsion fragment off the dorsal distal phalanx\n\n**Both treated similarly for small fragments.** Surgical threshold: large fragment (>30% articular surface), joint subluxation, or chronic untreated mallet.\n\n**Treatment protocol:**\n- DIP extension splinting **full-time** × 6 weeks, then nighttime × 2 weeks\n- The PIP must remain **free**\n- Critical: if the DIP flexes even once during splinting, the clock restarts. Tell the patient. Tell them again.\n\n**Untreated:** Can evolve into swan-neck deformity as extensor force redistributes proximally through the oblique retinacular ligament.`,
    citations: [{ id: "mallet-flex-resets-clock", label: "Mallet Finger Pearls — KB" }],
    followUps: ["Want to work through the mallet finger case?", "Should I explain swan-neck deformity?"],
  },
  {
    id: "distal-radius",
    keywords: ["distal radius", "wrist", "foosh", "colles", "dinner fork", "radial", "shortening", "tilt", "druj", "median nerve", "carpal tunnel", "acute cts"],
    shortAnswer: "Distal radius fractures require systematic assessment of alignment, DRUJ stability, and median nerve status — then decide: reduce vs. operate.",
    fullAnswer: `**Acceptable closed reduction parameters (general):**\n- Dorsal angulation < 5°\n- Radial shortening < 5mm\n- Articular step-off < 2mm\n(These thresholds tighten for younger, higher-demand patients.)\n\n**Acute median nerve symptoms:** Highly important. Re-examine the median nerve after reduction:\n- Symptoms resolve → observe\n- Symptoms persist or worsen → urgent carpal tunnel release\n\n**DRUJ:** Always assess. Instability changes the surgical plan.\n\n**Definitive management:** Volar locked plating (VLP) is the most common contemporary fixation for displaced extra-articular fractures.\n\n**Sentinel event in older patients:** A distal radius fracture in a 58-year-old woman warrants DEXA and osteoporosis workup — the next fracture is often the hip.`,
    citations: [{ id: "acute-cts-distal-radius", label: "Distal Radius Pearls — KB" }],
    followUps: ["Want to work through the distal radius FOOSH case?", "Should I quiz you on reduction parameters?"],
  },
]

// ── Match engine ──────────────────────────────────────────────────────────────

export function findBestMatch(query: string): KBEntry | null {
  const q = query.toLowerCase()
  let bestEntry: KBEntry | null = null
  let bestScore = 0

  for (const entry of KB_ENTRIES) {
    const score = entry.keywords.reduce((acc, kw) => {
      return acc + (q.includes(kw.toLowerCase()) ? 1 : 0)
    }, 0)
    if (score > bestScore) {
      bestScore = score
      bestEntry = entry
    }
  }

  return bestScore > 0 ? bestEntry : null
}

// ── Role-aware depth modifier ─────────────────────────────────────────────────

export function roleDepthNote(role: string): string {
  if (["M3", "M4"].includes(role)) {
    return "\n\n*Depth: conceptual overview — ask me to go deeper on any part.*"
  }
  if (["PGY-4", "PGY-5", "Fellow"].includes(role)) {
    return "\n\n*Depth: operative detail level — happy to go further into technique or literature.*"
  }
  return ""
}

// ── Canned pimping questions ──────────────────────────────────────────────────

export type PimpingQuestion = {
  topic: string
  question: string
  keyPoints: string[]
  rightAnswer: string
}

export const PIMPING_QUESTIONS: Record<string, PimpingQuestion[]> = {
  "flexor tendon": [
    {
      topic: "Flexor tendon",
      question: "Which zone of flexor tendon injury has the worst prognosis, and why?",
      keyPoints: ["Zone II", "No man's land", "A1 pulley to FDS insertion", "Tight sheath", "Pulley preservation"],
      rightAnswer: "Zone II — 'no man's land' — because both FDS and FDP run within a tight sheath, and the complex pulley system makes primary repair technically demanding with high adhesion rates.",
    },
    {
      topic: "Flexor tendon",
      question: "A patient comes in with a laceration to the palm. You test FDS by holding the other fingers in extension and asking the patient to flex at the PIP. Why does this work?",
      keyPoints: ["FDS has independent action", "FDP to adjacent fingers is tethered", "Mass action of FDP"],
      rightAnswer: "FDS has independent action per digit. By holding adjacent fingers in extension, you tether FDP (mass action), isolating FDS function. PIP flexion = intact FDS.",
    },
  ],
  "anatomy": [
    {
      topic: "Anatomy",
      question: "Name the six dorsal wrist compartments and their contents.",
      keyPoints: ["1: APL+EPB", "2: ECRL+ECRB", "3: EPL", "4: EIP+EDC", "5: EDM", "6: ECU"],
      rightAnswer: "1 (APL, EPB), 2 (ECRL, ECRB), 3 (EPL — ulnar to Lister's), 4 (EIP + 4 EDC slips), 5 (EDM), 6 (ECU in ulnar groove).",
    },
    {
      topic: "Anatomy",
      question: "Where does the EPL tendon wrap around, and why does it matter clinically?",
      keyPoints: ["Lister's tubercle", "Mechanical pulley", "Attrition rupture", "Dropped thumb", "Distal radius fracture"],
      rightAnswer: "The EPL wraps around Lister's tubercle, which acts as a mechanical pulley. After a minimally displaced distal radius fracture, attrition rupture can occur weeks later — presenting as a 'dropped thumb' that the patient often attributes to something mundane.",
    },
  ],
  "infection": [
    {
      topic: "Infection",
      question: "What are Kanavel's four signs?",
      keyPoints: ["Fusiform swelling", "Flexed posture", "Tenderness along sheath", "Pain with passive extension"],
      rightAnswer: "1) Symmetric fusiform swelling of the digit. 2) Flexed posture at rest. 3) Tenderness along the flexor tendon sheath. 4) Pain with passive extension — the most sensitive sign.",
    },
  ],
  "default": [
    {
      topic: "Hand surgery",
      question: "A 24-year-old presents with a 5mm wound over the dorsal 5th MCP joint 2 days after a bar fight. What's your concern and what do you do?",
      keyPoints: ["Fight bite", "Eikenella corrodens", "Joint involvement", "Admit", "IV abx", "OR washout"],
      rightAnswer: "Fight bite with presumed MCP joint involvement until proven otherwise. Admit, start IV ampicillin-sulbactam, update tetanus, and take to the OR for washout. Never close primarily. The wound size underestimates depth.",
    },
  ],
}

export function getPimpingQuestion(topic: string, _intensity: string): PimpingQuestion {
  const key = Object.keys(PIMPING_QUESTIONS).find((k) =>
    topic.toLowerCase().includes(k.toLowerCase())
  ) ?? "default"
  const pool = PIMPING_QUESTIONS[key]
  return pool[Math.floor(Math.random() * pool.length)]
}
