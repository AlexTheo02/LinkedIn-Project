import s from "./JobListingStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { useJobsContext } from "../../../Hooks/useJobsContext.js";
import { useApplication } from "../../../Hooks/useApplication.js";
import {useAuthContext} from "../../../Hooks/useAuthContext.js";

const {
    string_workingArrangmement,
    string_employmentType
} = require("../functions.js")

const JobListingFooter = ({ job, onApplicantsClick }) => {
    const {appliedJobs} = useJobsContext();
    const {handleApplyClick, handleRemoveApplyClick, isLoading} = useApplication();
    const {user} = useAuthContext()

    const isApplied = appliedJobs.includes(job._id)

    return (
        <div className={s.job_listing_footer}>
            {/* Footer */}
            <h4 className={s.job_listing_info_bar}>Number of applicants: {job.applicants.length}</h4>

            <div className={s.job_listing_interaction_bar}>
                {/* Interaction Bar */}
                {job.author === user.userId
                ?
                    <button onClick={(event) => {event.stopPropagation(); onApplicantsClick(job.applicants)}} className={s.applicants_button}>   
                        Applicants <FontAwesomeIcon icon={faUser}/>
                    </button>
                :
                    <button
                        disabled={isLoading}
                        className={`${s.job_listing_button} ${isApplied ? s.applied : ""}`}
                        onClick={isApplied ?
                            (event) => {event.stopPropagation(); handleRemoveApplyClick({targetJob: job})}
                        :
                            (event) => {event.stopPropagation(); handleApplyClick({targetJob: job})}}
                    >
                        {isApplied ? <>Applied <FontAwesomeIcon icon={faCheck}/> </>: <>Apply </>}
                    </button>
                }
            </div>

        </div>
    )
}

const JobListing = ({job, onClick, onApplicantsClick}) => {

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

            <JobListingFooter job={job} onApplicantsClick={onApplicantsClick}/>
        </div>
    )
}

export default JobListing;