import Link from "next/link"
import { ArrowLeft, Clock, MessageSquare } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Case Unfolds" }

const CASES = [
  {
    id: "001-fight-bite",
    title: "The bar fight",
    description: "24M with a small wound over the dorsal 5th MCP, 2 days after a fight. It has been getting worse.",
    difficulty: "Intermediate",
    estimatedMinutes: 12,
    tags: ["trauma", "infection", "MCP"],
    chatPrompt: "Walk me through the fight bite case: 24M with dorsal MCP wound after a bar fight",
  },
  {
    id: "002-mallet-finger",
    title: "The basketball drop",
    description: "32M cannot straighten the tip of his right long finger after jamming it catching a pass.",
    difficulty: "Intro",
    estimatedMinutes: 8,
    tags: ["extensor", "DIP", "tendon"],
    chatPrompt: "Walk me through the mallet finger case: 32M who jammed his finger catching a basketball",
  },
  {
    id: "003-distal-radius",
    title: "FOOSH on the ice",
    description: "58F with wrist pain and deformity after falling on an outstretched hand on icy steps.",
    difficulty: "Intermediate",
    estimatedMinutes: 14,
    tags: ["wrist", "fracture", "median nerve"],
    chatPrompt: "Walk me through the FOOSH case: 58F with wrist deformity after a fall",
  },
]

const DIFFICULTY_VARIANT: Record<string, "terracotta" | "secondary" | "default"> = {
  Intro: "terracotta",
  Intermediate: "secondary",
  Advanced: "default",
}

export default function CasePage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <Link
                href="/c"
                className="mb-4 inline-flex items-center gap-2 rounded-lg text-small text-ink-muted transition-colors duration-300 ease-standard hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                <ArrowLeft size={14} />
                Back to chat
              </Link>
              <SectionMarker number="03" label="Case Unfolds" className="mb-2" />
              <h1 className="font-fraunces text-h1 text-ink">Clinical cases</h1>
              <p className="mt-3 text-body text-ink-muted">
                Synthetic hand-surgery cases with progressive reveal, management gating, and reasoning autopsy.
              </p>
              <p className="mt-3 text-micro text-ink-muted">
                3 seed cases | local demo content | needs faculty verification
              </p>
            </div>
            <Button asChild>
              <Link href="/c?prefill=Give%20me%20a%20hand%20surgery%20case%20to%20work%20through">
                <MessageSquare size={15} />
                Use in chat
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {CASES.map((c, index) => (
              <article
                key={c.id}
                className="group rounded-2xl border border-rule/70 bg-bg-elevated p-5 shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-medium"
              >
                <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-subtle font-mono text-micro text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="font-fraunces text-h3 text-ink">{c.title}</h2>
                      <Badge variant={DIFFICULTY_VARIANT[c.difficulty]}>{c.difficulty}</Badge>
                      <span className="inline-flex items-center gap-1 text-micro text-ink-muted">
                        <Clock size={12} />
                        {c.estimatedMinutes} min
                      </span>
                    </div>
                    <p className="text-body text-ink-muted">{c.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-rule/70 bg-bg px-2 py-0.5 text-micro text-ink-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/c?prefill=${encodeURIComponent(c.chatPrompt)}`}>
                        Use in chat
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/case/${c.id}`}>Start case</Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
