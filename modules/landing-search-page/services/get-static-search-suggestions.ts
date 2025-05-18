"use client"

import { useQuery } from "@tanstack/react-query";

export const useStaticSearchSuggestions = (query: string) => {
    return useQuery({
        queryKey: ['autocomplete', query],
        queryFn: async () => {
            if (!query) return [];
            const res = await fetch(`/api/search_suggestions/static_data?query=${query}`);
            return res.json();
        },
        enabled: !!query,
        staleTime: 3600000,
    });
}; 