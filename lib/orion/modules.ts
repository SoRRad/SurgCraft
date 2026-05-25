/**
 * ORION Surgery module registry.
 *
 * Each surgical subspecialty is a module. Phase 0B.2 ships only the Hand
 * module as active. Other modules are placeholder "in development" entries
 * that show a faculty-recruitment page when visited.
 *
 * Adding a new module:
 *   1. Add an entry below with `status: "in-development"`.
 *   2. When ready to ship, flip to `status: "active"` and add routes.
 */

import type { LucideIcon } from "lucide-react"
import {
  Hand,
  Ribbon,
  Bone,
  Scissors,
  Baby,
  Activity,
} from "lucide-react"

export type ModuleStatus = "active" | "in-development" | "planned"

export type SurgicalModule = {
  /** Stable URL slug — used in /m/[id] routes. */
  id: string
  /** Display name in module chip + dropdown. */
  name: string
  /** Slightly longer name for cards/About. */
  fullName: string
  /** One-line description. */
  tagline: string
  /** Lucide icon for the picker. */
  icon: LucideIcon
  status: ModuleStatus
  /** Where module home routes to when status is active. Null otherwise. */
  homeRoute: string | null
  /** Color accent slot — re-uses design tokens. */
  accent: "terracotta" | "electric" | "correct" | "warn" | "wrong"
  /** Faculty recruitment / context note for in-development modules. */
  recruitmentNote?: string
}

export const MODULES: readonly SurgicalModule[] = [
  {
    id: "hand",
    name: "Hand",
    fullName: "Hand & Upper Extremity",
    tagline:
      "Hand trauma, infection, tendon, nerve, and fracture education for medical learners.",
    icon: Hand,
    status: "active",
    homeRoute: "/c",
    accent: "terracotta",
  },
  {
    id: "bariatric",
    name: "Bariatric",
    fullName: "Bariatric & Metabolic Surgery",
    tagline:
      "Pre-operative selection, operative anatomy, and post-operative complications in bariatric surgery.",
    icon: Activity,
    status: "in-development",
    homeRoute: null,
    accent: "electric",
    recruitmentNote:
      "Seeking a bariatric surgery faculty champion to co-author seed cases and validate the pitfall and red-flag libraries for this module.",
  },
  {
    id: "foot-ankle",
    name: "Foot & Ankle",
    fullName: "Foot & Ankle Surgery",
    tagline:
      "Ankle fractures, foot trauma, diabetic foot, and reconstructive principles.",
    icon: Bone,
    status: "in-development",
    homeRoute: null,
    accent: "correct",
    recruitmentNote:
      "Seeking a foot & ankle faculty champion to scope the first set of cases — diabetic foot, ankle fractures, and Achilles rupture are likely candidates.",
  },
  {
    id: "plastic",
    name: "Plastic",
    fullName: "Plastic & Reconstructive Surgery",
    tagline:
      "Reconstructive ladder, flap selection, wound coverage, and aesthetic principles.",
    icon: Scissors,
    status: "in-development",
    homeRoute: null,
    accent: "warn",
    recruitmentNote:
      "Seeking a plastic surgery faculty champion. Initial scope: reconstructive ladder, flap anatomy, and wound-coverage decision frameworks.",
  },
  {
    id: "pediatric",
    name: "Pediatric",
    fullName: "Pediatric Surgery",
    tagline:
      "Common pediatric surgical conditions, age-specific differentials, and family-centered communication.",
    icon: Baby,
    status: "in-development",
    homeRoute: null,
    accent: "wrong",
    recruitmentNote:
      "Seeking a pediatric surgery faculty champion. Initial scope: appendicitis, pyloric stenosis, intussusception, and inguinal hernia.",
  },
  {
    id: "vascular",
    name: "Vascular",
    fullName: "Vascular Surgery",
    tagline:
      "Limb ischemia, aneurysmal disease, access surgery, and endovascular fundamentals.",
    icon: Ribbon,
    status: "in-development",
    homeRoute: null,
    accent: "electric",
    recruitmentNote:
      "Seeking a vascular surgery faculty champion. Initial scope: acute limb ischemia, AAA recognition, and dialysis access fundamentals.",
  },
] as const

export const ACTIVE_MODULES = MODULES.filter((m) => m.status === "active")
export const IN_DEVELOPMENT_MODULES = MODULES.filter(
  (m) => m.status === "in-development",
)

/** The single active module in Phase 0B.2 — Hand. */
export const DEFAULT_MODULE: SurgicalModule = ACTIVE_MODULES[0] ?? MODULES[0]

export function getModule(id: string): SurgicalModule | undefined {
  return MODULES.find((m) => m.id === id)
}
