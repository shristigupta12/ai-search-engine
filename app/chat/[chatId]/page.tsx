import { ChatPageComponent } from "@/modules/chat-page/components/chat-page-component";

// app/chat/[chatId]/page.tsx
export default async function ChatPage({
  params,
}: {
  params:  Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  return (
    <div>
      <ChatPageComponent chatId={chatId} />
    </div>
  );
}
  