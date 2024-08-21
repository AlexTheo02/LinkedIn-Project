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
        case 'SET_ACTIVE_RECEIVER':
            return{
                ...state,
                activeReceiver: action.payload
            }
        case 'UPDATE_CONVERSATIONS':
            const conversation = state.activeConversation;

            // Remove conversation from conversations list
            const filteredConversations = state.conversations.filter(c => c._id !== conversation._id)

            return{
                ...state,
                conversations: [conversation, ...filteredConversations]
            }
        case 'SET_FROM_PROFILE':
            return {
                ...state,
                fromProfile: action.payload
            }
        default:
            return state
    }
}

export const ConversationContextProvider = ( {children} ) => {
    const [state, conversationDispatch] = useReducer(conversationReducer, {
        conversations: [],
        activeConversation: null,
        activeReceiver: {id: "", profilePicture: "", name: "Name", surname: "Surname"},
        fromProfile: false
    })

    return(
        <ConversationContext.Provider value={{...state, conversationDispatch}}>
            {children}
        </ConversationContext.Provider>
    )
}