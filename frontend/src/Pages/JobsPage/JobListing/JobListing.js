import { useState } from "react";
import s from "./JobListingStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
const {
    string_workingArrangmement,
    string_employmentType
} = require("../functions.js")

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
            <h4 className={s.job_listing_info_bar}>Number of applicants: {job.applicants?.length}</h4>

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

    return (
        <div className={s.job_listing} onClick={() => onClick(job)}>
            {/* Job Listing */}
            <div className={s.job_listing_header}>
                <div className={s.job_title}>
                    {job.title}
                </div>
            </div>
            <div className={s.job_listing_main_body}>
                <div className={s.employer}>{job.employer}</div>

                <p>{job.location} • {string_workingArrangmement(job.workingArrangement)} • {string_employmentType(job.employmentType)}</p>
                
            </div>

            <JobListingFooter job={job}/>
        </div>
    )
}

export default JobListing;