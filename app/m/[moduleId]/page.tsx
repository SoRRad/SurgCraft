import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CircleDashed, Mail } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { getModule, MODULES } from "@/lib/orion/modules"
import type { Metadata } from "next"

interface PageProps {
  params: { moduleId: string }
}

export function generateStaticParams() {
  return MODULES.filter((m) => m.status !== "active").map((m) => ({ moduleId: m.id }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const mod = getModule(params.moduleId)
  if (!mod) return { title: "Module" }
  return {
    title: mod.fullName,
    description: `${mod.fullName} module in ORION Surgery. ${mod.tagline}`,
  }
}

export default function ModulePlaceholderPage({ params }: PageProps) {
  const mod = getModule(params.moduleId)
  if (!mod) notFound()

  // If a module is somehow "active" but the user hit /m/[id], redirect via Link in UI.
  const Icon = mod.icon

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/modules">
                <ArrowLeft size={14} />
                Back to modules
              </Link>
            </Button>
          </div>

          <div className="mb-8 flex items-start gap-4">
            <span
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-surface-subtle text-ink-faint shadow-soft"
              aria-hidden="true"
            >
              <Icon size={22} />
            </span>
            <div>
              <SectionMarker number="—" label="ORION module" className="mb-2" />
              <h1 className="font-fraunces text-h1 leading-tight text-ink">{mod.fullName}</h1>
              <p className="mt-2 text-body text-ink-muted">{mod.tagline}</p>
            </div>
          </div>

          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-warn-soft/60 px-3 py-1.5 text-micro font-semibold uppercase tracking-[0.16em] text-warn">
            <CircleDashed size={12} aria-hidden="true" />
            In development
          </div>

          {mod.recruitmentNote && (
            <section className="mb-8 rounded-2xl border border-rule/70 bg-bg-elevated p-6 shadow-soft">
              <p className="mb-2 font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-terracotta">
                Faculty champion wanted
              </p>
              <p className="text-body leading-relaxed text-ink">
                {mod.recruitmentNote}
              </p>
            </section>
          )}

          <section className="mb-8 space-y-4 rounded-2xl border border-rule/70 bg-surface-subtle/40 p-6">
            <h2 className="font-fraunces text-h3 text-ink">What it will include at launch</h2>
            <ul className="space-y-2 text-small leading-relaxed text-ink">
              {[
                "A small set of synthetic seed cases co-authored with the faculty champion.",
                "A Mistake Museum of decision-time cognitive errors specific to this subspecialty.",
                "A Do-Not-Miss library of recognition-time red flags requiring immediate escalation.",
                "Pearl registry with faculty attribution.",
                "Same chat-first, role-aware tutor surface as the Hand module.",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-ink-faint" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3 rounded-2xl border border-rule/70 bg-bg-elevated p-6">
            <h2 className="font-fraunces text-h3 text-ink">In the meantime</h2>
            <p className="text-small leading-relaxed text-ink-muted">
              The Hand module is fully usable today and demonstrates the full ORION pattern: chat-first tutoring, progressive case reveal, the Mistake Museum / Do-Not-Miss separation, saved pearls, and local-first persistence. Future modules will mirror this shape.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild>
                <Link href="/c">Try the Hand module</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/modules">See all modules</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/about">
                  <Mail size={14} />
                  Contact about contributing
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </ChatLayout>
  )
}
