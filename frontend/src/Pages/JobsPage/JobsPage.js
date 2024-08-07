import { useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import s from "./JobsPageStyle.module.css";
import JobInfo from './JobInfo/JobInfo';
import JobListings from "./JobListings/JobListings";
import CreateJobListing from './CreateJobListing/CreateJobListing'

function JobsPage(){

    const sample_job = {
        title: "",
        employer: "",
        location: "",
        description: "",
        requirements: [],
        benefits: [],
        responsibilities: [],
        timestamp: new Date("January 1, 1900"),
        applicantsNumber: 0,
        workingArrangement: "",
        employmentType: "",
        employeesRange: 0,
    };

    const [showingMoreInfo, setShowingMoreInfo] = useState(false);
    const [selectedJob, setSelectedJob] = useState(sample_job);
    const [isCreatingJob, setIsCreatingJob] = useState(false);

    // Create handler struct and pass it into each job listing
    // Handler will contain selected job listing, is showing, is not showing ...

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setShowingMoreInfo(true);
    }

    const handleCreateJobClick = () => {
        setShowingMoreInfo(false);
        setIsCreatingJob(true);
    }

    const handleCancelCreateJobClick = () => {  
        setIsCreatingJob(false);
    }

    const jobListingsHandler = {
        handleCancel: handleCancelCreateJobClick
    };

    const exitJobInfo = () => {
        setShowingMoreInfo(false);
    }

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
                        <JobListings onClick={handleJobClick} />
                    }
                        
                </div>
                <JobInfo job={selectedJob} isExpanded={showingMoreInfo} onExit={exitJobInfo}/>
            </div>
        </div>
    );
}

export default JobsPage;
