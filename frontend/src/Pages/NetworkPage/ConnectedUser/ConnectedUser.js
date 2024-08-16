import React, { useState, useEffect } from 'react';
import s from "./ConnectedUserStyle.module.css";
import { useAuthContext } from '../../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

function ConnectedUser({ id }) {
    const {user} = useAuthContext();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/users/${id}`,{
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    const data = await response.json();
                    setUserData(data);

                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        }
    }, [id, user]);

    if (!userData){
        return;
    }

    const handleNetworkUserClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };
    
    return (
        <div className={s.profile_container}  onClick={() => handleNetworkUserClick(userData._id)}>
            <img src={userData.profilePicture} alt="Profile" className={s.profile_picture} />
            <h3>{userData.name} {userData.surname}</h3>
            <p>{userData.workingPosition} at {userData.employmentOrganization}</p>
        </div>
    );
}

export default ConnectedUser;
