# Phase 0B — Part 3: Tool Use + Inline Cases + Rich Content

> **Run this only after Part 2 is verified.** Sidebar, conversation history, and message feedback must all work.

> **What this does:** the "wow" part. Gives the bot tools it can call to launch cases, surface pearls, show mistakes, and quiz the user — all inline in the conversation. This is what makes the chat feel intelligent rather than just a Q&A.

> **Time estimate:** this is the most complex part. Budget at least a full session in Claude Code. Expect to iterate on tool design.

---

## Prompt

```
Part 2 is verified. Now do Part 3: tool use and rich inline content. This is what turns the chat from "Q&A with citations" into "the bot drives the experience."

Read the current state of:
- app/api/chat/route.ts
- lib/llm/anthropic-provider.ts and mock-provider.ts
- prompts/tutor-chat.md
- content/cases/*.json (the 3 seed cases)
- lib/demo/demo-content.ts (mistakes, do-not-miss)

Then proceed.

═══════════════════════════════════════════
PART 3 — Tool Use + Inline Rich Content
═══════════════════════════════════════════

## 3.1 Define the tools the bot can call

Create `lib/llm/tools.ts`. Define 6 tools as Vercel AI SDK tool definitions (using zod schemas):

1. **launch_case** — `{ case_id: string, reason: string }` — bot decides to walk the user through a specific case
2. **show_pearl** — `{ topic: string, pearl_text: string, attribution: string }` — bot inserts a curated pearl card inline (use static pearls from existing content for now; in 0C this will look up from DB)
3. **show_mistake** — `{ mistake_id: string }` — bot surfaces a common mistake card from the Mistake Museum content
4. **show_donotmiss** — `{ donotmiss_id: string }` — bot surfaces a do-not-miss red flag from existing content
5. **start_quiz** — `{ topic: string, intensity: "gentle" | "standard" | "pyrotechnic" }` — bot enters quiz mode for a topic
6. **suggest_followups** — `{ chips: string[] }` — bot offers 2–4 quick-reply chips the user can tap (e.g., "Tell me more", "Quiz me on this", "Show common mistake")

Each tool has a clear description for the LLM explaining when to use it. The descriptions matter — they're what Claude reads to decide whether to call the tool.

Example tool descriptions (you'll write these in detail):
- launch_case: "Use when the user asks to walk through, work through, or be guided through a specific clinical scenario. Match the user's intent to a case_id from the available list. Available cases: 001-fight-bite, 002-mallet-finger, 003-distal-radius. Always include a brief one-sentence reason."
- show_pearl: "Use when there's a high-yield clinical pearl that perfectly captures the teaching point. Pearls should be sharp, memorable, and attributable. Use sparingly — at most one per response."
- suggest_followups: "Always end a response with this tool, suggesting 2-4 follow-up paths the user might want to take next. Examples: 'Quiz me on this', 'Show the common mistake', 'Walk me through a case', 'What changes management?'."

## 3.2 Wire tools into the API route

Update `app/api/chat/route.ts`:

```ts
import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { allTools } from "@/lib/llm/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: tutorSystemPrompt,
    messages,
    tools: allTools,
    toolChoice: "auto",
    maxSteps: 5,  // allow multi-step tool reasoning
  });

  return result.toDataStreamResponse();
}
```

For mock mode: the mock provider needs to *simulate* tool calls based on keyword detection. E.g., if user message contains "walk me through" + a known case keyword, mock returns a streamed message that includes a synthetic tool-call event for `launch_case`. Use the AI SDK's data stream protocol to emit tool calls from the mock — write a small helper `lib/llm/mock-stream.ts` that yields the right SSE events.

## 3.3 Render tool calls in the chat UI

This is the heart of Part 3.

The `useChat` hook returns messages with a `parts` array where each part has a `type`. Common types:
- `text` — plain text content
- `tool-{toolName}` — a tool invocation with input and output

Update the message rendering so:
- Text parts render as normal markdown (use `react-markdown` — add to deps)
- Tool parts render as RICH COMPONENTS depending on the tool

Create these rich tool-result components:

### `components/chat/tool-results/CaseLauncher.tsx`
Renders a card inline in the chat:
- Case title (Instrument Serif)
- Stem preview (2-line truncation)
- Difficulty badge + estimated minutes
- Prominent button: "Start case →"
- On click: opens the inline case experience (see 3.4)

### `components/chat/tool-results/PearlCard.tsx`
Reuses your existing PearlCard component. Renders inline as a callout. Quote in --terracotta with attribution below.

### `components/chat/tool-results/MistakeCard.tsx`
Compact version of the Mistake Museum card. Shows: mistake, why it matters, the correction one-liner. Has a "See more in Mistake Museum →" link.

### `components/chat/tool-results/DoNotMissCard.tsx`
Compact red-flag card with the safety callout repeated: "In a real clinical scenario, escalate to senior and hand surgery."

### `components/chat/tool-results/QuizStarter.tsx`
A card that says "Quiz mode: {topic} ({intensity})" with a "Begin" button. On click, sets a `quizMode` state in the conversation and the next bot response will be a quiz question.

### `components/chat/tool-results/FollowupChips.tsx`
Renders the suggested follow-ups as clickable chips below the bot message. Clicking a chip submits it as the user's next message.

## 3.4 Inline case experience

When `launch_case` is invoked, render the case canvas inline at that point in the conversation. Use `components/case/CaseCanvas.tsx` (which already exists from Phase 0A).

Behavior:
- Desktop (≥ 768px): case canvas renders inline as a tall card spanning the chat width. User scrolls through the case in place. When finished, a "Return to chat" button collapses it to a compact summary card.
- Mobile (< 768px): clicking "Start case →" opens the case canvas as a fullscreen overlay. Top bar has "← Back to chat" button. When user finishes the case, overlay closes and a compact summary card appears in the chat.

The case canvas needs a small refactor to support this:
- Add an `embedded` prop. When true: no Header/Footer, slightly tighter spacing, and an `onComplete` callback that fires when the user reaches the management card.
- After completion, the chat receives a synthetic message: "User completed case: {title}". The bot can then react ("Great — what was the most surprising teaching point for you?").

## 3.5 Quiz mode

When `start_quiz` is invoked, the conversation enters quiz mode:
- Set `conversation.quizState = { topic, intensity, questionsAsked: 0, score: 0 }` in localStorage
- Subsequent bot responses ask rapid-fire questions on the topic
- The system prompt is augmented: "You are now in quiz mode for {topic}, {intensity}. Ask one question at a time. After the user answers, briefly grade (correct/partial/incorrect), give a one-sentence explanation, then ask the next question. After 5 questions, summarize."
- The UI shows a small quiz banner above the conversation: "Quiz: {topic} · {questionsAsked}/5"
- An "End quiz" button stops it (resets quizState)
- Score is calculated heuristically by the bot ("3/5 correct") and shown when quiz ends

## 3.6 Update the system prompt for tool use

Append to `prompts/tutor-chat.md`:

```
## Tools you can use

