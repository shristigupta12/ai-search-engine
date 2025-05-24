import { IconArrowRight, IconArrowUp, IconLinkPlus } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
export const SearchBar = ({onInputChange, inputValue, handleSearch, disableSearchButton, className, chatPage}: {onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, inputValue: string, handleSearch: () => void, disableSearchButton: boolean, className?: string, chatPage?: boolean}) => {
    
    const {theme} = useTheme()
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !disableSearchButton) {
            handleSearch();
        }
    };

    return(
        <div className={cn("relative flex w-full bg-white rounded-tl-3xl rounded-tr-3xl ", chatPage ? "pb-3" : "pb-0", className, theme=="dark" ? "bg-neutral-900" : "bg-white")}>
            <Input 
                className={`pr-20 w-full sm:min-w-[400px] bg-neutral-50 sm:py-6 py-3 rounded-3xl ${theme=="dark" ? "bg-neutral-800 [&::selection]:bg-neutral-600 [&::selection]:text-white" : "bg-white [&::selection]:bg-neutral-200 [&::selection]:text-neutral-900"}`} 
                onChange={onInputChange} 
                onKeyDown={handleKeyDown}
                placeholder="What is Next.js?" 
                value={inputValue} 
            />
            {/* <Button variant={"ghost"} size={"icon"} className={`absolute right-9 top-1/2 ${chatPage ? "-translate-y-5" : "-translate-y-1/2"} text-neutral-500 cursor-pointer h-7`}>
                <IconLinkPlus size={20} />
            </Button> */}
            <Button variant={"ghost"} size={"icon"} className={`absolute right-2 top-1/2 ${chatPage ? "-translate-y-4.5" : "-translate-y-1/2"} cursor-pointer ${theme=="dark" ? "bg-neutral-50 text-neutral-600 hover:bg-neutral-300" : "hover:text-white text-white bg-neutral-600 hover:bg-neutral-700"}  rounded-full p-1  cursor-pointer h-6 w-6`} onClick={handleSearch} disabled={disableSearchButton} >
                {chatPage ? <IconArrowUp size={20} /> : <IconArrowRight size={20} />}
            </Button>
        </div>
    )
}