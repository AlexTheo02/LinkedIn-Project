import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faUserGroup, faUsers } from '@fortawesome/free-solid-svg-icons';
import s from './PersonalDetailsPageStyle.module.css';
import Select from "react-dropdown-select";
import NavBar from './../../Components/NavBar/NavBar.js';
import "../../Components/SelectStyle.css"
import { useAuthContext } from '../../Hooks/useAuthContext.js';
import ManyInputFields from '../../Components/ManyInputFields/ManyInputFields.js';

const {
    createYearOptions,
    calculateDaysOptions,
    createRange
} = require("../../Components/GeneralFunctions.js")

function PersonalDetails() {
    const [profilePicture, setProfilePicture] = useState("");

    const [profilePic, setProfilePic] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [workingPosition, setWorkingPosition] = useState('');
    const [employmentOrganization, setEmploymentOrganization] = useState('');
    const [placeOfResidence, setPlaceOfResidence] = useState('');
    const [professionalExperience, setProfessionalExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [skills, setSkills] = useState([]);

    const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const yearOptions = createYearOptions();
    const [daysOptions, setDaysOptions] = useState(createRange(31));

    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const [isDateOfBirthPublic, setIsDateOfBirthPublic] = useState(false);
    const [isPhonePublic, setIsPhonePublic] = useState(false);
    const [isPlaceOfResidencePublic, setIsPlaceOfResidencePublic] = useState(true);
    const [isProfessionalExperiencePublic, setIsProfessionalExperiencePublic] = useState(true);
    const [isEducationPublic, setIsEducationPublic] = useState(true);
    const [isSkillsPublic, setIsSkillsPublic] = useState(true);

    const {user} = useAuthContext()
    const [userData, setUserData] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);

    useEffect(() => {
        const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user.userId}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);

                setProfilePic(data.profilePicture);
                setName(data.name);
                setSurname(data.surname);
                setPhoneNumber(data.phoneNumber);
                setWorkingPosition(data.workingPosition);
                setEmploymentOrganization(data.employmentOrganization);
                setPlaceOfResidence(data.placeOfResidence);
                setProfessionalExperience(data.professionalExperience.length === 0 ? [""] : data.professionalExperience);
                setEducation(data.education.length === 0 ? [""] : data.education);
                setSkills(data.skills.length === 0 ? [""] : data.skills);

                const dob = new Date(data.dateOfBirth);
                setDay(dob.getDate());
                setMonth(monthOptions[dob.getMonth()]);
                setYear(dob.getFullYear());

                setIsDateOfBirthPublic(!data.privateDetails.includes("dateOfBirth"));
                setIsPhonePublic(!data.privateDetails.includes("phoneNumber"));
                setIsPlaceOfResidencePublic(!data.privateDetails.includes("placeOfResidence"));
                setIsProfessionalExperiencePublic(!data.privateDetails.includes("professionalExperience"));
                setIsEducationPublic(!data.privateDetails.includes("education"));
                setIsSkillsPublic(!data.privateDetails.includes("skills"))

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    if (!userData) {
        return <h1 className={s.loading_text}>Loading...</h1>;
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file); // actual file
            setProfilePic(URL.createObjectURL(file));
        }
    };

    const handleEditToggle = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setError(null);
        setErrorFields([]);

        setProfilePic(userData.profilePicture);
        setName(userData.name);
        setSurname(userData.surname);
        setPhoneNumber(userData.phoneNumber);
        setWorkingPosition(userData.workingPosition);
        setEmploymentOrganization(userData.employmentOrganization);
        setPlaceOfResidence(userData.placeOfResidence);
        setProfessionalExperience(userData.professionalExperience.length === 0 ? [""] : userData.professionalExperience);
        setEducation(userData.education.length === 0 ? [""] : userData.education);
        setSkills(userData.skills.length === 0 ? [""] : userData.skills);

        const dob = new Date(userData.dateOfBirth);
        setDay(dob.getDate());
        setMonth(monthOptions[dob.getMonth()]);
        setYear(dob.getFullYear());

        setIsDateOfBirthPublic(!userData.privateDetails.includes("dateOfBirth"));
        setIsPhonePublic(!userData.privateDetails.includes("phoneNumber"));
        setIsPlaceOfResidencePublic(!userData.privateDetails.includes("placeOfResidence"));
        setIsProfessionalExperiencePublic(!userData.privateDetails.includes("professionalExperience"));
        setIsEducationPublic(!userData.privateDetails.includes("education"));
        setIsSkillsPublic(!userData.privateDetails.includes("skills"));

        setIsEditing(false);
    };

    const handleSaveChanges = async () => {
        setIsLoading(true);
        setError(null);
        setErrorFields([]);

        console.log(professionalExperience);
        console.log(education);
        console.log(skills);
        
        const professionalExperienceList = professionalExperience.filter(item => item.trim() !== "");
        const educationList = education.filter(item => item.trim() !== "");
        const skillsList = skills.filter(item => item.trim() !== "");

        console.log(professionalExperienceList);
        console.log(educationList);
        console.log(skillsList);

        const formDataPrivateDetails = [
            !isDateOfBirthPublic && "dateOfBirth",
            !isPhonePublic && "phoneNumber",
            !isPlaceOfResidencePublic && "placeOfResidence",
            !isProfessionalExperiencePublic && "professionalExperience",
            !isEducationPublic && "education",
            !isSkillsPublic && "skills"
        ].filter(Boolean)

        const formData = new FormData();
        if (profilePicture !== userData.profilePicture){
            formData.append("file", profilePicture);
        }
        formData.append("name", name);
        formData.append("surname", surname);
        formData.append("phoneNumber", phoneNumber);
        formData.append("workingPosition", workingPosition);
        formData.append("employmentOrganization", employmentOrganization);
        formData.append("placeOfResidence", placeOfResidence);
        formData.append("professionalExperience", JSON.stringify(professionalExperienceList));
        formData.append("education", JSON.stringify(educationList));
        formData.append("skills", JSON.stringify(skillsList));
        formData.append("dateOfBirth", new Date(`${month} ${day}, ${year} 00:00:00 GMT`));
        formData.append("privateDetails", formDataPrivateDetails);

        try {
            const response = await fetch(`/api/users/${user.userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data)
                setError(data.error);
                // setError(data.error)
                setErrorFields(data.errorFields);
            }
            if (response.ok){
                setUserData(data);
                setIsEditing(false);
            }
            
        } catch (error) {
            console.error('Error updating user data:', error);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <NavBar currentPage={"Personal Details"}/>
            <div className={s.background_image}>
                <div className={s.profile_container}>
                    <div className={s.profile_field} id="profileField">
                        <img src={profilePic} alt="Profile" id="profilePic" />
                        {isEditing && (
                            <>
                                <label htmlFor="inputImage">New profile picture</label>
                                <input
                                    type="file"
                                    className={s.picture_input}
                                    placeholder="Upload Photo"
                                    accept="image/jpeg, image/png, image/jpg"
                                    id="inputImage"
                                    onChange={handleImageChange}
                                />
                            </>
                        )}
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="nameInput">Name</label>
                        <input
                            type="text"
                            id="nameInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Name') ? s.error : ''}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="surnameInput">Surname</label>
                        <input
                            type="text"
                            id="surnameInput"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Surname') ? s.error : ''}
                        />
                    </div>
                    <div className={s.date_of_birth}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="day">Date of Birth</label>
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isDateOfBirthPublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsDateOfBirthPublic(!isDateOfBirthPublic)}
                                        title={isDateOfBirthPublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <div className={s.dropdown_row}>
                            <div className={s.side_dropdown}>
                                <Select
                                    onDropdownOpen={() => calculateDaysOptions(month, year, setDaysOptions)}
                                    closeOnClickInput={true}
                                    searchable={false}
                                    options={daysOptions.map(day => ({ label: day, value: day }))}
                                    values={[{ label: day, value: day }]}
                                    onChange={(values) => setDay(values[0].value)}
                                    disabled={!isEditing}
                                    className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                                />
                            </div>

                            <div className={s.middle_dropdown}>
                                <Select
                                    searchable={false}
                                    closeOnClickInput={true}
                                    options={monthOptions.map(month => ({ label: month, value: month }))}
                                    values={[{ label: month, value: month }]}
                                    onChange={(values) => setMonth(values[0].value)}
                                    disabled={!isEditing}
                                    className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                                />
                            </div>
                            
                            <div className={s.side_dropdown}>
                                <Select
                                    searchable={false}
                                    closeOnClickInput={true}
                                    options={yearOptions.map(year => ({ label: year, value: year }))}
                                    values={[{ label: year, value: year }]}
                                    onChange={(values) => setYear(values[0].value)}
                                    disabled={!isEditing}
                                    className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="phoneNumberInput">Phone Number</label>
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isPhonePublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsPhonePublic(!isPhonePublic)}
                                        title={isPhonePublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <input
                            type="tel"
                            id="phoneNumberInput"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Phone Number') ? s.error : ''}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="workingPositionInput">Working Position</label>
                        <input
                            type="text"
                            id="workingPositionInput"
                            value={workingPosition}
                            onChange={(e) => setWorkingPosition(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Working Position') ? s.error : ''}
                        />
                    </div>
                    <div className={s.input_field}>
                        <label htmlFor="employmentOrganizationInput">Employment Organization</label>
                        <input
                            type="text"
                            id="employmentOrganizationInput"
                            value={employmentOrganization}
                            onChange={(e) => setEmploymentOrganization(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Employment Organization') ? s.error : ''}
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="placeOfResidenceInput">Place Of Residence</label>
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isPlaceOfResidencePublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsPlaceOfResidencePublic(!isPlaceOfResidencePublic)}
                                        title={isPlaceOfResidencePublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <input
                            id="placeOfResidenceInput"
                            value={placeOfResidence}
                            onChange={(e) => setPlaceOfResidence(e.target.value)}
                            disabled={!isEditing}
                            className={errorFields.includes('Place Of Residence') ? s.error : ''}
                        />
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="professionalExperienceInput">Professional Experience</label>
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isProfessionalExperiencePublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsProfessionalExperiencePublic(!isProfessionalExperiencePublic)}
                                        title={isProfessionalExperiencePublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <ManyInputFields id="professionalExperienceInput" name={'Professional experience field'} list={professionalExperience} setList={setProfessionalExperience} limit={10} isEditing={isEditing}/>
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="educationInput">Education</label>
                            {/* Expandable text, if empty, message {field} has not been set up yet... */}
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isEducationPublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsEducationPublic(!isEducationPublic)}
                                        title={isEducationPublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <ManyInputFields id="educationInput" name={'Education field'} list={education} setList={setEducation} limit={10} isEditing={isEditing}/>
                    </div>
                    <div className={s.input_field}>
                        <div className={s.label_with_icon}>
                            <label htmlFor="skillsInput">Skills</label>
                            {isEditing && (
                                <div className={s.icons_container}>
                                    <FontAwesomeIcon icon={faUserGroup} className={s.additional_icon} />
                                    <FontAwesomeIcon
                                        icon={isSkillsPublic ? faToggleOn : faToggleOff}
                                        className={s.toggle_icon}
                                        onClick={() => setIsSkillsPublic(!isSkillsPublic)}
                                        title={isSkillsPublic ? 'Set to private' : 'Set to public'}
                                    />
                                    <FontAwesomeIcon icon={faUsers} className={s.additional_icon} />
                                </div>
                            )}
                        </div>
                        <ManyInputFields id="skillsInput" name={'Skill field'} list={skills} setList={setSkills} limit={10} isEditing={isEditing}/>
                    </div>
                    
                    {/* Display error message */}
                    {error && (
                        <div className={s.error_message}>
                            <b>{error}</b>
                        </div>
                    )}
                    <div className={s.button_container}>
                        {isEditing ? (
                            <>
                                <button disabled={isLoading} className={s.save_button} onClick={handleSaveChanges}>Save changes</button>
                                <button className={s.cancel_button} onClick={handleCancel}>Cancel</button>
                            </>
                        ) : (
                            <button className={s.edit_button} onClick={handleEditToggle}>Edit</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalDetails;
