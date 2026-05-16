"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UserData {
  handle: string
  role: string
  specialty: string
  onHandService: boolean
  primaryGoal: string
  comfort: Record<string, number>
}

// ── Streak ring placeholder ───────────────────────────────────────────────────
function StreakRingPlaceholder({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  const r = 28
  const circ = 2 * Math.PI * r
  const progress = Math.min(value / max, 1)
  const offset = circ * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        aria-label={`${label}: ${value} of ${max}`}
        role="img"
      >
        {/* Track */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="5"
        />
        {/* Progress */}
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 420ms var(--ease-reveal)" }}
        />
        <text
          x="36"
          y="40"
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--font-jetbrains-mono)"
          fill="var(--ink)"
        >
          {value}
        </text>
      </svg>
      <span className="text-micro text-ink-muted text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </div>
  )
}

// ── Mode card (stub for future weeks) ────────────────────────────────────────
function ModeCard({
  title,
  description,
  href,
  badge,
}: {
  title: string
  description: string
  href: string
  badge?: string
}) {
  return (
    <Card className="group relative transition-colors duration-150 hover:border-electric">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-h3">{title}</CardTitle>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("handcraft_user")
    if (!stored) {
      router.replace("/onboarding")
      return
    }
    try {
      setUser(JSON.parse(stored))
    } catch {
      router.replace("/onboarding")
      return
    }
    setLoaded(true)
  }, [router])

  if (!loaded || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <p className="font-inter text-small text-ink-muted animate-pulse">Loading…</p>
      </div>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Welcome */}
        <div className="flex items-start gap-5 mb-12">
          <HandMascot pose="open" size={80} className="flex-shrink-0 mt-1" />
          <div>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-0.5">
              § SurgiCraft · Module 01
            </p>
            <h1 className="font-fraunces text-display text-ink leading-none">
              Handcraft
            </h1>
            <p className="mt-2 text-body text-ink-muted">
              Welcome back,{" "}
              <span className="text-ink font-medium">{user.handle}</span>
              {" "}· {user.role} · {user.specialty}
              {user.onHandService && " · On hand service"}
            </p>
            <p className="mt-1 text-micro text-ink-muted">
              Phase 0A · local faculty-demo prototype · no external AI connected
            </p>
          </div>
        </div>

        {/* Streak rings */}
        <section aria-labelledby="streaks-heading" className="mb-12">
          <SectionMarker number="02" label="Today's streaks" className="mb-4" />
          <div
            className="flex gap-8 p-6 rounded-lg border border-rule bg-bg-elevated w-fit"
          >
            <StreakRingPlaceholder label="Questions" value={0} max={10} color="var(--electric)" />
            <StreakRingPlaceholder label="Cases" value={0} max={3} color="var(--terracotta)" />
            <StreakRingPlaceholder label="Review" value={0} max={5} color="var(--correct)" />
          </div>
          <p className="mt-3 text-micro text-ink-muted">
            Nothing here yet. Even a hand has to start as a limb bud.
          </p>
        </section>

        {/* Mode launcher */}
        <section aria-labelledby="modes-heading" className="mb-12">
          <SectionMarker number="03" label="Start a session" className="mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ModeCard
              title="Tutor"
              description="Ask anything about hand surgery. Get cited answers adapted to your level."
              href="/chat"
              badge="Week 2"
            />
            <ModeCard
              title="Case Unfolds"
              description="Work through a progressive clinical case. Cards reveal as you ask."
              href="/case"
              badge="Week 3"
            />
            <ModeCard
              title="Pimping Simulator"
              description="Rapid-fire attending-voice questions. Optional countdown. Debrief after."
              href="/pimping"
              badge="Week 5"
            />
            <ModeCard
              title="Pre-Op Prep"
              description="Anatomy, approach, pitfalls, and pearls for tomorrow's case."
              href="/preop"
              badge="Week 5"
            />
            <ModeCard
              title="OR Debrief"
              description="Reflect on a case you saw. Fill gaps as they emerge."
              href="/debrief"
              badge="Phase 1"
            />
            <ModeCard
              title="Consult Mode"
              description="Play the hand surgeon. The bot is the ED resident."
              href="/consult"
              badge="Phase 1"
            />
          </div>
        </section>

      </div>
    </AppShell>
  )
}
