import { AppShell } from "@/components/shell/AppShell"

export const metadata = { title: "Flagged Responses" }

export default function AdminFlagsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-fraunces text-h1 text-ink mb-2">Flagged Responses</h1>
        <p className="text-body text-ink-muted">Review queue — Week 6.</p>
      </div>
    </AppShell>
  )
}
