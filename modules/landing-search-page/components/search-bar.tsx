"use client"

import { IconLinkPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChatPage } from "./chat-page";

export default function SearchBar() {

    const [query, setQuery] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');

    const {data: suggestions = [], isLoading} = useQuery({
        queryKey: ['autocomplete', query],
        queryFn: async () => {
            if (!query) return [];
            const res = await fetch(`/api/autocomplete?query=${query}`);
            return res.json();
        },
        enabled: !!query,
    })


    return(
        <div className="flex flex-col gap-3">
            <div className="relative flex ">
                <Input className="w-[50vw] pr-18" onChange={e=> {setQuery(e.target.value); setInputValue(e.target.value)}} placeholder="What is the weather today?" value={inputValue} />
                <Button variant={"ghost"} size={"icon"} className="absolute right-12 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer h-7">
                    <IconLinkPlus size={20} />
                </Button>
                <Button variant={"ghost"} size={"icon"} className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-white text-white bg-neutral-600 rounded-md p-1 hover:bg-neutral-700 cursor-pointer h-7">
                    <IconArrowRight size={20} />
                </Button>
            </div>
            {isLoading ? <div>Loading...</div> : suggestions.length > 0 ? <ChatPage suggestions={suggestions} setQuery={setInputValue}/> : <div></div>}
        </div>
    )
}