"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Flag, Shield, Trash2, Upload } from "lucide-react"
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
import { cn } from "@/lib/utils"

const isLive = process.env.NEXT_PUBLIC_APP_MODE === "live"

interface UserData {
  handle: string
  role: string
  specialty: string
  onHandService: boolean
  primaryGoal: string
  [key: string]: unknown
}

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
  const importInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [saved, setSaved] = useState(false)
  const [flags, setFlags] = useState<LocalFlaggedMessage[]>([])
  const [dataNotice, setDataNotice] = useState("")

  useEffect(() => {
    if (!open) return

    const raw = localStorage.getItem("surgicraft_demo_user") ?? localStorage.getItem("handcraft_user")
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as UserData
        setUser(parsed)
        setHandle(parsed.handle ?? "")
        setRole(parsed.role ?? "")
      } catch {}
    }

    setFlags(listFlaggedMessages())
    const refreshFlags = () => setFlags(listFlaggedMessages())
    window.addEventListener("surgicraft:conversations:updated", refreshFlags)
    return () => window.removeEventListener("surgicraft:conversations:updated", refreshFlags)
  }, [open])

  function handleSave() {
    if (!user) return
    const updated = { ...user, handle: handle.trim() || user.handle, role }
    localStorage.setItem("surgicraft_demo_user", JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function handleExport() {
    const payload = exportLocalData()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `surgicraft-local-export-${new Date().toISOString().slice(0, 10)}.json`
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
      setDataNotice("Import failed. Choose a SurgiCraft local JSON export.")
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
      <SheetContent side="right" className="w-full sm:max-w-[430px] p-0 flex flex-col bg-bg border-l border-rule">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-rule">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <section>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-3">Profile</p>
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
                <Select value={role} onValueChange={setRole}>
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

          <section>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-3">AI mode</p>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-micro",
                  isLive ? "bg-correct-soft text-correct" : "text-ink-muted"
                )}
              >
                {isLive ? "Live AI" : "Demo mode"}
              </Badge>
            </div>
            <p className="text-small text-ink-muted leading-relaxed">
              {isLive
                ? "Connected to Claude via Anthropic. Set ANTHROPIC_API_KEY in .env.local."
                : "Using local mock provider. To enable real Claude, set ANTHROPIC_API_KEY and NEXT_PUBLIC_APP_MODE=live in .env.local and restart the dev server."}
            </p>
          </section>

          <section>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-3">Privacy</p>
            <div className="p-4 border border-terracotta-soft bg-terracotta-soft rounded-lg">
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

          <section>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-micro text-ink-muted uppercase tracking-wider font-inter">Local data</p>
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

          <section>
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-micro text-ink-muted uppercase tracking-wider font-inter">Review flags</p>
              <Badge variant="secondary" className="text-micro text-ink-muted">Local only</Badge>
            </div>
            <p className="text-small text-ink-muted leading-relaxed mb-3">
              Flagged messages are visible only on this device until Phase 0C adds governed review workflows.
            </p>
            {flags.length === 0 ? (
              <div className="border border-rule rounded-lg bg-bg-elevated px-4 py-3">
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
                      "w-full text-left border border-rule rounded-lg bg-bg-elevated px-3 py-2",
                      "hover:border-electric transition-colors duration-150",
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

          <section>
            <p className="text-micro text-ink-muted uppercase tracking-wider font-inter mb-3">Display</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-small text-ink">Theme</span>
                <span className="text-small text-ink-muted">Light (dark coming soon)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-small text-ink">Reduced motion</span>
                <span className="text-small text-ink-muted">System preference</span>
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-rule space-y-2">
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
