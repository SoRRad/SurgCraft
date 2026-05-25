# Historical Phase 0B Part 3 Prompt

> Status: historical. This prompt has already been executed and should not be replayed against the current repo.

Part 3 originally introduced rich chat tools:

- `launch_case`
- `show_pearl`
- `show_mistake`
- `show_donotmiss`
- `start_quiz`
- `suggest_followups`

Current implementation notes:

- Tool schemas live in `lib/llm/tools.ts`.
- Tool rendering lives in `components/chat/tool-results/`.
- `show_pearl` now accepts only known `pearl_id` values and returns authored local demo content from `lib/demo/demo-content.ts`.
- The active safety and tool-use prompt is `prompts/tutor-chat.md`.

For current next steps, use `ROADMAP.md` and `BUILD_ORDER.md`.
