import { Header } from "@/components/shell/Header"
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
    <div className="flex flex-col h-dvh bg-bg overflow-hidden">
      <Header />
      <ChatExperience conversationId={params.conversationId} />
    </div>
  )
}
