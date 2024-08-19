import { createContext, useReducer } from "react";

export const JobsContext = createContext()

export const jobsReducer = (state, action) => {
    switch (action.type){
        case 'SET_APPLIED_JOBS':
            return {
                ...state,
                appliedJobs: action.payload,
            }
        case 'APPLY_JOB':
            return {
                ...state,
                appliedJobs: [action.payload, ...state.appliedJobs],
            }
        case 'REMOVE_APPLICATION':
            return {
                ...state,
                appliedJobs: state.appliedJobs.filter(jobId => jobId !== action.payload),
            }
        default:
            return state
    }
}

export const JobsContextProvider = ( {children} ) => {
    const [state, dispatch] = useReducer(jobsReducer, {
        appliedJobs: [],
    })

    return(
        <JobsContext.Provider value={{...state, dispatch}}>
            {children}
        </JobsContext.Provider>
    )
}