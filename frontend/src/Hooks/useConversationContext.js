import { ConversationContext } from "../Context/ConversationContext";
import { useContext } from "react";

export const useConversationContext = () => {
    const context = useContext(ConversationContext)

    if (!context){
        throw Error("useConversationContext must be used inside the ConversationContextProvider")
    }

    return context
}