import React from 'react';
import s from "./ConnectedUserStyle.module.css";

function ConnectedUser({ name, surname, workingPosition, employmentOrganization, profilePic }) {
    console.log("Profile Pic URL:", profilePic); // Έλεγχος εάν η URL είναι σωστή
    return (
        <div className={s.profile_container}>
            <img src={profilePic} alt="Profile" className={s.profile_picture} />
            <h3>{name} {surname}</h3>
            <p>{workingPosition} at {employmentOrganization}</p>
        </div>
    );
}

export default ConnectedUser;
