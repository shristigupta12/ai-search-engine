import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconLinkPlus, IconArrowRight } from "@tabler/icons-react"

export const LandingSearchPage = () => {
    return(
        <div className="items-center justify-center flex flex-col min-h-screen gap-6">
            <h1 className="text-4xl ">Ask me anything!</h1>
            <div className="relative flex ">
                <Input className="w-[50vw] pr-18" />
                <Button variant={"ghost"} size={"icon"} className="absolute right-12 top-1/2 -translate-y-1/2 text-neutral-500 cursor-pointer h-7">
                    <IconLinkPlus size={20} />
                </Button>
                <Button variant={"ghost"} size={"icon"} className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-white text-white bg-neutral-600 rounded-md p-1 hover:bg-neutral-700 cursor-pointer h-7">
                    <IconArrowRight size={20} />
                </Button>
            </div>
        </div>
    )
}
