"use client"

import { createContext, ReactNode, useState, useContext } from "react";

type SidebarContextType = {
    isOpen: true | false;
    toggleOpen: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({children}: {children: ReactNode}) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }

    return(
        <SidebarContext.Provider value={{isOpen, toggleOpen}}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}