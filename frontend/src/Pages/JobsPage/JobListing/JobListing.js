import { useState } from "react";
import s from "./JobListingStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../../../Hooks/useAuthContext.js";
const {
    string_workingArrangmement,
    string_employmentType
} = require("../functions.js")

const JobListingFooter = ({ job }) => {
    const {user} = useAuthContext();

    // Move state to Job, not on footer only
    const [applyButtonLoading, setConnectButtonLoading] = useState(false)

    const handleApplyClick = async (event) => {
        event.stopPropagation();
        setConnectButtonLoading(true);
        console.log('EEEEEEEEEE1')
        try {
            console.log('EEEEEEEEEE2')
            const jobResponse = await fetch(`/api/jobs/addApplicant/${job._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (jobResponse.ok) {
                console.log('EEEEEEEEEE')
                try {
                    const userResponse = await fetch(`/api/users/applyJob/${job._id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
            
                    if (userResponse.ok) {
                        console.log('User applied the job successfully');
                    } else {
                        console.error('User error applying');
                    }
                } catch (error) {
                    console.error('User error applying:', error);
                }

            } else {
                console.error('Error adding applicant', jobResponse.error);
            }
        } catch (error) {
            console.error('Error adding applicant:', error);
        }

        setConnectButtonLoading(false);
    }

    const handleRemoveApplyClick = async (event) => {
        event.stopPropagation();
        setConnectButtonLoading(true);



        setConnectButtonLoading(false);
    }

    return (
        <div className={s.job_listing_footer}>
            {/* Footer */}
            <h4 className={s.job_listing_info_bar}>Number of applicants: {job.applicants?.length}</h4>

            <div className={s.job_listing_interaction_bar}>
                {/* Interaction Bar */}
                {/* Add id to applied */}
                <button disabled={applyButtonLoading} className={`${s.job_listing_button} ${job.applicants.includes(user.userId) ? s.applied : ""}`} onClick={job.applicants.includes(user.userId) ? handleRemoveApplyClick : handleApplyClick}>
                    {job.applicants.includes(user.userId) ? <>Applied <FontAwesomeIcon icon={faCheck}/> </>: <>Apply </>}
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