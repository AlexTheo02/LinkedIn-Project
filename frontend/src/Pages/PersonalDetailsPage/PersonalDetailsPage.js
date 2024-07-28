import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import s from './PersonalDetailsPageStyle.module.css';

import NavBar from './../../Components/NavBar/NavBar.js';

function PersonalDetails() {
    const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));
    const [name, setName] = useState('Kostas');
    const [surname, setSurname] = useState('Loulos');
    const [phoneNumber, setPhoneNumber] = useState('123456');
    const [workingPosition, setWorkingPosition] = useState('');
    const [employmentOrganization, setEmploymentOrganization] = useState('');
    const [location, setLocation] = useState('');
    const [experience, setExperience] = useState('');
    const [education, setEducation] = useState('');
    const [skills, setSkills] = useState('');

    const [isPhonePublic, setIsPhonePublic] = useState(false);
    const [isLocationPublic, setIsLocationPublic] = useState(true);
    const [isExperiencePublic, setIsExperiencePublic] = useState(true);
    const [isEducationPublic, setIsEducationPublic] = useState(true);
    const [isSkillsPublic, setIsSkillsPublic] = useState(true);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            <NavBar />
            <div className={s.background_image}>
                <div className={s.profile_container}>
                    <div className={s.profile_field} id="profileField">
                        <img src={profilePic} alt="Profile" id="profilePic" />
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
                        <div className={s.label_with_icon}>
                            <label htmlFor="phoneNumberInput">Phone Number</label>
                            <div className={s.icons_container}>
                                <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                <FontAwesomeIcon
                                    icon={isPhonePublic ? faToggleOn : faToggleOff}
                                    className={s.toggle_icon}
                                    onClick={() => setIsPhonePublic(!isPhonePublic)}
                                    title= {isPhonePublic ? 'Set to private' : 'Set to public'}
                                />
                                <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                            </div>
                        </div>
                        <input
                            type="tel"
                            id="phoneNumberInput"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="workingPositionInput">Working Position</label>
                        <input
                            type="text"
                            id="workingPositionInput"
                            value={workingPosition}
                            onChange={(e) => setWorkingPosition(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="employmentOrganizationInput">Employment Organization</label>
                        <input
                            type="text"
                            id="employmentOrganizationInput"
                            value={employmentOrganization}
                            onChange={(e) => setEmploymentOrganization(e.target.value)}
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="locationInput">Place Of Residence</label>
                            <div className={s.icons_container}>
                                <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                <FontAwesomeIcon
                                    icon={isLocationPublic ? faToggleOn : faToggleOff}
                                    className={s.toggle_icon}
                                    onClick={() => setIsLocationPublic(!isLocationPublic)}
                                    title= {isLocationPublic ? 'Set to private' : 'Set to public'}
                                />
                                <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                            </div>
                        </div>
                        <textarea
                            id="locationInput"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            rows="1"
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="experienceInput">Professional Experience</label>
                            <div className={s.icons_container}>
                                <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                <FontAwesomeIcon
                                    icon={isExperiencePublic ? faToggleOn : faToggleOff}
                                    className={s.toggle_icon}
                                    onClick={() => setIsExperiencePublic(!isExperiencePublic)}
                                    title= {isExperiencePublic ? 'Set to private' : 'Set to public'}
                                />
                                <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                            </div>
                        </div>
                        <textarea
                            id="experienceInput"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows="4"
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="educationInput">Education</label>
                            <div className={s.icons_container}>
                                <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                <FontAwesomeIcon
                                    icon={isEducationPublic ? faToggleOn : faToggleOff}
                                    className={s.toggle_icon}
                                    onClick={() => setIsEducationPublic(!isEducationPublic)}
                                    title= {isEducationPublic ? 'Set to private' : 'Set to public'}
                                />
                                <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                            </div>
                        </div>
                        <textarea
                            id="educationInput"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            rows="4"
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="skillsInput">Skills</label>
                            <div className={s.icons_container}>
                                <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                <FontAwesomeIcon
                                    icon={isSkillsPublic ? faToggleOn : faToggleOff}
                                    className={s.toggle_icon}
                                    onClick={() => setIsSkillsPublic(!isSkillsPublic)}
                                    title= {isSkillsPublic ? 'Set to private' : 'Set to public'}
                                />
                                <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                            </div>
                        </div>
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
