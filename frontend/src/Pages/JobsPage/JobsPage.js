import { useState } from "react";
import NavBar from "../../Components/NavBar/NavBar";
import s from "./JobsPageStyle.module.css";
import JobInfo from './JobInfo/JobInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import CreateJobListing from './CreateJobListing/CreateJobListing'

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

                <div>{location} • {workingArrangement} • {workingHours}</div>
                
            </div>

            <JobListingFooter job={job}/>
        </div>
    )
}

function JobsPage(){

    const job1 = {
        title: "Software Engineer",
        company: "TechCompany",
        location: "New York, NY",
        description: "TechCompany is seeking a skilled Software Engineer to join our innovative and dynamic team in New York. The successful candidate will be responsible for developing and maintaining high-quality web applications using cutting-edge technologies. This is an exciting opportunity to work in a collaborative environment, where you will have the chance to shape the future of our product line and enhance your skills in a supportive setting.",
        requirements: [
            "Bachelor's degree in Computer Science or related field",
            "3+ years of experience in software development",
            "Proficiency in JavaScript and React",
            "Experience with version control systems (e.g., Git)",
            "Strong problem-solving skills and attention to detail"
        ],
        benefits: [
            "Health insurance",
            "Paid time off",
            "Flexible working hours",
            "Professional development and training",
            "401(k) matching"
        ],
        responsibilities: [
            "Develop and maintain web applications using JavaScript and React.",
            "Collaborate with cross-functional teams to define and design new features.",
            "Participate in code reviews and ensure best practices are followed.",
            "Identify and resolve performance and scalability issues.",
            "Stay up-to-date with emerging trends in software development"
        ],
        timestamp: "2024-07-26T10:00:00Z",
        applicantsNumber: 12,
        workingArrangement: "On site",
        employmentType: "Full Time",
        employeesNumber: 1500,          /* Change to: Employees Range */
        
    };
    
    const job2 = {
        title: "Product Manager",
        company: "InnoTech Solutions",
        location: "San Francisco, CA",
        description: "InnoTech Solutions is on the lookout for a highly motivated and experienced Product Manager to drive our product development efforts. As a key member of our leadership team, you will oversee the entire product lifecycle, from ideation through to launch and post-launch analysis. The ideal candidate will bring a strong understanding of market trends and customer needs, leveraging this knowledge to guide product strategy and development. This role requires a strategic thinker with excellent communication skills, capable of leading cross-functional teams to deliver innovative solutions that meet our business objectives.",
        requirements: [
            "Bachelor's degree in Business, Marketing, or related field",
            "5+ years of experience in product management",
            "Strong analytical and problem-solving skills",
            "Experience with Agile methodologies",
            "Excellent communication and leadership skills"
        ],
        benefits: [
            "Comprehensive health and dental insurance",
            "Stock options",
            "Gym membership",
            "Professional development opportunities",
            "Flexible work schedule"
        ],
        responsibilities: [
            "Define product vision, roadmap, and growth opportunities.",
            "Manage the product lifecycle from concept to launch.",
            "Collaborate with engineering, design, and marketing teams.",
            "Conduct market research and user feedback analysis to inform product decisions.",
            "Monitor and analyze product performance metrics"
        ],
        timestamp: "2024-07-25T15:30:00Z",
        applicantsNumber: 8,
        workingArrangement: "Remote",
        employmentType: "Part Time",
        employeesNumber: 250,       /* Change to: Employees Range */
        isApplied: false
    };

    const [showingMoreInfo, setShowingMoreInfo] = useState(false);
    const [selectedJob, setSelectedJob] = useState(job1);
    const [isCreatingJob, setIsCreatingJob] = useState(false);

    // Create handler struct and pass it into each job listing
    // Handler will contain selected job listing, is showing, is not showing ...

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setShowingMoreInfo(true);
    }

    const handleCreateJobClick = () => {
        setShowingMoreInfo(false);
        setSelectedJob(job1);
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
            <NavBar />
            <div className={s.jobs_page_content_container}>
                <div className={`${s.jobs_timeline} ${showingMoreInfo ? s.jobs_timeline_expanded : undefined}`}>
                    <div className={s.jobs_timeline_header}>
                        {isCreatingJob ? 
                        <>
                            Create Job Listing
                        </> 
                        : 
                        <>
                            Available Jobs
                            <button className={s.job_listing_button} onClick={handleCreateJobClick}>
                                Create Job Listing
                            </button>
                        </>
                        }
                    </div>

                    {isCreatingJob ?
                        <CreateJobListing jobListingsHandler={jobListingsHandler}/>
                        :
                        <div className={s.job_listings_container}>
                            {/* Use .map of job listings list, jobListing_id and handleJob... id  MUST BE THE SAME */}
                            <JobListing job={job1} onClick={() => {handleJobClick(job1)}}/>
                            <JobListing job={job2} onClick={() => {handleJobClick(job2)}}/>
                            <JobListing job={job1} onClick={() => {handleJobClick(job1)}}/>
                            <JobListing job={job2} onClick={() => {handleJobClick(job2)}}/>
                            <JobListing job={job1} onClick={() => {handleJobClick(job1)}}/>
                            <JobListing job={job2} onClick={() => {handleJobClick(job2)}}/>
                            <JobListing job={job1} onClick={() => {handleJobClick(job1)}}/>
                        </div>
                    }
                        
                </div>
                <JobInfo job={selectedJob} isExpanded={showingMoreInfo} onExit={exitJobInfo}/>
            </div>
        </div>
    );
}

export default JobsPage;
