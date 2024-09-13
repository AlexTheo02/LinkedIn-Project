import { useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import s from "./JobsPageStyle.module.css";
import JobInfo from './JobInfo/JobInfo';
import JobListings from "./JobListings/JobListings";
import CreateJobListing from './CreateJobListing/CreateJobListing'
import { useJobsContext } from "../../Hooks/useJobsContext";
import { useAuthContext } from "../../Hooks/useAuthContext";
import ApplicantsPopup from "./ApplicantsPopup/ApplicantsPopup";

function JobsPage(){
    const [showingMoreInfo, setShowingMoreInfo] = useState(false);
    const [isCreatingJob, setIsCreatingJob] = useState(false);
    const [isApplicantsPopupOpen, setIsApplicantsPopupOpen] = useState(false);
    const [applicants, setApplicants] = useState(null);

    const { dispatch } = useJobsContext();
    const { user } = useAuthContext();

    const handleJobClick = async (job) => {
        dispatch({type: 'SET_ACTIVE_JOB', payload: job});
        setShowingMoreInfo(true);
        const jobId = job._id;

        // Log the interaction on the user's jobInteractions table
        const response = await fetch(`/api/users/log-job-interaction/${jobId}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                'Authorization': `Bearer ${user.token}`
            },
        });

        if (!response.ok){
            const json = await response.json()
            console.log(json)
        }
    }

    const handleCreateJobClick = () => {
        setShowingMoreInfo(false);
        setIsCreatingJob(true);
    }

    const handleCancelCreateJobClick = () => {  
        setIsCreatingJob(false);
    }

    const jobListingsHandler = {
        handleCancel: handleCancelCreateJobClick,
        setIsCreatingJob
    };

    const exitJobInfo = () => {
        setShowingMoreInfo(false);
    }

    const handleApplicantsPopupClose = () => {
        setApplicants(null)
        setIsApplicantsPopupOpen(false);  // Closes the popup
    };

    const handleApplicantsClick = (applicants) => {
        setApplicants(applicants)
        setIsApplicantsPopupOpen(true);  // Opens the popup
    };

    return(
        <div className={s.jobs_page}>
            <NavBar currentPage={"Jobs"}/>
            <div className={s.jobs_page_content_container}>
                <div className={`${s.jobs_timeline} ${showingMoreInfo ? s.jobs_timeline_expanded : undefined}`}>
                    <div className={s.jobs_timeline_header}>
                        {isCreatingJob ? 
                        <>
                            <h2>Create Job Listing</h2>
                            <button className={s.job_listing_button} onClick={handleCancelCreateJobClick}>
                                Cancel
                            </button>

                        </> 
                        : 
                        <>
                            <h2>Available Jobs</h2>
                            <button className={s.job_listing_button} onClick={handleCreateJobClick}>
                                Create Job Listing
                            </button>
                        </>
                        }
                    </div>

                    {isCreatingJob ?
                        <CreateJobListing jobListingsHandler={jobListingsHandler}/>
                        :
                        <JobListings onClick={handleJobClick} onApplicantsClick={handleApplicantsClick} />
                    }
                        
                </div>
                <JobInfo isExpanded={showingMoreInfo} onExit={exitJobInfo} onApplicantsClick={handleApplicantsClick}/>
            </div>

            {isApplicantsPopupOpen && (
                <ApplicantsPopup applicantsData={applicants} onClose={handleApplicantsPopupClose} />
            )}
        </div>
    );
}

export default JobsPage;
