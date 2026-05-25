"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"

const TOPICS = [
  {
    topic: "Fight bite",
    category: "Infection",
    learnerLevel: "Intern",
    oneLiner: "Dorsal MCP laceration after punch = fight bite until proven otherwise.",
    doNotMiss: "Septic MCP joint",
    commonMistake: "Primary closure",
    caseId: "001-fight-bite",
    attendingFollowUp: "What empiric IV coverage and why?",
  },
  {
    topic: "Mallet finger",
    category: "Tendon",
    learnerLevel: "MS4",
    oneLiner: "DIP extension splint continuously; PIP stays free.",
    doNotMiss: "Unrecognized bony subluxation",
    commonMistake: "Immobilizing PIP",
    caseId: "002-mallet-finger",
    attendingFollowUp: "When do you operate?",
  },
  {
    topic: "Distal radius fracture",
    category: "Fracture",
    learnerLevel: "PGY-2",
    oneLiner: "Re-check median nerve after reduction every time.",
    doNotMiss: "Acute CTS",
    commonMistake: "Watching persistent median symptoms",
    caseId: "003-distal-radius",
    attendingFollowUp: "Which reduction parameters are unacceptable?",
  },
  {
    topic: "Scaphoid fracture",
    category: "Emergency",
    learnerLevel: "Intern",
    oneLiner: "Snuffbox tenderness + negative x-ray = treat as scaphoid fracture.",
    doNotMiss: "Occult fracture with AVN",
    commonMistake: "Discharging as sprain",
    attendingFollowUp: "What is your imaging plan?",
  },
]

const FILTERS = ["All", "Infection", "Fracture", "Tendon", "Nerve", "Anatomy", "Emergency"]

export default function TopicsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All")

  const rows = useMemo(() => {
    return TOPICS.filter((entry) => {
      const matchFilter = filter === "All" || entry.category === filter
      const matchQuery = `${entry.topic} ${entry.oneLiner}`.toLowerCase().includes(query.toLowerCase())
      return matchFilter && matchQuery
    })
  }, [query, filter])

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <SectionMarker number="06" label="Topics" className="mb-3" />
          <h1 className="text-h1 font-fraunces text-ink">Hand topic cards</h1>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics"
              className="w-full min-w-0 rounded-xl bg-bg-elevated px-3 py-2 ring-1 ring-rule/70"
            />
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full px-3 py-1 text-small ${filter === value ? "bg-electric text-bg" : "bg-surface-subtle text-ink-muted"}`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rows.map((entry) => (
              <article key={entry.topic} className="min-w-0 rounded-2xl bg-bg-elevated p-4 ring-1 ring-rule/70 shadow-soft">
                <h2 className="text-h3 font-fraunces text-ink break-words">{entry.topic}</h2>
                <p className="text-micro text-ink-faint">{entry.learnerLevel} · {entry.category}</p>
                <p className="mt-2 text-small text-ink break-words">{entry.oneLiner}</p>

                <details className="mt-3">
                  <summary className="cursor-pointer text-small font-semibold text-electric">View details</summary>
                  <div className="mt-2 space-y-1 text-small text-ink-muted break-words">
                    <p><strong>Do-not-miss:</strong> {entry.doNotMiss}</p>
                    <p><strong>Common mistake:</strong> {entry.commonMistake}</p>
                    <p><strong>Attending follow-up:</strong> {entry.attendingFollowUp}</p>
                  </div>
                </details>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/c?prefill=${encodeURIComponent(`Teach me ${entry.topic} for rounds.`)}`}>Ask in chat</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/rapid?topic=${encodeURIComponent(entry.topic)}`}>Practice rapid Q&A</Link>
                  </Button>
                  {entry.caseId && (
                    <Button asChild size="sm">
                      <Link href={`/case/${entry.caseId}`}>Work through case</Link>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
