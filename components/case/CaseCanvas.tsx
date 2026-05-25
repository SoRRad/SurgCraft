"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Static case imports
import case001 from "@/content/cases/001-fight-bite.json"
import case002 from "@/content/cases/002-mallet-finger.json"
import case003 from "@/content/cases/003-distal-radius.json"

type CardData = {
  label: string
  alwaysVisible?: boolean
  content: string
  unlockKeywords?: string[]
}

type CaseData = {
  id: string
  title: string
  difficulty: string
  estimatedMinutes: number
  tags: string[]
  stem: string
  cards: Record<string, CardData>
  pearls: Array<{ id: string; text: string; attribution: string }>
  teachingPoints: string[]
  references: string[]
}

const CASE_MAP: Record<string, CaseData> = {
  "001-fight-bite": case001 as unknown as CaseData,
  "002-mallet-finger": case002 as unknown as CaseData,
  "003-distal-radius": case003 as unknown as CaseData,
}

const CARD_ORDER = ["chief_complaint", "history", "exam", "imaging", "labs", "management"]

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/)
  return m ? m[0] : text.slice(0, 80) + "…"
}

interface CaseCanvasProps {
  caseId: string
  embedded?: boolean
  onComplete?: () => void
  onBack?: () => void
}

export function CaseCanvas({ caseId, embedded = false, onComplete, onBack }: CaseCanvasProps) {
  const caseData = CASE_MAP[caseId]

  const orderedCards = CARD_ORDER.filter((k) => k in (caseData?.cards ?? {}))
  const revealableCards = orderedCards.filter((k) => k !== "chief_complaint" && k !== "management")
  const hasManagement = "management" in (caseData?.cards ?? {})

  const [revealed, setRevealed] = useState<string[]>(["chief_complaint"])
  const [managementOverride, setManagementOverride] = useState(false)
  const [done, setDone] = useState(false)

  if (!caseData) {
    return (
      <div className="p-6 text-center text-ink-muted">
        Case not found: {caseId}
      </div>
    )
  }

  const managementRevealed = revealed.includes("management")
  const nonManagementRevealed = revealed.filter((k) => k !== "chief_complaint" && k !== "management")
  const managementUnlocked = nonManagementRevealed.length >= 3 || managementOverride

  function revealCard(cardKey: string) {
    if (revealed.includes(cardKey)) return
    setRevealed((prev) => [...prev, cardKey])

    // If management was just revealed, mark as completable
    if (cardKey === "management") {
      setDone(true)
    }
  }

  function handleComplete() {
    setDone(false)
    onComplete?.()
  }

  const compact = embedded

  return (
    <div className={cn("flex flex-col", compact ? "gap-4" : "gap-6")}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p
            className={cn("text-ink leading-snug", compact ? "text-stem" : "font-fraunces text-h2")}
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
          >
            {caseData.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-micro">{caseData.difficulty}</Badge>
            <span className="text-micro text-ink-muted">~{caseData.estimatedMinutes} min</span>
          </div>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-small text-ink-muted hover:text-ink transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Stem */}
      <p
        className={cn("leading-relaxed text-ink", compact ? "text-body" : "text-stem")}
        style={{ fontFamily: "var(--font-instrument-serif), serif" }}
      >
        {caseData.stem}
      </p>

      {/* Chief complaint — always visible */}
      {caseData.cards.chief_complaint && (
        <div className="border border-rule rounded-lg bg-bg-elevated overflow-hidden">
          <div className="px-4 py-2 border-b border-rule bg-bg">
            <p className="font-fraunces text-small text-ink">{caseData.cards.chief_complaint.label}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-body text-ink leading-relaxed">{caseData.cards.chief_complaint.content}</p>
          </div>
        </div>
      )}

      {/* Reveal buttons */}
      <div>
        <p className="text-micro text-ink-muted uppercase tracking-wider mb-2">Explore the case</p>
        <div className="flex flex-wrap gap-2">
          {revealableCards.map((cardKey) => (
            <Button
              key={cardKey}
              variant={revealed.includes(cardKey) ? "secondary" : "outline"}
              size="sm"
              onClick={() => revealCard(cardKey)}
              disabled={revealed.includes(cardKey)}
              className={cn(revealed.includes(cardKey) && "opacity-60 cursor-default")}
            >
              {revealed.includes(cardKey) ? `${caseData.cards[cardKey]?.label} ✓` : `Reveal ${caseData.cards[cardKey]?.label}`}
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
                  type="button"
                  onClick={() => setManagementOverride(true)}
                  className="text-small text-ink-muted hover:text-ink underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-electric rounded"
                >
                  Reveal anyway
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Revealed cards */}
      <div className="space-y-3">
        {orderedCards
          .filter((k) => k !== "chief_complaint" && revealed.includes(k))
          .map((cardKey) => (
            <div
              key={cardKey}
              className="border border-rule rounded-lg bg-bg-elevated overflow-hidden animate-fade-up"
              style={{ animationDuration: "300ms" }}
            >
              <div className="px-4 py-2 border-b border-rule bg-bg">
                <p className="font-fraunces text-small text-ink">{caseData.cards[cardKey].label}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-body text-ink leading-relaxed">{caseData.cards[cardKey].content}</p>
              </div>
            </div>
          ))}
      </div>

      {/* End-of-case teaching content */}
      {managementRevealed && (
        <div className="space-y-5 pt-4 border-t border-rule animate-fade-up">
          {caseData.teachingPoints.length > 0 && (
            <div>
              <p className="text-micro text-ink-muted uppercase tracking-wider mb-3">Teaching points</p>
              <ol className="space-y-2">
                {caseData.teachingPoints.map((point, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-mono text-micro text-ink-muted flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-body text-ink leading-relaxed">{point}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {caseData.pearls.length > 0 && (
            <div>
              <p className="text-micro text-ink-muted uppercase tracking-wider mb-3">Faculty pearls</p>
              <div className="space-y-2">
                {caseData.pearls.map((pearl) => (
                  <div key={pearl.id} className="border border-terracotta-soft bg-terracotta-soft/30 rounded-lg p-3">
                    <p className="text-body text-ink leading-relaxed mb-1.5">{pearl.text}</p>
                    <p className="text-micro text-terracotta font-medium">{pearl.attribution}</p>
                    <p className="text-micro text-ink-muted mt-2">
                      Local demo content · needs faculty verification
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete / return to chat */}
          {onComplete && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleComplete}
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg text-small font-medium",
                  "bg-correct text-bg hover:opacity-90 transition-opacity duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-correct focus-visible:ring-offset-2"
                )}
              >
                Case complete — return to chat →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      {!managementRevealed && (
        <p className="text-micro text-ink-muted">
          {nonManagementRevealed.length}/{revealableCards.length} cards revealed
          {!managementUnlocked && ` · ${3 - nonManagementRevealed.length} more to unlock management`}
        </p>
      )}
    </div>
  )
}
