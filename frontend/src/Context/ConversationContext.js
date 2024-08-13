import { createContext, useReducer } from "react";

export const ConversationContext = createContext()

export const conversationReducer = (state, action) => {
    switch (action.type){
        case 'SET_CONVERSATIONS':
            return {
                conversations: action.payload
            }
        case 'CREATE_CONVERSATION':
            return {
                conversations: [action.payload, ...state.conversations]
            }
        default:
            return state
    }
}

export const ConversationContextProvider = ( {children} ) => {
    const [state, conversationDispatch] = useReducer(conversationReducer, {
        conversations: []
    })

    return(
        <ConversationContext.Provider value={{...state, conversationDispatch}}>
            {children}
        </ConversationContext.Provider>
    )
}