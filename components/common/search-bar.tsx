import { IconLinkPlus } from "@tabler/icons-react";

import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const SearchBar = ({onInputChange, inputValue, handleSearch, disableSearchButton}: {onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, inputValue: string, handleSearch: () => void, disableSearchButton: boolean}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !disableSearchButton) {
            handleSearch();
        }
    };

    return(
        <div className="relative flex w-full rounded-md bg-white">
            <Input 
                className="w-full pr-20 min-w-[500px] shadow-sm " 
                onChange={onInputChange} 
                onKeyDown={handleKeyDown}
                placeholder="What is the weather today?" 
                value={inputValue} 
            />
            <Button variant={"ghost"} size={"icon"} className="absolute right-12 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer h-7">
                <IconLinkPlus size={20} />
            </Button>
            <Button variant={"ghost"} size={"icon"} className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-white text-white bg-neutral-600 rounded-md p-1 hover:bg-neutral-700 cursor-pointer h-7" onClick={handleSearch} disabled={disableSearchButton} >
                <IconArrowRight size={20} />
            </Button>
        </div>
    )
}