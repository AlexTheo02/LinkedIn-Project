import React, { useState, useEffect } from 'react';
import s from './NetworkUserStyle.module.css';
import { useAuthContext } from '../../../Hooks/useAuthContext';

function NetworkUser({ id }) {
    const {user} = useAuthContext();
    const [userData, setUserData] = useState(null);

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
    }, [user, id]);

    if (!userData){
        return;
    }

    return (
        <div className={s.network_user}>
            <img src={userData.profilePicture} alt={`${userData.name} ${userData.surname}`} />
            <div className={s.user_info}>
                <b>{userData.name} {userData.surname}</b>
                <b className={s.position}>{userData.workingPosition} at {userData.employmentOrganization}</b>
            </div>
        </div>
    );
}

export default NetworkUser;