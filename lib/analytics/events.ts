// PostHog event taxonomy - Phase 1
// Self-hosted option available for HIPAA-adjacent compliance
export const events = {
  ONBOARDING_COMPLETE: "onboarding_complete",
  SESSION_START: "session_start",
  SESSION_END: "session_end",
  CASE_START: "case_start",
  CASE_COMPLETE: "case_complete",
  PEARL_UNLOCK: "pearl_unlock",
  FLAG_SUBMIT: "flag_submit",
  CONFIDENCE_SUBMIT: "confidence_submit",
} as const

