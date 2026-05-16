"use client"

import { useState, createContext, useContext } from "react"
import { Header } from "@/components/shell/Header"
import { SidebarInner } from "@/components/chat/Sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// ── Sidebar open context (shared with Header hamburger) ───────────────────────

interface SidebarContextValue {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

// ── ChatLayout ────────────────────────────────────────────────────────────────

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-dvh bg-bg overflow-hidden">

        {/* Desktop sidebar — hidden on mobile */}
        <aside
          className={cn(
            "hidden md:flex flex-col w-[280px] flex-shrink-0",
            "border-r border-rule"
          )}
          aria-label="Navigation sidebar"
        >
          <SidebarInner />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-hidden flex flex-col">
            {children}
          </main>
        </div>

      </div>

      {/* Mobile sidebar drawer */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[280px] border-r border-rule bg-bg"
          aria-label="Navigation drawer"
        >
          <SidebarInner onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </SidebarContext.Provider>
  )
}
