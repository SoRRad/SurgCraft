"use client"

import { useState, useRef, useEffect } from "react"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TUTOR_TOPICS } from "@/lib/demo/demo-content"
import { findTutorAnswer, type TutorAnswer } from "@/lib/llm/local-demo-engine"
import { cn } from "@/lib/utils"

type Branch = "explain" | "quiz" | "oneliner" | "mistake" | "change" | null

const NOT_FOUND_MSG =
  "I don't have a verified local demo answer for that yet. In Phase 0B this will be handled by a provider-agnostic LLM + curated knowledge base. For now, try: fight bite, mallet finger, distal radius fracture, flexor tendon zones, or Kanavel signs."

// ── Answer display ────────────────────────────────────────────────────────────

function AnswerSection({ label, children, accent = false }: {
  label: string
  children: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className={cn("border rounded-lg p-4", accent ? "border-terracotta-soft bg-terracotta-soft/30" : "border-rule bg-bg-elevated")}>
      <p className={cn("text-micro font-semibold uppercase tracking-wider mb-2", accent ? "text-terracotta" : "text-ink-muted")}>
        {label}
      </p>
      <div className="text-body text-ink leading-relaxed">{children}</div>
    </div>
  )
}

function BranchButton({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-small border transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2",
        active
          ? "border-electric bg-electric-soft text-electric font-medium"
          : "border-rule bg-bg-elevated text-ink-muted hover:text-ink hover:border-ink-muted"
      )}
    >
      {children}
    </button>
  )
}

