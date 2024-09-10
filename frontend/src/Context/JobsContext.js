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
        case 'SET_ACTIVE_JOB':
            return {
                ...state,
                activeJob: action.payload
            }
        case 'REMOVE_APPLICATION':
            return {
                ...state,
                appliedJobs: state.appliedJobs.filter(jobId => jobId !== action.payload)
            }
        case 'UPDATE_JOB_APPLICANTS':
            // Update applicants list on specific job
            const jobIndex = state.jobs.findIndex(job => job._id === action.payload.jobId);
            const updatedJobs = state.jobs.map((job, index) => (
                index === jobIndex ? {...job, applicants: action.payload.newApplicants} : job
            ));

        return {
            ...state,
            jobs: updatedJobs,
            activeJob: state.activeJob && state.activeJob._id === action.payload.jobId ? updatedJobs[jobIndex] : state.activeJob
        }
        case 'SET_JOBS':
            return {
                ...state,
                jobs: action.payload
            }
        default:
            return state
    }
}

export const JobsContextProvider = ( {children} ) => {
    const [state, dispatch] = useReducer(jobsReducer, {
        jobs: null,
        appliedJobs: [],
        activeJob: null
    })

    return(
        <JobsContext.Provider value={{...state, dispatch}}>
            {children}
        </JobsContext.Provider>
    )
}