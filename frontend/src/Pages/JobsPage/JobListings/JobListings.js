import { useState, useEffect } from "react";
import JobListing from "../JobListing/JobListing";
import s from "./JobListingsStyle.module.css"
import { useAuthContext } from "../../../Hooks/useAuthContext";
import {useJobsContext} from "../../../Hooks/useJobsContext"

function JobListings({onClick}) {
    const {user} = useAuthContext()
    const {dispatch} = useJobsContext()

    const [jobs, setJobs] = useState(null);

    // Fetch posts from database
    useEffect(() => {
        const fetchJobs = async() => {
            const response = await fetch('/api/jobs', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok){
                setJobs(json);

                const appliedJobsIds = json
                    .filter(job => job.applicants.includes(user.userId))
                    .map(job => job._id);

                dispatch({ type: 'SET_APPLIED_JOBS', payload: appliedJobsIds });
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
                <JobListing key={job._id} job={job} onClick={onClick}/>
            ))}
        </div>
        
    );
}

export default JobListings;