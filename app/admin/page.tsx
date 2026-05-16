import { AppShell } from "@/components/shell/AppShell"
import { SectionMarker } from "@/components/shell/SectionMarker"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Admin" }

export default function AdminPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-12">
        <SectionMarker number="06" label="Admin" className="mb-4" />
        <h1 className="font-fraunces text-h1 text-ink mb-6">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/flags">Review flagged responses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/kb">Knowledge base</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
