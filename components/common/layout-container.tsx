"use client"

import { Sidebar } from "@/modules/sidebar/components/sidebar"
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const LayoutContainer = ({children}: {children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient());
    return(
      <QueryClientProvider client={queryClient}>
        <div className="flex">
            <Sidebar />
            <div className="flex-1 text-neutral-600">
              {children}
            </div>
        </div>
        </QueryClientProvider>
    )
}
