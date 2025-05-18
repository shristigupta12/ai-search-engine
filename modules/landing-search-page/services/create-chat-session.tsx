"use client"

import { useMutation } from "@tanstack/react-query";

const createChatSession = async ({session_id, title, text_prompt}: {session_id: string, title: string, text_prompt: string}) => {
   const res = await fetch('/api/sessions/create_session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({session_id, title, text_prompt})
   });
   if(!res.ok) {
    throw new Error('Failed to create chat session');
   }
   return res.json();
}

export const useCreateChatSession = () => {
    return useMutation({
        mutationFn: createChatSession,
        onError: (error) => {
            console.error(error);
        }
    })
}


