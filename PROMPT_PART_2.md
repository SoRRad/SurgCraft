# Phase 0B — Part 2: Sidebar + Conversation History + Polish

> **Run this only after Part 1 is verified.** Streaming chat must work end-to-end in both mock and live mode before continuing.

> **What this does:** adds the sidebar (conversations + library), conversation persistence to localStorage, auto-generated conversation titles, message feedback (thumbs/flag/save to pearls), and the responsive mobile drawer.

---

## Prompt

```
Part 1 is verified — streaming chat works in mock and live mode. Now do Part 2.

Read the current state of:
- app/c/page.tsx and app/c/[conversationId]/page.tsx
- app/layout.tsx
- components/shell/Header.tsx
- lib/llm/* (current state after Part 1)

Then proceed.

═══════════════════════════════════════════
PART 2 — Sidebar, History, Polish
═══════════════════════════════════════════

## 2.1 Conversation persistence layer

Create `lib/demo/conversations.ts`:

Types:
```ts
type Conversation = {
  id: string;             // nanoid or uuid v4
  title: string;          // user-visible, auto-generated
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
  messages: ChatMessage[];
  topicTags: string[];    // ["mallet finger", "trauma"] — used for sidebar grouping later
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  feedback?: "up" | "down" | null;
  flagged?: boolean;
  savedAsPearl?: boolean;
  citations?: Citation[];
};
```

Functions:
- `listConversations(): Conversation[]` — sorted by updatedAt desc
- `getConversation(id): Conversation | null`
- `createConversation(firstMessage): Conversation`
- `appendMessage(conversationId, message): void`
- `updateMessage(conversationId, messageId, patch): void`
- `deleteConversation(id): void`
- `clearAllConversations(): void`

All use localStorage under key `surgicraft:conversations`. SSR-safe (no localStorage access on server).

Cap at 50 conversations; auto-prune oldest beyond that with a console warning.

## 2.2 Conversation title generation

When the first user message in a conversation is sent, fire a *separate, non-streaming* LLM call to generate a 4-7 word title.

Create `app/api/chat/title/route.ts`:
- POST handler, accepts `{ firstUserMessage }`
- Calls `generateText` (not stream) with a tiny prompt: 
  "Summarize this medical learning question into a 4–7 word title. Respond with only the title. No quotes, no period. Question: {firstUserMessage}"
- Uses Claude Sonnet 4.5 in live mode, simple template-based fallback in mock mode (mock: take first 5 words of the question, capitalize)
- Returns `{ title: string }`

In the chat UI: after the user's first message arrives, fire this call in the background. When it returns, update the conversation's title and the sidebar entry.

## 2.3 Sidebar component

Create `components/chat/Sidebar.tsx` with the following structure:

```
┌─────────────────────────────┐
│  [+ New conversation]       │
│                             │
│  RECENT                     │
│  · Mallet finger management │   ← active conversation highlighted with --electric border-left
│  · Distal radius approach   │
│  · Fight bite presentation  │
│  · Anatomy review · MCP     │
│  See all ▾                  │   ← collapsed after 5 items
│                             │
│  LIBRARY                    │
│  · Cases                    │
│  · Mistake Museum           │
│  · Do-Not-Miss              │
│  · My pearls (saved)        │
│                             │
│  ─────────────              │
│  About · Settings           │
│  Phase 0B · Live AI         │
└─────────────────────────────┘
```

Styling:
- 280px wide on desktop, full-width drawer on mobile
- Background --bg (warm off-white), 1px right border in --rule
- Each item: 8px vertical padding, hover background --terracotta-soft (very subtle)
- Section labels ("RECENT", "LIBRARY") in Fraunces small caps, text-micro, --ink-muted
- Active conversation: 2px --electric border on the left, slight bold
- Conversation items: title truncated to one line with text-ellipsis; below the title, in --ink-muted text-micro, the relative time ("2h ago", "Yesterday")
- "+ New conversation" button: full width, --electric background, white text, Fraunces

Behavior:
- Click conversation → router.push(`/c/${id}`)
- Click "+ New conversation" → router.push(`/c`)
- Click library item → router.push to that page
- Long-press / right-click on conversation → context menu: Rename, Delete, Clear (Part 3 stretch — for now just delete)

## 2.4 Layout shell rework

Create `components/chat/ChatLayout.tsx`:
- Desktop: Sidebar (280px) + Main area (flex-1)
- Mobile: Main area full width; Sidebar opens as a drawer from the left (use shadcn Sheet) when hamburger is clicked
- Header is INSIDE the main area on desktop (above the chat), at the top on mobile

Apply this layout to:
- `/c` (chat home)
- `/c/[conversationId]` (specific conversation)
- `/case`, `/case/[id]` (cases library)
- `/mistakes` (mistakes library)
- `/donotmiss` (do-not-miss library)
- `/pearls` (NEW — see 2.7)

About and Onboarding pages keep their standalone shell.

## 2.5 Conversation flow

The chat experience should now work like this:
1. User on /c (empty state) submits first message
2. Frontend creates conversation locally, calls `createConversation(message)`
3. Frontend calls /api/chat with messages
4. Streams response, appends assistant message when done
5. In parallel: calls /api/chat/title to generate a title, updates the conversation
6. Router replaces /c with /c/{conversationId} (no full page reload — use router.replace)
7. Subsequent messages append to the same conversation

When user navigates to /c/{conversationId}:
- Load conversation from localStorage
- Display all messages
- Continue chatting in the same conversation

When user clicks "+ New conversation":
- Navigate to /c
- Fresh empty state

## 2.6 Message feedback + actions

Update `components/chat/MessageBubble.tsx` (or wherever assistant messages are rendered):

Each assistant message gets a small action row beneath it:
- Thumbs up (sets feedback="up", saves to conversation)
- Thumbs down (sets feedback="down", saves to conversation)
- Flag for faculty review (toggles flagged=true, saves)
- Save to pearls (toggles savedAsPearl=true, saves message content to a separate localStorage key `surgicraft:saved-pearls`)
- Copy

Icons from lucide-react. Each is icon-only with tooltip. Active state shows the icon filled in --electric or --terracotta.

User messages get only "Copy" and "Edit" (edit replaces the message and re-streams from that point — Part 3 if it's too much for Part 2; basic version: edit re-fills the input, doesn't actually replay).

## 2.7 Pearls library page

Create `app/pearls/page.tsx`:
- Lists messages the user has saved as pearls (from `surgicraft:saved-pearls`)
- Each pearl rendered as a `<PearlCard>`-style card
- Includes: pearl content, source conversation link, date saved
- Empty state: hand mascot + "No pearls saved yet. Click the bookmark icon on any answer to save it here."
- Top of page: filter chips by topic (auto-extracted from the saved messages — or skip filtering in Part 2)

This is the *learner's personal* pearls — separate from faculty pearls (which will come back in Phase 0C with the DB).

## 2.8 Library page polish

The Cases, Mistakes, Do-Not-Miss pages already exist. Update them so:
- They render INSIDE the ChatLayout (with sidebar visible)
- They have a "Use in chat" button at the top — clicking it navigates to /c with the input pre-filled (e.g., "Walk me through the fight bite case" for a specific case)
- They keep their existing content but visual styling now matches the chat-first aesthetic

## 2.9 Settings drawer

Create `components/shell/SettingsDrawer.tsx` — a Sheet that opens from the right when "Settings" is clicked in the sidebar.

Contents:
- User handle (editable)
- Role / PGY (editable, dropdown)
- LLM mode: shows current (Demo / Live) and explains how to change it (edit .env.local)
- Reduced motion override toggle
- Theme (light only for now, dark coming soon)
- "Clear all data" button (with confirm dialog) — wipes localStorage
- Disclaimer reminder block at the bottom

## 2.10 Privacy contract acknowledgment

If user hasn't seen the privacy contract (check localStorage flag), show a small banner above the chat on first load:

> "Educational use only. Not for clinical decision-making. Your conversations are stored locally in your browser and never sent to faculty or program directors. [Got it]"

Set the flag when they dismiss. Re-show only if cleared.

## 2.11 Final checks

- `npm run build` must pass
- `npm run lint` must pass  
- Test these flows manually and report:
  1. Onboard → chat empty state → type a message → conversation created → title appears in sidebar → reload page → conversation still there
  2. New conversation → chat → switch back to old conversation → both work
  3. Mobile viewport: hamburger opens sidebar drawer, conversations clickable, drawer closes after click
  4. Save a message to pearls → navigate to /pearls → see it there
  5. Flag a message → check localStorage for the flag

═══════════════════════════════════════════

Report:
1. Files added/changed/deleted
2. Build + lint status
3. Manual test results
4. Anything you punted
5. Suggested polish for Part 3

DO NOT build in this part: tool use, inline case rendering, anatomy SVG, quiz mode logic, dark theme, conversation editing.
```
