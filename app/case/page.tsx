import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Case Unfolds" }

const CASES = [
  {
    id: "001-fight-bite",
    title: "The bar fight",
    description: "24M with a small wound over the dorsal 5th MCP, 2 days after a fight. It's been getting worse.",
    difficulty: "Intermediate",
    estimatedMinutes: 12,
    tags: ["trauma", "infection", "MCP"],
  },
  {
    id: "002-mallet-finger",
    title: "The basketball drop",
    description: "32M can't straighten the tip of his right long finger after jamming it catching a pass.",
    difficulty: "Intro",
    estimatedMinutes: 8,
    tags: ["extensor", "DIP", "tendon"],
  },
  {
    id: "003-distal-radius",
    title: "FOOSH on the ice",
    description: "58F with wrist pain and deformity after falling on an outstretched hand on icy steps.",
    difficulty: "Intermediate",
    estimatedMinutes: 14,
    tags: ["wrist", "fracture", "median-nerve"],
  },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  "Intro": "terracotta",
  "Intermediate": "secondary",
  "Advanced": "default",
} as const

export default function CasePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10">

        <div className="mb-8">
          <SectionMarker number="03" label="Case Unfolds" className="mb-2" />
          <h1 className="font-fraunces text-h1 text-ink mb-2">Clinical cases</h1>
          <p className="text-body text-ink-muted">
            Work through each case step by step. Cards reveal as you ask. Management is gated until you have gathered enough information.
          </p>
          <p className="mt-3 text-micro text-ink-muted">
            3 seed cases · All cases are synthetic — no real patient data.
          </p>
        </div>

        <div className="space-y-4">
          {CASES.map((c, index) => (
            <div
              key={c.id}
              className="border border-rule rounded-lg bg-bg-elevated p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-electric transition-colors duration-150"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full border border-rule flex items-center justify-center">
                <span className="font-mono text-micro text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-fraunces text-h3 text-ink">{c.title}</h2>
                  <Badge variant={DIFFICULTY_COLORS[c.difficulty] as "terracotta" | "secondary" | "default"} className="text-micro flex-shrink-0">
                    {c.difficulty}
                  </Badge>
                </div>
                <p className="text-body text-ink-muted mb-3">{c.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-micro text-ink-muted">~{c.estimatedMinutes} min</span>
                  <span className="text-rule">·</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {c.tags.map((tag) => (
                      <span key={tag} className="text-micro text-ink-muted bg-bg rounded px-1.5 py-0.5 border border-rule">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button asChild className="flex-shrink-0">
                <Link href={`/case/${c.id}`}>Start case →</Link>
              </Button>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  )
}
