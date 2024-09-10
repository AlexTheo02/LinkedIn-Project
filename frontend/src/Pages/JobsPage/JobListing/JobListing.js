import s from "./JobListingStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useJobsContext } from "../../../Hooks/useJobsContext.js";
import { useApplication } from "../../../Hooks/useApplication.js";
const {
    string_workingArrangmement,
    string_employmentType
} = require("../functions.js")

const JobListingFooter = ({ job }) => {
    const {appliedJobs} = useJobsContext();
    const {handleApplyClick, handleRemoveApplyClick, isLoading} = useApplication();

    const isApplied = appliedJobs.includes(job._id)

    return (
        <div className={s.job_listing_footer}>
            {/* Footer */}
            <h4 className={s.job_listing_info_bar}>Number of applicants: {job.applicants.length}</h4>

            <div className={s.job_listing_interaction_bar}>
                {/* Interaction Bar */}
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