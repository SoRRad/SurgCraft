import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { MISTAKE_MUSEUM } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Mistake Museum" }

function MistakeCard({ entry, index }: {
  entry: typeof MISTAKE_MUSEUM[number]
  index: number
}) {
  return (
    <article className="border border-rule rounded-lg bg-bg-elevated overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-rule">
        <div className="flex items-start gap-3">
          <span className="font-mono text-micro text-ink-muted flex-shrink-0 mt-0.5">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="font-fraunces text-h3 text-ink">{entry.title}</h2>
        </div>
        {entry.vignette && (
          <p className="mt-3 text-small text-ink-muted italic leading-relaxed pl-7">
            {entry.vignette}
          </p>
        )}
      </div>
      <div className="divide-y divide-rule">
        {[
          { label: "The mistake", value: entry.mistake, accent: true },
          { label: "Why learners make it", value: entry.whyLearnersMakeIt },
          { label: "Why it matters", value: entry.whyItMatters },
          { label: "How to avoid it", value: entry.howToAvoidIt },
          { label: "Best correction on rounds", value: entry.bestCorrectionOneLiner, quote: true },
        ].map(({ label, value, accent, quote }) => (
          <div key={label} className="px-5 py-4">
            <p className={`text-micro uppercase tracking-wider font-semibold mb-1.5 ${accent ? "text-terracotta" : "text-ink-muted"}`}>
              {label}
            </p>
            <p className={`text-body text-ink leading-relaxed ${quote ? "font-medium" : ""}`}>
              {quote ? `"${value}"` : value}
            </p>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function MistakesPage() {
  const firstThree = MISTAKE_MUSEUM.slice(0, 3)
  const lastThree = MISTAKE_MUSEUM.slice(3)

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <SectionMarker number="04" label="Mistake Museum" className="mb-3" />
          <h1 className="font-fraunces text-h1 text-ink mb-3">Common mistakes in hand surgery</h1>
          <p className="text-body text-ink-muted max-w-2xl">
            The mistakes that hand surgery attendings correct most often — with the cognitive trap that causes them, the clinical consequence, and the rule that prevents them.
          </p>
          <p className="mt-3 text-micro text-ink-muted">
            Local demo content · All cases synthetic · Not for clinical use
          </p>
        </div>

        {/* First row: 1 column (full-width) */}
        <section className="mb-8">
          <SectionMarker number="01" label="Don't close it" className="mb-4" />
          <MistakeCard entry={firstThree[0]} index={0} />
        </section>

        {/* Second row: 2 columns */}
        <section className="mb-8">
          <SectionMarker number="02" label="The splint problem" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MistakeCard entry={firstThree[1]} index={1} />
            <MistakeCard entry={firstThree[2]} index={2} />
          </div>
        </section>

        {/* Mascot interlude */}
        <div className="flex items-center gap-4 py-8 px-6 border-y border-rule my-8">
          <HandMascot pose="open" size={64} className="flex-shrink-0 opacity-70" />
          <p className="text-body text-ink-muted italic">
            The attendings who write these cases were once the residents who made these mistakes. That is how the pearls get written.
          </p>
        </div>

        {/* Third row: full-width */}
        <section className="mb-8">
          <SectionMarker number="03" label="The infection trap" className="mb-4" />
          <MistakeCard entry={lastThree[0]} index={3} />
        </section>

        {/* Fourth row: 2 columns */}
        <section className="mb-8">
          <SectionMarker number="04" label="The examination problem" className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MistakeCard entry={lastThree[1]} index={4} />
            <MistakeCard entry={lastThree[2]} index={5} />
          </div>
        </section>

      </div>
    </AppShell>
  )
}
