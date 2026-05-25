"use client"

import { ThemeProvider } from "./ThemeProvider"
import { VoiceSettingsProvider } from "./VoiceSettings"

/**
 * Single client-side provider tree mounted at the root layout.
 * Keep additions here narrow — anything provider-shaped that needs
 * to wrap the whole app.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <VoiceSettingsProvider>
        {children}
      </VoiceSettingsProvider>
    </ThemeProvider>
  )
}
