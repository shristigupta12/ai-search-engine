"use client"

import { useAddMessage } from "@/modules/chat-page/services/useAddMessage";
import { ChatMessageType } from "@/modules/chat-page/types/message-details-type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchBar } from "@/components/common/search-bar";
import { useSidebar } from "@/modules/sidebar/context/sidebar-context";
import BouncingDotsLoader from "@/components/common/loader/bouncing-dots-loader";
import { getMessages } from "@/modules/chat-page/services/getMessages";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { fetchStreamedAIResponse } from "../services/useAskGpt";

const splitStringIntoChunks = (str: string, chunkSize: number = 50): string[] => {
    const chunks: string[] = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
};

interface LocalMessage {
    role: string;
    content: string;
}

export const ChatPageComponent = ({chatId}: {chatId: string}) => {
    const [AILoader, setAILoader] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const {isOpen} = useSidebar();
    const {mutate: addMessage} = useAddMessage();
    const {data: messages, isLoading, isError, error} = useQuery({
        queryKey: ['chat-messages', chatId],
        queryFn: () => getMessages(chatId),
        staleTime: 3600000,
    })
    const [showStreamedMessage, setShowStreamedMessage] = useState(false);
    const [streamedMessage, setStreamedMessage] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [sendDataToApi, setSendDataToApi] = useState(false);
    const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
    
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }
    
    function addMessageToChat(message: string, role: string, showStreaming: boolean = false){
        addMessage(
            {
                session_id: chatId,
                message: message || '...',
                role: role
            },
            {
                onSuccess: async () => {
                    setShowStreamedMessage(showStreaming);
                    setSearchInput('');
                    setAILoader(false);
                },
                onError: (error) => {
                    toast.error('Failed to get answer');
                    console.error(error);
                }
            }
        );
    }
    
    const handleSearch = () => {
        setSearchInput('');
        setLocalMessages([...localMessages, {role: 'user', content: searchInput}]);
        addMessageToChat(searchInput, 'user', true);
        handleSend(searchInput);
    }
    
    const handleSend = async (userInput: string) => {
        // Add initial AI message
        setLocalMessages(prev => [...prev, { role: 'ai', content: '' }]);
        setIsStreaming(true);
        
        await fetchStreamedAIResponse(
            userInput,
            (chunk) => {
                setLocalMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: newMessages[lastIndex].content + chunk,
                    };
                    return newMessages;
                });
            },
            () => {
                setIsStreaming(false);
                setSendDataToApi(true);
            }
        );
    };
    
    useEffect(() => {
        if (showStreamedMessage) {
            const len = messages?.data.length;
            const lastMessage = messages?.data[len - 1];
            const chunks = splitStringIntoChunks(lastMessage?.content || '');
            let currentMessage = '';
            
            const interval = setInterval(() => {
                if (chunks.length === 0) {
                    clearInterval(interval);
                    return;
                }
                const nextChunk = chunks.shift() || '';
                currentMessage += nextChunk;
                setStreamedMessage(currentMessage);
            }, 2000);

            setShowStreamedMessage(false);

            // Cleanup interval on unmount or when showStreamedMessage changes
            return () => clearInterval(interval);
        }
    }, [showStreamedMessage, messages])

    useEffect(()=>{
        if(sendDataToApi){
            const lastMessage = localMessages[localMessages.length - 1];
            if (lastMessage) {
                addMessageToChat(lastMessage.content, 'ai', false);
            }
            setSendDataToApi(false);
            setIsStreaming(false);
        }
    }, [sendDataToApi])

    useEffect(()=>{
        setLocalMessages([]);
        const len: number = messages?.data.length;
        const lastMessage = messages?.data[len - 1];
        if(lastMessage && lastMessage?.role === 'user'){
            setAILoader(true);
            handleSend(lastMessage.content);
        }
    }, [messages])


    if(isLoading) return 
        <div className="w-full flex items-center justify-center">
        <BouncingDotsLoader />
        </div>
        
    if(isError) return <div>Error: {error?.message}</div>


    return(
        <div className="min-h-screen relative">
            <div className="max-w-full h-full flex flex-col gap-4 pb-8 items-end ">
                {messages?.data?.map((message: ChatMessageType, index: number) => (
                    <motion.div 
                        key={message.id} 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={` ${message.role === 'user' ? ' bg-neutral-100 rounded-md p-2 w-fit text-sm' : 'ml-0 max-w-full'}`}
                    >
                        {message.role === 'ai' ? (
                            <div className="markdown-body">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content} 
                                </ReactMarkdown>
                            </div>
                        ) : (
                            message.content
                        )}
                    </motion.div>
                ))}
                {localMessages.map((message, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={` ${message.role === 'user' ? ' bg-neutral-100 rounded-md p-2 w-fit text-sm' : 'ml-0 max-w-full'}`}
                >
                    {message.role === 'ai' ? (
                        <div className="markdown-body w-full">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {showStreamedMessage && message === messages?.data[messages.data.length - 1] ? streamedMessage : message.content} 
                            </ReactMarkdown>
                        </div>
                    ) : (
                        message.content
                    )}
                </motion.div>
                ))}
              
                {AILoader && 
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <BouncingDotsLoader />
                </motion.div>
                }
            </div>
            <div className={` ${isOpen ? " lg:w-[calc(100vw-462px-240px)] md:w-[calc(100vw-130px-160px)] w-[calc(100vw-130px)]" : "lg:w-[calc(100vw-296px-243px)] w-[calc(100vw-130px)]"} fixed bottom-0 rounded-md pb-3`}>
                <SearchBar onInputChange={handleSearchInputChange} inputValue={searchInput} handleSearch={handleSearch} disableSearchButton={searchInput.length===0 || AILoader} chatPage={true} />
            </div>
        </div>
    )
}