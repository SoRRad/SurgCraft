// Week 5: pimping response grading via Claude
// Returns a score (0-3) and "the right way to answer on rounds" debrief
export type PimpingGrade = {
  score: 0 | 1 | 2 | 3
  feedback: string
  rightAnswer: string
}
