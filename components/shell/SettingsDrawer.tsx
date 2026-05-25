"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Flag, Monitor, Moon, Shield, Sun, Trash2, Upload, Volume2 } from "lucide-react"
import { useTheme } from "@/components/shell/ThemeProvider"
import { speak, stopSpeaking, useVoiceSettings } from "@/components/shell/VoiceSettings"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  clearAllConversations,
  clearAllData,
  exportLocalData,
  importLocalData,
  listFlaggedMessages,
  type LocalFlaggedMessage,
} from "@/lib/demo/conversations"
import { getDemoUser, migrateFromWeek1Key, saveDemoUser } from "@/lib/demo/demo-user"
import { cn } from "@/lib/utils"
import {
  getProviderStatusDetail,
  getProviderStatusLabel,
  useProviderStatus,
} from "./useProviderStatus"

type SettingsUser = NonNullable<ReturnType<typeof getDemoUser>>

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatFlagDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "Unknown date"
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function getFlagPreview(flag: LocalFlaggedMessage): string {
  return flag.message.content.trim() || "Flagged assistant response with tool output."
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const router = useRouter()
  const { status: providerStatus } = useProviderStatus()
  const importInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<SettingsUser | null>(null)
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState<SettingsUser["role"] | "">("")
  const [saved, setSaved] = useState(false)
  const [flags, setFlags] = useState<LocalFlaggedMessage[]>([])
  const [dataNotice, setDataNotice] = useState("")

  useEffect(() => {
    if (!open) return

    migrateFromWeek1Key()
    const parsed = getDemoUser()
    if (parsed) {
      setUser(parsed)
      setHandle(parsed.handle ?? "")
      setRole(parsed.role ?? "")
    }

    setFlags(listFlaggedMessages())
    const refreshFlags = () => setFlags(listFlaggedMessages())
    window.addEventListener("surgicraft:conversations:updated", refreshFlags)
    return () => window.removeEventListener("surgicraft:conversations:updated", refreshFlags)
  }, [open])

  function handleSave() {
    if (!user) return
    const updated = {
      ...user,
      handle: handle.trim() || user.handle,
      role: role || user.role,
    }
    saveDemoUser(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function handleExport() {
    const payload = exportLocalData()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `orion-local-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setDataNotice(
      `Exported ${payload.conversations.length} conversations and ${payload.pearls.length} pearls.`
    )
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const parsed = JSON.parse(await file.text()) as unknown
      const result = importLocalData(parsed)
      setFlags(listFlaggedMessages())
      setDataNotice(
        `Imported ${result.conversationsImported} conversations and ${result.pearlsImported} pearls.`
      )
    } catch {
      setDataNotice("Import failed. Choose an ORION local JSON export.")
    } finally {
      e.currentTarget.value = ""
    }
  }

  function handleClearConversations() {
    if (!window.confirm("Clear local conversations only? Saved pearls and your profile will stay on this device.")) return
    clearAllConversations()
    setFlags([])
    setDataNotice("Cleared local conversations. Saved pearls and profile data were kept.")
    onOpenChange(false)
    router.push("/c")
  }

  function handleClearAll() {
    if (!window.confirm("Clear all local data? This will delete conversations, saved pearls, and your profile. You will be taken to onboarding.")) return
    clearAllData()
    onOpenChange(false)
    router.push("/onboarding")
  }

  function openFlag(flag: LocalFlaggedMessage) {
    onOpenChange(false)
    router.push(`/c/${flag.conversationId}`)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col border-l border-rule/70 bg-bg p-0 shadow-floating sm:max-w-[450px]">
        <SheetHeader className="border-b border-rule/70 px-6 pb-4 pt-6">
          <SheetTitle className="font-fraunces text-h2">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
            <p className="mb-3 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Profile</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="settings-handle" className="text-small">Handle</Label>
                <Input
                  id="settings-handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  maxLength={32}
                  className="mt-1"
                  placeholder="Your anonymous handle"
                />
              </div>
              <div>
                <Label htmlFor="settings-role" className="text-small">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as SettingsUser["role"])}>
                  <SelectTrigger id="settings-role" className="mt-1">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["M3", "M4", "Intern", "PGY-2", "PGY-3", "PGY-4", "PGY-5", "Fellow", "Attending"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} size="sm" className="w-full">
                {saved ? "Saved" : "Save changes"}
              </Button>
            </div>
          </section>

          <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
            <p className="mb-3 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">AI mode</p>
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-micro",
                  providerStatus.provider === "anthropic"
                    ? "bg-correct-soft text-correct"
                    : providerStatus.reason
                    ? "bg-warn-soft text-warn"
                    : "text-ink-muted"
                )}
              >
                {getProviderStatusLabel(providerStatus)}
              </Badge>
            </div>
            <p className="text-small text-ink-muted leading-relaxed">
              {getProviderStatusDetail(providerStatus)}
            </p>
            <p className="mt-2 text-small text-ink-muted leading-relaxed">
              To test Anthropic live mode, set LLM_PROVIDER=anthropic and ANTHROPIC_API_KEY on the server, then restart.
            </p>
          </section>

          <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
            <p className="mb-3 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Privacy and safety</p>
            <div className="rounded-xl border border-terracotta-soft bg-terracotta-soft/60 p-4">
              <div className="flex items-start gap-2">
                <Shield size={15} className="text-terracotta mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-micro font-semibold text-terracotta uppercase tracking-wide mb-1">
                    Educational use only
                  </p>
                  <p className="text-small text-ink leading-relaxed">
                    No PHI: do not enter names, MRNs, dates of birth, images, or other patient identifiers.
                    Conversations, pearls, and flags are stored locally in this browser.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Local data</p>
              <Badge variant="secondary" className="text-micro text-ink-muted">Local only</Badge>
            </div>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleExport}>
                <Download size={14} />
                Export JSON
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => importInputRef.current?.click()}>
                <Upload size={14} />
                Import JSON
              </Button>
            </div>
            <p className="mt-2 text-small text-ink-muted leading-relaxed">
              Export and import move only local conversations and saved pearls from this browser.
            </p>
            {dataNotice && (
              <p className="mt-2 text-small text-electric">{dataNotice}</p>
            )}
          </section>

          <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Review flags</p>
              <Badge variant="secondary" className="text-micro text-ink-muted">Local only</Badge>
            </div>
            <p className="text-small text-ink-muted leading-relaxed mb-3">
              Local review only - not sent to faculty yet. Flagged messages are visible only on this device.
              Faculty verification workflow is planned for Phase 0C.
            </p>
            {flags.length === 0 ? (
              <div className="rounded-xl border border-rule/70 bg-surface-subtle px-4 py-3">
                <p className="text-small text-ink-muted">No local flags yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {flags.map((flag) => (
                  <button
                    key={`${flag.conversationId}:${flag.message.id}`}
                    type="button"
                    onClick={() => openFlag(flag)}
                    className={cn(
                      "w-full rounded-xl border border-rule/70 bg-bg px-3 py-2 text-left",
                      "transition-all duration-300 ease-standard hover:border-electric/40 hover:shadow-soft",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Flag size={13} className="text-terracotta flex-shrink-0" />
                      <span className="text-small font-medium text-ink truncate flex-1">
                        {flag.conversationTitle}
                      </span>
                      <span className="text-micro text-ink-muted flex-shrink-0">
                        {formatFlagDate(flag.message.createdAt)}
                      </span>
                    </div>
                    <p className="text-small text-ink-muted leading-relaxed max-h-16 overflow-hidden">
                      {getFlagPreview(flag)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <ThemeSection />
          <VoiceSection />
        </div>

        <div className="space-y-2 border-t border-rule/70 px-6 py-4">
          <p className="text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Danger zone</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleClearConversations}
          >
            <Trash2 size={14} />
            Clear conversations only
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-wrong border-wrong hover:bg-wrong-soft"
            onClick={handleClearAll}
          >
            <Trash2 size={14} />
            Clear all profile data
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Theme section ────────────────────────────────────────────────────────────
function ThemeSection() {
  const { theme, setTheme } = useTheme()
  const options = [
    { id: "light",  label: "Light",  Icon: Sun },
    { id: "dark",   label: "Dark",   Icon: Moon },
    { id: "system", label: "System", Icon: Monitor },
  ] as const
  return (
    <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
      <p className="mb-3 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Theme</p>
      <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
        {options.map(({ id, label, Icon }) => {
          const selected = theme === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border px-3 py-2.5 text-small transition-colors duration-150 ease-standard",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
                selected
                  ? "border-electric/60 bg-electric-soft text-ink"
                  : "border-rule bg-bg text-ink-muted hover:text-ink"
              )}
            >
              <Icon size={14} className={selected ? "text-electric" : "text-ink-faint"} />
              {label}
            </button>
          )
        })}
      </div>
    </section>
  )
}

// ── Voice section ────────────────────────────────────────────────────────────
function VoiceSection() {
  const { prefs, setPrefs, voices, ttsSupported, sttSupported } = useVoiceSettings()
  if (!ttsSupported && !sttSupported) {
    return (
      <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
        <p className="mb-1 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Voice</p>
        <p className="text-small text-ink-muted">
          Your browser does not support the Web Speech API. Try Chrome, Edge, or Safari for read-aloud and voice input.
        </p>
      </section>
    )
  }

  function handlePreview() {
    if (!ttsSupported) return
    stopSpeaking()
    speak("This is how ORION will sound when reading answers.", prefs, voices)
  }

  return (
    <section className="rounded-2xl bg-bg-elevated p-4 shadow-soft">
      <p className="mb-3 text-micro font-semibold uppercase tracking-[0.18em] text-ink-faint">Voice</p>

      {ttsSupported && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="tts-voice" className="text-small">Voice</Label>
            <Select
              value={prefs.voiceURI ?? "default"}
              onValueChange={(v) => setPrefs({ voiceURI: v === "default" ? null : v })}
            >
              <SelectTrigger id="tts-voice" className="mt-1">
                <SelectValue placeholder="Browser default" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="default">Browser default</SelectItem>
                {voices.map((v) => (
                  <SelectItem key={v.voiceURI} value={v.voiceURI}>
                    {v.name} · {v.lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderRow
            label="Speed"
            value={prefs.rate}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={(rate) => setPrefs({ rate })}
            format={(v) => `${v.toFixed(1)}×`}
          />
          <SliderRow
            label="Pitch"
            value={prefs.pitch}
            min={0.0}
            max={2.0}
            step={0.1}
            onChange={(pitch) => setPrefs({ pitch })}
            format={(v) => v.toFixed(1)}
          />
          <SliderRow
            label="Volume"
            value={prefs.volume}
            min={0}
            max={1}
            step={0.1}
            onChange={(volume) => setPrefs({ volume })}
            format={(v) => `${Math.round(v * 100)}%`}
          />

          <Button type="button" variant="outline" size="sm" onClick={handlePreview} className="w-full">
            <Volume2 size={14} />
            Preview voice
          </Button>
        </div>
      )}

      <p className="mt-3 text-micro text-ink-muted">
        {sttSupported
          ? "Voice input and read-aloud use your browser's built-in speech APIs. Nothing is sent to an external service."
          : "Voice input is not supported in this browser. Read-aloud is available."}
      </p>
    </section>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-small text-ink">{label}</span>
        <span className="tabular text-micro text-electric">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={label}
        className="w-full accent-electric"
      />
    </div>
  )
}

