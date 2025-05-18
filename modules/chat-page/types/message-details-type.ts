export interface ChatMessageType {
    id: string;
    session_id: string;
    content: string;
    created_at: string;
    role: "user" | "ai";
}