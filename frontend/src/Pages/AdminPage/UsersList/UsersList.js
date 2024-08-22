import React from 'react';
import s from './UsersListStyle.module.css';
import { useNavigate } from 'react-router-dom';
import User from '../User/User';

function UsersList({ users }) {
    const navigate = useNavigate();

    return (
        <div className={s.users_list}>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <User user={user} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersList;