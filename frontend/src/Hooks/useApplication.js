import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useJobsContext } from "./useJobsContext";

export const useApplication = () => {
    const {user} = useAuthContext()
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useJobsContext();

    const handleApplyClick = async ({targetJob}) => {
        setIsLoading(true);
        
        try {
            // Add applicant to job's data
            const jobResponse = await fetch(`/api/jobs/addApplicant/${targetJob._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (jobResponse.ok) {
                try {
                    // Add job to user's applied jobs
                    const userResponse = await fetch(`/api/users/applyJob/${targetJob._id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
            
                    if (userResponse.ok) {
                        const newApplicants = [user.userId, ...targetJob.applicants];
                        dispatch({ type: 'UPDATE_JOB_APPLICANTS', payload: {jobId: targetJob._id, newApplicants: newApplicants}});
                        dispatch({ type: 'APPLY_JOB', payload: targetJob._id});
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

        // Log the interaction on the user's jobInteractions table
        const response = await fetch(`/api/users/log-job-interaction/${targetJob._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                'Authorization': `Bearer ${user.token}`
            },
        });
        
        if (!response.ok){
            const json = await response.json()
            console.error("Error:", json)
        }

        setIsLoading(false);
    }

    const handleRemoveApplyClick = async ({targetJob}) => {
        setIsLoading(true);

        try {
            // Remove applicant to job's data
            const jobResponse = await fetch(`/api/jobs/removeApplicant/${targetJob._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (jobResponse.ok) {
                try {
                    // Remove job from user's applied jobs
                    const userResponse = await fetch(`/api/users/removeApplyjob/${targetJob._id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
            
                    if (userResponse.ok) {
                        const newApplicants = targetJob.applicants.filter(applicant => applicant !== user.userId);
                        dispatch({ type: 'UPDATE_JOB_APPLICANTS', payload: {jobId: targetJob._id, newApplicants: newApplicants}});
                        dispatch({ type: 'REMOVE_APPLICATION', payload: targetJob._id });

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

        // Log the interaction on the user's jobInteractions table
        const response = await fetch(`/api/users/log-job-interaction/${targetJob._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type" : "application/json",
                'Authorization': `Bearer ${user.token}`
            },
        });
        
        if (!response.ok){
            const json = await response.json()
            console.error("Error:", json)
        }

        setIsLoading(false);
    }

    return {handleApplyClick, handleRemoveApplyClick, isLoading};
}