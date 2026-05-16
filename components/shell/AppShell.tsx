import type { ReactNode } from "react"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: ReactNode
  className?: string
  /** Hide the header (e.g. on onboarding) */
  hideHeader?: boolean
  /** Hide the footer */
  hideFooter?: boolean
}

export function AppShell({
  children,
  className,
  hideHeader = false,
  hideFooter = false,
}: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {!hideHeader && <Header />}
      <main
        className={cn(
          "flex-1",
          className
        )}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
