import { useState, useEffect } from "react";
import JobListing from "../JobListing/JobListing";
import s from "./JobListingsStyle.module.css"

function JobListings({onClick}) {
    const job1 = {
        title: "Software Engineer",
        employer: "TechCompany",
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
        employer: "InnoTech Solutions",
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
            {/* {jobs && posts.map((job) => (
                <JobListing key={job._id} job={job} onClick={() => onClick(job)}/>
            ))} */}

            <JobListing job={job1} onClick={() => onClick(job1)}/>
            <JobListing job={job2} onClick={() => onClick(job2)}/>
            <JobListing job={job1} onClick={() => onClick(job1)}/>
            <JobListing job={job2} onClick={() => onClick(job2)}/>
            <JobListing job={job1} onClick={() => onClick(job1)}/>
            <JobListing job={job2} onClick={() => onClick(job2)}/>
            <JobListing job={job1} onClick={() => onClick(job1)}/>
            <JobListing job={job2} onClick={() => onClick(job2)}/>
            
        </div>
        
    );
}

export default JobListings;