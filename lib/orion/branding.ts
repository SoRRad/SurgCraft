/**
 * ORION Surgery branding constants.
 *
 * Single source of truth for the platform name, tagline, and module identity.
 * Import from here rather than hard-coding strings in components.
 *
 * Note: localStorage keys still use the legacy "surgicraft:*" namespace and
 * are intentionally not renamed, to preserve existing learner data through
 * the rebrand. Only user-facing strings and documentation were renamed.
 */

export const PLATFORM = {
  /** Short wordmark — used in headers, browser tab titles, etc. */
  short: "ORION",
  /** Display wordmark. */
  full: "ORION Surgery",
  /** The acronym expanded — used on About, footer tooltip, page metadata. */
  tagline: "Operative Reasoning and Interactive Online Navigator",
  /** Display mark including the active module separator. */
  withModule: (moduleName: string) => `ORION · ${moduleName}`,
  /** One-line elevator description. */
  oneLiner:
    "Interactive surgical education platform for medical students, residents, and fellows.",
  /** Where the pilot is happening. */
  pilotOrg: "Mayo Clinic",
} as const

/**
 * Educational-only disclaimer — required surface on every chat surface,
 * library page, footer, and onboarding screen.
 */
export const SAFETY = {
  short: "Educational only · No PHI",
  long: "Educational use only. Not for clinical decision-making.",
  realPatient:
    "I can't help with real patient care. Call your senior and the relevant surgical service. " +
    "I'm here for educational discussion only — if you want, I can convert this into a synthetic teaching case.",
} as const
