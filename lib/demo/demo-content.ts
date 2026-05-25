// Single source of truth for authored demo content.
// Import from here rather than scattering constants across components.

export const SEED_CASE_IDS = [
  "001-fight-bite",
  "002-mallet-finger",
  "003-distal-radius",
] as const

export type SeedCaseId = typeof SEED_CASE_IDS[number]

// ── Tutor topic menu ──────────────────────────────────────────────────────────

export type TutorTopic = {
  id: string
  label: string
  suggestedQuestion: string
  difficulty: "intro" | "intermediate" | "advanced"
}

export const TUTOR_TOPICS: TutorTopic[] = [
  {
    id: "fight-bite",
    label: "Fight bite",
    suggestedQuestion: "How do you manage a wound over the dorsal MCP after a bar fight?",
    difficulty: "intermediate",
  },
  {
    id: "mallet-finger",
    label: "Mallet finger",
    suggestedQuestion: "What is the treatment for bony mallet finger with a small fragment?",
    difficulty: "intro",
  },
  {
    id: "distal-radius",
    label: "Distal radius fracture",
    suggestedQuestion: "What are the acceptable closed reduction parameters for a distal radius fracture?",
    difficulty: "intermediate",
  },
  {
    id: "flexor-tendon-zones",
    label: "Flexor tendon zones",
    suggestedQuestion: "What are the flexor tendon zones and why does Zone II have the worst prognosis?",
    difficulty: "intro",
  },
  {
    id: "kanavel",
    label: "Kanavel signs",
    suggestedQuestion: "What are Kanavel's four cardinal signs of pyogenic flexor tenosynovitis?",
    difficulty: "intro",
  },
]

// ── Pimping topic menu ────────────────────────────────────────────────────────

export const PIMPING_TOPICS = [
  { id: "anatomy", label: "Anatomy" },
  { id: "flexor tendon", label: "Flexor tendons" },
  { id: "extensor tendon", label: "Extensor tendons" },
  { id: "infection", label: "Hand infections" },
  { id: "trauma", label: "Trauma" },
  { id: "nerve", label: "Peripheral nerve" },
] as const

// ── Authored Pearls ───────────────────────────────────────────────────────────

export type PearlEntry = {
  id: string
  topic: string
  content: string
  attribution: string
  tags: string[]
  verified: boolean
}

export const PEARL_IDS = [
  "fight-bite-mcp",
  "eikenella",
  "mallet-flex-resets-clock",
  "mallet-leave-pip",
  "acute-cts-distal-radius",
  "distal-radius-not-just-a-wrist-fracture",
] as const

export type PearlId = typeof PEARL_IDS[number]

export const PEARLS: PearlEntry[] = [
  {
    id: "fight-bite-mcp",
    topic: "Fight bite",
    content: "Any wound over the dorsal MCP in a young adult is a fight bite until proven otherwise — and the joint is involved until proven otherwise.",
    attribution: "Hand service",
    tags: ["infection", "trauma", "MCP"],
    verified: false,
  },
  {
    id: "eikenella",
    topic: "Fight bite",
    content: "Eikenella corrodens is the bug you don't want to miss — and the reason ampicillin-sulbactam beats cephalexin here.",
    attribution: "Hand service",
    tags: ["infection", "microbiology"],
    verified: false,
  },
  {
    id: "mallet-flex-resets-clock",
    topic: "Mallet finger",
    content: "If the DIP flexes even once during splinting, the clock starts over. Tell the patient. Tell them again.",
    attribution: "Hand service",
    tags: ["extensor", "splinting", "mallet"],
    verified: false,
  },
  {
    id: "mallet-leave-pip",
    topic: "Mallet finger",
    content: "Splint the DIP only. Leaving the PIP free preserves function and improves compliance.",
    attribution: "Hand service",
    tags: ["extensor", "splinting", "mallet"],
    verified: false,
  },
  {
    id: "acute-cts-distal-radius",
    topic: "Distal radius",
    content: "Median nerve symptoms after a distal radius fracture demand re-examination after reduction. Persistent symptoms = urgent carpal tunnel release, not a watch-and-wait.",
    attribution: "Hand service",
    tags: ["nerve", "distal-radius", "carpal-tunnel"],
    verified: false,
  },
  {
    id: "distal-radius-not-just-a-wrist-fracture",
    topic: "Distal radius",
    content: "A distal radius fracture in a 58-year-old woman is a sentinel event. Recommend DEXA and consider osteoporosis workup — the next fracture is often the hip.",
    attribution: "Hand service",
    tags: ["distal-radius", "osteoporosis", "prevention"],
    verified: false,
  },
]

// ── Mistake Museum ────────────────────────────────────────────────────────────

