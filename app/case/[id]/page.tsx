"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Lock, MessageSquare } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReasoningAutopsy, type ReasoningAutopsyData } from "@/components/case/ReasoningAutopsy"
import { cn } from "@/lib/utils"

// -- Static case imports --------------------------------------------------------
import case001 from "@/content/cases/001-fight-bite.json"
import case002 from "@/content/cases/002-mallet-finger.json"
import case003 from "@/content/cases/003-distal-radius.json"

// -- Types ---------------------------------------------------------------------

type CardData = {
  label: string
  alwaysVisible?: boolean
  isReveal?: boolean
  content: string
  unlockKeywords?: string[]
}

type CaseData = {
  id: string
  title: string
  difficulty: string
  tags: string[]
  estimatedMinutes: number
  stem: string
  cards: Record<string, CardData>
  pearls: Array<{ id: string; text: string; attribution: string }>
  teachingPoints: string[]
  references: string[]
  reasoningAutopsy?: ReasoningAutopsyData
}

const CASES: Record<string, CaseData> = {
  "001-fight-bite": case001 as unknown as CaseData,
  "002-mallet-finger": case002 as unknown as CaseData,
  "003-distal-radius": case003 as unknown as CaseData,
}

// Ordered card keys for display
const CARD_ORDER = ["chief_complaint", "history", "exam", "imaging", "labs", "management"]

// Summary sentence per card key (first sentence of each card's content)
function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/)
  return m ? m[0] : text.slice(0, 80) + "..."
}

// -- Revealable card -----------------------------------------------------------