// ── Simple markdown renderer (bold + newlines only) ───────────────────────────
function SimpleMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        return part.split("\n").map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ))
      })}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [query, setQuery] = useState("")
  const [answer, setAnswer] = useState<TutorAnswer | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [activeBranch, setActiveBranch] = useState<Branch>(null)
  const answerRef = useRef<HTMLDivElement>(null)

  function handleAsk(q: string) {
    const q2 = q.trim()
    if (!q2) return
    setQuery(q2)
    setActiveBranch(null)
    const result = findTutorAnswer(q2)
    if (result) {
      setAnswer(result)
      setNotFound(false)
    } else {
      setAnswer(null)
      setNotFound(true)
    }
    setTimeout(() => answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
  }

  function toggleBranch(branch: Branch) {
    setActiveBranch((prev) => prev === branch ? null : branch)
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SectionMarker number="02" label="Tutor" />
            <Badge variant="outline" className="text-micro text-ink-muted">Demo mode · No AI API connected</Badge>
          </div>
          <h1 className="font-fraunces text-h1 text-ink mb-2">Ask about hand surgery</h1>
          <p className="text-body text-ink-muted">
            This demo uses local keyword matching. Phase 0B will connect a real LLM.
          </p>
        </div>

        {/* Topic chips */}
        <div className="mb-6">
          <p className="text-micro text-ink-muted uppercase tracking-wider mb-3">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {TUTOR_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleAsk(topic.suggestedQuestion)}
                className={cn(
                  "px-3 py-1.5 rounded-full border border-rule text-small text-ink-muted bg-bg-elevated",
                  "hover:border-electric hover:text-electric transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                )}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleAsk(query) }}
          className="flex gap-2 mb-10"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a hand surgery question…"
            className="flex-1"
            aria-label="Hand surgery question"
          />
          <Button type="submit" disabled={!query.trim()}>Ask →</Button>
        </form>

        {/* Answer area */}
        <div ref={answerRef}>

          {/* Not found */}
          {notFound && (
            <div className="border border-rule rounded-lg p-5 bg-bg-elevated animate-fade-up">
              <p className="text-body text-ink-muted">{NOT_FOUND_MSG}</p>
            </div>
          )}

          {/* Structured answer */}
          {answer && (
            <div className="space-y-4 animate-fade-up">
              <AnswerSection label="Short explanation">
                <SimpleMarkdown text={answer.shortExplanation} />
              </AnswerSection>

              <AnswerSection label="Rounds one-liner" accent>
                <p className="font-medium">{answer.roundsOneLiner}</p>
              </AnswerSection>

              <AnswerSection label="Common mistake">
                <SimpleMarkdown text={answer.commonMistake} />
              </AnswerSection>

              <AnswerSection label="Likely attending follow-up">
                <p className="italic text-ink-muted">&ldquo;{answer.likelyFollowUp}&rdquo;</p>
              </AnswerSection>

              <p className="text-micro text-ink-muted text-right">
                Local demo content · needs faculty verification
              </p>

              {/* Branch buttons */}
              <div className="pt-2 border-t border-rule">
                <p className="text-micro text-ink-muted mb-3 uppercase tracking-wider">Explore further:</p>
                <div className="flex flex-wrap gap-2">
                  <BranchButton active={activeBranch === "explain"} onClick={() => toggleBranch("explain")}>
                    Teach me fast
                  </BranchButton>
                  <BranchButton active={activeBranch === "quiz"} onClick={() => toggleBranch("quiz")}>
                    Quiz me
                  </BranchButton>
                  <BranchButton active={activeBranch === "oneliner"} onClick={() => toggleBranch("oneliner")}>
                    Give me the rounds one-liner
                  </BranchButton>
                  <BranchButton active={activeBranch === "mistake"} onClick={() => toggleBranch("mistake")}>
                    Show common mistake
                  </BranchButton>
                  <BranchButton active={activeBranch === "change"} onClick={() => toggleBranch("change")}>
                    What would change my answer?
                  </BranchButton>
                </div>
              </div>

              {/* Branch content */}
              {activeBranch === "explain" && (
                <div className="border border-rule rounded-lg p-5 bg-bg-elevated animate-fade-up space-y-3">
                  <p className="text-micro text-ink-muted uppercase tracking-wider">Full explanation</p>
                  <div className="text-body text-ink leading-relaxed whitespace-pre-line">
                    <SimpleMarkdown text={answer.fullAnswer} />
                  </div>
                </div>
              )}

              {activeBranch === "quiz" && (
                <div className="border border-electric-soft bg-electric-soft/30 rounded-lg p-5 animate-fade-up">
                  <p className="text-micro text-electric uppercase tracking-wider mb-2">Quiz question</p>
                  <p className="text-body text-ink font-medium leading-relaxed">
                    {answer.likelyFollowUp}
                  </p>
                  <p className="mt-3 text-small text-ink-muted italic">
                    Think through it before reading the answer above.
                  </p>
                </div>
              )}

              {activeBranch === "oneliner" && (
                <div className="border-2 border-terracotta-soft rounded-lg p-5 bg-terracotta-soft/40 animate-fade-up">
                  <p className="text-micro text-terracotta uppercase tracking-wider mb-2">On rounds, say:</p>
                  <p className="font-fraunces text-h3 text-ink leading-snug">
                    &ldquo;{answer.roundsOneLiner}&rdquo;
                  </p>
                </div>
              )}

              {activeBranch === "mistake" && (
                <div className="border border-wrong-soft bg-wrong-soft/30 rounded-lg p-5 animate-fade-up">
                  <p className="text-micro text-wrong uppercase tracking-wider mb-2">Common mistake</p>
                  <p className="text-body text-ink leading-relaxed">
                    <SimpleMarkdown text={answer.commonMistake} />
                  </p>
                </div>
              )}

              {activeBranch === "change" && (
                <div className="animate-fade-up space-y-3">
                  <p className="text-micro text-ink-muted uppercase tracking-wider">What would change your answer?</p>
                  {answer.whatWouldChange.map((variant, i) => (
                    <div key={i} className="border border-rule rounded-lg overflow-hidden bg-bg-elevated">
                      <div className="px-4 py-3 border-b border-rule bg-bg">
                        <p className="text-small font-medium text-ink">{variant.condition}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-body text-ink-muted leading-relaxed">
                          <SimpleMarkdown text={variant.answer} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
