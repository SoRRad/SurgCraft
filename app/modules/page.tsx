import Link from "next/link"
import { ArrowRight, CircleDashed, CircleDot } from "lucide-react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { MODULES, type SurgicalModule } from "@/lib/orion/modules"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Surgical subspecialty modules in ORION Surgery. Hand is active; additional modules are in development pending faculty champions.",
}

const ACCENT_STYLES: Record<SurgicalModule["accent"], string> = {
  terracotta: "from-terracotta-soft/60 to-terracotta-soft/20 text-terracotta",
  electric: "from-electric-soft/60 to-electric-soft/20 text-electric",
  correct: "from-correct-soft/60 to-correct-soft/20 text-correct",
  warn: "from-warn-soft/60 to-warn-soft/20 text-warn",
  wrong: "from-wrong-soft/60 to-wrong-soft/20 text-wrong",
}

function StatusPill({ status }: { status: SurgicalModule["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-correct-soft px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.16em] text-correct">
        <CircleDot size={9} aria-hidden="true" />
        Active
      </span>
    )
  }
  if (status === "in-development") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.16em] text-ink-muted">
        <CircleDashed size={9} aria-hidden="true" />
        In development
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.16em] text-ink-faint">
      Planned
    </span>
  )
}

function ModuleCard({ module }: { module: SurgicalModule }) {
  const Icon = module.icon
  const isActive = module.status === "active"
  const href = module.homeRoute ?? `/m/${module.id}`

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft transition-all duration-300 ease-standard",
        isActive
          ? "hover:-translate-y-0.5 hover:border-terracotta/40 hover:shadow-medium"
          : "hover:border-electric/30 hover:shadow-medium",
      )}
    >
      <div
        className={cn(
          "flex items-start gap-3 bg-gradient-to-br p-5",
          ACCENT_STYLES[module.accent],
        )}
      >
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-bg-elevated/80 shadow-soft" aria-hidden="true">
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-fraunces text-h3 leading-tight text-ink">{module.name}</h2>
            <StatusPill status={module.status} />
          </div>
          <p className="mt-0.5 text-micro text-ink-muted">{module.fullName}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-small leading-relaxed text-ink">{module.tagline}</p>

        {module.recruitmentNote && (
          <p className="rounded-xl border border-rule/60 bg-bg p-3 text-micro leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink">Faculty wanted: </span>
            {module.recruitmentNote}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Button asChild variant={isActive ? "default" : "outline"} size="sm" className="w-full">
            <Link href={href}>
              {isActive ? "Enter module" : "Learn more"}
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function ModulesPage() {
  const active = MODULES.filter((m) => m.status === "active")
  const inDev = MODULES.filter((m) => m.status === "in-development")

  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-10 max-w-3xl">
            <SectionMarker number="01" label="ORION Modules" className="mb-3" />
            <h1 className="font-fraunces text-h1 leading-tight text-ink">
              Surgical subspecialty modules
            </h1>
            <p className="mt-3 text-body text-ink-muted">
              ORION Surgery is built as a platform. Each module ships its own knowledge base, seed cases, common-pitfall library, and red-flag library. Modules unlock when a faculty champion signs on to author and review content.
            </p>
          </div>

          <section className="mb-10">
            <p className="mb-4 font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-correct">
              Active
            </p>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {active.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          </section>

          <section>
            <p className="mb-4 font-fraunces text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">
              In development · faculty champions wanted
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {inDev.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          </section>

          <div className="mt-10 rounded-2xl border border-rule/70 bg-surface-subtle/60 p-5 text-small text-ink-muted">
            <p className="mb-1 font-semibold text-ink">Want to bring a module online?</p>
            <p className="leading-relaxed">
              ORION needs a faculty champion per module — one attending willing to co-author seed cases, validate the pitfall and red-flag libraries, and review content as it grows. Reach out via the contact details in <Link href="/about" className="text-electric hover:underline">About</Link>.
            </p>
          </div>
        </div>
      </div>
    </ChatLayout>
  )
}
