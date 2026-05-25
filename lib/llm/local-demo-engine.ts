// Local demo engine - keyword matching + canned content.
// Zero network calls. Runs entirely in-process.
// This is what makes Phase 0A a no-cost demo.

// -- Knowledge bank (used by MockProvider) -------------------------------------

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
    fullAnswer: `The flexor tendons are divided into five zones:\n\n**Zone I** - Distal to the FDS insertion. FDP avulsion (jersey finger) is the classic injury here.\n\n**Zone II** - A1 pulley to the FDS insertion ("no man's land"). The most surgically complex zone: both FDS and FDP run within a tight tendon sheath, and pulleys must be preserved.\n\n**Zone III** - Palm. Distal edge of carpal tunnel to the A1 pulley. Better prognosis; intrinsic muscle origins here.\n\n**Zone IV** - Within the carpal tunnel. All 9 flexor tendons (4 FDS, 4 FDP, 1 FPL) in a confined space.\n\n**Zone V** - Proximal to the carpal tunnel (forearm). Multiple tendons plus nerve and vessel injuries are common here.\n\nClinical pearl: Zone II ("no man's land") has historically the worst prognosis due to pulley system complexity. Primary repair within 24 hours is ideal; delayed repair remains possible up to ~3 weeks.`,
    citations: [{ id: "flexor-tendon-zones", label: "Flexor Tendon Zones - KB" }],
    followUps: ["Want to drill zone II injuries in more detail?", "Should I run a quick pimping question on this?"],
  },
  {
    id: "extensor-compartments",
    keywords: ["extensor", "compartment", "compartments", "epl", "epb", "apl", "edc", "eip", "edm", "ecu", "ecrl", "ecrb", "lister"],
    shortAnswer: "Six dorsal compartments contain the extensor tendons at the wrist, held by the extensor retinaculum.",
    fullAnswer: `There are six dorsal wrist compartments:\n\n**1** - APL + EPB (radial styloid; de Quervain's)\n**2** - ECRL + ECRB (radial to Lister's tubercle)\n**3** - EPL (ulnar to Lister's tubercle - wraps around it as a pulley)\n**4** - EIP + EDC (central dorsum)\n**5** - EDM (ulnar; extensor to small finger)\n**6** - ECU (ulnar groove; DRUJ stabilizer)\n\n**Lister's tubercle pearl:** The EPL wraps around Lister's tubercle as a mechanical pulley. Attrition rupture of the EPL can occur weeks after a minimally displaced distal radius fracture - watch for "dropped thumb."`,
    citations: [{ id: "extensor-compartments", label: "Extensor Compartments - KB" }],
    followUps: ["Want me to quiz you on which tendon is in which compartment?", "Should I explain de Quervain's in detail?"],
  },
  {
    id: "scaphoid",
    keywords: ["scaphoid", "snuffbox", "avascular", "avn", "waist", "proximal pole", "herbert", "navicular"],
    shortAnswer: "The scaphoid is the most commonly fractured carpal bone; its retrograde blood supply makes proximal pole fractures high-risk for AVN.",
    fullAnswer: `**Key anatomy:** ~80% of the scaphoid's blood supply enters distally via the dorsal ridge branches of the radial artery. The proximal pole is an end-vascular territory, making it vulnerable to avascular necrosis (AVN) after fracture.\n\n**Herbert classification (simplified):**\n- A1/A2: Stable (incomplete, tubercle or waist)\n- B2: Unstable complete waist - most common fracture\n- B3: Proximal pole - highest AVN risk\n- B4: Perilunate fracture-dislocation\n\n**Diagnosis pearls:**\n- Plain films miss ~20% of acute scaphoid fractures\n- MRI is the gold standard for occult fracture\n- Anatomical snuffbox tenderness = scaphoid until proven otherwise`,
    citations: [{ id: "scaphoid-anatomy", label: "Scaphoid Anatomy - KB" }],
    followUps: ["Want to go through the surgical indications?", "Should I quiz you on the Herbert classification?"],
  },
  {
    id: "kanavel",
    keywords: ["kanavel", "tenosynovitis", "pyogenic", "flexor sheath", "sausage", "fusiform", "digit", "infection", "sheath"],
    shortAnswer: "Kanavel's 4 signs diagnose pyogenic flexor tenosynovitis - a hand surgery emergency.",
    fullAnswer: `**Kanavel's four cardinal signs of pyogenic flexor tenosynovitis:**\n\n1. **Symmetric fusiform swelling** of the entire finger (sausage digit)\n2. **Flexed posture** of the finger at rest\n3. **Tenderness** along the flexor tendon sheath (entire volar finger)\n4. **Pain with passive extension** of the finger - the most *sensitive* sign\n\n**Why it matters:** Pyogenic tenosynovitis is a surgical emergency. Delay of 24-48 hours significantly worsens outcomes.\n\n**Common organisms:** *S. aureus* (most common), GAS, *Eikenella corrodens* (fight bite), *Pasteurella multocida* (animal bite).\n\n**Treatment:** IV antibiotics + OR irrigation of the flexor tendon sheath.`,
    citations: [{ id: "kanavel-signs", label: "Kanavel's Signs - KB" }],
    followUps: ["Should I explain the surgical approach to sheath irrigation?", "Want to compare this to fight bite?"],
  },
  {
    id: "fight-bite",
    keywords: ["fight", "bite", "clenched", "fist", "mcp", "eikenella", "human bite", "bar fight", "punch"],
    shortAnswer: "Any wound over the dorsal MCP in a young adult is a fight bite until proven otherwise - and the joint is involved until proven otherwise.",
    fullAnswer: `**Mechanism:** When the fist is clenched, the tooth enters the MCP joint capsule. As the hand extends, the capsule "closes," sealing contamination inside the joint.\n\n**Key bugs:** *Eikenella corrodens* is the pathogen you can't miss. It's resistant to cephalexin but sensitive to ampicillin-sulbactam.\n\n**Treatment:**\n- Admit\n- IV ampicillin-sulbactam\n- Tetanus update\n- Hand surgery consult for OR washout\n- Never close primarily\n\n**Pearl:** The wound size lies about the depth. A 5mm skin wound can be a through-and-through joint capsule violation.`,
    citations: [{ id: "fight-bite-mcp", label: "Fight Bite - KB" }],
    followUps: ["Want to work through the fight bite case?", "Should I explain the OR washout steps?"],
  },
  {
    id: "mallet-finger",
    keywords: ["mallet", "droop", "dip", "extensor", "terminal", "avulsion", "splint", "jersey", "drop", "baseball", "basketball"],
    shortAnswer: "Mallet finger = terminal extensor tendon disruption at the dorsal distal phalanx. Treat with DIP extension splinting full-time x 6 weeks.",
    fullAnswer: `**Definition:** Mallet finger = disruption of the terminal extensor tendon at its insertion on the dorsal distal phalanx.\n\n**Tendinous vs. bony:** Both treated similarly for small fragments. Surgical threshold: large fragment (>30% articular surface), joint subluxation, or chronic untreated mallet.\n\n**Treatment protocol:**\n- DIP extension splinting **full-time** x  6 weeks, then nighttime x  2 weeks\n- The PIP must remain **free**\n- Critical: if the DIP flexes even once during splinting, the clock restarts.\n\n**Untreated:** Can evolve into swan-neck deformity.`,
    citations: [{ id: "mallet-flex-resets-clock", label: "Mallet Finger Pearls - KB" }],
    followUps: ["Want to work through the mallet finger case?", "Should I explain swan-neck deformity?"],
  },
  {
    id: "distal-radius",
    keywords: ["distal radius", "wrist", "foosh", "colles", "dinner fork", "radial", "shortening", "tilt", "druj", "median nerve", "carpal tunnel", "acute cts"],
    shortAnswer: "Distal radius fractures require systematic assessment of alignment, DRUJ stability, and median nerve status - then decide: reduce vs. operate.",
    fullAnswer: `**Acceptable closed reduction parameters (general):**\n- Dorsal angulation < 5 deg\n- Radial shortening < 5mm\n- Articular step-off < 2mm\n\n**Acute median nerve symptoms:** Re-examine after reduction:\n- Symptoms resolve -> observe\n- Symptoms persist -> urgent carpal tunnel release\n\n**DRUJ:** Always assess. Instability changes the surgical plan.\n\n**Sentinel event:** A distal radius fracture in a 58-year-old woman warrants DEXA - the next fracture is often the hip.`,
    citations: [{ id: "acute-cts-distal-radius", label: "Distal Radius Pearls - KB" }],
    followUps: ["Want to work through the distal radius FOOSH case?", "Should I quiz you on reduction parameters?"],
  },
]

