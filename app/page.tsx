"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  isDemoUserSaved,
  migrateFromWeek1Key,
  startGuestSession,
} from "@/lib/demo/demo-user"

/**
 * Landing page.
 *
 * Returning learner → /c.
 * New visitor → small splash with two paths: a guided onboarding for
 * residents who want personalized tutor depth, and a one-click demo
 * for faculty reviewers, visiting clinicians, or anyone evaluating ORION.
 */
export default function Home() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

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
    router.replace("/c")
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

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-lg text-center">
        <p className="text-micro font-semibold uppercase tracking-[0.22em] text-ink-faint">
          ORION Surgery
        </p>
        <h1 className="mt-3 font-fraunces text-h1 leading-tight text-ink">
          Operative Reasoning &amp; Interactive Online Navigator
        </h1>
        <p className="mx-auto mt-4 max-w-md text-body text-ink-muted">
          An educational tutor for hand-surgery learners. Built for medical
          students, residents, and fellows. Educational use only, no PHI.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleTryDemo}
            className="inline-flex w-full items-center justify-center rounded-xl bg-electric px-5 py-3 text-small font-semibold text-bg shadow-soft transition-all duration-200 ease-standard hover:-translate-y-0.5 hover:shadow-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 sm:w-auto"
          >
            Try the demo
          </button>
          <Link
            href="/onboarding"
            className="inline-flex w-full items-center justify-center rounded-xl border border-rule bg-bg-elevated px-5 py-3 text-small font-medium text-ink transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 sm:w-auto"
          >
            Set up a learner profile
          </Link>
        </div>

        <p className="mt-6 text-micro text-ink-faint">
          The demo skips onboarding and uses a generic resident profile. Set up
          a profile if you want the tutor to adapt to your level.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 text-micro text-ink-faint">
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/modules" className="hover:text-ink">
            Modules
          </Link>
        </div>
      </div>
    </main>
  )
}
