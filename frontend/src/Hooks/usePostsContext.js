import { PostsContext } from "../Context/PostContext";
import { useContext } from "react";

export const usePostsContext = () => {
    const context = useContext(PostsContext)

    if (!context){
        throw Error("usePostContext must be used inside the PostsContextProvider")
    }

    return context
}