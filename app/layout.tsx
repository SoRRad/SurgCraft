import type { Metadata } from "next"
import {
  Fraunces,
  Inter,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "SurgiCraft: Handcraft",
    template: "%s · SurgiCraft: Handcraft",
  },
  description:
    "Interactive surgical education platform. First module: hand surgery for medical students, residents, and fellows. Educational use only.",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={[
        fraunces.variable,
        inter.variable,
        instrumentSerif.variable,
        jetbrainsMono.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  )
}
