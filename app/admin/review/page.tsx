import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { AlertTriangle, FileText } from "lucide-react"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM, PEARLS } from "@/lib/demo/demo-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Faculty review",
  description:
    "Faculty review portal — central registry of every authored clinical claim in ORION with reviewer, date, and status.",
}

export const dynamic = "force-dynamic"

async function loadContentReview(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "CONTENT_REVIEW.md")
    return await fs.readFile(filePath, "utf-8")
  } catch {
    return null
  }
}

export default async function AdminReviewPage() {
  const reviewMarkdown = await loadContentReview()

  // High-level stats sourced from in-memory content registries
  const stats = {
    mistakes: { total: MISTAKE_MUSEUM.length, verified: 0 },
    doNotMiss: { total: DO_NOT_MISS.length, verified: 0 },
    pearls: { total: PEARLS.length, verified: PEARLS.filter((p) => p.verified).length },
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <SectionMarker number="—" label="Faculty review portal" className="mb-3" />
          <h1 className="font-fraunces text-h1 text-ink">Content review status</h1>
          <p className="mt-3 max-w-2xl text-body text-ink-muted">
            Every clinical claim authored for ORION is tracked here. No piece of content reaches a pilot resident until its row in <code className="rounded bg-bg px-1 py-0.5 font-mono text-small">CONTENT_REVIEW.md</code> reads <strong className="text-ink">approved</strong> or <strong className="text-ink">approved-with-edits</strong>.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Mistake Museum" total={stats.mistakes.total} verified={stats.mistakes.verified} accent="warn" />
          <StatCard label="Do-Not-Miss" total={stats.doNotMiss.total} verified={stats.doNotMiss.verified} accent="wrong" />
          <StatCard label="Pearls" total={stats.pearls.total} verified={stats.pearls.verified} accent="terracotta" />
        </div>

        <div className="mb-6 rounded-2xl border border-warn-soft bg-warn-soft/35 p-4 shadow-soft">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-warn" />
            <div className="space-y-1 text-small leading-relaxed text-ink-muted">
              <p>
                Phase 0B.2: <strong className="text-ink">no clinical content has been faculty-verified yet</strong>. Everything is synthetic, authored for the prototype, and pending review.
              </p>
              <p>
                Phase 0C will move this portal from a read-only Markdown view to an editor with per-row sign-off and audit trail.
              </p>
            </div>
          </div>
        </div>

        {reviewMarkdown ? (
          <section className="overflow-hidden rounded-2xl border border-rule/70 bg-bg-elevated shadow-soft">
            <div className="flex items-center gap-2 border-b border-rule/70 bg-surface-subtle/60 px-5 py-3">
              <FileText size={14} className="text-ink-faint" />
              <p className="text-small font-semibold text-ink">CONTENT_REVIEW.md</p>
              <span className="ml-auto text-micro text-ink-muted">
                Read-only · Phase 0B.2
              </span>
            </div>
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words bg-bg p-5 font-mono text-small leading-relaxed text-ink">
              {reviewMarkdown}
            </pre>
          </section>
        ) : (
          <section className="rounded-2xl border border-rule/70 bg-bg-elevated p-6 shadow-soft">
            <p className="text-small text-ink-muted">
              <code className="rounded bg-bg px-1 py-0.5 font-mono">CONTENT_REVIEW.md</code> is missing at the repo root. Add it and refresh — the portal renders it directly.
            </p>
          </section>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href="/mistakes">View Mistake Museum</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/donotmiss">View Do-Not-Miss</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/case">View seed cases</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/about">About + content policy</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}

function StatCard({
  label,
  total,
  verified,
  accent,
}: {
  label: string
  total: number
  verified: number
  accent: "warn" | "wrong" | "terracotta"
}) {
  const accentMap = {
    warn: "border-warn-soft text-warn",
    wrong: "border-wrong-soft text-wrong",
    terracotta: "border-terracotta-soft text-terracotta",
  } as const

  return (
    <div className={`rounded-2xl border bg-bg-elevated p-5 shadow-soft ${accentMap[accent]}`}>
      <p className="font-fraunces text-micro font-semibold uppercase tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-2 font-fraunces text-h1 leading-none text-ink">{total}</p>
      <p className="mt-1 text-small text-ink-muted">
        {verified}/{total} faculty-verified
      </p>
    </div>
  )
}
