import { AppShell } from "@/components/shell/AppShell"

export const metadata = { title: "Case Canvas" }

export default function CaseCanvasPage({ params }: { params: { id: string } }) {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-body text-ink-muted">
          Case canvas for <code className="font-mono text-small">{params.id}</code> — Week 3.
        </p>
      </div>
    </AppShell>
  )
}
