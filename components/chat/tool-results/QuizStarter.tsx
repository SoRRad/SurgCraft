"use client"

import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizStarterProps {
  topic: string
  intensity: "gentle" | "standard" | "pyrotechnic"
  onBegin: (topic: string, intensity: string) => void
}

const INTENSITY_LABELS = {
  gentle: "Gentle - hints included",
  standard: "Standard - balanced",
  pyrotechnic: "Pyrotechnic - attending-voice pimp",
}

export function QuizStarter({ topic, intensity, onBegin }: QuizStarterProps) {
  return (
    <div className="my-2 rounded-2xl border border-electric-soft bg-electric-soft/25 p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={14} className="text-electric flex-shrink-0" />
        <p className="text-micro font-semibold uppercase tracking-[0.16em] text-electric">
          Quiz mode
        </p>
      </div>
      <p className="font-fraunces text-h3 text-ink mb-1">{topic}</p>
      <p className="text-small text-ink-muted mb-4">{INTENSITY_LABELS[intensity]} | 5 questions</p>
      <button
        type="button"
        onClick={() => onBegin(topic, intensity)}
        className={cn(
          "px-4 py-2 rounded-lg text-small font-medium",
          "bg-electric text-bg hover:opacity-90 transition-opacity duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
        )}
      >
        Begin quiz
      </button>
    </div>
  )
}

