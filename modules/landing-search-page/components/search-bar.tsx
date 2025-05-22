"use client"

import { useState } from "react";
import { Suggestions } from "./suggestions";
import { useCreateChatSession } from "../services/create-chat-session";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/common/search-bar";
import { useDebounce} from 'use-debounce'
import { useStaticSearchSuggestions } from "../services/get-static-search-suggestions";
import { getAllSessions } from "@/modules/sidebar/services/get-all-sessions";
import { useQuery } from "@tanstack/react-query";
import BouncingDotsLoader from "@/components/common/loader/bouncing-dots-loader";
// import { useGptSearchSuggestions } from "../services/get-gpt-search-suggestions";

export default function SearchBarMainPage() {
    const [query, setQuery] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [debouncedQuery] = useDebounce(query, 2000);
    const router = useRouter();
    const [gptSuggestions, setGptSuggestions] = useState<string[]>([]);
    const {data: suggestions = [], isLoading} = useStaticSearchSuggestions(debouncedQuery);
    const [newChatLoader, setNewChatLoader] = useState(false);
    const {mutate: createChatSession, isPending} = useCreateChatSession();

    const {refetch} = useQuery({
        queryKey: ['sessions'],
        queryFn: getAllSessions,
        staleTime: 3600000,
    })

    const handleSearch = () => {
        const session_id = crypto.randomUUID();
        createChatSession({
            session_id: session_id,
            title: inputValue.slice(0, 20),
            text_prompt: inputValue
        }, {
            onSuccess: () => {
                setInputValue('');
                setNewChatLoader(true);
                router.push(`/chat/${session_id}`);
                refetch();
            },
            onError: (error) => {
                toast.error(error?.message);
            }
        })
        
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setInputValue(e.target.value);
    }


    if(isPending) return <BouncingDotsLoader />

    return(
        <> {(newChatLoader || isLoading) &&  <BouncingDotsLoader onPage={true} />}
        <div className="flex flex-col gap-3">
            <SearchBar onInputChange={handleInputChange} inputValue={inputValue} handleSearch={handleSearch} disableSearchButton={inputValue.length===0}/>
             {suggestions.length > 0 ? <Suggestions suggestions={suggestions} setQuery={setInputValue}/> : 
                gptSuggestions.length > 0 ? <Suggestions suggestions={gptSuggestions} setQuery={setInputValue}/> : <div></div>
            }
        </div>
        </>
    )
}