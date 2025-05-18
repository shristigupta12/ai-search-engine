import { SetStateAction } from "react"
import { Dispatch } from "react"

export const Suggestions = ({suggestions, setQuery}: {suggestions: any, setQuery:  Dispatch<SetStateAction<string>>}) => {
    return(
        <ul>
          {suggestions.map((item: any, idx: any) => (
            <li key={idx} className="cursor-pointer hover:bg-neutral-100 rounded-md p-2" onClick={() => setQuery(item.title)}>{item.title}</li>
          ))}
        </ul>
    )
}