You have tools available for surfacing rich content inline. Use them naturally — they should make the conversation more useful, not more cluttered.

- **launch_case** — when the user asks to walk through, work through, or be guided through a case. Match intent to one of the available case IDs.
- **show_pearl** — when a sharp, attributable pearl perfectly captures the teaching point. Sparingly — at most one per response.
- **show_mistake** — when discussing an error learners commonly make on the topic at hand. Surface the relevant mistake card.
- **show_donotmiss** — when discussing a high-stakes red flag. Always remind the user that in real clinical care, escalation is non-negotiable.
- **start_quiz** — when the user explicitly asks to be quizzed, or when you sense they'd benefit from testing comprehension on a topic you've been discussing.
- **suggest_followups** — call at the end of nearly every response. Offer 2–4 short follow-up chips that match what the user might want next.

You can call multiple tools in one response. Order matters — tools render inline in the order called.

## When NOT to use tools
- For simple factual answers, just answer in text. Tools should add value, not noise.
- Never use tools to deflect from a question you should answer directly.
- Never call show_pearl, show_mistake, or show_donotmiss with content you've made up. If you don't have a real attributable pearl/mistake/red-flag, just say it in text.
```

## 3.7 Library "Use in chat" wiring

The "Use in chat" buttons on library pages (added in Part 2) should:
- For a case page: navigate to /c with prefilled input "Walk me through the {case title} case"
- For a mistake card: prefilled input "Tell me about the {mistake} mistake"
- For a do-not-miss item: prefilled input "Discuss {item} as a red flag"

Use a query param `?prefill={text}` that the chat page reads and pre-fills the input on mount.

## 3.8 Conversation memory in tools

When the bot calls `launch_case`, that case becomes part of the conversation context. If the user later says "what was that case again?", the bot should remember (the case is in the message history as a tool result).

For longer conversations, consider summarization (Phase 0C concern — don't add yet, but note in code comments).

## 3.9 Final checks

- `npm run build` must pass
- `npm run lint` must pass
- Test these flows manually:
  1. Type "Walk me through a fight bite case" → bot calls launch_case → case canvas renders inline → finish the case → bot reacts
  2. Type "Quiz me on flexor tendon zones" → bot calls start_quiz → asks first question → user answers → bot grades + asks next
  3. Type "What are the common mistakes in mallet finger?" → bot answers with show_mistake tool result → mistake card renders inline
  4. Mobile: launch a case → fullscreen takeover → back to chat → compact summary card appears
  5. Tool results render correctly on reload (the conversation history persists tool calls)
  6. With ANTHROPIC_API_KEY unset: mock mode still produces tool calls via keyword detection

═══════════════════════════════════════════

Report:
1. Files added/changed/deleted
2. Build + lint status
3. Manual test results — be specific about which tool flows work and which don't
4. Token usage per typical conversation in live mode (rough estimate)
5. Anything that needs polish before showing faculty

After Part 3 passes: SurgiCraft : Handcraft Phase 0B is complete. Time to schedule the faculty demo.
```
