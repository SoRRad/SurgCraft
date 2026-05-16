import { ChatLayout } from "@/components/chat/ChatLayout"
import { ChatExperience } from "@/components/chat/ChatExperience"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SurgiCraft : Handcraft",
}

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string }
}) {
  return (
    <ChatLayout>
      <ChatExperience conversationId={params.conversationId} />
    </ChatLayout>
  )
}
