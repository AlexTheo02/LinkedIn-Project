import React from 'react';
import s from './JobInfoStyle.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLocationDot, faUserTie, faCalendarDays, faBriefcase, faBuilding, faCheck } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { useJobsContext } from '../../../Hooks/useJobsContext.js';
import { useApplication } from '../../../Hooks/useApplication.js';
const {
    string_workingArrangmement,
    string_employmentType,
    calculate_employeesRange
} = require("../functions.js")

const JobInfo = ({isExpanded, onExit}) => {
    const {appliedJobs, activeJob} = useJobsContext();
    const {handleApplyClick, handleRemoveApplyClick, isLoading} = useApplication();
    
    if (!activeJob){
        return;
    }

    const isApplied = appliedJobs.includes(activeJob._id)
    
    // Έλεγχος εγκυρότητας ημερομηνίας
    const isValidDate = !isNaN(new Date(activeJob.createdAt));

    return (
        <div className={`${s.jobInfoContainer} ${isExpanded ? s.expanded : ''}`}>
            <FontAwesomeIcon 
                icon={faArrowLeft} 
                className={s.left_arrow} 
                onClick={onExit}
            />
            <h2 className={s.jobTitle}>{activeJob.title}</h2>
            <p className={s.companyName}>{activeJob.employer}</p>
            <p className={s.location}>
                <FontAwesomeIcon icon={faLocationDot} className={s.icon} />
                {activeJob.location}
            </p>
            <p className={s.time_and_applicants}>
                <FontAwesomeIcon icon={faCalendarDays} className={s.icon} />
                {isValidDate ? formatDistanceToNow(new Date(activeJob.createdAt)) : 'Invalid date'} ago • 
                <FontAwesomeIcon icon={faUserTie} className={s.applicants_icon} />
                {activeJob.applicants.length} applicants
            </p>
            <p className={s.rest_info}>
                <FontAwesomeIcon icon={faBriefcase} className={s.icon} />
                {string_workingArrangmement(activeJob.workingArrangement)} • {string_employmentType(activeJob.employmentType)}
            </p>
            <p className={s.rest_info}>
                <FontAwesomeIcon icon={faBuilding} className={s.icon} />
                {calculate_employeesRange(activeJob.employeesRange)} employees
            </p>

            <div className={s.section}>
                <h3>About the job</h3>
                <p>{activeJob.description}</p>
            </div>
            { activeJob.requirements.length > 0 && 
                <div className={s.section}>
                    <h3>Requirements</h3>
                    <ul>
                        {activeJob.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
            }
            { activeJob.responsibilities.length > 0 && 
                <div className={s.section}>
                    <h3>Responsibilities</h3>
                    <ul>
                        {activeJob.responsibilities.map((res, index) => (
                            <li key={index}>{res}</li>
                        ))}
                    </ul>
                </div>
            }
            { activeJob.benefits.length > 0 && 
                <div className={s.section}>
                    <h3>Benefits</h3>
                    <ul>
                        {activeJob.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
            }
            <button
                disabled={isLoading}
                className={`${s.apply_button} ${isApplied ? s.applied : ""}`}
                onClick={isApplied ? (event) => {handleRemoveApplyClick({targetJob: activeJob})} : (event) => {handleApplyClick({targetJob: activeJob})}}
                >
                {isApplied ? <>Applied <FontAwesomeIcon icon={faCheck}/> </>: <>Apply Now</>}
            </button>
        </div>
    );
};

export default JobInfo;
