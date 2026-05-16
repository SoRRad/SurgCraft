import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"

export const metadata = { title: "Settings" }

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <SectionMarker number="06" label="Settings" className="mb-4" />
        <h1 className="font-fraunces text-h1 text-ink mb-2">Settings</h1>
        <p className="text-body text-ink-muted">Profile editing and privacy settings — coming soon.</p>
      </div>
    </AppShell>
  )
}
