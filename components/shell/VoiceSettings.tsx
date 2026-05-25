"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

/**
 * Voice settings + helpers. Uses the browser's built-in SpeechSynthesis
 * (TTS) and SpeechRecognition (STT) APIs. No external API calls.
 *
 * Graceful: if the browser doesn't support the API, hooks return
 * supported=false and noop functions. UI should hide the affordance.
 */

export interface VoicePrefs {
  voiceURI: string | null   // null = browser default
  rate: number              // 0.5 - 2.0
  pitch: number             // 0.0 - 2.0
  volume: number            // 0.0 - 1.0
  autoSpeak: boolean        // automatically read each new assistant message
}

const DEFAULT_PREFS: VoicePrefs = {
  voiceURI: null,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoSpeak: false,
}

const STORAGE_KEY = "orion:voice-prefs"

function readPrefs(): VoicePrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_PREFS
  }
}

interface VoiceContextValue {
  prefs: VoicePrefs
  setPrefs: (next: Partial<VoicePrefs>) => void
  voices: SpeechSynthesisVoice[]
  ttsSupported: boolean
  sttSupported: boolean
}

const VoiceContext = createContext<VoiceContextValue>({
  prefs: DEFAULT_PREFS,
  setPrefs: () => {},
  voices: [],
  ttsSupported: false,
  sttSupported: false,
})

export function VoiceSettingsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<VoicePrefs>(DEFAULT_PREFS)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setPrefsState(readPrefs())
    setMounted(true)
  }, [])

  const ttsSupported = mounted && typeof window !== "undefined" && "speechSynthesis" in window
  const sttSupported = useMemo(() => {
    if (!mounted || typeof window === "undefined") return false
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition)
  }, [mounted])

  useEffect(() => {
    if (!ttsSupported) return
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
  }, [ttsSupported])

  const setPrefs = useCallback((next: Partial<VoicePrefs>) => {
    setPrefsState((prev) => {
      const merged = { ...prev, ...next }
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)) } catch {}
      return merged
    })
  }, [])

  return (
    <VoiceContext.Provider value={{ prefs, setPrefs, voices, ttsSupported, sttSupported }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoiceSettings() {
  return useContext(VoiceContext)
}

/**
 * Speak helper. Cancels anything already speaking, then queues the
 * given text with current prefs. Returns the utterance so callers can
 * track end events.
 */
export function speak(text: string, prefs: VoicePrefs, voices: SpeechSynthesisVoice[]): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(stripMarkdown(text))
  utter.rate = clamp(prefs.rate, 0.5, 2.0)
  utter.pitch = clamp(prefs.pitch, 0.0, 2.0)
  utter.volume = clamp(prefs.volume, 0.0, 1.0)
  const picked = voices.find((v) => v.voiceURI === prefs.voiceURI)
  if (picked) utter.voice = picked
  window.speechSynthesis.speak(utter)
  return utter
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel()
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** Strip markdown so TTS doesn't read asterisks and brackets literally. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")         // links
    .replace(/[*_~`]/g, "")                     // emphasis
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")         // headings
    .replace(/^\s*>\s?/gm, "")                  // blockquote
    .replace(/^\s*[-*+]\s+/gm, "")              // bullets
    .replace(/^\s*\d+\.\s+/gm, "")              // numbered lists
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
