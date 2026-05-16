"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { HandMascot } from "@/components/motif/HandMascot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// ── Handle generator ──────────────────────────────────────────────────────────
const HANDLE_PREFIXES = [
  "DistalRadius", "ScaphoidFlex", "TendonZone", "MedianNerve",
  "KanavelSign", "MalletFinger", "FightBite", "ListerTubercle",
  "ExtensorZone", "FlexorPro", "NerveGraft", "VolarPlate",
]

function generateHandle(): string {
  const prefix = HANDLE_PREFIXES[Math.floor(Math.random() * HANDLE_PREFIXES.length)]
  const suffix = Math.floor(10 + Math.random() * 90)
  return `${prefix}${suffix}`
}

// ── Comfort categories ────────────────────────────────────────────────────────
const COMFORT_FIELDS = [
  { key: "anatomy",        label: "Anatomy" },
  { key: "trauma",         label: "Trauma" },
  { key: "congenital",     label: "Congenital" },
  { key: "peripheralNerve", label: "Peripheral Nerve" },
  { key: "microsurgery",   label: "Microsurgery" },
] as const

type ComfortKey = typeof COMFORT_FIELDS[number]["key"]
type ComfortMap = Record<ComfortKey, number>

const defaultComfort: ComfortMap = {
  anatomy: 3,
  trauma: 3,
  congenital: 2,
  peripheralNerve: 2,
  microsurgery: 1,
}

// ── Privacy contract ──────────────────────────────────────────────────────────
function PrivacyContract({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-rule bg-bg-elevated p-8 animate-scale-in">
        <SectionMarker number="00" label="Before we begin" className="mb-4" />
        <h1 className="font-fraunces text-h2 text-ink mb-3">Privacy contract</h1>
        <p className="text-body text-ink-muted mb-6 leading-relaxed">
          Your individual responses are private. Faculty and program directors{" "}
          <strong className="text-ink font-medium">cannot see how you score.</strong>{" "}
          Aggregate anonymized data helps us improve the platform.
        </p>
        <ul className="space-y-2 text-small text-ink-muted mb-8">
          <li className="flex gap-2">
            <span className="text-correct mt-0.5">✓</span>
            <span>Your answers belong to you</span>
          </li>
          <li className="flex gap-2">
            <span className="text-correct mt-0.5">✓</span>
            <span>No ranking visible to attendings or PDs</span>
          </li>
          <li className="flex gap-2">
            <span className="text-correct mt-0.5">✓</span>
            <span>Educational use only — not clinical advice</span>
          </li>
        </ul>
        <Button className="w-full" onClick={onAccept}>
          I understand &mdash; let&apos;s start
        </Button>
      </div>
    </div>
  )
}

