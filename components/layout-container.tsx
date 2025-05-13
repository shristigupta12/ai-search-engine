"use client"

import { Sidebar } from "@/modules/sidebar/components/sidebar"
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react"
import { useSidebar } from "@/modules/sidebar/context/sidebar-context";
import { Button } from "./ui/button";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const LayoutContainer = ({children}: {children: React.ReactNode}) => {
    const {toggleOpen} = useSidebar();
    const [queryClient] = useState(() => new QueryClient());
    return(
      <QueryClientProvider client={queryClient}>
        <div className="flex">
            <Sidebar />
            {/* <Button variant="ghost" size="icon" onClick={() => toggleOpen()} className="hover:cursor-pointer  hover:bg-white"> */}
              <IconLayoutSidebarLeftExpand size={20} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer mx-2 my-2" onClick={() => toggleOpen()}  />
            {/* </Button> */}
            <div className="flex-1 text-neutral-600">
              {children}
            </div>
        </div>
        </QueryClientProvider>
    )
}
