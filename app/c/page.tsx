import { ChatLayout } from "@/components/chat/ChatLayout"
import { ChatExperience } from "@/components/chat/ChatExperience"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SurgiCraft : Handcraft",
}

export default function ChatHomePage() {
  return (
    <ChatLayout>
      <ChatExperience />
    </ChatLayout>
  )
}
