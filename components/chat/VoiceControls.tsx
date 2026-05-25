"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, MicOff, Square, Volume2 } from "lucide-react"
import { speak, stopSpeaking, useVoiceSettings } from "@/components/shell/VoiceSettings"
import { cn } from "@/lib/utils"

/**
 * Small "Read aloud" toggle that lives inside the assistant-message
 * action row. Tracks a per-message speaking state so the icon switches
 * to a stop icon while this message is being read.
 */
export function ReadAloudButton({ text }: { text: string }) {
  const { prefs, voices, ttsSupported } = useVoiceSettings()
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!ttsSupported) return
    const handler = () => setSpeaking(false)
    window.addEventListener("orion:tts:stop", handler)
    return () => window.removeEventListener("orion:tts:stop", handler)
  }, [ttsSupported])

  if (!ttsSupported) return null

  function handleClick() {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      window.dispatchEvent(new Event("orion:tts:stop"))
      return
    }
    // Stop anything else first
    window.dispatchEvent(new Event("orion:tts:stop"))
    const utter = speak(text, prefs, voices)
    if (!utter) return
    setSpeaking(true)
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={speaking ? "Stop reading" : "Read aloud"}
      aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
      aria-pressed={speaking}
      className={cn(
        "rounded-md p-1.5 transition-colors duration-150 ease-standard",
        "hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
        speaking ? "text-electric" : "text-ink-muted hover:text-ink"
      )}
    >
      {speaking ? <Square size={13} fill="currentColor" /> : <Volume2 size={13} />}
    </button>
  )
}

/**
 * Microphone button for the chat input. Push-to-talk: click to start
 * listening, transcript is appended via onTranscript. Click again to
 * stop. Stops automatically after recognized speech ends.
 *
 * Uses webkitSpeechRecognition (Chrome/Edge/Safari). Hidden gracefully
 * in browsers without support (e.g. Firefox).
 */
export function MicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const { sttSupported } = useVoiceSettings()
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop() } catch {}
    }
  }, [])

  if (!sttSupported) return null

  function start() {
    if (typeof window === "undefined") return
    const w = window as any
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Recognition) return

    const rec = new Recognition()
    rec.lang = "en-US"
    rec.interimResults = false
    rec.continuous = false
    rec.maxAlternatives = 1
    rec.onstart = () => setListening(true)
    rec.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0]?.transcript ?? "")
        .join(" ")
        .trim()
      if (transcript) onTranscript(transcript)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    try {
      rec.start()
      recognitionRef.current = rec
    } catch {
      setListening(false)
    }
  }

  function stop() {
    try { recognitionRef.current?.stop() } catch {}
    setListening(false)
  }

  return (
    <button
      type="button"
      onClick={() => (listening ? stop() : start())}
      title={listening ? "Stop listening" : "Voice input"}
      aria-label={listening ? "Stop listening" : "Voice input"}
      aria-pressed={listening}
      className={cn(
        "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ease-standard",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric",
        listening
          ? "bg-electric-soft text-electric"
          : "text-ink-muted hover:bg-surface-subtle hover:text-ink"
      )}
    >
      {listening ? <MicOff size={16} /> : <Mic size={16} />}
    </button>
  )
}
