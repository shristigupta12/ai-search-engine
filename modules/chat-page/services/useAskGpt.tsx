import { useMutation } from "@tanstack/react-query"

type AskInput = { userInput: string }

export const useAskGpt = () => {
    return useMutation({
        mutationFn: async ({ userInput }: AskInput): Promise<string> => {
            const res = await fetch('/api/chat/ask_gpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userInput})
            })
            const data = await res.json();
            return data.answer;
        }
    })
}