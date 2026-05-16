"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UserData {
  handle: string
  role: string
  specialty: string
  onHandService: boolean
  primaryGoal: string
  comfort: Record<string, number>
}

function ModeCard({
  title, description, href, status, size = "sm",
}: {
  title: string; description: string; href: string
  status: "available" | "coming-soon"; size?: "lg" | "sm" | "md"
}) {
  const available = status === "available"
  return (
    <div className={cn(
      "border rounded-lg bg-bg-elevated flex flex-col",
      available ? "border-rule hover:border-electric transition-colors duration-150" : "border-rule opacity-70",
      size === "lg" && "p-7", size === "md" && "p-6", size === "sm" && "p-5"
    )}>
      <div className="flex items-start justify-between mb-3">
        <h2 className={cn("font-fraunces text-ink", size === "lg" ? "text-h2" : "text-h3")}>
          {title}
        </h2>
        <Badge variant={available ? "default" : "secondary"} className="text-micro flex-shrink-0 ml-2">
          {available ? "Available" : "Coming soon"}
        </Badge>
      </div>
      <p className={cn("text-ink-muted flex-1 mb-4", size === "lg" ? "text-body" : "text-small")}>
        {description}
      </p>
      {available ? (
        <Button asChild size={size === "lg" ? "lg" : "default"} className="w-full">
          <Link href={href}>Open →</Link>
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={href}>Preview</Link>
        </Button>
      )}
    </div>
  )
}

function StreakRing({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const r = 28, circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(value / max, 1))
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label={`${label}: ${value} of ${max}`} role="img">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--rule)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 420ms var(--ease-reveal)" }} />
        <text x="36" y="40" textAnchor="middle" fontSize="13" fontFamily="var(--font-jetbrains-mono)" fill="var(--ink)">{value}</text>
      </svg>
      <span className="text-micro text-ink-muted text-center leading-tight max-w-[64px]">{label}</span>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("surgicraft_demo_user") ?? localStorage.getItem("handcraft_user")
    if (!stored) { router.replace("/onboarding"); return }
    try { setUser(JSON.parse(stored)) } catch { router.replace("/onboarding"); return }
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

        {/* Hero */}
        <div className="flex items-start gap-5 mb-14">
          <HandMascot pose="open" size={80} className="flex-shrink-0 mt-1" />
          <div>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-0.5">
              § SurgiCraft · Module 01
            </p>
            <h1 className="font-fraunces text-display text-ink leading-none">Handcraft</h1>
            <p className="mt-2 text-body text-ink-muted">
              Welcome back, <span className="text-ink font-medium">{user.handle}</span>
              {" "}· {user.role} · {user.specialty}
              {user.onHandService && " · On hand service"}
            </p>
            <p className="mt-1 text-micro text-ink-muted">
              Phase 0A · local faculty-demo prototype · no external AI connected
            </p>
          </div>
        </div>

        {/* Row 1 — 2 large cards (available) */}
        <section className="mb-6">
          <SectionMarker number="01" label="Available now" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModeCard title="Tutor" status="available" href="/chat" size="lg"
              description="Ask any hand surgery question. Structured answers with rounds one-liners, common mistakes, and what-would-change variants." />
            <ModeCard title="Case Unfolds" status="available" href="/case" size="lg"
              description="Three progressive clinical cases. Reveal cards as you ask, get teaching points and faculty pearls at the end." />
          </div>
        </section>

        {/* Row 2 — 4 smaller cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <ModeCard title="Mistake Museum" status="available" href="/mistakes" size="sm"
            description="6 common errors — what they are, why they happen, how to avoid them." />
          <ModeCard title="Do-Not-Miss" status="available" href="/donotmiss" size="sm"
            description="8 diagnoses where delayed recognition causes irreversible harm." />
          <ModeCard title="Pimping Simulator" status="coming-soon" href="/pimping" size="sm"
            description="Rapid-fire attending-voice questions with graded debrief." />
          <ModeCard title="Pre-Op Prep" status="coming-soon" href="/preop" size="sm"
            description="Anatomy, approach, intra-op questions, and pitfalls." />
        </div>

        {/* Row 3 — 2 medium cards (coming soon) */}
        <section className="mb-12">
          <SectionMarker number="02" label="Coming in Phase 0B / 1" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ModeCard title="OR Debrief" status="coming-soon" href="/debrief" size="md"
              description="Describe a case you scrubbed. Reflective questions fill knowledge gaps as they emerge." />
            <ModeCard title="Consult Mode" status="coming-soon" href="/consult" size="md"
              description="You receive the consult, the bot is the ED resident. Scored on completeness and disposition." />
          </div>
        </section>

        {/* Streak rings */}
        <section className="mb-10">
          <SectionMarker number="03" label="Today&apos;s progress" className="mb-4" />
          <div className="flex gap-8 p-6 rounded-lg border border-rule bg-bg-elevated w-fit">
            <StreakRing label="Questions" value={0} max={10} color="var(--electric)" />
            <StreakRing label="Cases" value={0} max={3} color="var(--terracotta)" />
            <StreakRing label="Review" value={0} max={5} color="var(--correct)" />
          </div>
          <p className="mt-3 text-micro text-ink-muted">
            Nothing here yet. Streak tracking connects to Supabase in Phase 0C.
          </p>
        </section>

      </div>
    </AppShell>
  )
}
