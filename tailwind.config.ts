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
      padding: "2rem",
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
        fraunces: ["var(--font-fraunces)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        "instrument-serif": ["var(--font-instrument-serif)", "serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        display: ["64px", { lineHeight: "1.05" }],
        h1: ["40px", { lineHeight: "1.15" }],
        h2: ["28px", { lineHeight: "1.25" }],
        h3: ["20px", { lineHeight: "1.35" }],
        stem: ["24px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
        micro: ["12px", { lineHeight: "1.4" }],
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
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "fade-in": "fade-in 280ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "scale-in": "scale-in 420ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
