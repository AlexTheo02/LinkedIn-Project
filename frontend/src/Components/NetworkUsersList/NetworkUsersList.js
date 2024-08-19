import React from 'react';
import s from './NetworkUsersListStyle.module.css';
import NetworkUser from './NetworkUser/NetworkUser';
import { useNavigate } from 'react-router-dom';

function NetworkUsersList({ network }) {
    const navigate = useNavigate();

    const handleNetworkUserClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };

    return (
        <div className={s.users_list}>
            <ul>
                {network.map((connected_user_id, index) => (
                    <li key={index} onClick={() => handleNetworkUserClick(connected_user_id)}>
                        <NetworkUser id={connected_user_id} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NetworkUsersList;