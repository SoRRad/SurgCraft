"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Library as LibraryIcon,
  MessageSquare,
  Search,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM, TOPIC_INDEX } from "@/lib/demo/demo-content"
import { cn } from "@/lib/utils"

/**
 * /library — unified Cases + Common pitfalls + Red flags + Topics, with
 * a search box that filters across title/description/tags. Replaces
 * the previous /topics, /mistakes, and /donotmiss pages.
 */

type TabId = "all" | "topics" | "pitfalls" | "redflags"

const TABS: Array<{ id: TabId; label: string; icon: typeof BookOpen }> = [
  { id: "all",       label: "All",              icon: LibraryIcon },
  { id: "topics",    label: "Topics",           icon: BookOpen },
  { id: "pitfalls",  label: "Common pitfalls",  icon: AlertTriangle },
  { id: "redflags",  label: "Red flags",        icon: ShieldAlert },
]

const CASE_TITLES: Record<string, string> = {
  "001-fight-bite":   "The bar fight",
  "002-mallet-finger": "The basketball drop",
  "003-distal-radius": "FOOSH on the ice",
}

interface LibraryItem {
  kind: "topic" | "pitfall" | "redflag"
  id: string
  title: string
  summary: string
  tags: string[]
  href: string
  related: Array<{ label: string; href: string }>
}

function buildItems(): LibraryItem[] {
  const items: LibraryItem[] = []

  for (const topic of TOPIC_INDEX) {
    items.push({
      kind: "topic",
      id: `topic-${topic.topic}`,
      title: topic.topic,
      summary: [
        topic.caseIds.length ? `${topic.caseIds.length} case${topic.caseIds.length > 1 ? "s" : ""}` : null,
        topic.mistakeIds.length ? `${topic.mistakeIds.length} pitfall${topic.mistakeIds.length > 1 ? "s" : ""}` : null,
        topic.doNotMissIds.length ? `${topic.doNotMissIds.length} red flag${topic.doNotMissIds.length > 1 ? "s" : ""}` : null,
      ].filter(Boolean).join(" · "),
      tags: topic.tags,
      href: `/c?prefill=${encodeURIComponent(`Tell me about: ${topic.topic}`)}`,
      related: [
        ...topic.caseIds.map((id) => ({
          label: `Case: ${CASE_TITLES[id] ?? id}`,
          href: `/case/${id}`,
        })),
        ...topic.mistakeIds.map((id) => ({
          label: "Common pitfall",
          href: `/library?focus=pitfall:${id}`,
        })),
        ...topic.doNotMissIds.map((id) => ({
          label: "Red flag",
          href: `/library?focus=redflag:${id}`,
        })),
      ],
    })
  }

  for (const m of MISTAKE_MUSEUM) {
    items.push({
      kind: "pitfall",
      id: m.id,
      title: m.title,
      summary: m.mistake,
      tags: m.tags,
      href: `/c?prefill=${encodeURIComponent(`Quiz me on this pitfall: ${m.title}`)}`,
      related: m.relatedDoNotMissId
        ? [{ label: "Paired red flag", href: `/library?focus=redflag:${m.relatedDoNotMissId}` }]
        : [],
    })
  }

  for (const d of DO_NOT_MISS) {
    items.push({
      kind: "redflag",
      id: d.id,
      title: d.diagnosis,
      summary: d.clue,
      tags: d.tags,
      href: `/c?prefill=${encodeURIComponent(`Quiz me on this red flag: ${d.diagnosis}`)}`,
      related: d.relatedMistakeId
        ? [{ label: "Paired pitfall", href: `/library?focus=pitfall:${d.relatedMistakeId}` }]
        : [],
    })
  }

  return items
}

