"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { AppShell } from "@/components/shell/AppShell"
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
import { startGuestSession } from "@/lib/demo/demo-user"

// ── Handle generator ────────────────────────────────────────────────────────
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

// ── Comfort categories ──────────────────────────────────────────────────────
const COMFORT_FIELDS = [
  { key: "anatomy",         label: "Anatomy" },
  { key: "trauma",          label: "Trauma" },
  { key: "congenital",      label: "Congenital" },
  { key: "peripheralNerve", label: "Peripheral nerve" },
  { key: "microsurgery",    label: "Microsurgery" },
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

export default function OnboardingPage() {
  const router = useRouter()
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

  function handleSkip() {
    startGuestSession()
    router.push("/c")
  }

  return (
    <AppShell hideHeader hideFooter className="px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <header className="mb-8">
          <p className="text-micro font-semibold uppercase tracking-[0.22em] text-ink-faint">
            ORION Surgery
          </p>
          <h1 className="mt-2 font-fraunces text-h1 leading-tight text-ink heading-readable">
            Set up your learner profile
          </h1>
          <p className="mt-3 text-body text-ink-muted">
            Five quick questions so the tutor can pitch answers at your level.
            Stored locally in this browser. Not shared.
          </p>
        </header>

        {/* Skip-to-demo card */}
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-rule bg-bg-elevated p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-electric-soft text-electric"
              aria-hidden="true"
            >
              <Sparkles size={16} />
            </span>
            <div className="min-w-0">
              <p className="text-small font-semibold text-ink">
                Just want to look around?
              </p>
              <p className="text-small text-ink-muted">
                Skip the form and use a generic resident profile.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="flex-shrink-0 rounded-lg border border-rule bg-bg px-3 py-2 text-small font-medium text-ink transition-colors duration-200 ease-standard hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
          >
            Skip and try the demo
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Role */}
          <fieldset>
            <Label htmlFor="role-select" className="mb-2 block text-small font-medium text-ink">
              Your training level
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role-select" aria-required="true">
                <SelectValue placeholder="Select your level…" />
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
              <p className="mt-1.5 text-micro text-wrong" role="alert">{errors.role}</p>
            )}
          </fieldset>

          {/* Specialty */}
          <fieldset>
            <Label htmlFor="specialty-select" className="mb-2 block text-small font-medium text-ink">
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
                  "Emergency Medicine",
                  "Other",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.specialty && (
              <p className="mt-1.5 text-micro text-wrong" role="alert">{errors.specialty}</p>
            )}
          </fieldset>

          {/* Rotation */}
          <fieldset>
            <Label className="mb-2 block text-small font-medium text-ink">
              Current rotation
            </Label>
            <div className="flex items-center gap-3 rounded-lg border border-rule bg-bg-elevated px-3 py-2.5">
              <Switch
                id="hand-service"
                checked={onHandService}
                onCheckedChange={setOnHandService}
              />
              <Label htmlFor="hand-service" className="cursor-pointer text-small text-ink">
                {onHandService ? "On hand service this rotation" : "Not on hand service right now"}
              </Label>
            </div>
          </fieldset>

          {/* Goal */}
          <fieldset>
            <Label htmlFor="goal-select" className="mb-2 block text-small font-medium text-ink">
              Goal for this session
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
                  "Practice questions",
                ].map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.primaryGoal && (
              <p className="mt-1.5 text-micro text-wrong" role="alert">{errors.primaryGoal}</p>
            )}
          </fieldset>

          {/* Comfort */}
          <fieldset>
            <Label className="mb-1 block text-small font-medium text-ink">
              Self-rated comfort
            </Label>
            <p className="mb-4 text-micro text-ink-muted">
              1 = total beginner. 5 = comfortably teaching it.
            </p>
            <div className="space-y-4">
              {COMFORT_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <Label htmlFor={`comfort-${key}`} className="text-small text-ink">
                      {label}
                    </Label>
                    <span
                      className="tabular text-micro text-electric"
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

          {/* Handle */}
          <fieldset>
            <Label htmlFor="handle" className="mb-2 block text-small font-medium text-ink">
              Anonymous handle
            </Label>
            <p className="mb-2 text-micro text-ink-muted">
              Do not enter your real name, MRN, DOB, or other PHI.
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
              <p className="mt-1.5 text-micro text-wrong" role="alert">{errors.handle}</p>
            )}
          </fieldset>

          {/* Submit */}
          <div className="border-t border-rule pt-6">
            <Button type="submit" size="lg" className="w-full">
              Start learning
            </Button>
            <p className="mt-3 text-center text-micro text-ink-muted">
              Educational use only — not for clinical decision-making.
            </p>
            <p className="mt-2 text-center text-micro text-ink-faint">
              <Link href="/about" className="hover:text-ink">
                Read how ORION handles your data
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
