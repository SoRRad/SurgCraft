# Design

> ORION Surgery visual system. Cream-and-ink editorial palette, fluid typography, restrained color strategy. Authored to feel like a well-typeset academic textbook rendered for the web.

## Theme

Two themes. The default is light: a clean blue-tinted off-white that reads professional in a clinical environment. The dark theme uses deep navy and lighter ink for late-night studying. Theme follows the system preference unless the user picks one in Settings.

A surgical resident might use ORION on a hospital workstation at 2pm or on a personal laptop at 11pm. The two themes cover both honestly.

## Color strategy

**Restrained**: tinted blue-grey neutrals dominate; one accent (royal blue) is reserved for primary actions, links, focus rings, and active states; a deep navy carries the brand voice on the wordmark and section indicators. Status colors (correct / warn / wrong) are muted. The palette is aligned with Mayo Clinic's visual language without copying its mark.

### Light tokens

| Token | Hex | Purpose |
|---|---|---|
| `--bg` | `#F6F8FB` | Page background |
| `--bg-elevated` | `#FFFFFF` | Cards, input surfaces |
| `--surface-subtle` | `#EEF2F8` | Inset wells, hover backgrounds |
| `--surface-raised` | `#FFFFFF` | Topmost surfaces |
| `--ink` | `#0C2340` | Deep navy — primary text |
| `--ink-muted` | `#475569` | Secondary text |
| `--ink-faint` | `#7C8AA0` | Tertiary text, micro labels |
| `--rule` | `#DDE5EE` | Borders, dividers |
| `--navy` | `#0C2340` | Brand accent |
| `--electric` | `#1E5BA8` | Primary action, links, focus |
| `--correct` | `#1F7A55` | Success states |
| `--warn` | `#8A5A1B` | In-development, caution |
| `--wrong` | `#A1414B` | Errors, deletions |

### Dark tokens

| Token | Hex | Purpose |
|---|---|---|
| `--bg` | `#0A1B30` | Deep navy page |
| `--bg-elevated` | `#122C4A` | Cards |
| `--surface-subtle` | `#16345A` | Inset wells |
| `--ink` | `#EAF1F9` | Primary text |
| `--electric` | `#6FA3DE` | Primary action / link (lighter for contrast) |

Each color has a `-soft` variant for backgrounds. Never use `#000` or `#fff` straight.

## Typography

System-stack fonts that ship with every modern OS. No webfont fetch, no FOIT.

| Family | Stack | Use |
|---|---|---|
| Display (serif) | `'Iowan Old Style', 'Palatino Linotype', 'Cambria', Georgia, serif` | Page headings, wordmark, case stems |
| Body (sans) | `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif` | Body, UI labels, controls |
| Mono | `ui-monospace, 'SF Mono', Menlo, Consolas, monospace` | Counters, citations, code |

### Fluid scale (clamp-based)

| Token | Mobile → desktop | Use |
|---|---|---|
| `display` | `clamp(2.25rem, 5vw + 1rem, 3.75rem)` | Onboarding hero, marketing only |
| `h1` | `clamp(1.75rem, 3vw + 0.75rem, 2.5rem)` | Page titles |
| `h2` | `clamp(1.375rem, 2vw + 0.5rem, 1.75rem)` | Section titles |
| `h3` | `clamp(1.125rem, 1vw + 0.5rem, 1.25rem)` | Subsection titles |
| `body` | `1rem` | Default text, 1.6 line-height |
| `small` | `0.875rem` | Secondary text |
| `micro` | `0.75rem` | Labels, badges |

All headings cap at `max-width: 36ch`. Body prose caps at `max-width: 70ch`. Headings use display serif at weight 500–600; body uses sans at 400–500.

## Layout

Two surfaces:

1. **App shell (chat)** — fixed sidebar (264px) on `md+`, hamburger drawer below. Header is 56px tall and sticky. Main area scrolls.
2. **Standalone pages (onboarding, about, modules)** — single-column, `max-width: 720px`, centered, generous vertical rhythm.

Containers default to `px-4 md:px-6`. Vertical rhythm uses 4 / 8 / 16 / 24 / 40 / 64. Cards are 16px rounded; pills are full-rounded.

## Components

Reuse shadcn/ui primitives in `components/ui/*` (button, dialog, input, label, select, slider, switch, tabs, sheet). Brand polish lives in `components/shell` and `components/chat`. Cards are used sparingly — most content sits on the page background with rules and rhythm doing the work.

### Buttons

- Primary: electric fill, white-cream text, soft shadow, micro hover lift.
- Outline: 1px rule border, ink text.
- Ghost: no chrome, ink-muted text, surface-subtle on hover.
- All buttons reach 40px minimum height; touch targets 44px on mobile.

### Inputs

Textareas use `bg-bg-elevated` with `border-rule/70`; on focus the ring is `electric/10` and the border tints toward electric.

## Motion

Defaults are 200–300ms, ease-out exponential. Easings:

- `--ease-standard: cubic-bezier(0.22, 0.61, 0.36, 1)`
- `--ease-reveal: cubic-bezier(0.16, 1, 0.3, 1)` (for content reveal)
- `--ease-micro: cubic-bezier(0.4, 0, 0.2, 1)` (for button presses)

No layout property animations (height/width). Use transform/opacity. `prefers-reduced-motion: reduce` collapses every transition to 0.01ms.

## Iconography

Lucide React, weight 1.5, size 14–18 in UI chrome, 20–24 in standalone affordances. Icons are decoration; they never carry meaning alone.

## Anti-patterns to refuse

- Gradient text, side-stripe borders, glassmorphism, hero-metric KPI cards.
- Em dashes in prose (use commas, colons, semicolons, parentheses).
- Identical card grids of 6+ tiles.
- Modals as the first answer to a navigation question.
- Streak rings, leaderboards, badges, gamified counters.
