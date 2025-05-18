"use client"

import { useAskGpt } from "@/modules/chat-page/services/useAskGpt";
import { useAddMessage } from "@/modules/chat-page/services/useAddMessage";
import { ChatMessageType } from "@/modules/chat-page/types/message-details-type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/search-bar";
import { useSidebar } from "@/modules/sidebar/context/sidebar-context";
import BouncingDotsLoader from "@/components/common/loader/bouncing-dots-loader";
import { getMessages } from "@/modules/chat-page/services/getMessages";
import { useGetAllSessions } from "@/modules/sidebar/services/get-all-sessions";
import { SessionDetailsType } from "@/modules/sidebar/types/session-details-type";
import { useRouter } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatPageComponent = ({chatId}: {chatId: string}) => {

    const [AILoader, setAILoader] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const {isOpen} = useSidebar();
    const router = useRouter();
    const {mutate} = useAskGpt();
    const {mutate: addMessage} = useAddMessage();
    const {data: messages, isLoading, isError, error, refetch} = useQuery({
        queryKey: ['chat-messages', chatId],
        queryFn: () => getMessages(chatId),
        staleTime: 3600000,
    })
    const {data: sessions} = useGetAllSessions();

    useEffect(()=>{
        const sessionPresent = sessions?.data.some((session: SessionDetailsType) => session.id === chatId);
        if(!sessionPresent){
            router.push('/');
        }
    }, [sessions])

    
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }

    function addMessageToChat(message: string, role: string){
        addMessage(
            {
                session_id: chatId,
                message: message || '...',
                role: role
            },
            {
                onSuccess: () => {
                    refetch();
                    setSearchInput('');
                },
                onError: (error) => {
                    toast.error('Failed to get answer');
                    console.error(error);
                }
            }
        );
    }

    const handleSearch = () => {
        addMessageToChat(searchInput, 'user');
    }

    useEffect(()=>{
        const len: number = messages?.data.length;
        const lastMessage = messages?.data[len - 1];
        console.log("lastMessage: ", lastMessage);
        if(lastMessage && lastMessage?.role === 'user'){
            setAILoader(true);
            mutate(
                {userInput: lastMessage.content},
                {
                    onSuccess: (responseData) => {
                        console.log("data: ", responseData);
                        addMessageToChat(responseData, 'ai');
                        setAILoader(false);
                    },
                    onError: (error) => {
                        toast.error('Failed to get answer');
                        console.error(error);
                        setAILoader(false);
                    }
                }
            );
        }
    }, [messages])

    useEffect(()=>{
        console.log("sessions: ", sessions);
    }, [sessions])

    if(isLoading) return <BouncingDotsLoader />
    if(isError) return <div>Error: {error?.message}</div>

    return(
        <div className="min-h-screen relative">
            <div className="w-full h-full flex flex-col gap-4 pb-8 items-end">
                {messages?.data?.map((message: ChatMessageType) => (
                    <div key={message.id} className={`${message.role === 'user' ? ' bg-neutral-100 rounded-md p-2 w-fit text-sm' : 'ml-0 w-full'}`}>
                        {message.role === 'ai' ? (
                            <div className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            message.content
                        )}
                    </div>
                ))}
                {AILoader && <BouncingDotsLoader /> }
            </div>
            <div className={` ${isOpen ? "w-[37vw]" : "w-[46vw]"} fixed bottom-0 rounded-md bg-white pb-4`}>
                <SearchBar onInputChange={handleSearchInputChange} inputValue={searchInput} handleSearch={handleSearch} disableSearchButton={searchInput.length===0 || AILoader}/>
            </div>
        </div>
    )
}