"use client"

import { useEffect, useMemo, useState } from "react"

export type ProviderStatus = {
  provider: "mock" | "anthropic"
  requestedProvider: "mock" | "anthropic" | "live" | null
  mode: "demo" | "live"
  reason: string | null
  hasAnthropicKey: boolean
}

function fallbackStatus(): ProviderStatus {
  const live = process.env.NEXT_PUBLIC_APP_MODE === "live"
  return {
    provider: live ? "anthropic" : "mock",
    requestedProvider: live ? "live" : "mock",
    mode: live ? "live" : "demo",
    reason: null,
    hasAnthropicKey: false,
  }
}

export function useProviderStatus() {
  const initial = useMemo(fallbackStatus, [])
  const [status, setStatus] = useState<ProviderStatus>(initial)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch("/api/provider-status", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ProviderStatus | null) => {
        if (!cancelled && data) setStatus(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { status, loading }
}

export function getProviderStatusLabel(status: ProviderStatus): string {
  if (status.reason && status.provider === "mock") return "Fallback: mock"
  if (status.provider === "anthropic") return "Anthropic live"
  return "Mock demo"
}

export function getProviderStatusDetail(status: ProviderStatus): string {
  if (status.reason) return status.reason
  if (status.provider === "anthropic") return "Using Anthropic through the server route."
  return "No external AI API is being used."
}
