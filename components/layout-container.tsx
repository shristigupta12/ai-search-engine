"use client"

import { Sidebar } from "@/modules/sidebar/components/sidebar"
import { IconLayoutSidebarLeftExpand } from "@tabler/icons-react"
import { useSidebar } from "@/modules/sidebar/context/sidebar-context";
import { Button } from "./ui/button";

export const LayoutContainer = ({children}: {children: React.ReactNode}) => {
    const {toggleOpen} = useSidebar();
    return(
        <div className="flex">
            <Sidebar />
            {/* <Button variant="ghost" size="icon" onClick={() => toggleOpen()} className="hover:cursor-pointer  hover:bg-white"> */}
              <IconLayoutSidebarLeftExpand size={20} className="text-neutral-500 hover:text-neutral-700 hover:cursor-pointer mx-2 my-2" onClick={() => toggleOpen()}  />
            {/* </Button> */}
            <div className="flex-1 text-neutral-600">
              {children}
            </div>
        </div>
    )
}