export function findBestMatch(query: string): KBEntry | null {
  const q = query.toLowerCase()
  let bestEntry: KBEntry | null = null
  let bestScore = 0
  for (const entry of KB_ENTRIES) {
    const score = entry.keywords.reduce((acc, kw) => acc + (q.includes(kw.toLowerCase()) ? 1 : 0), 0)
    if (score > bestScore) { bestScore = score; bestEntry = entry }
  }
  return bestScore > 0 ? bestEntry : null
}

export function roleDepthNote(role: string): string {
  if (["M3", "M4"].includes(role)) return "\n\n*Depth: conceptual overview - ask me to go deeper on any part.*"
  if (["PGY-4", "PGY-5", "Fellow"].includes(role)) return "\n\n*Depth: operative detail level - happy to go further.*"
  return ""
}

export type PimpingQuestion = {
  topic: string; question: string; keyPoints: string[]; rightAnswer: string
}

export const PIMPING_QUESTIONS: Record<string, PimpingQuestion[]> = {
  "flexor tendon": [
    {
      topic: "Flexor tendon",
      question: "Which zone of flexor tendon injury has the worst prognosis, and why?",
      keyPoints: ["Zone II", "No man's land", "A1 pulley to FDS insertion", "Tight sheath", "Pulley preservation"],
      rightAnswer: "Zone II - 'no man's land' - because both FDS and FDP run within a tight sheath, and the complex pulley system makes primary repair technically demanding with high adhesion rates.",
    },
    {
      topic: "Flexor tendon",
      question: "A patient has a palm laceration. You test FDS by holding other fingers in extension and asking PIP flexion. Why does this work?",
      keyPoints: ["FDS has independent action", "FDP to adjacent fingers is tethered", "Mass action of FDP"],
      rightAnswer: "FDS has independent action per digit. Holding adjacent fingers in extension tethers FDP (mass action), isolating FDS. PIP flexion = intact FDS.",
    },
  ],
  "anatomy": [
    {
      topic: "Anatomy",
      question: "Name the six dorsal wrist compartments and their contents.",
      keyPoints: ["1: APL+EPB", "2: ECRL+ECRB", "3: EPL", "4: EIP+EDC", "5: EDM", "6: ECU"],
      rightAnswer: "1 (APL, EPB), 2 (ECRL, ECRB), 3 (EPL - ulnar to Lister's), 4 (EIP + 4 EDC slips), 5 (EDM), 6 (ECU in ulnar groove).",
    },
  ],
  "infection": [
    {
      topic: "Infection",
      question: "What are Kanavel's four signs?",
      keyPoints: ["Fusiform swelling", "Flexed posture", "Tenderness along sheath", "Pain with passive extension"],
      rightAnswer: "1) Symmetric fusiform swelling. 2) Flexed posture at rest. 3) Tenderness along the flexor tendon sheath. 4) Pain with passive extension - the most sensitive sign.",
    },
  ],
  "default": [
    {
      topic: "Hand surgery",
      question: "A 24-year-old presents with a 5mm wound over the dorsal 5th MCP 2 days after a bar fight. What's your concern?",
      keyPoints: ["Fight bite", "Eikenella corrodens", "Joint involvement", "Admit", "IV abx", "OR washout"],
      rightAnswer: "Fight bite with presumed MCP joint involvement. Admit, IV ampicillin-sulbactam, tetanus update, OR washout. Never close primarily.",
    },
  ],
}

