"use client"

import { Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizStarterProps {
  topic: string
  intensity: "gentle" | "standard" | "pyrotechnic"
  onBegin: (topic: string, intensity: string) => void
}

const INTENSITY_LABELS = {
  gentle: "Gentle — hints included",
  standard: "Standard — balanced",
  pyrotechnic: "Pyrotechnic — attending-voice pimp",
}

export function QuizStarter({ topic, intensity, onBegin }: QuizStarterProps) {
  return (
    <div className="border border-electric-soft bg-electric-soft/20 rounded-lg p-4 my-2">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={14} className="text-electric flex-shrink-0" />
        <p className="text-micro text-electric font-semibold uppercase tracking-wider">
          Quiz mode
        </p>
      </div>
      <p className="font-fraunces text-h3 text-ink mb-1">{topic}</p>
      <p className="text-small text-ink-muted mb-4">{INTENSITY_LABELS[intensity]} · 5 questions</p>
      <button
        type="button"
        onClick={() => onBegin(topic, intensity)}
        className={cn(
          "px-4 py-2 rounded-lg text-small font-medium",
          "bg-electric text-bg hover:opacity-90 transition-opacity duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
        )}
      >
        Begin quiz →
      </button>
    </div>
  )
}
