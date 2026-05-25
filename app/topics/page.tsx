import Link from "next/link"
import { AlertTriangle, BookOpen, Eye, MessageSquare, Sparkles } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM, TOPIC_INDEX } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Topic index",
  description:
    "Cross-content topic index for the ORION Hand module. Every topic links to the related cases, mistakes, do-not-miss entries, and tutor answers.",
}

const CASE_TITLES: Record<string, string> = {
  "001-fight-bite": "The bar fight",
  "002-mallet-finger": "The basketball drop",
  "003-distal-radius": "FOOSH on the ice",
}

export default function TopicsPage() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <SectionMarker number="06" label="Topic index" className="mb-3" />
              <h1 className="font-fraunces text-h1 text-ink">Topics across the library</h1>
              <p className="mt-3 text-body text-ink-muted">
                One unified index for every clinical topic the ORION Hand module covers. Each row links to the related cases, decision-time mistakes, recognition-time red flags, and tutor walkthroughs.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {TOPIC_INDEX.map((topic) => {
              const mistakes = topic.mistakeIds
                .map((id) => MISTAKE_MUSEUM.find((m) => m.id === id))
                .filter((m): m is NonNullable<typeof m> => Boolean(m))
              const doNotMiss = topic.doNotMissIds
                .map((id) => DO_NOT_MISS.find((d) => d.id === id))
                .filter((d): d is NonNullable<typeof d> => Boolean(d))

              return (
                <article
                  key={topic.topic}
                  className="overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-medium"
                >
                  <div className="border-b border-rule/60 bg-surface-subtle/40 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-fraunces text-h3 leading-tight text-ink">{topic.topic}</h2>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/c?prefill=${encodeURIComponent(`Tell me about: ${topic.topic}`)}`}>
                          <MessageSquare size={13} />
                          Ask in chat
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {topic.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-bg text-ink-muted">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
                    <TopicSlot
                      icon={<BookOpen size={14} className="text-electric" />}
                      label="Cases"
                      items={topic.caseIds.map((id) => ({
                        id,
                        label: CASE_TITLES[id] ?? id,
                        href: `/case/${id}`,
                      }))}
                      emptyText="No seed case yet"
                    />
                    <TopicSlot
                      icon={<AlertTriangle size={14} className="text-warn" />}
                      label="Decision mistake"
                      items={mistakes.map((m) => ({
                        id: m.id,
                        label: m.title,
                        href: `/mistakes#${m.id}`,
                      }))}
                      emptyText="None catalogued"
                    />
                    <TopicSlot
                      icon={<Eye size={14} className="text-wrong" />}
                      label="Do-not-miss"
                      items={doNotMiss.map((d) => ({
                        id: d.id,
                        label: d.diagnosis,
                        href: `/donotmiss#${d.id}`,
                      }))}
                      emptyText="None catalogued"
                    />
                  </div>

                  {topic.tutorAnswerIds.length > 0 && (
                    <div className="border-t border-rule/60 bg-bg/60 px-5 py-3">
                      <p className="flex items-center gap-2 text-micro text-ink-muted">
                        <Sparkles size={12} className="text-terracotta" />
                        Tutor walkthrough available for this topic — try{" "}
                        <Link
                          href={`/c?prefill=${encodeURIComponent(`Walk me through: ${topic.topic}`)}`}
                          className="font-semibold text-electric hover:underline"
                        >
                          asking the tutor
                        </Link>
                        .
                      </p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}

function TopicSlot({
  icon,
  label,
  items,
  emptyText,
}: {
  icon: React.ReactNode
  label: string
  items: Array<{ id: string; label: string; href: string }>
  emptyText: string
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">
        {icon}
        {label}
      </p>
      {items.length === 0 ? (
        <p className="text-small italic text-ink-faint">{emptyText}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block rounded-md px-2 py-1 text-small leading-snug text-ink transition-colors duration-200 ease-standard hover:bg-surface-subtle hover:text-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
