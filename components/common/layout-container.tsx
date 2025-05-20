"use client"

import { Sidebar } from "@/modules/sidebar/components/sidebar"
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const LayoutContainer = ({children}: {children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());
    return(
      <QueryClientProvider client={queryClient}>
        <div className="flex p-3 bg-neutral-100">
            <Sidebar />
            <div className="flex-1 px-60 py-10 bg-white shadow-md rounded-lg overflow-y-scroll no-scrollbar h-[calc(100vh-24px)]">
              {children}
            </div>
        </div>
        </QueryClientProvider>
    )
}
