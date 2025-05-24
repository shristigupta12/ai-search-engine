import { SetStateAction } from "react"
import { Dispatch } from "react"
import { useTheme } from "next-themes"

export const Suggestions = ({suggestions, setQuery}: {suggestions: any, setQuery:  Dispatch<SetStateAction<string>>}) => {
  const {theme} = useTheme()
    return(
        <ul>
          {suggestions.map((item: any, idx: any) => (
            <li key={idx} className={`cursor-pointer ${theme==="dark" ? "hover:bg-neutral-800" : "hover:bg-neutral-100"} rounded-md p-2`} onClick={() => setQuery(item.title)}>{item.title}</li>
          ))}
        </ul>
    )
}