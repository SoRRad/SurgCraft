"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
})

const STORAGE_KEY = "orion:theme"

function readStored(): Theme {
  if (typeof window === "undefined") return "system"
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (raw === "light" || raw === "dark" || raw === "system") return raw
  } catch {}
  return "system"
}

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function applyClass(resolved: "light" | "dark") {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolved, setResolved] = useState<"light" | "dark">("light")

  // Hydrate from storage + media query once mounted
  useEffect(() => {
    const stored = readStored()
    setThemeState(stored)
    const next = stored === "system" ? (systemPrefersDark() ? "dark" : "light") : stored
    setResolved(next)
    applyClass(next)
  }, [])

  // Watch system preference if theme is "system"
  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light"
      setResolved(next)
      applyClass(next)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    const r = next === "system" ? (systemPrefersDark() ? "dark" : "light") : next
    setResolved(r)
    applyClass(r)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
