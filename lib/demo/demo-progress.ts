// SSR-safe localStorage helpers for demo progress state.
// In Phase 0C+, this will be backed by Supabase (case_attempts, pearl_unlocks, streaks).

export type DemoProgress = {
  completedCaseIds: string[]
  unlockedPearlIds: string[]
  viewedMistakeIds: string[]
  viewedDoNotMissIds: string[]
  sessionCount: number
  questionCount: number
  lastActiveDate: string | null
}

const KEY = "surgicraft_demo_progress"

const DEFAULT_PROGRESS: DemoProgress = {
  completedCaseIds: [],
  unlockedPearlIds: [],
  viewedMistakeIds: [],
  viewedDoNotMissIds: [],
  sessionCount: 0,
  questionCount: 0,
  lastActiveDate: null,
}

export function getDemoProgress(): DemoProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS }
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } : { ...DEFAULT_PROGRESS }
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveDemoProgress(progress: DemoProgress): void {
  if (typeof window === "undefined") return
  localStorage.setItem(KEY, JSON.stringify(progress))
}

export function markCaseCompleted(caseId: string): void {
  const p = getDemoProgress()
  if (!p.completedCaseIds.includes(caseId)) {
    p.completedCaseIds.push(caseId)
  }
  p.lastActiveDate = new Date().toISOString().split("T")[0]
  saveDemoProgress(p)
}

export function unlockPearl(pearlId: string): void {
  const p = getDemoProgress()
  if (!p.unlockedPearlIds.includes(pearlId)) {
    p.unlockedPearlIds.push(pearlId)
  }
  saveDemoProgress(p)
}

export function incrementQuestionCount(): void {
  const p = getDemoProgress()
  p.questionCount += 1
  p.lastActiveDate = new Date().toISOString().split("T")[0]
  saveDemoProgress(p)
}

export function clearDemoProgress(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}
