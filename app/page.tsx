"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Clock } from "lucide-react"
import {
  isDemoUserSaved,
  migrateFromWeek1Key,
  startGuestSession,
} from "@/lib/demo/demo-user"
import { MODULES, type SurgicalModule } from "@/lib/orion/modules"
import { MayoMark } from "@/components/shell/MayoMark"
import { cn } from "@/lib/utils"

/**
 * Landing page.
 *
 * Three sections, in order:
 *   1. Brand intro + Mayo Clinic affiliation chip
 *   2. Module selector grid (Hand active; others in development)
 *   3. Entry CTAs (Try demo / Set up profile)
 *
 * Returning learners (demo user already saved) skip the page and go to /c.
 */
export default function Home() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string>("hand")

  useEffect(() => {
    migrateFromWeek1Key()
    if (isDemoUserSaved()) {
      router.replace("/c")
    } else {
      setReady(true)
    }
  }, [router])

  function handleTryDemo() {
    startGuestSession()
    router.replace(selectedModule === "hand" ? "/c" : `/m/${selectedModule}`)
  }

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg px-4">
        <p className="text-small text-ink-muted" aria-live="polite">
          Loading ORION…
        </p>
      </div>
    )
  }

  const activeChoice = MODULES.find((m) => m.id === selectedModule)
  const isHand = activeChoice?.status === "active"

  return (
    <main className="min-h-dvh bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Brand */}
        <header className="mb-10 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            ORION Surgery
          </p>
          <h1 className="mx-auto mt-3 font-fraunces text-h1 leading-tight text-ink heading-readable">
            Operative Reasoning &amp; Interactive Online Navigator
          </h1>
          <p className="mx-auto mt-4 max-w-md text-body text-ink-muted">
            An educational tutor for surgical learners. Built for medical students, residents, and fellows. Educational use only, no PHI.
          </p>

          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-rule bg-bg-elevated px-3 py-1.5 text-micro text-ink-muted shadow-soft">
            <MayoMark size={14} />
            <span>In affiliation with Mayo Clinic</span>
          </div>
        </header>

        {/* Module selector */}
        <section aria-labelledby="modules-heading" className="mb-10">
          <div className="mb-4">
            <h2 id="modules-heading" className="font-fraunces text-h3 text-ink">
              Choose a module
            </h2>
            <p className="mt-1 text-small text-ink-muted">
              Hand is the active pilot. Other modules are previews while we recruit faculty champions.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <li key={mod.id}>
                <ModuleTile
                  module={mod}
                  selected={selectedModule === mod.id}
                  onSelect={() => setSelectedModule(mod.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Entry CTAs */}
        <section
          aria-labelledby="entry-heading"
          className="rounded-2xl border border-rule bg-bg-elevated p-5 shadow-soft sm:p-6"
        >
          <h2 id="entry-heading" className="font-fraunces text-h3 text-ink">
            How do you want to start with {activeChoice?.name ?? "this module"}?
          </h2>
          {!isHand && activeChoice ? (
            <>
              <p className="mt-2 text-small text-ink-muted">
                {activeChoice.name} is in development. Preview the placeholder or pick the active Hand module.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/m/${activeChoice.id}`}
                  className="flex-1 rounded-xl border border-rule bg-bg px-5 py-3 text-center text-small font-medium text-ink transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                >
                  Preview {activeChoice.name} module
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedModule("hand")}
                  className="flex-1 rounded-xl bg-electric px-5 py-3 text-small font-semibold text-bg-elevated shadow-soft transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                >
                  Switch to Hand
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-small text-ink-muted">
                Pick the demo if you just want to look around. Pick the profile flow if you want the tutor to adapt to your training level.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleTryDemo}
                  className="flex-1 rounded-xl bg-electric px-5 py-3 text-small font-semibold text-bg-elevated shadow-soft transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                >
                  Try the demo
                </button>
                <Link
                  href="/onboarding"
                  className="flex-1 rounded-xl border border-rule bg-bg px-5 py-3 text-center text-small font-medium text-ink transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                >
                  Set up a learner profile
                </Link>
              </div>
              <p className="mt-4 text-micro text-ink-faint">
                The demo skips onboarding and uses a generic resident profile.
              </p>
            </>
          )}
        </section>

        {/* Footer links */}
        <footer className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-micro text-ink-faint">
          <Link href="/about" className="hover:text-ink">About</Link>
          <span aria-hidden="true">·</span>
          <Link href="/library" className="hover:text-ink">Library</Link>
          <span aria-hidden="true">·</span>
          <Link href="/resources" className="hover:text-ink">Resources</Link>
        </footer>
      </div>
    </main>
  )
}

function ModuleTile({
  module: mod,
  selected,
  onSelect,
}: {
  module: SurgicalModule
  selected: boolean
  onSelect: () => void
}) {
  const Icon = mod.icon
  const isActive = mod.status === "active"

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-standard",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2",
        selected
          ? "border-electric/60 bg-electric-soft/60 shadow-soft"
          : "border-rule bg-bg-elevated hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-soft"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
          isActive ? "bg-electric text-bg-elevated" : "bg-surface-subtle text-ink-faint"
        )}
        aria-hidden="true"
      >
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-small font-semibold text-ink">{mod.name}</span>
          {isActive ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-correct-soft px-2 py-0.5 text-[10px] font-medium text-correct">
              <CheckCircle2 size={10} />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-ink-faint">
              <Clock size={10} />
              In development
            </span>
          )}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-micro text-ink-muted">{mod.tagline}</span>
      </span>
    </button>
  )
}
