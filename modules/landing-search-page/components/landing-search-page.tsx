
import  SearchBarMainPage  from "./search-bar"
export const LandingSearchPage = () => {
    return(
        <div className={`items-center justify-center flex flex-col h-full gap-6`}>
            <h1 className="sm:text-4xl text-2xl ">Ask me anything!</h1>
            <SearchBarMainPage />
        </div>
    )
}
