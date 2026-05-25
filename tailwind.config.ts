import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-elevated": "var(--bg-elevated)",
        "surface-subtle": "var(--surface-subtle)",
        "surface-raised": "var(--surface-raised)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        rule: "var(--rule)",
        terracotta: "var(--terracotta)",
        "terracotta-soft": "var(--terracotta-soft)",
        electric: "var(--electric)",
        "electric-soft": "var(--electric-soft)",
        correct: "var(--correct)",
        "correct-soft": "var(--correct-soft)",
        warn: "var(--warn)",
        "warn-soft": "var(--warn-soft)",
        wrong: "var(--wrong)",
        "wrong-soft": "var(--wrong-soft)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        fraunces: ["var(--font-fraunces)"],
        inter: ["var(--font-inter)"],
        "instrument-serif": ["var(--font-instrument-serif)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      /*
       * Fluid typography: every heading clamps so it never overflows
       * on a 360px phone and never inflates past the readable max on
       * a 1440px monitor. Body text stays fixed at 1rem.
       */
      fontSize: {
        display: ["clamp(2.25rem, 5vw + 1rem, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1:      ["clamp(1.75rem, 3vw + 0.75rem, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h2:      ["clamp(1.375rem, 2vw + 0.5rem, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        h3:      ["clamp(1.125rem, 1vw + 0.5rem, 1.25rem)", { lineHeight: "1.35" }],
        stem:    ["clamp(1.0625rem, 0.75vw + 0.75rem, 1.25rem)", { lineHeight: "1.5" }],
        body:    ["1rem", { lineHeight: "1.6" }],
        small:   ["0.875rem", { lineHeight: "1.5" }],
        micro:   ["0.75rem", { lineHeight: "1.4" }],
      },
      borderRadius: {
        "2xl": "1rem",
        xl: "0.875rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        medium: "var(--shadow-medium)",
        floating: "var(--shadow-floating)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        reveal: "var(--ease-reveal)",
        micro: "var(--ease-micro)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "fade-in": "fade-in 220ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "scale-in": "scale-in 320ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
