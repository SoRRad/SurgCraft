import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "ORION Surgery · Hand",
    template: "%s · ORION Surgery",
  },
  description:
    "ORION Surgery — Operative Reasoning and Interactive Online Navigator. Educational hand-surgery tutoring for medical students, residents, and fellows. Educational use only.",
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FBF8F3",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  )
}
