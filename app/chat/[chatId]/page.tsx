"use client"

import { useParams } from "next/navigation";
import { ChatPageComponent } from "@/modules/chat-page/components/chat-page-component";


export default function ChatPage() {
    const {chatId} = useParams();
    return(
        <div className="p-4">
            <ChatPageComponent chatId={chatId as string}/>
       </div>
    )
}