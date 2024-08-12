import { useState, useEffect } from "react";
import JobListing from "../JobListing/JobListing";
import s from "./JobListingsStyle.module.css"
import { useAuthContext } from "../../../Hooks/useAuthContext";

function JobListings({onClick}) {
    const {user} = useAuthContext()

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
            }
        }

        if (user){
            fetchJobs()
        }
        
        // filter jobs for user's timeline
    }, [user])


    return(
        <div className={s.jobs}>
            {jobs && jobs.map((job) => (
                <JobListing key={job._id} job={job} onClick={onClick}/>
            ))}
        </div>
        
    );
}

export default JobListings;