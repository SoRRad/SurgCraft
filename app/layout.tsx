import type { Metadata, Viewport } from "next"
import { Providers } from "@/components/shell/Providers"
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F8FB" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A1B30" },
  ],
}

// Inline pre-hydration theme script: avoids the dark-mode flash by
// reading the saved preference (or matching system) before React mounts.
const setInitialTheme = `
(function() {
  try {
    var stored = localStorage.getItem('orion:theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = stored === 'dark' || ((stored === null || stored === 'system') && prefersDark);
    if (dark) document.documentElement.classList.add('dark');
  } catch (_) {}
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
