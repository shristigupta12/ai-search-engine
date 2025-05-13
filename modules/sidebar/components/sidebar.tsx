import { JSX } from "react";
import { useSidebar } from "../context/sidebar-context";
import { cn } from "@/lib/utils";

export function Sidebar({className, ...props}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    const {isOpen} = useSidebar();
    return(
        <div className={cn("min-h-screen border-r-2 border-r-neutral-300 w-40", isOpen ? "w-40" : "w-10")}>
            
        </div>
    )   
}