'use client'

import SignInButton from '@/components/common/sign-in-button'
import { supabase } from '@/lib/supabaseClient'
import { Sidebar } from '@/modules/sidebar/components/sidebar/sidebar'
import { User } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ThemeProvider } from '../theme-provider'
import { useTheme } from 'next-themes'

export const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [user, setUser] = useState<User | null>(null)
  const {theme} = useTheme()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (!user) {
    // Not signed in
    return (
      <div className={`flex h-screen flex-col items-center justify-center gap-8`}>
        <SignInButton />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  
  return (
    <div className={`flex bg-neutral-100 p-3 ${theme === "dark" ? "bg-neutral-800": "bg-neutral-100"} `}>
      <Sidebar />
      <div className={`no-scrollbar h-[calc(100vh-24px)] flex-1 overflow-y-scroll rounded-lg px-10 py-10 shadow-md lg:px-60  ${theme=="dark" ? "text-neutral-100 bg-neutral-900 border-[1px] border-neutral-700" : "text-neutral-600 bg-white"}`}>
        {children}
      </div>
    </div>
  )
}
