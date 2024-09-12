import { useEffect } from "react";
import JobListing from "../JobListing/JobListing";
import s from "./JobListingsStyle.module.css"
import { useAuthContext } from "../../../Hooks/useAuthContext";
import {useJobsContext} from "../../../Hooks/useJobsContext"

function JobListings({onClick, onApplicantsClick}) {
    const {user} = useAuthContext()
    const {jobs, dispatch} = useJobsContext()


    // Fetch posts from database
    useEffect(() => {
        const fetchJobs = async() => {
            const response = await fetch('/api/jobs/get-tailored-jobs', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();
            
            if (response.ok){
                const appliedJobsIds = json
                    .filter(job => job.applicants.includes(user.userId))
                    .map(job => job._id);

                dispatch({ type: 'SET_APPLIED_JOBS', payload: appliedJobsIds });
                dispatch({type: 'SET_JOBS', payload: json})
            }
        }

        if (user){
            fetchJobs()
        }
        
        // filter jobs for user's timeline
    }, [dispatch, user])

    return(
        <div className={s.jobs}>
            {jobs && jobs.map((job) => (
                <JobListing key={job._id} job={job} onClick={() => { onClick(job) }} onApplicantsClick={onApplicantsClick}/>
            ))}
        </div>
        
    );
}

export default JobListings;