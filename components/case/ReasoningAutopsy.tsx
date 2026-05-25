import { Brain, CheckCircle, HelpCircle, Lightbulb, MessageSquareQuote, TriangleAlert } from "lucide-react"
import { SectionMarker } from "@/components/shell/SectionMarker"

export type ReasoningAutopsyData = {
  shouldHaveNoticedEarly: string
  whatChangesManagement: string
  attendingMayAskNext: string
  bestRoundsOneLiner: string
  commonMistake: string
  onePearlToRemember: string
}

const FIELDS: Array<{
  key: keyof ReasoningAutopsyData
  label: string
  icon: typeof Brain
}> = [
  { key: "shouldHaveNoticedEarly", label: "What you should have noticed early", icon: Brain },
  { key: "whatChangesManagement", label: "What changes management", icon: CheckCircle },
  { key: "attendingMayAskNext", label: "Attending may ask next", icon: HelpCircle },
  { key: "bestRoundsOneLiner", label: "Best rounds one-liner", icon: MessageSquareQuote },
  { key: "commonMistake", label: "Common mistake", icon: TriangleAlert },
  { key: "onePearlToRemember", label: "One pearl to remember", icon: Lightbulb },
]

interface ReasoningAutopsyProps {
  data: ReasoningAutopsyData
}

export function ReasoningAutopsy({ data }: ReasoningAutopsyProps) {
  return (
    <section aria-labelledby="autopsy-heading" className="mt-10">
      <div className="rounded-2xl border border-rule bg-bg-elevated p-5 shadow-soft">
        <SectionMarker number="06" label="Case debrief" className="mb-4" />
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="autopsy-heading" className="font-fraunces text-h2 text-ink heading-readable">
              How the case turns
            </h2>
            <p className="mt-2 max-w-2xl text-small text-ink-muted">
              The senior-resident view: what mattered early, what changes management, and how to say it on rounds.
            </p>
          </div>
          <span className="rounded-full bg-surface-subtle px-3 py-1 text-micro text-ink-muted">
            Demo content · needs faculty verification
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {FIELDS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="rounded-xl border border-rule/70 bg-bg p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
                  <Icon size={15} />
                </span>
                <p className="text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  {label}
                </p>
              </div>
              <p className="text-body leading-relaxed text-ink">{data[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
