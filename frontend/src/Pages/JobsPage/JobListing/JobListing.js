import { useState } from "react";
import s from "./JobListingStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const JobListingFooter = ({ job }) => {

    // Move state to Job, not on footer only
    const [isApplied, setIsApplied] = useState(false);

    const handleApplyClick = (event) => {
        event.stopPropagation();
        // Toggle state
        setIsApplied(!isApplied);
        // Add user to applicants
    }

    return (
        <div className={s.job_listing_footer}>
            {/* Footer */}
            <div className={s.job_listing_info_bar}>
                Number of applicants: 4
            </div>

            <div className={s.job_listing_interaction_bar}>
                {/* Interaction Bar */}
                {/* Add id to applied */}
                <button className={`${s.job_listing_button} ${isApplied ? s.applied : ""}`} onClick={handleApplyClick}>
                    {isApplied ? <>Applied <FontAwesomeIcon icon={faCheck}/> </>: <>Apply </>}
                </button>
            </div>

        </div>
    )
}

const JobListing = ({job, onClick}) => {
    // Fetch data from db

    const jobTitle = "Secretary"
    const employer = "National and Kapodistrian University of Athens"
    const location = "Athens, Greece"
    const workingArrangement = "(On-site)"
    const workingHours = "Full-time"

    return (
        <div className={s.job_listing} onClick={onClick}>
            {/* Job Listing */}
            <div className={s.job_listing_header}>
                <div className={s.job_title}>
                    {jobTitle}
                </div>
            </div>
            <div className={s.job_listing_main_body}>
                <div className={s.employer}>{employer}</div>

                <p>{location} • {workingArrangement} • {workingHours}</p>
                
            </div>

            <JobListingFooter job={job}/>
        </div>
    )
}

export default JobListing;