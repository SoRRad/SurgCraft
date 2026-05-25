"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReasoningAutopsy, type ReasoningAutopsyData } from "@/components/case/ReasoningAutopsy"
import { cn } from "@/lib/utils"

// ── Static case imports ────────────────────────────────────────────────────────
import case001 from "@/content/cases/001-fight-bite.json"
import case002 from "@/content/cases/002-mallet-finger.json"
import case003 from "@/content/cases/003-distal-radius.json"

// ── Types ─────────────────────────────────────────────────────────────────────

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
  return m ? m[0] : text.slice(0, 80) + "…"
}

// ── Revealable card ───────────────────────────────────────────────────────────

function CaseCardRevealed({ card }: { card: CardData }) {
  return (
    <div
      className="border border-rule rounded-lg bg-bg-elevated overflow-hidden animate-fade-up"
      style={{ animationDuration: "420ms", animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="px-5 py-3 border-b border-rule bg-bg">
        <p className="font-fraunces text-h3 text-ink">{card.label}</p>
      </div>
      <div className="px-5 py-4">
        <p className="text-body text-ink leading-relaxed">{card.content}</p>
      </div>
    </div>
  )
}

// ── Pearl card ────────────────────────────────────────────────────────────────

function PearlCard({ pearl }: { pearl: { id: string; text: string; attribution: string } }) {
  return (
    <div className="border border-terracotta-soft bg-terracotta-soft/30 rounded-lg p-4">
      <p className="text-body text-ink leading-relaxed mb-2">{pearl.text}</p>
      <p className="text-micro text-terracotta font-medium">{pearl.attribution}</p>
      <p className="text-micro text-ink-muted mt-2">
        Local demo content · needs faculty verification
      </p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CaseCanvasPage({ params }: { params: { id: string } }) {
  const caseData = CASES[params.id]
  if (!caseData) notFound()

  const orderedCards = CARD_ORDER.filter((k) => k in caseData.cards)
  const revealableCards = orderedCards.filter((k) => k !== "chief_complaint" && k !== "management")
  const hasManagement = "management" in caseData.cards

  const [revealed, setRevealed] = useState<string[]>(["chief_complaint"])
  const [managementOverride, setManagementOverride] = useState(false)
  const [summaryLines, setSummaryLines] = useState<string[]>([
    firstSentence(caseData.cards["chief_complaint"]?.content ?? ""),
  ])

  const managementRevealed = revealed.includes("management")
  const nonManagementRevealed = revealed.filter((k) => k !== "chief_complaint" && k !== "management")
  const managementUnlocked = nonManagementRevealed.length >= 3 || managementOverride

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
    if (revealed.includes(cardKey)) return `${card?.label ?? cardKey} ✓`
    return `Reveal ${card?.label ?? cardKey}`
  }

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">

        {/* Breadcrumb + meta */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/case" className="text-small text-ink-muted hover:text-ink transition-colors">
            ← Cases
          </Link>
          <span className="text-rule">·</span>
          <Badge variant="secondary" className="text-micro">{caseData.difficulty}</Badge>
          <span className="text-micro text-ink-muted">~{caseData.estimatedMinutes} min</span>
        </div>

        {/* Two-pane layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

          {/* LEFT — main case area */}
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

            {/* Chief complaint — always visible */}
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant={managementRevealed ? "secondary" : "default"}
                      size="sm"
                      onClick={() => revealCard("management")}
                      disabled={!managementUnlocked || managementRevealed}
                      title={!managementUnlocked ? "Reveal at least 3 cards first" : undefined}
                    >
                      {managementRevealed
                        ? "Management ✓"
                        : managementUnlocked
                        ? "Reveal Management"
                        : `🔒 Management (${nonManagementRevealed.length}/3)`}
                    </Button>
                    {!managementUnlocked && !managementRevealed && (
                      <button
                        onClick={() => { setManagementOverride(true) }}
                        className="text-small text-ink-muted hover:text-ink underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric rounded"
                      >
                        Reveal anyway
                      </button>
                    )}
                  </div>
                )}
              </div>
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
              <div className="animate-fade-up space-y-8 pt-4 border-t border-rule">

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

                {/* Pearls */}
                {caseData.pearls.length > 0 && (
                  <section>
                    <SectionMarker number="05" label="Faculty Pearls" className="mb-4" />
                    <div className="space-y-3">
                      {caseData.pearls.map((pearl) => (
                        <PearlCard key={pearl.id} pearl={pearl} />
                      ))}
                    </div>
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
                    Synthetic case · Local demo content · Needs faculty verification
                  </p>
                </section>

                {/* Nav */}
                <div className="flex gap-3 pt-4 border-t border-rule">
                  <Button asChild variant="outline">
                    <Link href="/case">← Back to cases</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/c">Back to chat</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — running summary (sticky desktop, collapsible mobile) */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <details open className="lg:open">
              <summary className="lg:hidden flex items-center justify-between cursor-pointer mb-3 text-small font-medium text-ink">
                What we know so far
                <span className="text-ink-muted">▾</span>
              </summary>
              <div className="border border-rule rounded-lg bg-bg-elevated p-4">
                <p className="hidden lg:block font-fraunces text-h3 text-ink mb-3">
                  What we know
                </p>
                {summaryLines.length === 0 ? (
                  <p className="text-small text-ink-muted italic">
                    Nothing yet. Start by revealing history or exam.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {summaryLines.map((line, i) => (
                      <li key={i} className="text-small text-ink leading-relaxed flex gap-2">
                        <span className="text-rule flex-shrink-0 mt-1">—</span>
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