export type MistakeEntry = {
  id: string
  title: string
  vignette: string
  mistake: string
  whyLearnersMakeIt: string
  whyItMatters: string
  howToAvoidIt: string
  bestCorrectionOneLiner: string
  tags: string[]
}

export const MISTAKE_MUSEUM: MistakeEntry[] = [
  {
    id: "fight-bite-closed",
    title: "The wound that should not have been closed",
    vignette: "A 22-year-old presents to urgent care with a small laceration over his right 5th MCP joint. The PA sutures it with 3 interrupted nylons and sends him home on cephalexin.",
    mistake: "Primary closure of a fight bite over the MCP joint.",
    whyLearnersMakeIt: "The wound is small, the patient underreports the mechanism, and closing wounds is instinctive. The MCP location over bone looks like the laceration was from hitting a hard surface, not a tooth.",
    whyItMatters: "Fight bites contaminate the MCP joint capsule with oral flora including Eikenella corrodens. Primary closure seals bacteria inside a synovial space. The patient returns in 48 hours with septic arthritis — and now has a much harder problem to treat.",
    howToAvoidIt: "Any wound over the dorsal MCP in a young adult = fight bite until proven otherwise. Never close primarily. Explore, irrigate, leave open. Admit for IV ampicillin-sulbactam and hand surgery consult for OR washout.",
    bestCorrectionOneLiner: "The mechanism matters more than the wound size — that's a fight bite, and it's going to the OR.",
    tags: ["infection", "trauma", "MCP", "fight-bite"],
  },
  {
    id: "pip-splinted",
    title: "The splint that went one joint too far",
    vignette: "A 28-year-old with a mallet finger gets a full-finger Stack splint immobilizing both the DIP and PIP joints. Follow-up at 4 weeks shows excellent DIP position but significant PIP stiffness.",
    mistake: "Splinting the PIP joint in mallet finger treatment.",
    whyLearnersMakeIt: "A longer splint feels more stable and secure. It seems like immobilizing more of the finger would protect the healing DIP. The PIP is in the way when placing the Stack splint and it's easier to immobilize everything.",
    whyItMatters: "The PIP joint needs to move. Immobilizing it causes stiffness that can be as functionally disabling as the mallet deformity itself. PIP joint stiffness is often harder to rehabilitate than the original mallet.",
    howToAvoidIt: "Splint the DIP only in full extension. The PIP must remain free. Any stack or aluminum splint should end proximal to the PIP joint crease. Confirm PIP ROM at every follow-up.",
    bestCorrectionOneLiner: "Mallet finger splinting is DIP only — the PIP needs to stay free, and now we need to add PIP rehab.",
    tags: ["extensor", "mallet-finger", "splinting", "DIP", "PIP"],
  },
  {
    id: "median-nerve-watched",
    title: "The nerve that was watched",
    vignette: "A 55-year-old sustains a distal radius fracture, reduced in the ED. Post-reduction x-ray looks acceptable. She complains of numbness in her thumb and index finger. The team notes it and plans to monitor.",
    mistake: "Watching median nerve symptoms that persist after closed reduction of a distal radius fracture.",
    whyLearnersMakeIt: "The fracture is reduced, the x-ray looks reasonable, and the attending is happy with the alignment. Median nerve symptoms after wrist fractures are common and often transiently improve — it's easy to assume this is just swelling that will resolve.",
    whyItMatters: "Persistent median nerve symptoms after reduction indicate acute carpal tunnel syndrome — not transient neuropraxia. The hematoma or residual bony compression is continuing to compromise the nerve. The window for decompression without permanent sequelae is short.",
    howToAvoidIt: "Examine the median nerve before and after reduction, document both findings, and compare. Symptoms that resolve after reduction → observe. Symptoms that persist or worsen → urgent carpal tunnel release. Never watch persistent nerve deficit in this context.",
    bestCorrectionOneLiner: "Persistent median nerve symptoms after reduction mean acute CTS — this is going to the OR tonight.",
    tags: ["distal-radius", "median-nerve", "carpal-tunnel", "acute-CTS"],
  },
  {
    id: "tenosynovitis-cellulitis",
    title: "The infection that wasn't cellulitis",
    vignette: "A 35-year-old with a swollen index finger is prescribed oral Keflex and told to follow up in 3 days. The finger is diffusely swollen, held in slight flexion, and tender along the entire volar surface.",
    mistake: "Treating pyogenic flexor tenosynovitis with oral antibiotics as if it were cellulitis.",
    whyLearnersMakeIt: "A swollen, erythematous finger in a healthy-appearing patient looks like cellulitis. Giving antibiotics and close follow-up feels appropriately conservative. Kanavel's signs require deliberate examination — they are easy to miss if you don't look for them systematically.",
    whyItMatters: "Pyogenic tenosynovitis requires surgical drainage. The flexor sheath is a closed synovial space that oral — or even IV — antibiotics cannot adequately penetrate. Without drainage, the tendon will necrose within 24–48 hours of established infection.",
    howToAvoidIt: "For any diffusely swollen finger: check all four Kanavel's signs deliberately. Pain with passive extension is the most sensitive sign and should prompt immediate hand surgery consult. When in doubt, it's a consult, not a prescription.",
    bestCorrectionOneLiner: "That's Kanavel's signs — this is pyogenic tenosynovitis, not cellulitis, and it needs the OR tonight.",
    tags: ["infection", "tenosynovitis", "kanavel", "cellulitis"],
  },
  {
    id: "cascade-not-checked",
    title: "The cascade that nobody checked",
    vignette: "A patient with a palm laceration is assessed in the ED. The wound is irrigated and sutured. Flexion and extension of all fingers appears intact at a glance. Three weeks later, during wound check, the patient demonstrates a subtle resting cascade abnormality.",
    mistake: "Not systematically testing the resting cascade and individual tendon function after a hand laceration.",
    whyLearnersMakeIt: "If the patient can move their fingers and isn't reporting weakness, the assessment feels complete. Active motion in an anxious or pain-limited patient is unreliable, and a partial tendon laceration (>50% but not complete) may retain some active function while still needing repair.",
    whyItMatters: "A partial flexor tendon laceration that goes unrepaired can rupture days to weeks later with normal use — resulting in a delayed, more difficult repair in a contaminated field. The longer the delay, the worse the prognosis.",
    howToAvoidIt: "Examine the cascade before and after repair. Test FDS and FDP independently for each finger. Test EPL, EIP, and intrinsics. Any tendon that is partially cut >50% should be repaired. Document explicitly that each tendon was assessed.",
    bestCorrectionOneLiner: "Always check the cascade and test each tendon individually — motion at a glance is not a tendon exam.",
    tags: ["tendon", "laceration", "flexor", "cascade", "exam"],
  },
  {
    id: "scaphoid-normal-xray",
    title: "The fracture that wasn't there — until it was",
    vignette: "A 22-year-old falls on his wrist playing soccer. The ED x-ray is read as normal. He is discharged with a diagnosis of 'wrist sprain.' At 6 weeks he returns with persistent pain. MRI shows an established scaphoid waist fracture with early AVN of the proximal pole.",
    mistake: "Dismissing wrist pain as a sprain when initial x-rays are negative, without considering occult scaphoid fracture.",
    whyLearnersMakeIt: "A normal x-ray in a young patient with wrist pain is reassuring. 'Sprain' is a reasonable label when no fracture is seen. The scaphoid fracture line is notoriously subtle on plain films and easy to miss, especially in the first 72 hours.",
    whyItMatters: "Plain films miss ~20% of acute scaphoid fractures. The proximal pole has end-arterial blood supply — untreated fractures risk avascular necrosis, scaphoid nonunion, and eventual wrist arthritis (SNAC wrist). Early diagnosis and immobilization (or surgical fixation for displaced fractures) prevents these outcomes.",
    howToAvoidIt: "Anatomical snuffbox tenderness or pain with axial load on the thumb in a young patient with wrist injury = scaphoid fracture until proven otherwise. Immobilize in a thumb spica splint and obtain MRI within 72 hours if x-ray is negative. Do not send home with 'sprain' if snuffbox tenderness is present.",
    bestCorrectionOneLiner: "Snuffbox tenderness with a negative x-ray means scaphoid fracture until MRI proves otherwise — not a sprain.",
    tags: ["scaphoid", "fracture", "x-ray", "AVN", "diagnosis"],
  },
]

