import React from 'react';
import s from './JobInfoStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot, faUserTie, faCalendarDays, faBriefcase, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
const {
    string_workingArrangmement,
    string_employmentType,
    calculate_employeesRange
} = require("../functions.js")

const JobInfo = ({ job, isExpanded, onExit}) => {
    
    // Έλεγχος εγκυρότητας ημερομηνίας
    const isValidDate = !isNaN(new Date(job.createdAt));

    return (
        <div className={`${s.jobInfoContainer} ${isExpanded ? s.expanded : ''}`}>
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className={s.left_arrow} 
                onClick={onExit}
            />
            <h2 className={s.jobTitle}>{job.title}</h2>
            <p className={s.companyName}>{job.employer}</p>
            <p className={s.location}>
                <FontAwesomeIcon icon={faLocationDot} className={s.icon} />
                {job.location}
            </p>
            <p className={s.time_and_applicants}>
                <FontAwesomeIcon icon={faCalendarDays} className={s.icon} />
                {isValidDate ? formatDistanceToNow(new Date(job.createdAt)) : 'Invalid date'} ago • 
                <FontAwesomeIcon icon={faUserTie} className={s.applicants_icon} />
                {job.applicants?.length} applicants
            </p>
            <p className={s.rest_info}>
                <FontAwesomeIcon icon={faBriefcase} className={s.icon} />
                {string_workingArrangmement(job.workingArrangement)} • {string_employmentType(job.employmentType)}
            </p>
            <p className={s.rest_info}>
                <FontAwesomeIcon icon={faBuilding} className={s.icon} />
                {calculate_employeesRange(job.employeesRange)} employees
            </p>

            <div className={s.section}>
                <h3>About the job</h3>
                <p>{job.description}</p>
            </div>
            { job.requirements.length > 0 && 
                <div className={s.section}>
                    <h3>Requirements</h3>
                    <ul>
                        {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
            }
            { job.responsibilities.length > 0 && 
                <div className={s.section}>
                    <h3>Responsibilities</h3>
                    <ul>
                        {job.responsibilities.map((res, index) => (
                            <li key={index}>{res}</li>
                        ))}
                    </ul>
                </div>
            }
            { job.benefits.length > 0 && 
                <div className={s.section}>
                    <h3>Benefits</h3>
                    <ul>
                        {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
            }
            <button className={s.apply_button}>Apply Now</button>
        </div>
    );
};

export default JobInfo;
