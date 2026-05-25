import type { ReactNode } from "react"
import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { ChevronDown } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About ORION Surgery",
  description:
    "About ORION Surgery — Operative Reasoning and Interactive Online Navigator. Multi-module surgical education platform piloting at Mayo Clinic.",
}

function CollapsibleSection({
  number,
  label,
  defaultOpen = false,
  children,
}: {
  number: string | number
  label: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group/section mb-4 overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 transition-colors duration-200 ease-standard hover:bg-surface-subtle/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-inset">
        <SectionMarker number={number} label={label} />
        <ChevronDown size={16} className="text-ink-faint transition-transform duration-300 ease-standard group-open/section:rotate-180" />
      </summary>
      <div className="border-t border-rule/60 px-5 py-5">
        <div className="space-y-4 text-body leading-relaxed text-ink">
          {children}
        </div>
      </div>
    </details>
  )
}

export default function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Title */}
        <div className="mb-10">
          <p className="mb-2 text-micro font-semibold uppercase tracking-[0.22em] text-ink-muted">
            ORION Surgery
          </p>
          <h1 className="font-fraunces text-h1 leading-tight text-ink">About</h1>
          <p className="mt-3 text-body text-ink-muted">
            <span className="font-medium text-ink">O</span>perative{" "}
            <span className="font-medium text-ink">R</span>easoning and{" "}
            <span className="font-medium text-ink">I</span>nteractive{" "}
            <span className="font-medium text-ink">O</span>nline{" "}
            <span className="font-medium text-ink">N</span>avigator.
          </p>
          <p className="mt-1 text-body text-ink-muted">
            Active module: <span className="font-medium text-ink">Hand</span> · Piloting at Mayo Clinic.
          </p>
        </div>

        {/* Top disclaimer — loud */}
        <div className="mb-10 rounded-2xl border border-terracotta-soft bg-terracotta-soft p-5">
          <p className="mb-2 text-small font-semibold uppercase tracking-wide text-terracotta">
            Educational use only
          </p>
          <p className="text-body text-ink">
            ORION is <strong className="font-semibold">not</strong> clinical decision support. It is a learning tool for medical students, residents, and fellows. No content here should be used to guide the care of a real patient. <strong>Do not enter PHI</strong> (names, MRNs, DOBs, images, or any patient identifiers). For real patients, consult your senior and the relevant attending.
          </p>
        </div>

        {/* C1 — Platform vs. Module — open by default */}
        <CollapsibleSection number="01" label="ORION vs. its modules" defaultOpen>
          <p>
            <strong>ORION Surgery</strong> is the platform. It is designed to host multiple surgical subspecialty modules, each with its own knowledge base, cases, common-pitfall library, red-flag library, and pearl registry.
          </p>
          <p>
            The active module today is <strong>Hand</strong> (hand surgery — trauma, infection, tendon, nerve, fracture). The platform is built so additional modules can be brought online when a faculty champion signs on to author and validate content. See <Link href="/modules" className="text-electric hover:underline">the module index</Link> for the full list and current status.
          </p>
          <p>
            In the UI hierarchy, the wordmark stays <strong>ORION</strong> and the current module appears as a chip next to it. The chip is a switcher: tap it to jump between modules.
          </p>
        </CollapsibleSection>

        {/* C2 — Pedagogical philosophy — open by default */}
        <CollapsibleSection number="02" label="Pedagogical philosophy" defaultOpen>
          <p>
            ORION is built around <strong>active recall in conversation</strong>. Most learning platforms hand you a textbook chapter or a flashcard. We hand you a chat input and a Socratic tutor who adapts depth to your training level.
          </p>
          <p>The core moves we try to teach:</p>
          <ul className="space-y-2 pl-0">
            {[
              ["Recognition", "What to spot at first contact (the red-flag reflex)."],
              ["Reasoning", "How to integrate history, exam, imaging, and labs into a working diagnosis."],
              ["Decision", "How to choose between management options, and the reasoning errors that derail learners (the common-pitfall library)."],
              ["Communication", "How to defend the plan on rounds in one sentence (the rounds one-liner)."],
              ["Reflection", "What you should have noticed earlier — the case debrief at case end."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-terracotta" aria-hidden="true" />
                <span><strong className="text-ink">{title}.</strong> {body}</span>
              </li>
            ))}
          </ul>
          <p>
            Across Bloom&apos;s taxonomy we target the upper levels: <em>apply</em>, <em>analyze</em>, <em>evaluate</em> — not just <em>remember</em>. The bot is allowed to push back, ask clarifying questions, and quiz the learner.
          </p>
        </CollapsibleSection>

        {/* C3 — Personas + use cases */}
        <CollapsibleSection number="03" label="Who this is for">
          <div className="space-y-3">
            {[
              {
                who: "M3 / sub-I",
                use:
                  "You don’t want to embarrass yourself on rounds tomorrow. Use the tutor for one-liners and the common-pitfall library to internalize the common traps.",
              },
              {
                who: "Intern · night float",
                use:
                  "A consult just came in. Quiz the bot on the red-flag library for the relevant subspecialty before you walk into the room.",
              },
              {
                who: "PGY-2 cramming for ABSITE / in-service",
                use:
                  "Work through cases, use quiz mode at standard intensity, save high-yield pearls.",
              },
              {
                who: "PGY-4 prepping for a case",
                use:
                  "Ask the tutor for the operative anatomy and likely intra-op questions. Use quiz mode at “pyrotechnic” intensity for the attending-voice debrief.",
              },
              {
                who: "Fellow refining decision-making",
                use:
                  "Use the Reasoning Autopsy at case end to challenge your own framing. Flag any content that needs faculty correction.",
              },
            ].map(({ who, use }) => (
              <div key={who} className="rounded-xl border border-rule/60 bg-bg p-3">
                <p className="mb-0.5 text-small font-semibold text-ink">{who}</p>
                <p className="text-small text-ink-muted">{use}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* C1 — How it works (data flow) */}
        <CollapsibleSection number="04" label="How it works">
          <p>
            ORION is a Next.js app. In Phase 0B.2 it has no database and no accounts — everything lives in your browser&apos;s localStorage. There are two operating modes:
          </p>

          <div className="rounded-2xl border border-rule/60 bg-bg p-5 font-mono text-small text-ink">
            <p className="mb-3 text-micro uppercase tracking-[0.16em] text-ink-faint">Mock mode (default)</p>
            <pre className="overflow-x-auto whitespace-pre text-small leading-relaxed">
{`Browser  ──▶  Next.js /api/chat  ──▶  MockProvider (deterministic)
                                       │
                                       └──▶  canned tutor + tool calls`}
            </pre>
            <p className="mt-5 mb-3 text-micro uppercase tracking-[0.16em] text-ink-faint">Live mode (Anthropic)</p>
            <pre className="overflow-x-auto whitespace-pre text-small leading-relaxed">
{`Browser  ──▶  Next.js /api/chat  ──▶  AnthropicProvider (server-only)
                ▲                       │
                │                       └──▶  Claude Sonnet 4.5 (streaming)
                │
        ANTHROPIC_API_KEY stays on the server`}
            </pre>
          </div>

          <p>
            Conversations, saved pearls, flagged messages, and the learner profile are stored in <code className="rounded bg-bg px-1 py-0.5 font-mono text-small">localStorage</code> under the legacy <code className="rounded bg-bg px-1 py-0.5 font-mono text-small">surgicraft:*</code> namespace (preserved through the rebrand for backward compatibility). Nothing is sent to any analytics endpoint. There is no tracking.
          </p>
          <p>
            Export and import your local data anytime from <strong>Settings → Data export</strong>.
          </p>
        </CollapsibleSection>

        {/* C4 — Synthetic case */}
        <CollapsibleSection number="05" label="What is a synthetic case?">
          <p>
            Every case in ORION is <strong>entirely fictional</strong>. No real patient was used as source material. Demographics, mechanisms, exam findings, imaging, and labs are constructed by the authors to teach a specific learning point.
          </p>
          <p>
            Each case is marked <code className="rounded bg-bg px-1 py-0.5 font-mono text-small">verified: false</code> in the JSON file until a hand surgery attending signs off — the central tracking lives in <code className="rounded bg-bg px-1 py-0.5 font-mono text-small">CONTENT_REVIEW.md</code> and is mirrored in the in-app faculty review portal.
          </p>
          <p>
            Faculty contributors can edit case JSONs directly (via PR) or through the planned Phase 0C admin UI. Real patient data never enters this system.
          </p>
        </CollapsibleSection>

        {/* C5 — Faculty involvement */}
        <CollapsibleSection number="06" label="Faculty involvement model">
          <p>What we ask of a faculty champion for a module:</p>
          <ul className="space-y-2 pl-0">
            {[
              ["Time commitment", "Roughly 1–2 hours per content batch (5–10 entries) during the early review cycles, then ad-hoc as content grows."],
              ["Review cadence", "We commit to never pushing unreviewed content to a resident. Faculty pace the review; the platform adapts."],
              ["Attribution", "Every faculty-authored or faculty-reviewed entry carries an attribution that is shown next to the content. No anonymous pearls."],
              ["Co-authorship", "Faculty who contribute multiple modules or review at scale are listed as co-authors in academic outputs from the pilot."],
              ["Out", "Faculty can withdraw their content at any time; their material is removed from the live app within one update cycle."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-electric" aria-hidden="true" />
                <span><strong className="text-ink">{title}.</strong> {body}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* C6 — Privacy & data */}
        <CollapsibleSection number="07" label="Privacy and data">
          <p>The privacy contract is strict and intentionally narrow.</p>
          <ul className="space-y-2 pl-4 list-none">
            {[
              "No PHI ever. Learners must not enter names, MRNs, DOBs, images, or any patient identifiers. The tutor refuses real-patient prompts and redirects to a synthetic case.",
              "No accounts, no analytics in Phase 0B. Onboarding writes an anonymous learner profile to your browser only.",
              "No content leaves your browser in mock mode. In live mode, only chat messages reach Anthropic; the API key stays on the server.",
              "Individual responses are private. Faculty and program directors cannot see how you score. Aggregate anonymized data — when introduced in Phase 0C — only describes platform-level usage.",
              "All conversations, pearls, and flags can be exported, imported, or cleared from Settings at any time.",
              "No public ranking. No leaderboards. No scores visible to attendings.",
            ].map((rule) => (
              <li key={rule} className="flex gap-3 text-body">
                <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-correct" aria-hidden="true" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* C10 — Citations & sources */}
        <CollapsibleSection number="08" label="Content sources and citation policy">
          <p>
            All content is governed by the following policy, to be reviewed by Mayo legal before pilot launch:
          </p>
          <div className="space-y-3">
            {[
              { source: "Faculty-written notes and pearls", policy: "Usable in full after explicit approval from the authoring faculty member. Attributed." },
              { source: "Mayo internal hand curriculum", policy: "Usable in full — Mayo-only deployment. Faculty approval required per section." },
              { source: "ASPS / PSEN course content", policy: "Link out only. Do not ingest unless explicitly licensed." },
              { source: "Textbooks (Green's, Wolfe, etc.)", policy: "Cite and paraphrase findings. Never reproduce verbatim." },
              { source: "Journal articles", policy: "Cite via DOI and paraphrase conclusions. Never reproduce." },
              { source: "Open guidelines (AAOS, ASSH, ASPS position statements)", policy: "Cite and summarize. Fine to reproduce short excerpts with attribution." },
              { source: "Real patient data from EPIC or other EMR", policy: "Never. Not in any phase of this pilot." },
            ].map(({ source, policy }) => (
              <div key={source} className="rounded-xl border border-rule/60 bg-bg p-3">
                <p className="mb-0.5 text-small font-semibold text-ink">{source}</p>
                <p className="text-small text-ink-muted">{policy}</p>
              </div>
            ))}
          </div>

          <p className="text-small text-ink-muted">
            The current source list seeded in ORION: Wolfe et al., <em>Green&apos;s Operative Hand Surgery</em>; AAOS Clinical Practice Guideline on Distal Radius Fractures; Patzakis MJ et al., <em>Management of human bite injuries of the hand</em>; Lin JS &amp; Samora JB, <em>Surgical and Nonsurgical Management of Mallet Finger</em>. Additional sources are added to <Link href="/admin/review" className="text-electric hover:underline">CONTENT_REVIEW.md</Link> as they are introduced.
          </p>
        </CollapsibleSection>

        {/* C7 — Roadmap (always open) */}
        <CollapsibleSection number="09" label="Phase roadmap" defaultOpen>
          <div className="space-y-4">
            {[
              { phase: "Phase 0A", status: "done", description: "Local faculty-demo foundation. Mock LLM, onboarding, synthetic cases, common-pitfall and red-flag libraries." },
              { phase: "Phase 0B.1", status: "done", description: "Stabilization: request validation, provider status, local persistence, saved pearls, local flags, tests, CI, QA checklist." },
              { phase: "Phase 0B.2", status: "active", description: "Faculty-demo polish + ORION rebrand + multi-module foundation + redesign + demo-mode skip-onboarding + slash commands and keyboard shortcuts." },
              { phase: "Phase 0C", status: "planned", description: "Supabase database, pgvector RAG, user accounts, faculty verification workflow, governed flagged-output review." },
              { phase: "Phase 1 (Pilot)", status: "future", description: "10–20 residents at Mayo. Faculty-reviewed content. Mayo-sanctioned hosting. Learning analytics focused on education — no leaderboards or public ranking." },
              { phase: "Phase 2+", status: "future", description: "Wider Mayo deployment. Additional modules as faculty champions sign on. Multi-institution scoping." },
            ].map(({ phase, status, description }) => (
              <div key={phase} className="flex gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                      status === "active" || status === "done"
                        ? "bg-correct"
                        : status === "planned"
                          ? "bg-electric"
                          : "bg-rule"
                    }`}
                  />
                  <div className="w-px flex-1 bg-rule" />
                </div>
                <div className="pb-4">
                  <p className="text-small font-semibold text-ink">{phase}</p>
                  <p className="mt-0.5 text-small text-ink-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* C8 — Glossary */}
        <CollapsibleSection number="10" label="Glossary">
          <p className="text-small text-ink-muted">For cross-disciplinary readers — define-once for terms used across the app.</p>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["PGY", "Post-graduate year (residency training year)."],
              ["M3 / M4", "Third- / fourth-year medical student."],
              ["Sub-I", "Sub-internship — a senior medical student rotating in a near-intern role."],
              ["Attending", "The senior physician with ultimate responsibility for patient care."],
              ["Pimping", "Faculty rapid-fire questioning of trainees, traditionally on rounds."],
              ["Pearl", "A short, attributable clinical insight worth remembering."],
              ["Rounds one-liner", "The single sentence you give an attending when defending a plan."],
              ["Kanavel signs", "Four cardinal signs of pyogenic flexor tenosynovitis."],
              ["FOOSH", "Fall On Outstretched Hand (mechanism of injury)."],
              ["MCP / PIP / DIP", "Metacarpophalangeal / proximal / distal interphalangeal joints."],
              ["Case debrief", "An end-of-case review that surfaces what a senior learner would have noticed earlier."],
              ["Common pitfalls / Red flags", "ORION's two error libraries. Pitfalls = decision-time reasoning errors. Red flags = recognition-time presentations you cannot miss."],
            ].map(([term, definition]) => (
              <div key={term} className="rounded-xl border border-rule/60 bg-bg p-3">
                <dt className="text-small font-semibold text-ink">{term}</dt>
                <dd className="mt-0.5 text-small text-ink-muted">{definition}</dd>
              </div>
            ))}
          </dl>
        </CollapsibleSection>

        {/* C9 — Acknowledgments */}
        <CollapsibleSection number="11" label="Team and acknowledgments" defaultOpen>
          <div className="rounded-2xl border border-rule/60 bg-bg p-4">
            <p className="font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-terracotta">
              Project lead
            </p>
            <p className="mt-1 text-h3 font-fraunces text-ink">Reza Shahriarirad</p>
            <p className="text-small text-ink-muted">Research Fellow</p>
            <p className="mt-2 text-small text-ink-muted">
              Design, engineering, and content scaffolding for ORION Surgery&apos;s Phase 0 prototype.
            </p>
          </div>

          <p className="text-small text-ink-muted">
            Faculty champions, attending reviewers, and resident testers will be acknowledged here as each module&apos;s content is reviewed and approved. ORION is intended as a collaboration between the development team and surgical educators at Mayo Clinic.
          </p>

          <p className="text-small text-ink-muted">
            If you are a surgical educator interested in championing a module, see <Link href="/modules" className="text-electric hover:underline">the modules page</Link> for current openings and contact details.
          </p>
        </CollapsibleSection>

        {/* Bottom note */}
        <div className="mt-8 rounded-2xl border border-rule bg-bg-elevated p-4">
          <p className="text-small text-ink-muted">
            <strong className="text-ink">Why mock mode by default?</strong>{" "}
            Avoiding cost during faculty review, avoiding compliance complexity before a Mayo-sanctioned environment is established, and making faculty demos frictionless: no keys, no setup, just{" "}
            <code className="mx-1 rounded bg-bg px-1.5 py-0.5 font-mono text-micro">npm install &amp;&amp; npm run dev</code>.
            The LLM layer is provider-agnostic, and Anthropic live mode is available when configured through the server route.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
