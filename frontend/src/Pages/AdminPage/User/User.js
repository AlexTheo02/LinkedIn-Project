import React, { useState, useEffect } from 'react';
import s from './NetworkUserStyle.module.css';

function User({ user }) {

    const handleUserClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };

    return (
        <div className={s.network_user} onClick={() => handleUserClick(user._id)}>
            <img src={user.profilePicture} alt={`${user.name} ${user.surname}`} />
            <div className={s.user_info}>
                <b>{user.name} {user.surname}</b>
                <b className={s.position}>{user.workingPosition} at {user.employmentOrganization}</b>
            </div>
            <div className={s.contact_info}>
                <p>{user.phoneNumber}</p>
                <b></b>
            </div>
        </div>
    );
}

export default User;