import { SectionMarker } from "@/components/shell/SectionMarker"

export type ReasoningAutopsyData = {
  shouldHaveNoticedEarly: string
  whatChangesManagement: string
  attendingMayAskNext: string
  bestRoundsOneLiner: string
  commonMistake: string
  onePearlToRemember: string
}

const FIELDS: Array<{ key: keyof ReasoningAutopsyData; label: string }> = [
  { key: "shouldHaveNoticedEarly", label: "What you should have noticed early" },
  { key: "whatChangesManagement", label: "What changes management" },
  { key: "attendingMayAskNext", label: "What the attending may ask next" },
  { key: "bestRoundsOneLiner", label: "Best rounds one-liner" },
  { key: "commonMistake", label: "Common mistake" },
  { key: "onePearlToRemember", label: "One pearl to remember" },
]

interface ReasoningAutopsyProps {
  data: ReasoningAutopsyData
}

export function ReasoningAutopsy({ data }: ReasoningAutopsyProps) {
  return (
    <section aria-labelledby="autopsy-heading" className="mt-10">
      <SectionMarker number="06" label="Reasoning Autopsy" className="mb-5" />
      <p className="text-small text-ink-muted mb-6">
        What a senior resident would notice, how they would frame it on rounds, and where learners typically get tripped up.
      </p>
      <div className="space-y-5">
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="border border-rule rounded-lg p-4 bg-bg-elevated">
            <p className="text-micro font-semibold uppercase tracking-wider text-terracotta mb-2">
              {label}
            </p>
            <p className="text-body text-ink leading-relaxed">{data[key]}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-micro text-ink-muted italic">
        Local demo content · needs faculty verification before pilot use.
      </p>
    </section>
  )
}
