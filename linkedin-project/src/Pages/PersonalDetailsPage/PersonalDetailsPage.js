import React, { useState } from 'react';
import s from './PersonalDetailsPageStyle.module.css';

import NavBar from './../../Components/NavBar/NavBar.js';

function PersonalDetails() {
    const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));
    const [name, setName] = useState('Kostas');
    const [surname, setSurname] = useState('Loulos');
    const [phoneNumber, setPhoneNumber] = useState('123456');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            <NavBar></NavBar>
            <div className={s.background_image}>
                <div className={s.profile_container}>
                    <div className={s.profile_field} id="profileField">
                        <img src={profilePic} alt="Profile Picture" id="profilePic" />
                        <label htmlFor="inputImage">New profile picture</label>
                        <input
                            type="file"
                            className={s.picture_input}
                            placeholder="Upload Photo"
                            accept="image/jpeg, image/png, image/jpg"
                            id="inputImage"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="nameInput">Name</label>
                        <input
                            type="text"
                            id="nameInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="surnameInput">Surname</label>
                        <input
                            type="text"
                            id="surnameInput"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="phoneNumberInput">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumberInput"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="experienceInput">Professional Experience</label>
                        <textarea
                            id="experienceInput"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows="4"
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="educationInput">Education</label>
                        <textarea
                            id="educationInput"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            rows="4"
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="skillsInput">Skills</label>
                        <textarea
                            id="skillsInput"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            rows="4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalDetails;
