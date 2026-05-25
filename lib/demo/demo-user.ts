// SSR-safe localStorage helpers for demo user state.
// In Phase 0C+, this will be replaced by Supabase auth + users table.

import type { Role, Specialty } from "@/lib/supabase/types"

export type DemoUser = {
  handle: string
  role: Role
  pgy?: number | null       // null if not a resident/fellow
  specialty: Specialty
  onHandService: boolean
  primaryGoal: string
  comfort: {
    anatomy: number
    trauma: number
    congenital: number
    peripheralNerve: number
    microsurgery: number
  }
  /** True when the profile was created by the "Skip and try the demo" path. */
  guestMode?: boolean
  createdAt: string
}

const KEY = "surgicraft_demo_user"

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as DemoUser) : null
  } catch {
    return null
  }
}

export function saveDemoUser(user: DemoUser): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function clearDemoUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}

export function isDemoUserSaved(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(KEY) !== null
}

/**
 * Creates an anonymous "guest" learner profile so a faculty reviewer (or
 * a returning user) can land directly in chat without filling the
 * onboarding form. Stored locally just like a normal demo user.
 */
export function createGuestDemoUser(): DemoUser {
  return {
    handle: "Guest",
    role: "PGY-2",
    specialty: "Plastic Surgery",
    onHandService: true,
    primaryGoal: "Casual learning",
    comfort: {
      anatomy: 3,
      trauma: 3,
      congenital: 2,
      peripheralNerve: 2,
      microsurgery: 2,
    },
    guestMode: true,
    createdAt: new Date().toISOString(),
  }
}

/** One-shot helper for the landing/onboarding "Try the demo" buttons. */
export function startGuestSession(): void {
  saveDemoUser(createGuestDemoUser())
}

// Migration helper: carry over data saved under the legacy hand-era key.
export function migrateFromWeek1Key(): void {
  if (typeof window === "undefined") return
  const old = localStorage.getItem("handcraft_user")
  if (old && !localStorage.getItem(KEY)) {
    localStorage.setItem(KEY, old)
  }
}
