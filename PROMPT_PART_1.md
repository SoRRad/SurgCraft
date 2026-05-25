# Historical Phase 0B Part 1 Prompt

> Status: historical. This prompt has already been executed and should not be replayed against the current repo.

Current source of truth:

- `ROADMAP.md`
- `SPEC.md`
- `BUILD_ORDER.md`
- `FILE_STRUCTURE.md`

Part 1 originally introduced the chat-first direction:

- `/c` as chat home
- `/c/[conversationId]`
- `ChatExperience`
- AI SDK streaming
- `prompts/tutor-chat.md`
- mock fallback and Anthropic live mode
- removal of the dashboard-centered product model

The current implementation has moved beyond this prompt. Provider selection now lives in `lib/llm/provider-selection.ts` and `lib/llm/streaming-provider.ts`, and the active prompt has stricter no-PHI, citation honesty, and tool-boundary rules.

Use the current roadmap for next work instead of this historical prompt.
