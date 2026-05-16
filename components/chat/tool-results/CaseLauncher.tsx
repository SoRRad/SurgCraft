"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CaseCanvas } from "@/components/case/CaseCanvas"
import { cn } from "@/lib/utils"

interface CaseResult {
  id: string
  title: string
  stem: string
  difficulty: string
  estimatedMinutes: number
  tags: string[]
  reason: string
}

interface CaseLauncherProps {
  caseData: CaseResult | null
  onCaseComplete?: (caseId: string, caseTitle: string) => void
}

export function CaseLauncher({ caseData, onCaseComplete }: CaseLauncherProps) {
  const [mode, setMode] = useState<"card" | "inline" | "done">("card")
  const [isMobile, setIsMobile] = useState(false)

  if (!caseData) return null

  function handleStart() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobile(true)
    }
    setMode("inline")
  }

  function handleComplete() {
    setMode("done")
    onCaseComplete?.(caseData!.id, caseData!.title)
  }

  if (mode === "done") {
    return (
      <div className="border border-correct-soft bg-correct-soft/20 rounded-lg px-4 py-3 my-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-small font-medium text-correct">Case completed ✓</p>
          <p className="text-small text-ink-muted">{caseData.title}</p>
        </div>
        <Link
          href={`/case/${caseData.id}`}
          className="text-micro text-electric hover:underline flex-shrink-0"
        >
          Review full case →
        </Link>
      </div>
    )
  }

  if (mode === "inline") {
    return (
      <div className={cn("my-2", isMobile && "fixed inset-0 z-50 bg-bg overflow-y-auto")}>
        {isMobile && (
          <div className="sticky top-0 z-10 bg-bg border-b border-rule px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("card")}
              className="text-small text-ink-muted hover:text-ink transition-colors"
            >
              ← Back to chat
            </button>
            <span className="text-small font-medium text-ink truncate">{caseData.title}</span>
          </div>
        )}
        <CaseCanvas
          caseId={caseData.id}
          embedded
          onComplete={handleComplete}
          onBack={isMobile ? () => setMode("card") : undefined}
        />
        {!isMobile && (
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={handleComplete}
              className="text-small text-ink-muted hover:text-ink underline underline-offset-2"
            >
              Return to chat →
            </button>
          </div>
        )}
      </div>
    )
  }

  // card mode (default)
  const stemPreview = caseData.stem.length > 120 ? caseData.stem.slice(0, 120) + "…" : caseData.stem

  return (
    <div className="border border-rule rounded-lg bg-bg-elevated overflow-hidden my-2">
      <div className="px-4 py-3 border-b border-rule bg-bg flex items-center gap-2">
        <span className="text-micro text-ink-muted uppercase tracking-wider font-inter">Case Unfolds</span>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-start gap-2 mb-2">
          <h3
            className="text-h3 text-ink leading-tight flex-1"
            style={{ fontFamily: "var(--font-instrument-serif), serif" }}
          >
            {caseData.title}
          </h3>
          <Badge variant="secondary" className="text-micro flex-shrink-0">{caseData.difficulty}</Badge>
        </div>
        <p className="text-small text-ink-muted mb-1">~{caseData.estimatedMinutes} min · {caseData.tags.join(", ")}</p>
        <p className="text-body text-ink leading-relaxed mb-4">{stemPreview}</p>
        {caseData.reason && (
          <p className="text-small text-ink-muted italic mb-4">{caseData.reason}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStart}
            className={cn(
              "px-4 py-2 rounded-lg text-small font-medium",
              "bg-electric text-bg hover:opacity-90 transition-opacity duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
            )}
          >
            Start case →
          </button>
          <Link
            href={`/case/${caseData.id}`}
            className="px-4 py-2 rounded-lg border border-rule text-small text-ink-muted hover:text-ink hover:border-ink-muted transition-colors duration-150"
          >
            Full page
          </Link>
        </div>
      </div>
    </div>
  )
}
