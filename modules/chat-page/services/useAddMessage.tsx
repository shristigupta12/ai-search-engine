import { useMutation } from "@tanstack/react-query";

export const addMessage = async ({session_id, message, role}: {session_id: string, message: string, role: string}) => {
    const res = await fetch('/api/chat/add_message', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({session_id, message, role})
    })
    if(!res.ok) {
        throw new Error('Failed to add message');
    }
    return res.json();
}

export const useAddMessage = () => {
    return useMutation({
        mutationFn: addMessage,
        onError: (error) => {
            console.error(error);
        }
    })
}