export const ChatPage = ({suggestions}: {suggestions: any}) => {
    return(
        <ul>
          {suggestions.map((item: any, idx: any) => (
            <li key={idx}>{item.title}</li>
          ))}
        </ul>
    )
}