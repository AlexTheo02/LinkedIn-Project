import React, { useState, useEffect } from 'react';
import s from "./GridViewUsersStyle.module.css";
import ConnectedUser from '../ConnectedUser/ConnectedUser';
import { useAuthContext } from '../../../Hooks/useAuthContext';

function GridViewUsers() {
    const { user } = useAuthContext();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/users/${user.userId}`, {
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
    }, [user]);

    if (!userData) {
        return <h1 className={s.loading_text}>Loading...</h1>;
    }

    return userData.network.length > 0 ? (
        <div className={s.grid_container}>
            {userData.network.map((connected_user_id) => (
                <div className={s.grid_item} key={connected_user_id}>
                    <ConnectedUser 
                        id={connected_user_id}
                    />
                </div>
            ))}
        </div>
    ) : (
        <div className={s.empty_network}>
            <h3>You haven't connected with any other user yet</h3>
        </div>
    );
}

export default GridViewUsers;
