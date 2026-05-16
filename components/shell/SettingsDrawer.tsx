"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { clearAllData } from "@/lib/demo/conversations"
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

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [saved, setSaved] = useState(false)

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
  }, [open])

  function handleSave() {
    if (!user) return
    const updated = { ...user, handle: handle.trim() || user.handle, role }
    localStorage.setItem("surgicraft_demo_user", JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function handleClearAll() {
    if (!window.confirm("Clear all local data? This will delete all conversations, saved pearls, and your profile. You'll be taken to onboarding.")) return
    clearAllData()
    onOpenChange(false)
    router.push("/onboarding")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 flex flex-col bg-bg border-l border-rule">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-rule">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Profile */}
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
                    <SelectValue placeholder="Select role…" />
                  </SelectTrigger>
                  <SelectContent>
                    {["M3", "M4", "Intern", "PGY-2", "PGY-3", "PGY-4", "PGY-5", "Fellow", "Attending"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} size="sm" className="w-full">
                {saved ? "Saved ✓" : "Save changes"}
              </Button>
            </div>
          </section>

          {/* LLM mode */}
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

          {/* Display */}
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

          {/* Disclaimer */}
          <section>
            <div className="p-4 border border-terracotta-soft bg-terracotta-soft rounded-lg">
              <p className="text-micro font-semibold text-terracotta uppercase tracking-wide mb-1">
                Educational use only
              </p>
              <p className="text-small text-ink leading-relaxed">
                Not for clinical decision-making. All conversations are stored locally in your browser.
                Faculty and program directors cannot see your responses.
              </p>
            </div>
          </section>

        </div>

        {/* Danger zone */}
        <div className="px-6 py-4 border-t border-rule">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-wrong border-wrong hover:bg-wrong-soft"
            onClick={handleClearAll}
          >
            Clear all data
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
