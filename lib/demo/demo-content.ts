// Single source of truth for authored demo content.
// Import from here rather than scattering constants across components.
// All content is authored here; local-demo-engine.ts has the matching logic.

// ── Seed cases (re-export references) ────────────────────────────────────────

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
    id: "flexor-tendon-zones",
    label: "Flexor tendon zones",
    suggestedQuestion: "What are the flexor tendon zones and why does Zone II have the worst prognosis?",
    difficulty: "intro",
  },
  {
    id: "extensor-compartments",
    label: "Extensor compartments",
    suggestedQuestion: "Name the six dorsal wrist compartments and their contents.",
    difficulty: "intermediate",
  },
  {
    id: "scaphoid",
    label: "Scaphoid anatomy & fractures",
    suggestedQuestion: "Why are proximal pole scaphoid fractures at high risk for AVN?",
    difficulty: "intermediate",
  },
  {
    id: "kanavel",
    label: "Kanavel's signs",
    suggestedQuestion: "What are Kanavel's four cardinal signs of pyogenic flexor tenosynovitis?",
    difficulty: "intro",
  },
  {
    id: "fight-bite",
    label: "Fight bite / clenched-fist injury",
    suggestedQuestion: "How do you manage a wound over the dorsal MCP in a young adult?",
    difficulty: "intermediate",
  },
  {
    id: "mallet-finger",
    label: "Mallet finger",
    suggestedQuestion: "What is the treatment for bony mallet finger with <30% articular involvement?",
    difficulty: "intro",
  },
  {
    id: "distal-radius",
    label: "Distal radius fractures",
    suggestedQuestion: "What are the acceptable closed reduction parameters for a distal radius fracture?",
    difficulty: "intermediate",
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

// ── Mistake museum stubs ──────────────────────────────────────────────────────
// Fully authored content added in Part B

export type MistakeEntry = {
  id: string
  title: string
  vignette: string
  theMistake: string
  whyItMatters: string
  rightMove: string
  pearl: string
  tags: string[]
}

export const MISTAKE_MUSEUM: MistakeEntry[] = [
  {
    id: "fight-bite-closed",
    title: "The wound that should not have been closed",
    vignette: "A 22-year-old presents to urgent care with a small wound over his right 5th MCP. The PA closes it with 3 interrupted nylons and discharges him on cephalexin.",
    theMistake: "Primary closure of a fight bite over the MCP joint.",
    whyItMatters: "Fight bites involve the joint capsule. Closing seals oral flora — including Eikenella — inside the joint. The patient returns in 48 hours with septic arthritis.",
    rightMove: "Never close a fight bite primarily. Explore, irrigate, leave open. Admit, IV ampicillin-sulbactam, hand surgery consult for OR washout.",
    pearl: "Any wound over the dorsal MCP in a young adult is a fight bite until proven otherwise — and the joint is involved until proven otherwise.",
    tags: ["infection", "trauma", "MCP", "fight-bite"],
  },
  {
    id: "mallet-flexed-once",
    title: "The splint that flexed once",
    vignette: "A patient with a mallet finger is splinted and doing well at 4 weeks. She removes the splint briefly to shower. The DIP flexes. The orthopedic tech tells her it's fine since she's almost done.",
    theMistake: "Allowing any DIP flexion during the 6-week full-time splinting period.",
    whyItMatters: "The terminal extensor tendon heals under tension. Any flexion disrupts healing and restarts the clock. Non-compliance is the #1 reason mallet fingers fail conservative treatment.",
    rightMove: "The clock restarts. Restart 6 weeks of full-time DIP extension splinting. Explain why — patients are more compliant when they understand the mechanism.",
    pearl: "Tell the patient. Tell them again. Write it on the splint.",
    tags: ["extensor", "mallet-finger", "splinting", "DIP"],
  },
  {
    id: "median-nerve-watched",
    title: "The nerve that was watched",
    vignette: "A 55-year-old sustains a distal radius fracture reduced in the ED. Post-reduction x-ray looks acceptable. She complains of numbness in her thumb and index finger. The team decides to watch it.",
    theMistake: "Watching median nerve symptoms that persist after closed reduction.",
    whyItMatters: "Persistent median nerve symptoms after reduction indicate acute carpal tunnel syndrome from hematoma or fracture fragment compression. The window for decompression is time-sensitive.",
    rightMove: "Re-examine median nerve after reduction. Symptoms resolve → observe. Symptoms persist → urgent carpal tunnel release. Do not watch and wait.",
    pearl: "Median nerve symptoms that persist after reduction are an emergency, not a watch-and-wait.",
    tags: ["distal-radius", "median-nerve", "carpal-tunnel", "acute-CTS"],
  },
]

// ── Do-not-miss stubs ─────────────────────────────────────────────────────────

export type DoNotMissEntry = {
  id: string
  diagnosis: string
  keyFinding: string
  consequence: string
  pearl: string
  tags: string[]
}

export const DO_NOT_MISS: DoNotMissEntry[] = [
  {
    id: "pyogenic-tenosynovitis",
    diagnosis: "Pyogenic flexor tenosynovitis",
    keyFinding: "Any of Kanavel's four signs — especially pain with passive extension",
    consequence: "Missed diagnosis → tendon necrosis, permanent loss of digit function",
    pearl: "If you even think pyogenic tenosynovitis, it's a hand surgery consult now, not after you get labs back.",
    tags: ["infection", "emergency", "kanavel"],
  },
  {
    id: "fight-bite-joint",
    diagnosis: "MCP joint involvement in fight bite",
    keyFinding: "Any wound over the dorsal MCP in the context of a fist fight",
    consequence: "Primary closure → septic arthritis → joint destruction",
    pearl: "The tooth enters the joint when the fist is clenched; the skin wound closes as the hand extends. The wound size lies.",
    tags: ["infection", "trauma", "fight-bite"],
  },
  {
    id: "acute-cts-post-reduction",
    diagnosis: "Acute carpal tunnel syndrome after distal radius fracture",
    keyFinding: "Median nerve symptoms that persist or worsen after closed reduction",
    consequence: "Untreated → permanent median nerve injury, thenar wasting",
    pearl: "Check median nerve before AND after reduction. Different findings = different decisions.",
    tags: ["distal-radius", "nerve", "emergency"],
  },
]
