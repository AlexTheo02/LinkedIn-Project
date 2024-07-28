import React from 'react';
import s from "./LinkUpRequestStyle.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

function LinkUpRequest({ name, position }) {
    const profilePic = require('./../../../Images/profile_ergasiaSite.png');

    return (
        <div className={s.profile_container}>
            <img src={profilePic} alt="Profile" className={s.profile_picture}/>
            <h3>{name}</h3>
            <p>{position}</p>
            <button className={s.accept_button}>Accept</button>
            <button className={s.decline_button}>Decline</button>
            <div className={s.learn_more_field}>
                <p>Learn More About Me</p>
                <FontAwesomeIcon icon={faAngleDown} className={s.angle_down} />
            </div>
        </div>
    );
}

export default LinkUpRequest;