export function getPimpingQuestion(topic: string, _intensity: string): PimpingQuestion {
  const key = Object.keys(PIMPING_QUESTIONS).find((k) => topic.toLowerCase().includes(k.toLowerCase())) ?? "default"
  const pool = PIMPING_QUESTIONS[key]
  return pool[Math.floor(Math.random() * pool.length)]
}

// -- Structured tutor answers for the B1 tutor demo UI ------------------------

export type TutorAnswerVariant = {
  condition: string
  answer: string
}

export type TutorAnswer = {
  id: string
  keywords: string[]
  shortExplanation: string
  roundsOneLiner: string
  commonMistake: string
  likelyFollowUp: string
  fullAnswer: string
  whatWouldChange: TutorAnswerVariant[]
  citations: Array<{ id: string; label: string }>
}

export const TUTOR_ANSWERS: TutorAnswer[] = [
  {
    id: "fight-bite",
    keywords: ["fight", "bite", "clenched", "fist", "mcp", "eikenella", "bar fight", "punch", "knuckle", "5th mcp", "dorsal mcp"],
    shortExplanation: "A fight bite is a clenched-fist injury over the MCP joint. When the fist is closed, a human tooth penetrates the joint capsule; as the hand opens, the skin wound 'closes,' sealing oral flora inside the joint. Eikenella corrodens - resistant to cephalexin - is the pathogen you cannot miss.",
    roundsOneLiner: "Fight bite over the MCP: admit, IV ampicillin-sulbactam, OR washout - never close primarily.",
    commonMistake: "Closing the wound primarily, or discharging on oral cephalexin. Both seal contamination inside a synovial space and set the patient up for septic arthritis.",
    likelyFollowUp: "Why does the mechanism matter here - specifically, what happens to the wound as the hand goes from closed to open fist?",
    fullAnswer: `**Fight bite (clenched-fist injury)** is a hand surgery emergency that looks deceptively minor.\n\n**Mechanism:** With the fist clenched, the tooth penetrates the MCP joint capsule. As the hand extends, the skin wound closes over the violation - sealing oral flora inside the joint. The wound size underestimates the depth.\n\n**Why it matters:** The MCP joint is considered contaminated until proven otherwise. Delayed or inadequate treatment leads to septic arthritis -> joint destruction -> permanent loss of function.\n\n**The bug:** *Eikenella corrodens* is the key organism from human oral flora. It is resistant to cephalexin and first-generation cephalosporins. Ampicillin-sulbactam provides appropriate coverage.\n\n**Management:**\n1. Admit\n2. IV ampicillin-sulbactam\n3. Tetanus update\n4. Obtain plain films (look for tooth fragment, air in joint)\n5. Hand surgery consult -> OR washout\n6. **Never close primarily**\n\n**Prognosis:** Delayed presentation (>24h) significantly worsens outcomes and may require multiple washouts.`,
    whatWouldChange: [
      {
        condition: "What if the wound was on the volar side?",
        answer: "Volar wounds over the fingers or palm are more likely flexor tendon or digital nerve lacerations from a defensive injury - not a fight bite. Explore, test flexor function and digital nerve sensation carefully, and repair accordingly. The infection concern shifts from Eikenella/joint to skin flora/tendon.",
      },
      {
        condition: "What if the patient was immunocompromised?",
        answer: "Immunocompromised patients (HIV, diabetes, steroids, immunosuppression) are at higher risk for atypical organisms and more aggressive infection. Broaden empiric coverage, lower the threshold for aggressive surgical management, and expect slower healing. Consult infectious disease early.",
      },
      {
        condition: "What if presentation was within 6 hours of injury?",
        answer: "Early presentation gives you a narrower window before joint contamination becomes established infection. Some centers manage select early cases with thorough ED exploration, irrigation, IV antibiotics, and very close follow-up (return in 24h). However, most hand surgeons still prefer formal OR exploration when any joint involvement is suspected - the downside of going to the OR is low; the downside of missing joint contamination is high.",
      },
    ],
    citations: [{ id: "fight-bite-mcp", label: "Fight Bite - Local demo KB" }],
  },
  {
    id: "mallet-finger",
    keywords: ["mallet", "droop", "dip", "extensor", "terminal", "avulsion", "splint", "drop", "baseball", "basketball", "fingertip"],
    shortExplanation: "Mallet finger is disruption of the terminal extensor tendon at its insertion on the dorsal distal phalanx, causing a DIP extension lag. For small avulsion fragments (<30% articular surface) with a congruent joint, DIP extension splinting full-time for 6 weeks is the treatment.",
    roundsOneLiner: "Mallet finger, small fragment, congruent joint: DIP extension splint full-time x  6 weeks - PIP free, clock restarts if DIP flexes once.",
    commonMistake: "Splinting the PIP joint as well (immobilizes unnecessarily and worsens compliance), or not counseling the patient that any single DIP flexion restarts the 6-week clock.",
    likelyFollowUp: "What is the surgical threshold for a bony mallet finger? What happens if untreated?",
    fullAnswer: `**Mallet finger** = disruption of the terminal extensor tendon at its insertion on the dorsal distal phalanx.\n\n**Two types:**\n- **Tendinous:** Pure tendon avulsion. No bony fragment.\n- **Bony:** Fragment avulsed off the dorsal distal phalanx base.\n\n**Both treated similarly for small fragments.** The classification that matters:\n- Fragment < 30% of articular surface + joint congruent -> conservative\n- Fragment > 30% OR joint subluxation -> surgical\n- Chronic (> 6-8 weeks untreated) -> re-evaluate; often surgical\n\n**Conservative treatment:**\n1. DIP extension splinting **full-time** x  6 weeks\n2. Nighttime splinting x  2 more weeks\n3. PIP must remain **free** - do not splint the PIP\n4. If the DIP flexes even once during the 6-week period -> restart the clock\n\n**Why the DIP can never flex:** The terminal extensor tendon heals under tension. Any slack disrupts healing and creates a gap.\n\n**If untreated:** Progressive DIP extension lag -> swan-neck deformity as extensor force redistributes proximally through the oblique retinacular ligament.`,
    whatWouldChange: [
      {
        condition: "What if the fragment was >30% of the articular surface?",
        answer: "Fragments >30% articular surface, or those with joint subluxation, are surgical. Options include extension block pinning (CRPP) or open reduction. The goal is to restore articular congruity and maintain DIP reduction. Technique choice depends on fracture pattern and surgeon preference.",
      },
      {
        condition: "What if the patient was a concert pianist?",
        answer: "Higher functional demand changes the shared decision-making conversation. Even a small residual extension lag can be debilitating for musicians. The evidence still supports conservative management for small fragments - but compliance expectations must be explicit, and the patient must understand that any flexion restarts the process. Some high-demand patients opt for surgical pinning to remove the compliance variable.",
      },
      {
        condition: "What if they presented 6 weeks late?",
        answer: "A chronic mallet finger (> 6 weeks). Conservative splinting can still be attempted for chronic tendinous mallets - success rates are lower but worth trying. Established bony mallets with nonunion typically require surgery. Check the PIP: if a swan-neck deformity has begun to develop, that changes the surgical planning significantly.",
      },
    ],
    citations: [{ id: "mallet-flex-resets-clock", label: "Mallet Finger - Local demo KB" }],
  },
  {
    id: "distal-radius",
    keywords: ["distal radius", "wrist", "foosh", "colles", "dinner fork", "radial shortening", "dorsal tilt", "druj", "median nerve", "carpal tunnel", "acute cts", "radius fracture"],
    shortExplanation: "Distal radius fractures require systematic assessment: reduce the fracture, check alignment parameters, assess DRUJ stability, and - critically - re-examine the median nerve after reduction. Median nerve symptoms that persist after reduction indicate acute carpal tunnel syndrome and require urgent decompression.",
    roundsOneLiner: "FOOSH with dinner-fork deformity: reduce, check median nerve after reduction, splint, follow in 1 week - persistent nerve symptoms = urgent carpal tunnel release.",
    commonMistake: "Watching median nerve symptoms after reduction instead of acting. Persistent or worsening symptoms after reduction = acute CTS = urgent carpal tunnel release, not watchful waiting.",
    likelyFollowUp: "What are the acceptable closed reduction parameters for a distal radius fracture? What does DRUJ instability change?",
    fullAnswer: `**Distal radius fracture - systematic evaluation**\n\n**Step 1: Neurovascular exam**\nMedian nerve distribution: volar thumb, index, long fingers. Document before AND after reduction.\n\n**Step 2: Radiographic parameters**\nOn PA: radial inclination (~23 deg), radial height (~12mm)\nOn lateral: volar tilt (+11 deg normally)\n\n**Acceptable post-reduction parameters:**\n- Dorsal angulation < 5 deg\n- Radial shortening < 5mm\n- Articular step-off < 2mm\n(These tighten for younger, higher-demand patients)\n\n**Step 3: DRUJ assessment**\nAlways. Instability changes the fixation strategy.\n\n**Step 4: Median nerve after reduction**\n- Symptoms resolve -> observe\n- Symptoms persist or worsen -> **urgent carpal tunnel release**\n\n**Definitive management:**\nVolar locked plating (VLP) is the most common contemporary fixation for displaced fractures.\n\n**Sentinel event:** A distal radius fracture in an older woman warrants osteoporosis workup - the next fracture is often the hip.`,
    whatWouldChange: [
      {
        condition: "What if the median nerve symptoms got worse after reduction?",
        answer: "Worsening or new median nerve symptoms after reduction = acute CTS from hematoma, edema, or residual bony compression. This is a hand surgery emergency. Urgent carpal tunnel release is indicated - not a watch-and-wait. The window for good outcomes narrows rapidly.",
      },
      {
        condition: "What if the patient was 25 instead of 58?",
        answer: "A young patient with a distal radius fracture has higher functional demands and higher bone quality. Acceptable reduction parameters tighten: near-anatomic restoration is the goal. Higher index of suspicion for accompanying carpal ligament injuries. The threshold for operative fixation is lower and the standard for what is 'acceptable' is higher.",
      },
      {
        condition: "What if the x-ray showed DRUJ widening?",
        answer: "DRUJ widening indicates disruption of the triangular fibrocartilage complex (TFCC) or associated ligamentous injury. This changes the surgical plan: the DRUJ must be addressed - TFCC repair, DRUJ pinning, or bony correction. Assess DRUJ stability intraoperatively with the forearm in neutral, pronation, and supination.",
      },
    ],
    citations: [{ id: "acute-cts-distal-radius", label: "Distal Radius - Local demo KB" }],
  },
  {
    id: "flexor-tendon-zones",
    keywords: ["flexor", "tendon", "zone", "zones", "fds", "fdp", "no man", "zone i", "zone ii", "zone iii", "zone iv", "zone v", "flexor tendon zones"],
    shortExplanation: "The flexor tendons are divided into five anatomical zones that guide surgical decision-making and prognosis. Zone II ('no man's land') has historically the worst prognosis because both FDS and FDP run within a tight sheath under a complex pulley system, making primary repair technically demanding.",
    roundsOneLiner: "Zone II flexor tendon injuries: primary repair within 24 hours preferred, Zone II has the worst prognosis due to tight sheath and pulley complexity.",
    commonMistake: "Assuming the finger is uninjured because active flexion is present - partial tendon lacerations may retain some function until >50% of the tendon is cut, and both FDS and FDP must be tested independently.",
    likelyFollowUp: "How do you test FDS vs FDP function independently at the bedside?",
    fullAnswer: `**Flexor tendon zones** guide injury classification and surgical planning:\n\n**Zone I** - Distal to the FDS insertion -> FDP avulsion (jersey finger, usually ring finger)\n\n**Zone II** - A1 pulley to FDS insertion ('no man's land') -> Most complex; both FDS + FDP in tight sheath; pulleys must be preserved\n\n**Zone III** - Palm (carpal tunnel exit -> A1 pulley) -> Better prognosis; more room to work\n\n**Zone IV** - Within the carpal tunnel -> All 9 flexors in confined space; FPL + 4 FDS + 4 FDP\n\n**Zone V** - Forearm (proximal to carpal tunnel) -> Multiple tendons + nerve/vessel injuries common\n\n**Bedside testing:**\n- FDP: hold PIP in extension -> ask patient to flex at DIP (FDP-only movement)\n- FDS: hold all other fingers extended -> ask PIP flexion on the tested finger (isolates FDS, tethers FDP)\n\n**Key principles:**\n- Primary repair preferred within 24h\n- Two-stage reconstruction for delayed or contaminated injuries\n- Pulley preservation critical in Zone II`,
    whatWouldChange: [
      {
        condition: "What if the laceration was at the wrist (Zone IV)?",
        answer: "Zone IV means all 9 flexors in the carpal tunnel. Multiple tendon lacerations are common. You must systematically test each FDS and FDP, plus FPL. The median and ulnar nerves are also at risk. Repair follows the same primary repair principles as Zone II, but pulley concerns are less dominant; the carpal tunnel itself provides the constraint.",
      },
      {
        condition: "What if the patient is a child?",
        answer: "Pediatric flexor tendon repairs have better intrinsic healing capacity but compliance with therapy protocols is a major limiting factor. Post-op rehabilitation requires dedicated pediatric hand therapy. Many centers use a modified Duran protocol or early controlled passive motion. The principles of repair are similar, but the post-op management pathway differs significantly.",
      },
      {
        condition: "What if you can't find the proximal tendon end?",
        answer: "The proximal end retracts - sometimes into the palm or forearm depending on the zone. Use gentle proximal-to-distal massage ('milking') along the digit or palm to deliver the tendon. If unavailable at primary exploration, a two-stage reconstruction (silicone rod to create a pseudosheath, followed by tendon graft at 3 months) may be needed. Don't force a repair under tension.",
      },
    ],
    citations: [{ id: "flexor-tendon-zones", label: "Flexor Tendon Zones - Local demo KB" }],
  },
  {
    id: "kanavel",
    keywords: ["kanavel", "tenosynovitis", "pyogenic", "flexor sheath", "sausage", "fusiform", "digit", "infection", "sheath", "kanavel signs", "flexor tenosynovitis"],
    shortExplanation: "Pyogenic flexor tenosynovitis presents with Kanavel's four signs: fusiform swelling, flexed posture, tenderness along the flexor sheath, and pain with passive extension (the most sensitive). It is a hand surgery emergency - delay of 24-48 hours significantly worsens outcomes.",
    roundsOneLiner: "Kanavel's four signs: fusiform swelling, flexed posture, sheath tenderness, pain with passive extension - any one warrants immediate hand surgery consult.",
    commonMistake: "Treating with oral antibiotics and close follow-up (treating like simple cellulitis). Pyogenic tenosynovitis is a tendon sheath infection that requires surgical drainage - antibiotics alone do not penetrate the sheath adequately.",
    likelyFollowUp: "How do you differentiate pyogenic flexor tenosynovitis from a simple dorsal hand infection or fight bite?",
    fullAnswer: `**Pyogenic flexor tenosynovitis** - a hand surgery emergency.\n\n**Kanavel's four cardinal signs:**\n1. **Symmetric fusiform swelling** of the entire digit (sausage finger)\n2. **Flexed posture** at rest\n3. **Tenderness** along the entire volar flexor sheath\n4. **Pain with passive extension** - the most *sensitive* sign\n\nAny one of the four warrants an immediate hand surgery consult. Do not wait for labs.\n\n**Common organisms:**\n- *S. aureus* (most common)\n- GAS\n- *Eikenella corrodens* (from fight bite or human bite)\n- *Pasteurella multocida* (animal bite)\n- Consider atypical organisms in immunocompromised patients\n\n**Why oral antibiotics fail:** The flexor sheath is a closed synovial space with limited penetration of systemic antibiotics at adequate concentrations. Surgical drainage is required.\n\n**Treatment:**\n1. IV antibiotics (empiric broad coverage)\n2. OR: closed tendon sheath irrigation (two small incisions) vs. open irrigation\n3. Splint, hand therapy postoperatively\n\n**Delay consequences:** 24-48 hours without drainage -> tendon necrosis -> permanent loss of digit function.`,
    whatWouldChange: [
      {
        condition: "What if only 2 of 4 Kanavel signs are present?",
        answer: "Incomplete Kanavel's signs do not rule out pyogenic tenosynovitis. Pain with passive extension alone, in the right clinical context (swollen finger, recent injury), should trigger an immediate hand surgery consult. The threshold is low because the cost of missing it - tendon necrosis - is high. Partial signs in immunocompromised patients may mean the infection is just as advanced.",
      },
      {
        condition: "What if the patient has diabetes?",
        answer: "Diabetic patients can have blunted inflammatory responses - they may show fewer Kanavel signs and less pain, while harboring the same or worse underlying infection. Never use symptom severity to gauge infection severity in diabetics. Lower threshold to operate, expect atypical organisms, and be more aggressive with surgical drainage. Multiple washouts are more common.",
      },
      {
        condition: "What if cultures grow MRSA?",
        answer: "MRSA flexor tenosynovitis requires vancomycin (or daptomycin for renal concerns). Surgical management is identical - OR irrigation of the flexor sheath - but ID involvement for IV antibiotics duration is important. Multiple washouts may be needed. MRSA is resistant to ampicillin-sulbactam, so empiric coverage should include MRSA coverage when risk factors are present.",
      },
    ],
    citations: [{ id: "kanavel-signs", label: "Kanavel's Signs - Local demo KB" }],
  },
]

export function findTutorAnswer(query: string): TutorAnswer | null {
  const q = query.toLowerCase()
  let bestEntry: TutorAnswer | null = null
  let bestScore = 0
  for (const entry of TUTOR_ANSWERS) {
    const score = entry.keywords.reduce((acc, kw) => acc + (q.includes(kw.toLowerCase()) ? 1 : 0), 0)
    if (score > bestScore) { bestScore = score; bestEntry = entry }
  }
  return bestScore > 0 ? bestEntry : null
}




