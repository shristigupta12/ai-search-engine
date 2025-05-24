"use client"

import { Sidebar } from "@/modules/sidebar/components/sidebar/sidebar"
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SignInButton from "@/components/common/sign-in-button"
import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";

export const LayoutContainer = ({children}: {children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      // const session = supabase.auth.getSession().then(({ data }) => {
      //   setUser(data?.session ?.user ?? null);
      // });
      // Listen for sign-in/sign-out
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);
  
    if (!user) {
      // Not signed in
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-8">
          <SignInButton />
        </div>
      );
    }

    return(
      <QueryClientProvider client={queryClient}>
        <div className="flex p-3 bg-neutral-100">
            <Sidebar />
            <div className="flex-1 lg:px-60 px-10 py-10 bg-white shadow-md rounded-lg overflow-y-scroll no-scrollbar h-[calc(100vh-24px)]">
              {children}
            </div>
        </div>
        </QueryClientProvider>
    )
}