// ── Do-Not-Miss ───────────────────────────────────────────────────────────────

export type DoNotMissEntry = {
  id: string
  diagnosis: string
  clue: string
  badOutcome: string
  educationalPoint: string
  tags: string[]
}

export const DO_NOT_MISS: DoNotMissEntry[] = [
  {
    id: "fight-bite-joint",
    diagnosis: "Fight bite / MCP joint contamination",
    clue: "Any wound over the dorsal MCP in the context of a fist fight, regardless of wound size or delay in presentation.",
    badOutcome: "Primary closure or inadequate treatment → septic arthritis → joint cartilage destruction → permanent MCP stiffness and loss of grip.",
    educationalPoint: "The wound was inflicted with the fist clenched. When the hand opens, the skin wound 'closes' over the violated joint capsule, sealing oral flora inside. The wound size is always smaller than the depth of contamination.",
    tags: ["infection", "trauma", "fight-bite", "MCP", "emergency"],
  },
  {
    id: "acute-cts-distal-radius",
    diagnosis: "Acute carpal tunnel syndrome after distal radius fracture",
    clue: "Median nerve symptoms (numbness in thumb, index, long fingers; thenar weakness) that persist or worsen after closed reduction.",
    badOutcome: "Untreated acute CTS → permanent median nerve injury, thenar muscle wasting, loss of pinch strength.",
    educationalPoint: "Examine the median nerve before and after reduction and document both. Resolution after reduction is reassuring. Persistence or worsening after reduction is a surgical emergency: urgent carpal tunnel release, not observation.",
    tags: ["distal-radius", "nerve", "emergency", "median-nerve", "acute-CTS"],
  },
  {
    id: "pyogenic-tenosynovitis",
    diagnosis: "Pyogenic flexor tenosynovitis",
    clue: "Any of Kanavel's four signs — especially pain with passive extension of the digit (most sensitive single sign).",
    badOutcome: "Missed or delayed diagnosis → tendon necrosis within 48 hours → permanent loss of active digit flexion.",
    educationalPoint: "This is a closed synovial space infection. Oral antibiotics cannot adequately penetrate the sheath. Surgical drainage is always required. Any one Kanavel sign warrants immediate hand surgery consult.",
    tags: ["infection", "emergency", "kanavel", "tenosynovitis", "tendon"],
  },
  {
    id: "compartment-syndrome",
    diagnosis: "Upper extremity compartment syndrome",
    clue: "Pain out of proportion to injury; pain with passive stretch of muscles in the affected compartment; tenseness of the forearm or hand compartments. Pulse may be present — this does not rule it out.",
    badOutcome: "Untreated → Volkmann's ischemic contracture, permanent loss of forearm/hand function, possible limb loss.",
    educationalPoint: "Compartment syndrome is a clinical diagnosis. Do not wait for pressure measurements if the clinical picture is convincing. The classic '5 Ps' (pain, pallor, pulselessness, paresthesias, paralysis) are late findings — pallor and pulselessness indicate severe ischemia, not early compartment syndrome.",
    tags: ["emergency", "compartment-syndrome", "forearm", "ischemia"],
  },
  {
    id: "scaphoid-occult",
    diagnosis: "Occult scaphoid fracture with normal initial x-ray",
    clue: "Anatomical snuffbox tenderness and/or pain with axial load on the thumb after a wrist injury, even with a normal plain x-ray.",
    badOutcome: "Missed and untreated → scaphoid nonunion → avascular necrosis of the proximal pole → SNAC wrist (scaphoid nonunion advanced collapse) → wrist arthritis.",
    educationalPoint: "Plain films miss ~20% of acute scaphoid fractures, especially in the first 72 hours. Snuffbox tenderness = scaphoid until MRI proves otherwise. Immobilize in thumb spica and obtain MRI within 72 hours. Never send home as 'wrist sprain' without excluding scaphoid fracture.",
    tags: ["scaphoid", "fracture", "x-ray", "AVN", "diagnosis"],
  },
  {
    id: "dysvascular-digit",
    diagnosis: "Dysvascular digit",
    clue: "A finger or thumb that is pale, cool, capillary refill >2 seconds, or has loss of Doppler signal after hand trauma.",
    badOutcome: "Untreated ischemia → irreversible digit necrosis within 4–6 hours of warm ischemia.",
    educationalPoint: "Vascular injury in the hand requires replant or revascularization within the golden window. Identify which vessels are involved using a Doppler probe. Emergent hand surgery consult. Do not delay for advanced imaging if the digit is obviously ischemic.",
    tags: ["emergency", "vascular", "digit", "ischemia", "replant"],
  },
  {
    id: "open-fracture",
    diagnosis: "Open fracture with under-recognized soft tissue injury",
    clue: "Any laceration near a fracture — even a small puncture wound — is an open fracture until proven otherwise.",
    badOutcome: "Unrecognized open fracture → treated as closed → inadequate debridement → deep infection, osteomyelitis.",
    educationalPoint: "The Gustilo-Anderson classification guides management, but the most important step is recognizing the wound communicates with the fracture. Probe wounds near fractures. When in doubt, take to the OR for formal exploration. IV antibiotics should be started within 1 hour of presentation.",
    tags: ["fracture", "open-fracture", "infection", "debridement"],
  },
  {
    id: "tendon-laceration-abnormal-cascade",
    diagnosis: "Tendon laceration with abnormal resting cascade",
    clue: "A resting hand in which one or more fingers does not follow the normal cascade (progressive flexion from index to small), suggesting an undetected flexor tendon laceration.",
    badOutcome: "Missed partial or complete tendon laceration → delays primary repair → secondary repair in a scarred field → worse functional outcome or need for staged reconstruction.",
    educationalPoint: "Look at the resting cascade before you evaluate individual tendon function. A finger that rests more extended than its neighbors suggests a flexor tendon laceration. Test FDS and FDP independently for each finger. Active motion at a glance is not a tendon exam — a partial laceration retains some function until >50% cut.",
    tags: ["tendon", "laceration", "cascade", "flexor", "exam"],
  },
]
