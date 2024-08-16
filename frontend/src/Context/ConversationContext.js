import { createContext, useReducer } from "react";

export const ConversationContext = createContext()

export const conversationReducer = (state, action) => {
    switch (action.type){
        case 'SET_CONVERSATIONS':
            return {
                ...state,
                conversations: action.payload
            }
        case 'CREATE_CONVERSATION':
            return {
                ...state,
                conversations: [action.payload, ...state.conversations]
            }
        case 'SET_ACTIVE_CONVERSATION':
            return {
                ...state,
                activeConversation: action.payload
            }
        case 'SET_RECEIVER':
            return{
                ...state,
                receiver: action.payload
            }
        default:
            return state
    }
}

export const ConversationContextProvider = ( {children} ) => {
    const [state, conversationDispatch] = useReducer(conversationReducer, {
        conversations: [],
        activeConversation: null,
        receiver: {id: "", profilePicture: "", name: "Name", surname: "Surname"}
    })

    return(
        <ConversationContext.Provider value={{...state, conversationDispatch}}>
            {children}
        </ConversationContext.Provider>
    )
}