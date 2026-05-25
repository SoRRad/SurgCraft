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

// Migration helper: carry over data saved under the legacy Handcraft key.
export function migrateFromWeek1Key(): void {
  if (typeof window === "undefined") return
  const old = localStorage.getItem("handcraft_user")
  if (old && !localStorage.getItem(KEY)) {
    localStorage.setItem(KEY, old)
  }
}
