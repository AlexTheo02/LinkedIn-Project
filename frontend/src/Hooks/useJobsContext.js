import { JobsContext } from "../Context/JobsContext";
import { useContext } from "react";

export const useJobsContext = () => {
    const context = useContext(JobsContext)

    if (!context){
        throw Error("useJobsContext must be used inside the JobsContextProvider")
    }

    return context
}