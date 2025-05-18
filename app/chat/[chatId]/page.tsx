
import { ChatPageComponent } from "@/modules/chat-page/components/chat-page-component";

// app/chat/[chatId]/page.tsx
export default function ChatPage({ params }: { params: { chatId: string } }) {
    return (
      <div>
        <ChatPageComponent chatId={params.chatId} />
      </div>
    );
  }
  