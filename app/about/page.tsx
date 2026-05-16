import type { ReactNode } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About SurgiCraft: Handcraft",
}

function Section({ number, label, children }: {
  number: string | number
  label: string
  children: ReactNode
}) {
  return (
    <section className="mb-12">
      <SectionMarker number={number} label={label} className="mb-3" />
      <div className="space-y-4 text-body text-ink leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-14">

        {/* Title */}
        <div className="mb-12">
          <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-1">SurgiCraft platform</p>
          <h1 className="font-fraunces text-h1 text-ink">About</h1>
          <p className="mt-2 text-body text-ink-muted">
            SurgiCraft: Handcraft · Piloting at Mayo Clinic · Phase 0A
          </p>
        </div>

        {/* Disclaimer — prominent */}
        <div className="mb-12 p-5 border border-terracotta-soft bg-terracotta-soft rounded-lg">
          <p className="text-small font-medium text-terracotta uppercase tracking-wide mb-2">
            Educational use only
          </p>
          <p className="text-body text-ink">
            This application is <strong>not</strong> clinical decision support. It is a learning tool
            for medical students, residents, and fellows. No content here should be used to guide the
            care of a real patient. For real patients, consult your attending.
          </p>
        </div>

        {/* Platform vs. Module */}
        <Section number="01" label="SurgiCraft vs. Handcraft">
          <p>
            <strong>SurgiCraft</strong> is the platform — an interactive surgical education system
            built to meet learners where they are. It is designed to host multiple specialty-specific
            modules, each with its own knowledge base, cases, and mode structure.
          </p>
          <p>
            <strong>Handcraft</strong> is the first module — focused on hand surgery. It adapts its
            voice and depth to the learner&apos;s role, grounds answers in a curated knowledge base, and
            turns passive reading into active reasoning: Socratic dialogue, unfolding cases,
            calibrated confidence, and faculty pearls.
          </p>
          <p>
            In the UI hierarchy, Handcraft is the thing users interact with. SurgiCraft is the
            platform that houses it and will eventually house others (e.g., a foot-and-ankle module,
            a peripheral nerve module) as the pilot expands.
          </p>
        </Section>

        {/* Safety & Scope */}
        <Section number="02" label="Safety and scope">
          <p>
            This is an educational platform, not a clinical tool. The following rules are absolute:
          </p>
          <ul className="space-y-2 pl-4 list-none">
            {[
              "No protected health information (PHI). No real patient data enters this system.",
              "All clinical cases are entirely synthetic. No real patients were used as source material.",
              "The platform never gives clinical advice for real patients. If the bot is asked about a real patient, it redirects to the attending.",
              "No substitute for textbooks, ASPS modules, or attending teaching. This is a supplement, not a replacement.",
              "No public ranking system. Individual scores are never visible to faculty, attendings, or program directors.",
              "Aggregate anonymized data may be used to improve the platform. Individual responses are private.",
            ].map((rule) => (
              <li key={rule} className="flex gap-3 text-body">
                <span className="text-terracotta mt-0.5 flex-shrink-0">—</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Content ownership */}
        <Section number="03" label="Content ownership policy">
          <p>
            All content is governed by the following policy, reviewed by Mayo legal before the pilot:
          </p>
          <div className="space-y-3">
            {[
              {
                source: "Faculty-written notes and pearls",
                policy: "Usable in full after explicit approval from the authoring faculty member. Attributed.",
              },
              {
                source: "Mayo internal hand curriculum",
                policy: "Usable in full — Mayo-only deployment. Faculty approval required per section.",
              },
              {
                source: "ASPS / PSEN course content",
                policy: "Link out only. Do not ingest unless explicitly licensed.",
              },
              {
                source: "Textbooks (Green's, Wolfe, etc.)",
                policy: "Cite and paraphrase findings. Never reproduce verbatim.",
              },
              {
                source: "Journal articles",
                policy: "Cite via DOI and paraphrase conclusions. Never reproduce.",
              },
              {
                source: "Open guidelines (AAOS, ASSH, ASPS position statements)",
                policy: "Cite and summarize. Fine to reproduce short excerpts with attribution.",
              },
              {
                source: "Real patient data from EPIC or other EMR",
                policy: "Never. Not in any phase of this pilot.",
              },
            ].map(({ source, policy }) => (
              <div key={source} className="border border-rule rounded p-3">
                <p className="text-small font-medium text-ink mb-1">{source}</p>
                <p className="text-small text-ink-muted">{policy}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Phase roadmap */}
        <Section number="04" label="Phase roadmap">
          <div className="space-y-4">
            {[
              {
                phase: "Phase 0A (current)",
                status: "active",
                description:
                  "Fully local faculty-demo prototype. No external API keys required. Mock LLM provider. Validates educational structure, UX, and content before committing to infrastructure cost.",
              },
              {
                phase: "Phase 0B",
                status: "planned",
                description:
                  "Live LLM integration (provider-agnostic — could be Anthropic, OpenAI, Azure, or Mayo-hosted). Real streaming chat, tutor mode, case reveal logic. Still no auth, no database.",
              },
              {
                phase: "Phase 0C",
                status: "planned",
                description:
                  "Supabase database integration, pgvector RAG, user accounts, streak rings, pearl unlocks, flag-for-faculty flow. Confidence calibration tracking.",
              },
              {
                phase: "Phase 1 (Pilot)",
                status: "future",
                description:
                  "10–20 residents at Mayo. All 6 modes live. Leaderboards (opt-in, anonymous). Admin review UI for flagged content. KB ingestion pipeline.",
              },
              {
                phase: "Phase 2+",
                status: "future",
                description:
                  "Wider Mayo deployment. Second subspecialty module. Multi-institution architecture scoping. Mayo-sanctioned environment.",
              },
            ].map(({ phase, status, description }) => (
              <div key={phase} className="flex gap-4">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 ${
                      status === "active" ? "bg-correct" :
                      status === "planned" ? "bg-electric" : "bg-rule"
                    }`}
                  />
                  <div className="w-px flex-1 bg-rule" />
                </div>
                <div className="pb-4">
                  <p className="text-small font-medium text-ink">{phase}</p>
                  <p className="text-small text-ink-muted mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Phase 0A note */}
        <div className="p-4 border border-rule rounded-lg bg-bg-elevated">
          <p className="text-small text-ink-muted">
            <strong className="text-ink">Why no API in Phase 0A?</strong>{" "}
            Avoiding cost during early validation, avoiding compliance complexity before a Mayo-sanctioned
            environment is established, and making faculty demos frictionless — no keys, no setup, just
            <code className="font-mono text-micro mx-1">npm install && npm run dev</code>.
            The LLM layer is provider-agnostic: when Phase 0B begins, we swap the mock provider
            for a real one without rewriting any app code.
          </p>
        </div>

      </div>
    </AppShell>
  )
}
