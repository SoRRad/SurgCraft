"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Landing: redirect to dashboard if onboarding done, else to onboarding.
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("handcraft_user")
    if (user) {
      router.replace("/dashboard")
    } else {
      router.replace("/onboarding")
    }
  }, [router])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <p className="font-inter text-small text-ink-muted animate-pulse">
        Loading…
      </p>
    </div>
  )
}
