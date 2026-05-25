"use client"

import { useMemo, useState } from "react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"

type RapidItem = {
  q: string
  best: string
  miss: string
  follow: string
  hook: string
}

const BANK: Record<string, RapidItem[]> = {
  "Fight bite": [
    {
      q: "What is first-line IV antibiotic coverage?",
      best: "Ampicillin-sulbactam with urgent washout evaluation.",
      miss: "Oral cephalexin misses Eikenella coverage.",
      follow: "When do you take this patient to the OR?",
      hook: "MCP bite = joint until proven otherwise.",
    },
  ],
  "Mallet finger": [
    {
      q: "How should a mallet splint be applied?",
      best: "DIP in extension continuously, with the PIP free.",
      miss: "Any DIP flexion resets the treatment clock.",
      follow: "When would you escalate to operative management?",
      hook: "DIP only; leave PIP mobile.",
    },
  ],
}

const TOPICS = [
  "Fight bite",
  "Mallet finger",
  "Distal radius fracture",
  "Flexor tendon zones",
  "Kanavel signs",
  "Scaphoid fracture",
  "Extensor compartments",
]

const INTENSITIES = ["Gentle", "Standard", "Oral boards"] as const

const FEEDBACK_LABELS = ["Needs review", "Partially correct", "Good", "Rounds-ready"]

export default function RapidPage() {
  const [topic, setTopic] = useState(TOPICS[0])
  const [intensity, setIntensity] = useState<(typeof INTENSITIES)[number]>("Standard")
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const item = useMemo<RapidItem>(() => {
    return (
      BANK[topic]?.[0] ?? {
        q: `Give a high-yield one-liner for ${topic}.`,
        best: `${topic}: summarize diagnosis and the first management step.`,
        miss: "Be explicit about red flags and escalation triggers.",
        follow: "What can be missed on first pass?",
        hook: "Name diagnosis + first move.",
      }
    )
  }, [topic])

  const score = answer.trim().length < 20 ? 0 : answer.toLowerCase().includes("urgent") ? 3 : 2

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <SectionMarker number="04" label="Rapid Q&A" className="mb-3" />
          <h1 className="text-h1 font-fraunces text-ink">Rapid Q&A</h1>
          <p className="mt-1 text-small text-ink-muted">Pimping-style practice, without scores being shared.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value)
                setSubmitted(false)
                setAnswer("")
              }}
              className="rounded-xl bg-bg-elevated px-3 py-2 ring-1 ring-rule/70"
            >
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as (typeof INTENSITIES)[number])}
              className="rounded-xl bg-bg-elevated px-3 py-2 ring-1 ring-rule/70"
            >
              {INTENSITIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 rounded-2xl bg-bg-elevated p-4 ring-1 ring-rule/70 shadow-soft">
            <p className="text-micro uppercase tracking-wide text-ink-faint">{intensity}</p>
            <p className="mt-1 text-body text-ink break-words">{item.q}</p>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-3 min-h-24 w-full rounded-xl bg-bg px-3 py-2 ring-1 ring-rule/70"
              placeholder="Type your answer..."
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => setSubmitted(true)}>Check answer</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false)
                  setAnswer("")
                }}
              >
                Next question
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSubmitted(false)
                  setAnswer("")
                }}
              >
                End session
              </Button>
              <Button asChild variant="outline">
                <a href="/c">Back to chat</a>
              </Button>
            </div>

            {submitted && (
              <div className="mt-4 space-y-2 text-small break-words">
                <p><strong>Feedback:</strong> {FEEDBACK_LABELS[score]}</p>
                <p><strong>Best answer:</strong> {item.best}</p>
                <p><strong>Missing key points:</strong> {item.miss}</p>
                <p><strong>Attending follow-up:</strong> {item.follow}</p>
                <p><strong>Memory hook:</strong> {item.hook}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
