import React, { useState, useEffect } from 'react';
import s from "./LinkUpRequestStyle.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

function LinkUpRequest({ id, onAccept }) {
    const navigate = useNavigate();

    const {user} = useAuthContext();
    const [userData, setUserData] = useState(null)
    const [isConnectionLoading, setIsConnectionLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isDeclined, setIsDeclined] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                
                if (response.ok){
                    setUserData(data);
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    if (!userData) {
        return;
    }

    const handleAccept = async () => {
        setIsConnectionLoading(true);
        try {
            const response = await fetch(`/api/users/acceptRequest/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                console.log('Request accepted successfully');
                onAccept(userData);
                setIsAccepted(true);
            } else {
                console.error('Error accepting the request');
            }
        } catch (error) {
            console.error('Error accepting the request:', error);
        }
        setIsConnectionLoading(false);
    }

    const handleDecline = async () => {
        setIsConnectionLoading(true);
        try {
            const response = await fetch(`/api/users/declineRequest/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                console.log('Request declined successfully');
                setIsDeclined(true);
            } else {
                console.error('Error accepting the request');
            }
        } catch (error) {
            console.error('Error accepting the request:', error);
        }
        setIsConnectionLoading(false);
    }

    const handleLearnMore = () => {
        navigate(`/Profile/${id}`);
    }

    return (
        <div className={s.profile_container}>
            <img src={userData.profilePicture} alt="Profile" className={s.profile_picture}/>
            <h3>{userData.name} {userData.surname}</h3>
            <p>{userData.workingPosition} at {userData.employmentOrganization}</p>
            { !isAccepted && !isDeclined && (
                <>
                    <button disabled={isConnectionLoading} className={s.accept_button} onClick={handleAccept}>Accept</button>
                    <button disabled={isConnectionLoading} className={s.decline_button} onClick={handleDecline}>Decline</button>
                </>
            )}
            { isAccepted &&
                <div className={s.accepted}>
                    <b>Accepted</b>
                </div>
            }
            { isDeclined &&
                <div className={s.declined}>
                    <b>Declined</b>
                </div>
            }
            <div className={s.learn_more_field} onClick={handleLearnMore}>
                <p>Learn More About Me</p>
                <FontAwesomeIcon icon={faAngleDown} className={s.angle_down} />
            </div>
        </div>
    );
}

export default LinkUpRequest;
