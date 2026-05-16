import { Header } from "@/components/shell/Header"
import { ChatExperience } from "@/components/chat/ChatExperience"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SurgiCraft : Handcraft",
}

export default function ChatHomePage() {
  return (
    <div className="flex flex-col h-dvh bg-bg overflow-hidden">
      <Header />
      <ChatExperience />
    </div>
  )
}
