"use client"

import { useSidebar } from "../context/sidebar-context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SessionDetailsType } from "../types/session-details-type";
import { useRouter, usePathname } from "next/navigation";
import { IconLayoutSidebarLeftExpand, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const {toggleOpen, isOpen} = useSidebar();
    const {data: sessions, isLoading, isError, error} = useQuery({
        queryKey: ['sessions'],
        queryFn: () => fetch('/api/sessions/all_sessions').then(res => res.json()),
        staleTime: 3600000,
    })
    if(isLoading) return <div>Loading...</div>
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
        <div className={cn("min-h-screen border-r-2 border-r-neutral-300 w-40 flex items-center flex-col gap-2 p-2", isOpen ? "w-40" : "w-10")}>

            <IconLayoutSidebarLeftExpand size={20} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer mx-2 my-2" onClick={() => toggleOpen()}  />

            <Button className="size-8 rounded-md bg-neutral-600 flex items-center justify-center hover:cursor-pointer hover:bg-neutral-700" onClick={handleNewChat}>
                <IconPlus size={20} className="text-white" />
            </Button>
            
            {sessions?.data?.map((session: SessionDetailsType) => (
                <div key={session.id} className={`flex flex-col gap-2 hover:cursor-pointer hover:bg-neutral-100 rounded-md p-2 ${session.id === currentSessionId ? "bg-neutral-100" : ""}`} onClick={() => handleSessionClick(session.id)}>
                    { isOpen && session.title}
                </div>
            ))}
        </div>
    )   
}