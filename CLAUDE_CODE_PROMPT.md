# Historical Claude Code Scaffold Prompt

> Status: historical. This was the original scaffold prompt for the early Handcraft build and no longer describes the current app architecture.

Do not use this file as the source of truth for future development. The current project is `SurgiCraft : Handcraft`, a Phase 0B chat-first prototype centered on `/c`, `ChatLayout`, local conversations, provider-flexible streaming, and inline chat tools.

Use these files instead:

- `ROADMAP.md` for canonical phase sequencing
- `SPEC.md` for the current product and architecture spec
- `BUILD_ORDER.md` for the current implementation checklist
- `FILE_STRUCTURE.md` for the current route/component/provider layout
- `prompts/tutor-chat.md` for the active chat system prompt

Historical context:

- The original scaffold assumed a dashboard-centered Week 1-6 build.
- It referenced legacy dashboard and chat routes, both removed or replaced by the chat-first `/c` flow.
- It treated Supabase as an initial setup item; Supabase is now Phase 0C+.
- It predated the provider selection layer and the current tool-result rendering.

Keep this file only as an archive of how the project began.
