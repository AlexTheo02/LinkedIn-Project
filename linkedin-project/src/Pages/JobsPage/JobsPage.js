import { useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import s from "./JobsPageStyle.module.css";

const CreateJobListing = () => {
    return(
        <div className={s.create_job_listing}>
            Create Job Listing
        </div>
    )
}

const JobListingFooter = ({jobListing_id}) => {

    return (
        <div className={s.job_listing_footer}>
            Footer
            <div className={s.job_listing_info_bar}>
                Info Bar
            </div>

            <div className={s.job_listing_interaction_bar}>
                Interaction Bar
            </div>

        </div>
    )
}

const JobListing = ({jobListing_id, onClick}) => {
    // Fetch data from db

    return (
        <div className={s.job_listing} onClick={onClick}>
            Job Listing
            <div className={s.job_listing_header}>
                Header
            </div>

            <div className={s.job_listing_main_body}>
                Main Body
            </div>

            <JobListingFooter jobListing_id={jobListing_id}/>
        </div>
    )
}

const JobListingInfo = ({selectedJobListing, isExpanded}) => {

    return (
        <div className={`${s.job_listing_info} ${isExpanded ? s.job_listing_info_expanded : undefined}`}>
            Job Listing Info for jobListing_id: {selectedJobListing}
        </div>
    )
}

function JobsPage(){

    const [showingMoreInfo, setShowingMoreInfo] = useState(false);
    const [selectedJobListing, setSelectedJobListing] = useState(null);

    // Create handler struct and pass it into each job listing
    // Handler will contain selected job listing, is showing, is not showing ...

    const handleJobClick = (jobListing_id) => {
        setSelectedJobListing(jobListing_id);
        setShowingMoreInfo(true);
    }

    const jobListing_id = 3;
    const altJobListing_id = 2;

    return(
        <div className={s.jobs_page}>
            <NavBar />
            <div className={s.jobs_page_content_container}>
            <button onClick={() => {setShowingMoreInfo(false); setSelectedJobListing(null);}}>
                collapse
            </button>
                <div className={`${s.jobs_timeline} ${showingMoreInfo ? s.jobs_timeline_expanded : undefined}`}>
                    Timeline
                    <CreateJobListing />

                    {/* Use .map of job listings list, jobListing_id and handleJob... id  MUST BE THE SAME */}
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    <JobListing jobListing_id={altJobListing_id} onClick={() => {handleJobClick(altJobListing_id)}}/>
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    <JobListing jobListing_id={jobListing_id} onClick={() => {handleJobClick(jobListing_id)}}/>
                    
                </div>
                <JobListingInfo selectedJobListing={selectedJobListing} isExpanded={showingMoreInfo}/>
            </div>
        </div>
    );
}

export default JobsPage;