"use client"

import { useSidebar } from "../context/sidebar-context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SessionDetailsType } from "../types/session-details-type";
import { useRouter, usePathname } from "next/navigation";
import { IconLayoutSidebarLeftExpand, IconPlus, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button";
import { getAllSessions } from "../services/get-all-sessions";
import BouncingDotsLoader from "@/components/common/loader/bouncing-dots-loader";
import { motion } from "framer-motion";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const {toggleOpen, isOpen} = useSidebar();
    const {data: sessions, isLoading, isError, error} = useQuery({
        queryKey: ['sessions'],
        queryFn: getAllSessions,
        staleTime: 3600000,
    })
    if(isLoading) return <BouncingDotsLoader />
    if(isError) return <div>Error: {error?.message}</div>

    const handleSessionClick = (sessionId: string) => {
        router.refresh();
        router.push(`/chat/${sessionId}`);
    }

    const handleNewChat = () => {
        router.push('/');
    }

    // Extract session ID from URL path containing 'chat'
    const currentSessionId = pathname.includes('/chat/') 
        ? pathname.split('/chat/')[1]
        : null;

    return(
        <motion.div 
            className={cn("min-h-screen bg-neutral-50 flex items-center flex-col gap-2", isOpen ? "w-60" : "w-0")}
            animate={{ width: isOpen ? 240 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div 
                className={`fixed top-0 left-0 overflow-y-auto h-screen flex items-center flex-col gap-2 px-4 py-10 ${isOpen? "w-54": "w-10"}`}
            >
                <div className={`flex w-full gap-2 ${isOpen? "flex-row justify-between items-center": "flex-col justify-center"}`}>
                    <IconLayoutSidebarLeftExpand size={24} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer" onClick={() => toggleOpen()}  />
                    <Button className="size-6 rounded-md bg-neutral-600 flex items-center justify-center hover:cursor-pointer hover:bg-neutral-700" onClick={handleNewChat}>
                        <IconPlus className="text-white size-4" />
                    </Button>
                </div>
                <div className="flex flex-col gap-2 w-full">
                {isOpen && sessions?.data?.map((session: SessionDetailsType) => (
                    <motion.div 
                        key={session.id} 
                        className={`group flex justify-between items-center gap-2 w-full hover:cursor-pointer hover:bg-neutral-200 rounded-md p-2 ${session.id === currentSessionId ? "bg-neutral-200" : "bg-none"}`} 
                        onClick={() => handleSessionClick(session.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">{session.title}</p>
                        <IconTrash size={16} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {}} />
                    </motion.div>
                ))}
                </div>
            </div>
        </motion.div>
    )   
}