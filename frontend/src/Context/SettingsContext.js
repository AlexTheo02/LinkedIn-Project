import { createContext, useReducer } from "react";

export const SettingsContext = createContext()

export const settingsReducer = (state, action) => {
    switch (action.type){
        case 'SET_IS_CONFIRMING_PASSWORD':
            return {
                ...state,
                isConfirmingPassword: action.payload
            }
        case 'SET_IS_EMAIL_CHANGING':
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

export const SettingsContextProvider = ( {children} ) => {
    const [state, settingsDispatch] = useReducer(settingsReducer, {
        isConfirmingPassword: true,

        isEmailChanging: false,
        initialEmail: "",
        previousEmail: "",
        currentEmail: "",

        isPasswordChanging: false,
        initialPassword: "",
        previousPassword: "",
        currentPassword: "",
        isPasswordVisible: false,

    })

    return(
        <SettingsContext.Provider value={{...state, settingsDispatch}}>
            {children}
        </SettingsContext.Provider>
    )
}