export default function LibraryPage() {
  const [tab, setTab] = useState<TabId>("all")
  const [query, setQuery] = useState("")

  const items = useMemo(() => buildItems(), [])

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) {
      for (const t of it.tags) map.set(t, (map.get(t) ?? 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12)
  }, [items])

  const [activeTags, setActiveTags] = useState<string[]>([])

  function toggleTag(tag: string) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((it) => {
      if (tab === "topics"   && it.kind !== "topic")   return false
      if (tab === "pitfalls" && it.kind !== "pitfall") return false
      if (tab === "redflags" && it.kind !== "redflag") return false

      if (activeTags.length && !activeTags.some((t) => it.tags.includes(t))) return false

      if (q) {
        const hay = `${it.title} ${it.summary} ${it.tags.join(" ")}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, tab, query, activeTags])

  const counts = useMemo(() => ({
    all:      items.length,
    topics:   items.filter((i) => i.kind === "topic").length,
    pitfalls: items.filter((i) => i.kind === "pitfall").length,
    redflags: items.filter((i) => i.kind === "redflag").length,
  }), [items])

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          <header className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Learn
            </p>
            <h1 className="mt-1.5 font-fraunces text-h1 text-ink heading-readable">
              Library
            </h1>
            <p className="mt-3 text-body text-ink-muted prose-readable">
              Every authored topic, common pitfall, and red flag in one place. Search by clue, diagnosis, or tag.
            </p>
          </header>

          {/* Search */}
          <div className="mb-4">
            <label htmlFor="library-search" className="sr-only">Search the library</label>
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
              <input
                id="library-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, pitfalls, red flags, tags…"
                className="w-full rounded-xl border border-rule bg-bg-elevated px-10 py-2.5 text-small text-ink placeholder:text-ink-faint shadow-soft focus:border-electric/60 focus:outline-none focus:ring-4 focus:ring-electric/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-faint hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label="Library category" className="mb-4 flex flex-wrap gap-1.5">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-small transition-colors duration-150 ease-standard",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                    active
                      ? "border-electric/60 bg-electric-soft text-ink"
                      : "border-rule bg-bg-elevated text-ink-muted hover:text-ink"
                  )}
                >
                  <Icon size={13} className={active ? "text-electric" : "text-ink-faint"} />
                  {label}
                  <span className="text-[11px] text-ink-faint">{counts[id]}</span>
                </button>
              )
            })}
          </div>

          {/* Tag chips */}
          <div className="mb-6 flex flex-wrap gap-1.5">
            {tagCounts.map(([tag, count]) => {
              const active = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors duration-150 ease-standard",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                    active
                      ? "border-electric/60 bg-electric-soft text-electric"
                      : "border-rule bg-bg-elevated text-ink-muted hover:text-ink"
                  )}
                >
                  {tag} <span className="text-ink-faint">·{count}</span>
                </button>
              )
            })}
            {activeTags.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTags([])}
                className="rounded-full px-2.5 py-0.5 text-[11px] text-ink-faint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
              >
                Clear tags
              </button>
            )}
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-rule bg-bg-elevated px-4 py-10 text-center text-small text-ink-muted">
              No matches. Try a different search or clear filters.
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {filtered.map((item) => (
                <li key={`${item.kind}-${item.id}`} id={`${item.kind}-${item.id}`}>
                  <LibraryCard item={item} />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-8 text-center text-micro text-ink-faint">
            Local demo content · synthetic · faculty verification planned for Phase 0C
          </p>
        </div>
      </div>
    </ChatLayout>
  )
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const meta = KIND_META[item.kind]
  const Icon = meta.icon
  return (
    <article className="group flex h-full flex-col rounded-xl border border-rule bg-bg-elevated p-4 transition-shadow duration-200 ease-standard hover:shadow-soft">
      <header className="mb-2 flex items-start gap-2.5">
        <span
          className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg", meta.iconWrap)}
          aria-hidden="true"
        >
          <Icon size={14} className={meta.iconColor} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", meta.labelColor)}>
            {meta.label}
          </p>
          <h2 className="mt-0.5 font-fraunces text-small font-semibold leading-snug text-ink">
            {item.title}
          </h2>
        </div>
      </header>

      <p className="text-small leading-relaxed text-ink-muted">{item.summary}</p>

      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {item.tags.slice(0, 5).map((t) => (
            <Badge key={t} variant="secondary" className="bg-surface-subtle text-ink-muted">{t}</Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
        <Button asChild size="sm" variant="outline">
          <Link href={item.href}>
            <MessageSquare size={13} />
            Ask in chat
          </Link>
        </Button>
        {item.related.length > 0 && (
          <details className="group/related text-[11px] text-ink-muted">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md px-1.5 py-0.5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric">
              Related <ChevronDown size={11} className="transition-transform duration-150 group-open/related:rotate-180" />
            </summary>
            <ul className="mt-1 space-y-0.5 pl-1">
              {item.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="inline-flex items-center gap-1 hover:text-electric">
                    {r.label}
                    <ArrowUpRight size={10} />
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  )
}

const KIND_META = {
  topic: {
    label: "Topic",
    icon: Sparkles,
    iconWrap: "bg-electric-soft",
    iconColor: "text-electric",
    labelColor: "text-electric",
  },
  pitfall: {
    label: "Common pitfall",
    icon: AlertTriangle,
    iconWrap: "bg-warn-soft",
    iconColor: "text-warn",
    labelColor: "text-warn",
  },
  redflag: {
    label: "Red flag",
    icon: ShieldAlert,
    iconWrap: "bg-wrong-soft",
    iconColor: "text-wrong",
    labelColor: "text-wrong",
  },
} as const
