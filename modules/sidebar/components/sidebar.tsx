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
import { useDeleteChatSession } from "../services/delete-session";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const {toggleOpen, isOpen} = useSidebar();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

    const {data: sessions, isLoading, isError, error, refetch} = useQuery({
        queryKey: ['sessions'],
        queryFn: getAllSessions,
        staleTime: 3600000,
    })
    
    const handleSessionClick = (sessionId: string) => {
        router.refresh();
        router.push(`/chat/${sessionId}`);
    }
    
    const handleNewChat = () => {
        router.push('/');
    }

    const {mutate: deleteSession, isPending: isDeleting} = useDeleteChatSession();
    
    const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent session click when clicking delete
        setSessionToDelete(sessionId);
        setDeleteDialogOpen(true);
    }

    const handleDeleteConfirm = () => {
        if (sessionToDelete) {
            deleteSession({session_id: sessionToDelete},
                {
                    onSuccess: () => {
                        refetch();
                        setDeleteDialogOpen(false);
                        setSessionToDelete(null);
                    },
                    onError: () => {
                        toast.error("Failed to delete session");
                        setDeleteDialogOpen(false);
                        setSessionToDelete(null);
                    }
                }
            );
        }
    }
    
    // Extract session ID from URL path containing 'chat'
    const currentSessionId = pathname.includes('/chat/') 
    ? pathname.split('/chat/')[1]
    : null;
    
    if(isLoading) return <BouncingDotsLoader />
    if(isError) return <div>Error: {error?.message}</div>

    return(
        <>
            <motion.div 
                className={cn("min-h-screen bg-neutral-50 flex items-center flex-col gap-2", isOpen ? "w-60" : "w-0")}
                animate={{ width: isOpen ? 240 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div 
                    className={`fixed top-0 left-0 overflow-y-auto h-screen flex items-center flex-col gap-2 px-4 py-10 ${isOpen? "w-54": "w-10"}`}
                >
                    {isDeleting && <BouncingDotsLoader onPage={true} />}
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
                            <IconTrash size={16} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDeleteClick(session.id, e)} />
                        </motion.div>
                    ))}
                    </div>
                </div>
            </motion.div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Session</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this session? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )   
}