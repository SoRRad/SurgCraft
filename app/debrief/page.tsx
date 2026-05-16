import { AppShell } from "@/components/shell/AppShell"

export const metadata = { title: "OR Debrief" }

export default function DebriefPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-fraunces text-h1 text-ink mb-2">OR Debrief</h1>
        <p className="text-body text-ink-muted">Deferred to Phase 1.</p>
      </div>
    </AppShell>
  )
}