// ── Main onboarding page ──────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [showPrivacy, setShowPrivacy] = useState(true)
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [onHandService, setOnHandService] = useState(false)
  const [primaryGoal, setPrimaryGoal] = useState("")
  const [comfort, setComfort] = useState<ComfortMap>(defaultComfort)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setHandle(generateHandle())
  }, [])

  function setComfortField(key: ComfortKey, value: number) {
    setComfort((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!role) next.role = "Please select your role."
    if (!specialty) next.specialty = "Please select your specialty."
    if (!primaryGoal) next.primaryGoal = "Please select a goal for this session."
    if (!handle.trim()) next.handle = "Please enter a handle."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const userData = {
      handle: handle.trim(),
      role,
      specialty,
      onHandService,
      primaryGoal,
      comfort,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("surgicraft_demo_user", JSON.stringify(userData))
    router.push("/c")
  }

  return (
    <>
      {showPrivacy && (
        <PrivacyContract onAccept={() => setShowPrivacy(false)} />
      )}

      <AppShell hideHeader className="px-4 py-12 sm:py-20">
        <div className="mx-auto w-full max-w-xl">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <HandMascot pose="open" size={64} />
              <div>
                <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-0.5">
                  SurgiCraft
                </p>
                <h1 className="font-fraunces text-h1 text-ink leading-tight">
                  Welcome to SurgiCraft
                </h1>
                <p className="text-small text-ink-muted mt-1">
                  Today&apos;s module: <span className="text-ink font-medium">Handcraft</span> — hand surgery.
                  Six quick questions to adapt everything to you.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-10">

            {/* Q1 — Role */}
            <fieldset>
              <SectionMarker number={1} label="Your role" className="mb-3" />
              <Label htmlFor="role-select" className="sr-only">
                Training level
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role-select" aria-required="true">
                  <SelectValue placeholder="Select your training level…" />
                </SelectTrigger>
                <SelectContent>
                  {["M3", "M4", "Intern", "PGY-2", "PGY-3", "PGY-4", "PGY-5", "Fellow", "Attending"].map(
                    (r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1.5 text-micro text-wrong" role="alert">
                  {errors.role}
                </p>
              )}
            </fieldset>

            {/* Q2 — Specialty */}
            <fieldset>
              <SectionMarker number={2} label="Your specialty" className="mb-3" />
              <Label htmlFor="specialty-select" className="sr-only">
                Specialty
              </Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty-select" aria-required="true">
                  <SelectValue placeholder="Select your specialty…" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Plastic Surgery",
                    "Orthopaedic Surgery",
                    "Emergency Med",
                    "Other",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialty && (
                <p className="mt-1.5 text-micro text-wrong" role="alert">
                  {errors.specialty}
                </p>
              )}
            </fieldset>

            {/* Q3 — Current rotation */}
            <fieldset>
              <SectionMarker number={3} label="Current rotation" className="mb-3" />
              <div className="flex items-center gap-3">
                <Switch
                  id="hand-service"
                  checked={onHandService}
                  onCheckedChange={setOnHandService}
                />
                <Label htmlFor="hand-service" className="cursor-pointer">
                  {onHandService ? "On hand service" : "Not currently on hand service"}
                </Label>
              </div>
            </fieldset>

            {/* Q4 — Primary goal */}
            <fieldset>
              <SectionMarker number={4} label="Goal for this session" className="mb-3" />
              <Label htmlFor="goal-select" className="sr-only">
                Primary goal
              </Label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                <SelectTrigger id="goal-select" aria-required="true">
                  <SelectValue placeholder="What are you here for today?" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Pre-round prep",
                    "Case prep",
                    "In-service prep",
                    "Casual learning",
                    "Pimping drill",
                  ].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.primaryGoal && (
                <p className="mt-1.5 text-micro text-wrong" role="alert">
                  {errors.primaryGoal}
                </p>
              )}
            </fieldset>

            {/* Q5 — Comfort ratings */}
            <fieldset>
              <SectionMarker number={5} label="Self-rated comfort" className="mb-3" />
              <p className="text-small text-ink-muted mb-5">
                1 = total beginner · 5 = comfortably teaching it
              </p>
              <div className="space-y-5">
                {COMFORT_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <div className="flex justify-between items-baseline mb-2">
                      <Label htmlFor={`comfort-${key}`} className="text-body">
                        {label}
                      </Label>
                      <span
                        className="font-mono text-small text-electric tabular-nums"
                        aria-live="polite"
                        aria-label={`${label} comfort: ${comfort[key]} out of 5`}
                      >
                        {comfort[key]}/5
                      </span>
                    </div>
                    <Slider
                      id={`comfort-${key}`}
                      min={1}
                      max={5}
                      step={1}
                      value={[comfort[key]]}
                      onValueChange={([v]) => setComfortField(key, v)}
                      aria-label={`${label} self-rated comfort, 1 to 5`}
                    />
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Q6 — Handle */}
            <fieldset>
              <SectionMarker number={6} label="Your handle" className="mb-3" />
              <p className="text-small text-ink-muted mb-3">
                Anonymous — visible on opt-in leaderboards only. Not tied to your name.
              </p>
              <div className="flex gap-2">
                <Input
                  id="handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. DistalRadius42"
                  aria-required="true"
                  maxLength={32}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setHandle(generateHandle())}
                  aria-label="Generate a new random handle"
                >
                  Shuffle
                </Button>
              </div>
              {errors.handle && (
                <p className="mt-1.5 text-micro text-wrong" role="alert">
                  {errors.handle}
                </p>
              )}
            </fieldset>

            {/* Submit */}
            <div className="pt-4 border-t border-rule">
              <Button type="submit" size="lg" className="w-full">
                Start learning →
              </Button>
              <p className="mt-3 text-center text-micro text-ink-muted">
                Educational use only — not for clinical decision-making.
              </p>
            </div>

          </form>
        </div>
      </AppShell>
    </>
  )
}
