// Week 4: Brier score per topic — confidence calibration tracking
// Brier score: mean squared error between predicted probability and outcome (0 or 1)
// Lower is better; 0 = perfect calibration, 1 = perfectly wrong
export function brierScore(
  confidencePercent: number,
  correct: boolean
): number {
  const p = confidencePercent / 100
  const o = correct ? 1 : 0
  return Math.pow(p - o, 2)
}

export type CalibrationRecord = {
  topic: string
  confidence: number
  correct: boolean
  score: number
  timestamp: string
}
