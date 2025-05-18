"use client"

import { useMutation } from "@tanstack/react-query";

export const useGptSearchSuggestions = () => {
    return useMutation({
        mutationFn: async (query: string) => {
            const res = await fetch(`/api/search_suggestions/gpt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query })
            });
            return res.json();
        }
    });
}; 