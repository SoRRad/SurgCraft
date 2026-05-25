import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import { Button } from "@/components/ui/button"
import { DO_NOT_MISS, MISTAKE_MUSEUM, PEARLS, TOPIC_INDEX } from "@/lib/demo/demo-content"

export const dynamic = "force-dynamic"

async function loadReviewMarkdown() {
  try {
    const filePath = path.join(process.cwd(), "CONTENT_REVIEW.md")
    return await fs.readFile(filePath, "utf-8")
  } catch {
    return ""
  }
}

export default async function ContentReviewPage() {
  const reviewMarkdown = await loadReviewMarkdown()
  const totalUnverified = 3 + TOPIC_INDEX.length + PEARLS.length + MISTAKE_MUSEUM.length + DO_NOT_MISS.length

  const counts = [
    { label: "Cases", value: 3 },
    { label: "Topics", value: TOPIC_INDEX.length },
    { label: "Pearls", value: PEARLS.length },
    { label: "Mistakes", value: MISTAKE_MUSEUM.length },
    { label: "Do-Not-Miss", value: DO_NOT_MISS.length },
    { label: "Unverified", value: totalUnverified },
  ]

  return (
    <AppShell>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionMarker number="07" label="Content Review" className="mb-3" />
        <h1 className="text-h1 font-fraunces text-ink">Content Review</h1>
        <p className="mt-2 max-w-3xl text-small text-ink-muted">
          Local read-only review studio for Phase 0B.2. Nothing is sent to faculty yet.
          Faculty verification workflow is planned for Phase 0C. No PHI.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {counts.map((item) => (
            <div key={item.label} className="rounded-2xl bg-bg-elevated p-4 ring-1 ring-rule/70 shadow-soft">
              <p className="text-micro uppercase tracking-wide text-ink-faint">{item.label}</p>
              <p className="mt-1 text-h3 font-semibold text-ink">{item.value}</p>
              <p className="text-micro text-ink-muted">needs faculty review</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="outline"><Link href="/case">View cases</Link></Button>
          <Button asChild variant="outline"><Link href="/topics">View topics</Link></Button>
        </div>

        <section className="mt-6 rounded-2xl bg-bg-elevated p-4 ring-1 ring-rule/70 shadow-soft">
          <p className="text-small font-semibold text-ink">CONTENT_REVIEW.md (read-only)</p>
          <pre className="mt-3 max-h-[55vh] overflow-auto whitespace-pre-wrap break-words text-small text-ink-muted">
            {reviewMarkdown || "CONTENT_REVIEW.md not found."}
          </pre>
        </section>
      </div>
    </AppShell>
  )
}
