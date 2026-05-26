import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ORION Surgery · Hand",
    template: "%s · ORION Surgery",
  },
  description:
    "ORION Surgery — Operative Reasoning and Interactive Online Navigator. Interactive surgical education for medical students, residents, and fellows. Active module: Hand. Educational use only.",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
