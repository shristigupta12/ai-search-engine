export const getMessages = async (chatId: string) => {
    const res = await fetch(`/api/chat/all_messages?session_id=${chatId}`);
    if(!res.ok) {
        throw new Error('Failed to fetch messages');
    }
    return res.json();
}