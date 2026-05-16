import { AppShell } from "@/components/shell/AppShell"

export const metadata = { title: "Consult Mode" }

export default function ConsultPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-fraunces text-h1 text-ink mb-2">Consult Mode</h1>
        <p className="text-body text-ink-muted">Deferred to Phase 1.</p>
      </div>
    </AppShell>
  )
}
