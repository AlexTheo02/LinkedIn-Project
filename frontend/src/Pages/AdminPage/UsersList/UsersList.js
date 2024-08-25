import React from 'react';
<<<<<<< Updated upstream
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
                        
=======
import s from './UsersListStyle.module.css';
import User from '../User/User';

function UsersList({ users, selectedUsers, handleSelectUser }) {
    return (
        <div className={s.users_list}>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <User userData={user} isSelected={selectedUsers.includes(user._id)} handleSelectUser={handleSelectUser} />
>>>>>>> Stashed changes
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NetworkUsersList;