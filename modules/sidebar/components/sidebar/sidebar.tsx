'use client'

import BouncingDotsLoader from '@/components/common/loader/bouncing-dots-loader'
import SignOutButton from '@/components/common/sign-out-button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { IconLayoutSidebarLeftExpand, IconMessageCircle, IconPlus, IconTrash } from '@tabler/icons-react'
import { format, isAfter, isThisMonth, isThisYear, isToday, parseISO, subDays } from 'date-fns'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSidebar } from '../../context/sidebar-context'
import { useDeleteChatSession } from '../../services/delete-session'
import { useGetAllSessions } from '../../services/get-all-sessions'
import { SessionDetailsType } from '../../types/session-details-type'

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toggleOpen, isOpen } = useSidebar()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [sessionChangeLoader, setSessionChangeLoader] = useState(false)
  // Extract session ID from URL path containing 'chat'
  const currentSessionId = pathname.includes('/chat/') ? pathname.split('/chat/')[1] : null

  const { data: sessions, isLoading, isError, error, refetch } = useGetAllSessions()

  const handleSessionClick = (sessionId: string) => {
    if(currentSessionId !== sessionId){
      setSessionChangeLoader(true)
      router.refresh()
      router.push(`/chat/${sessionId}`)
    }
  }

  const handleNewChat = () => {
    if (pathname !== '/') {
      setSessionChangeLoader(true)
      router.push('/')
    }
  }

  const { mutate: deleteSession, isPending: isDeleting } = useDeleteChatSession()

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent session click when clicking delete
    setSessionToDelete(sessionId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      deleteSession(
        { session_id: sessionToDelete },
        {
          onSuccess: () => {
            refetch()
            setDeleteDialogOpen(false)
            setSessionToDelete(null)
            handleNewChat()
          },
          onError: () => {
            toast.error('Failed to delete session')
            setDeleteDialogOpen(false)
            setSessionToDelete(null)
          },
        },
      )
    }
  }

  const [groups, setGroups] = useState<Record<string, SessionDetailsType[]>>({})
  function groupSessions(sessions: SessionDetailsType[]) {
    const groups: Record<string, SessionDetailsType[]> = {}
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)

    sessions.forEach((session) => {
      const date = parseISO(session.created_at)

      if (isToday(date)) {
        groups['Today'] = groups['Today'] || []
        groups['Today'].push(session)
      } else if (isAfter(date, sevenDaysAgo)) {
        groups['Last 7 days'] = groups['Last 7 days'] || []
        groups['Last 7 days'].push(session)
      } else if (isThisMonth(date)) {
        groups['Last month'] = groups['Last month'] || []
        groups['Last month'].push(session)
      } else if (isThisYear(date)) {
        const year = format(date, 'yyyy')
        groups[year] = groups[year] || []
        groups[year].push(session)
      } else {
        const year = format(date, 'yyyy')
        groups[year] = groups[year] || []
        groups[year].push(session)
      }
    })

    return groups
  }


  useEffect(() => {
    setSessionChangeLoader(false)
  }, [pathname])

  useEffect(() => {
    if (sessions) {
      setGroups(groupSessions(sessions.data))
    }
  }, [sessions])

  useEffect(() => {
    if (groups) {
      console.log(Object.keys(groups)[0])
    }
  }, [groups])

  // if(isLoading) return <BouncingDotsLoader />
  if (isError) return <div>Error: {error?.message}</div>

  return (
    <>
      {(sessionChangeLoader || isLoading || isDeleting) && <BouncingDotsLoader onPage={true} />}
      <motion.div
        className={cn('flex min-h-screen flex-col items-center gap-2 bg-neutral-100')}
        animate={{ width: isOpen ? 200 : 40 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <div
          className={`fixed top-0 left-0 flex h-screen flex-col items-center overflow-y-auto no-scrollbar px-4 py-10 ${isOpen ? 'w-54 gap-10' : 'w-[53px] gap-4'}`}>
          <motion.div
            className={`flex w-full gap-4`}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              flexDirection: isOpen ? 'row' : 'column',
              justifyContent: isOpen ? 'space-between' : 'center',
              alignItems: isOpen ? 'center' : 'center',
            }}
            transition={{
              duration: 0.3,
              flexDirection: { duration: 0.8 },
              justifyContent: { duration: 0.8 },
              alignItems: { duration: 0.3 },
            }}>
              <div className='py-2 bg-neutral-100'>
            <IconLayoutSidebarLeftExpand
              size={24}
              className="text-neutral-500 hover:cursor-pointer hover:text-neutral-700 fixed top-3 bg-neutral-100"
              onClick={() => toggleOpen()}
            />
            </div>
            <div className='flex items-center gap-2 fixed top-9 py-4  cursor-pointer bg-neutral-100 w-50' onClick={handleNewChat}>
              <Button
                className="flex size-6 items-center justify-center rounded-full bg-neutral-600 hover:cursor-pointer hover:bg-neutral-700">
                <IconPlus className="size-4 text-white" />
              </Button>
              {isOpen && <p className='text-sm text-neutral-600'>New Chat</p>}
            </div>
          </motion.div>
          <div className="flex w-full flex-col items-center gap-2">
            {isOpen ? (
              <div className="flex w-full flex-col">
                {Object.entries(groups).map(([groupName, sessions]) =>
                  sessions.length > 0 ? (
                    <Accordion type="single" key={groupName} collapsible className="w-full" defaultValue={groupName}>
                      <AccordionItem value={groupName}>
                        <AccordionTrigger className="text-sm font-semibold text-neutral-700">{groupName}</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2">
                            {sessions.map((session: SessionDetailsType) => (
                              <motion.div
                                key={session.id}
                                className={`group flex w-full items-center justify-between gap-2 rounded-md p-2 hover:cursor-pointer hover:bg-neutral-200 ${session.id === currentSessionId ? 'bg-neutral-200' : 'bg-none'}`}
                                onClick={() => handleSessionClick(session.id)}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}>
                                    <p className="max-w-[150px] overflow-hidden text-neutral-600 text-ellipsis whitespace-nowrap">{session.title}</p>
                                <IconTrash
                                  size={16}
                                  className="text-neutral-500 opacity-0 transition-opacity group-hover:opacity-100 hover:cursor-pointer hover:text-neutral-700"
                                  onClick={(e) => handleDeleteClick(session.id, e)}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <></>
                  ),
                )}
              </div>
            ) : (
              <IconMessageCircle size={24} className="text-neutral-500 hover:cursor-pointer hover:text-neutral-700 fixed top-24" onClick={toggleOpen} />
            )}
          </div>
          {isOpen && <SignOutButton className="absolute bottom-5 left-12 cursor-pointer bg-neutral-700" />}
        </div>
      </motion.div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>Are you sure you want to delete this session? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
