import { useState, useEffect } from "react";
import JobListing from "../JobListing/JobListing";
import s from "./JobListingsStyle.module.css"

function JobListings({onClick}) {

    const [jobs, setJobs] = useState(null);

    // Fetch posts from database
    useEffect(() => {
        const fetchJobs = async() => {
            const response = await fetch('/api/jobs');
            const json = await response.json();

            if (response.ok){
                setJobs(json);
            }
        }

        fetchJobs()

        // filter jobs for user's timeline
    }, [])


    return(
        <div className={s.jobs}>
            {jobs && jobs.map((job) => (
                <JobListing key={job._id} job={job} onClick={onClick}/>
            ))}
        </div>
        
    );
}

export default JobListings;