function CaseCardRevealed({ card }: { card: CardData }) {
  return (
    <div
      className="animate-fade-up overflow-hidden rounded-3xl bg-bg-elevated shadow-[0_10px_30px_rgba(32,32,30,0.08)] ring-1 ring-rule/60"
      style={{ animationDuration: "420ms", animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="border-b border-rule/70 bg-surface-subtle/60 px-5 py-3">
        <p className="font-fraunces text-h3 text-ink">{card.label}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-body text-ink leading-relaxed">{card.content}</p>
      </div>
    </div>
  )
}

// -- Pearl card ----------------------------------------------------------------

function PearlCard({ pearl }: { pearl: { id: string; text: string; attribution: string } }) {
  return (
    <div className="rounded-3xl bg-terracotta-soft/35 p-4 shadow-[0_10px_30px_rgba(185,94,69,0.12)] ring-1 ring-terracotta-soft/70">
      <p className="text-body text-ink leading-relaxed mb-2">{pearl.text}</p>
      <p className="text-micro text-terracotta font-medium">{pearl.attribution}</p>
      <p className="text-micro text-ink-muted mt-2">
        Local demo content | needs faculty verification
      </p>
    </div>
  )
}

// -- Main page -----------------------------------------------------------------

export default function CaseCanvasPage({ params }: { params: { id: string } }) {
  const caseData = CASES[params.id]

  const orderedCards = CARD_ORDER.filter((k) => caseData && k in caseData.cards)
  const revealableCards = orderedCards.filter((k) => k !== "chief_complaint" && k !== "management")
  const hasManagement = !!caseData && "management" in caseData.cards

  const [revealed, setRevealed] = useState<string[]>(["chief_complaint"])
  const [managementOverride, setManagementOverride] = useState(false)
  const [summaryLines, setSummaryLines] = useState<string[]>([
    firstSentence(caseData?.cards["chief_complaint"]?.content ?? ""),
  ])
  const [commitment, setCommitment] = useState("")

  if (!caseData) {
    return (
      <ChatLayout>
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl rounded-3xl bg-bg-elevated/98 p-1 shadow-[0_20px_60px_rgba(32,32,30,0.12)]">
            <div className="rounded-[calc(1.5rem-4px)] bg-bg-elevated p-8 text-center ring-1 ring-rule/50">
            <p className="text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">Case</p>
            <h1 className="mt-2 font-fraunces text-h2 text-ink">Case not found</h1>
            <p className="mt-3 text-small leading-relaxed text-ink-muted">
              This case does not exist in the current ORION Hand demo content set.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <Button asChild variant="outline">
                <Link href="/case">Back to cases</Link>
              </Button>
              <Button asChild>
                <Link href="/c">Back to chat</Link>
              </Button>
            </div>
            </div>
          </div>
        </div>
      </ChatLayout>
    )
  }

  const managementRevealed = revealed.includes("management")
  const nonManagementRevealed = revealed.filter((k) => k !== "chief_complaint" && k !== "management")
  const managementUnlocked = nonManagementRevealed.length >= 3 || managementOverride
  const commitmentReady = commitment.trim().length >= 8
  const informationGathered = 1 + nonManagementRevealed.length
  const informationTotal = 1 + revealableCards.length
  const progressPercent = Math.round((informationGathered / Math.max(informationTotal, 1)) * 100)

  function revealCard(cardKey: string) {
    if (revealed.includes(cardKey)) return
    setRevealed((prev) => [...prev, cardKey])
    const card = caseData.cards[cardKey]
    if (card) {
      setSummaryLines((prev) => [...prev, `${card.label}: ${firstSentence(card.content)}`])
    }
  }

  function getRevealButtonLabel(cardKey: string): string {
    const card = caseData.cards[cardKey]
    if (revealed.includes(cardKey)) return `${card?.label ?? cardKey} revealed`
    return `Reveal ${card?.label ?? cardKey}`
  }

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Breadcrumb + meta */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/case" className="inline-flex items-center gap-2 rounded-lg text-small text-ink-muted transition-colors hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
            <ArrowLeft size={14} />
            Cases
          </Link>
          <Badge variant="secondary" className="text-micro">{caseData.difficulty}</Badge>
          <span className="text-micro text-ink-muted">~{caseData.estimatedMinutes} min</span>
          <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-micro text-ink-muted">
            Demo mode | faculty verification needed
          </span>
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <Link href={`/c?prefill=${encodeURIComponent(`Walk me through the ${caseData.title} case.`)}`}>
              <MessageSquare size={14} />
              Use this in chat
            </Link>
          </Button>
        </div>

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

          {/* LEFT - main case area */}
          <div className="space-y-6">

            {/* Case stem */}
            <section>
              <SectionMarker number="01" label="Case Stem" className="mb-3" />
              <h1 className="font-fraunces text-h2 text-ink mb-4">{caseData.title}</h1>
              <p
                className="text-stem leading-relaxed text-ink"
                style={{ fontFamily: "var(--font-instrument-serif), serif" }}
              >
                {caseData.stem}
              </p>
            </section>

            <section className="rounded-3xl bg-bg-elevated p-5 shadow-[0_14px_34px_rgba(32,32,30,0.08)] ring-1 ring-rule/60" aria-label="Case progress">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-small font-semibold text-ink">Reasoning checkpoint</p>
                <p className="text-micro text-ink-muted">
                  Data points: {informationGathered}/{informationTotal}
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className="h-full rounded-full bg-electric transition-all duration-500 ease-reveal"
                  style={{ width: `${managementRevealed ? 100 : progressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-micro text-ink-muted">
                  Cards revealed: {informationGathered}/{informationTotal}
                </span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-micro",
                  managementUnlocked ? "bg-correct-soft text-correct" : "bg-surface-subtle text-ink-muted"
                )}>
                  {managementUnlocked ? "Management unlocked" : "Management locked"}
                </span>
                {managementRevealed && (
                  <span className="rounded-full bg-correct-soft px-2 py-0.5 text-micro text-correct">
                    Case complete
                  </span>
                )}
              </div>
            </section>

            {/* Chief complaint - always visible */}
            {caseData.cards.chief_complaint && (
              <CaseCardRevealed card={caseData.cards.chief_complaint} />
            )}

            {/* Reveal buttons */}
            <section>
              <SectionMarker number="02" label="Explore the case" className="mb-3" />
              <div className="flex flex-wrap gap-2">
                {revealableCards.map((cardKey) => (
                  <Button
                    key={cardKey}
                    variant={revealed.includes(cardKey) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => revealCard(cardKey)}
                    disabled={revealed.includes(cardKey)}
                    className={cn(
                      "transition-colors",
                      revealed.includes(cardKey) && "opacity-60 cursor-default"
                    )}
                  >
                    {getRevealButtonLabel(cardKey)}
                  </Button>
                ))}

                {hasManagement && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant={managementRevealed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => revealCard("management")}
                      disabled={!managementUnlocked || !commitmentReady || managementRevealed}
                      title={
                        !managementUnlocked
                          ? "Reveal at least 3 cards first"
                          : !commitmentReady
                            ? "Commit to a diagnosis and plan first"
                            : undefined
                      }
                    >
                      {managementRevealed ? (
                        <>
                          <CheckCircle size={14} />
                          Management revealed
                        </>
                      ) : managementUnlocked ? (
                        "Reveal management"
                      ) : (
                        <>
                          <Lock size={14} />
                          Management ({nonManagementRevealed.length}/3)
                        </>
                      )}
                    </Button>
                    {!managementUnlocked && !managementRevealed && (
                      <button
                        type="button"
                        onClick={() => { setManagementOverride(true) }}
                        className="rounded text-small text-ink-muted underline underline-offset-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                      >
                        Reveal anyway
                      </button>
                    )}
                  </div>
                )}
              </div>

              {hasManagement && managementUnlocked && !managementRevealed && (
                <div className="mt-4 rounded-3xl bg-bg-elevated p-5 shadow-[0_14px_34px_rgba(32,32,30,0.08)] ring-1 ring-rule/60">
                  <label htmlFor="case-commitment" className="text-small font-semibold text-ink">
                    Commit before revealing management
                  </label>
                  <p className="mt-1 text-small text-ink-muted">
                    Write your diagnosis and plan. This stays local and is not graded in Phase 0B.2.
                  </p>
                  <textarea
                    id="case-commitment"
                    value={commitment}
                    onChange={(event) => setCommitment(event.target.value)}
                    rows={3}
                    className="mt-3 w-full resize-none rounded-xl border border-rule/70 bg-bg px-3 py-2 text-body text-ink shadow-[inset_0_1px_1px_rgba(32,32,30,0.03)] placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-electric"
                    placeholder="Diagnosis, urgent concerns, and next management step..."
                  />
                </div>
              )}
            </section>

            {/* Revealed cards (excluding chief complaint, shown above) */}
            <div className="space-y-4">
              {orderedCards
                .filter((k) => k !== "chief_complaint" && revealed.includes(k))
                .map((cardKey) => (
                  <CaseCardRevealed key={cardKey} card={caseData.cards[cardKey]} />
                ))}
            </div>

            {/* End-of-case content */}
            {managementRevealed && (
              <div className="animate-fade-up space-y-8 border-t border-rule/70 pt-5">
                <div className="rounded-2xl border border-correct-soft bg-correct-soft/35 p-4 shadow-soft">
                  <p className="text-small font-semibold text-correct">Management unlocked</p>
                  <p className="mt-1 text-small text-ink-muted">
                    Compare the revealed plan with your commitment. This is a reasoning exercise, not a grade.
                  </p>
                </div>

                
                <section className="rounded-2xl bg-bg-elevated p-4 ring-1 ring-rule/70 shadow-soft">
                  <p className="text-small font-semibold text-ink">Learning checkpoint</p>
                  <p className="mt-1 text-small text-ink-muted">Reasoning summary (local only, non-punitive).</p>
                  <div className="mt-3 h-2 rounded-full bg-surface-subtle"><div className="h-2 rounded-full bg-correct" style={{width:`${Math.min(100,Math.round((informationGathered/informationTotal)*100))}%`}}/></div>
                  <ul className="mt-3 space-y-1 text-small text-ink">
                    <li><strong>Case completed:</strong> Yes</li>
                    <li><strong>Information gathered:</strong> {informationGathered}/{informationTotal}</li>
                    <li><strong>Diagnosis (your commitment):</strong> {commitment || "Not documented"}</li>
                    <li><strong>Key clues recognized:</strong> {nonManagementRevealed.length} card domains explored</li>
                    <li><strong>Important missed items:</strong> Review unrevealed/late-revealed clues</li>
                    <li><strong>Management decision:</strong> Revealed and compared</li>
                    <li><strong>Do-not-miss risk:</strong> Re-check escalation red flags</li>
                    <li><strong>Best rounds one-liner:</strong> State diagnosis + first management move</li>
                    <li><strong>Common mistake:</strong> Premature closure before full information gathering</li>
                    <li><strong>Suggested next step:</strong> Review related topic card and rapid Q&A.</li>
                  </ul>
                </section>

                {/* Teaching points */}
                <section>
                  <SectionMarker number="04" label="Teaching Points" className="mb-4" />
                  <ol className="space-y-3 list-none">
                    {caseData.teachingPoints.map((point, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-mono text-micro text-ink-muted flex-shrink-0 mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-body text-ink leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Pearls — collapsed by default with count */}
                {caseData.pearls.length > 0 && (
                  <section>
                    <SectionMarker number="05" label="Faculty Pearls" className="mb-3" />
                    <details className="group/pearls overflow-hidden rounded-2xl border border-terracotta-soft/60 bg-bg-elevated shadow-soft" open={caseData.pearls.length <= 2}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-small font-medium text-ink transition-colors duration-200 ease-standard hover:bg-terracotta-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-inset">
                        <span>
                          Show {caseData.pearls.length} pearl{caseData.pearls.length === 1 ? "" : "s"}
                        </span>
                        <span className="text-ink-faint transition-transform duration-300 ease-standard group-open/pearls:rotate-180">▾</span>
                      </summary>
                      <div className="space-y-3 border-t border-terracotta-soft/60 p-3">
                        {caseData.pearls.map((pearl) => (
                          <PearlCard key={pearl.id} pearl={pearl} />
                        ))}
                      </div>
                    </details>
                  </section>
                )}

                {/* Reasoning Autopsy */}
                {caseData.reasoningAutopsy && (
                  <ReasoningAutopsy data={caseData.reasoningAutopsy} />
                )}

                {/* References */}
                <section>
                  <p className="text-micro text-ink-muted uppercase tracking-wider mb-2">References</p>
                  <ul className="space-y-1">
                    {caseData.references.map((ref, i) => (
                      <li key={i} className="text-small text-ink-muted font-mono">{ref}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-micro text-ink-muted italic">
                    Synthetic case | Local demo content | Needs faculty verification
                  </p>
                </section>

                {/* Nav */}
                <div className="flex gap-3 pt-4 border-t border-rule">
                  <Button asChild variant="outline">
                    <Link href="/case">Back to cases</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/c">Back to chat</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - running summary (sticky desktop, collapsible mobile) */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <details open className="lg:open">
              <summary className="lg:hidden flex items-center justify-between cursor-pointer mb-3 text-small font-medium text-ink">
                What we know so far
                <span className="text-ink-muted">v</span>
              </summary>
              <div className="rounded-3xl bg-bg-elevated p-5 shadow-[0_14px_34px_rgba(32,32,30,0.08)] ring-1 ring-rule/60">
                <p className="hidden lg:block font-fraunces text-h3 text-ink mb-3">
                  What we know
                </p>
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-micro text-ink-muted">
                    <span>Progress</span>
                    <span>{managementRevealed ? 100 : progressPercent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-subtle">
                    <div
                      className="h-full rounded-full bg-electric transition-all duration-500 ease-reveal"
                      style={{ width: `${managementRevealed ? 100 : progressPercent}%` }}
                    />
                  </div>
                </div>
                {summaryLines.length === 0 ? (
                  <p className="text-small text-ink-muted italic">
                    Nothing yet. Start by revealing history or exam.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {summaryLines.map((line, i) => (
                      <li key={i} className="text-small text-ink leading-relaxed flex gap-2">
                        <span className="text-rule flex-shrink-0 mt-1">-</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 pt-3 border-t border-rule">
                  <p className="text-micro text-ink-muted">
                    {nonManagementRevealed.length} of {revealableCards.length} cards revealed
                  </p>
                  {!managementUnlocked && !managementRevealed && (
                    <p className="text-micro text-ink-muted mt-1">
                      Reveal {3 - nonManagementRevealed.length} more to unlock management
                    </p>
                  )}
                </div>
              </div>
            </details>
          </aside>

        </div>
      </div>
      </div>
    </ChatLayout>
  )
}

