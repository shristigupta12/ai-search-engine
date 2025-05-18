import { useMutation } from "@tanstack/react-query";

const deleteChatSession = async ({session_id}: {session_id: string}) => {
    const res = await fetch('/api/sessions/delete_session', {
        method: 'DELETE',
        body: JSON.stringify({session_id})
    });
    if(!res.ok) {
        throw new Error('Failed to delete chat session');
    }
    return res.json();
}

export const useDeleteChatSession = () => {
    return useMutation({
        mutationFn: deleteChatSession,
        onError: (error) => {
            console.error(error);
        }
    })
}
