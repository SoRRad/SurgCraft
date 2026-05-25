"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isDemoUserSaved, migrateFromWeek1Key } from "@/lib/demo/demo-user"

// Landing: redirect returning learners to the chat home, else to onboarding.
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    migrateFromWeek1Key()
    if (isDemoUserSaved()) {
      router.replace("/c")
    } else {
      router.replace("/onboarding")
    }
  }, [router])

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <p className="font-inter text-small text-ink-muted animate-pulse">
        Loading...
      </p>
    </div>
  )
}

