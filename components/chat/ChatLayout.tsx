"use client"

import { createContext, useContext, useState } from "react"
import { Header } from "@/components/shell/Header"
import { SidebarInner } from "@/components/chat/Sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

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

interface ChatLayoutProps {
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="flex h-dvh overflow-hidden bg-bg">
        <aside
          className={cn(
            "hidden w-[296px] flex-shrink-0 flex-col md:flex",
            "border-r border-rule/70 bg-bg/80"
          )}
          aria-label="Navigation sidebar"
        >
          <SidebarInner />
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
        </div>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[300px] border-r border-rule/70 bg-bg p-0 shadow-floating"
          aria-label="Navigation drawer"
        >
          <SidebarInner onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </SidebarContext.Provider>
  )
}
