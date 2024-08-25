import React from 'react';
import s from './UsersListStyle.module.css';
import User from '../User/User';

function UsersList({ users, selectedUsers, handleSelectUser }) {
    return (
        <div className={s.users_list}>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <User userData={user} isSelected={selectedUsers.includes(user._id)} handleSelectUser={handleSelectUser} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList;