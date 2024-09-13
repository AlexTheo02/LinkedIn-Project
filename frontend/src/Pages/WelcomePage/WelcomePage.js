import React, { useState } from 'react';
import s from './WelcomePageStyle.module.css';
import Select from "react-dropdown-select";
import WelcomeNavBar from './../../Components/WelcomeNavBar/WelcomeNavBar.js';
import "../../Components/SelectStyle.css"
import { useAuthentication } from '../../Hooks/useAuthentication.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const {
  createYearOptions,
  calculateDaysOptions,
  createRange
} = require("../../Components/GeneralFunctions.js")

function WelcomePage() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [workingPosition, setWorkingPosition] = useState("");
  const [employmentOrganization, setEmploymentOrganization] = useState("");
  const [placeOfResidence, setPlaceOfResidence] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const yearOptions = createYearOptions();
  
  const [daysOptions, setDaysOptions] = useState(createRange(31));
  const [day, setDay] = useState(daysOptions[0]);
  const [month, setMonth] = useState(monthOptions[0]);
  const [year, setYear] = useState(yearOptions[0]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));
  const [profilePicture, setProfilePicture] = useState("");

  const { register, login, isLoading, error, errorFields, setError, setErrorFields } = useAuthentication();
  
  const handleLoginClick = async (e) => {
    e.preventDefault();
    
    const user = { 
      email,
      password
    }

    await login(user);
  }

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    const dateOfBirth = new Date(`${month} ${day}, ${year} 00:00:00 GMT`);

    const user = { 
      profilePicture, 
      name, 
      surname, 
      dateOfBirth, 
      email, 
      password, 
      confirmPassword,
      phoneNumber,
      placeOfResidence, 
      workingPosition, 
      employmentOrganization
    }

    await register(user);
  }

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setErrorFields([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isRegistering) {
        handleRegisterClick(e);
      } else {
        handleLoginClick(e);
      }
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file); // Actual file
      setProfilePic(URL.createObjectURL(file)); // Preview
    }
  };
  
  return (
    <div className={s.welcome_page}>
      {/* Welcome page */}
      <WelcomeNavBar onModeSwitch={handleModeSwitch} isRegistering={isRegistering} />
      <div className={s.background_image}>
        <div className={s.form_box}>
          <h1 id="title">{isRegistering ? 'Register' : 'Log in'}</h1>
          <form onKeyDown={handleKeyDown}>
            <div className={s.input_group}>
              <div className={`${s.profile_field} ${isRegistering ? '' : s.hidden}`} id="profileField">
                <img src={profilePic} alt="Profile" id="profilePic" />
                <label htmlFor="inputImage">Upload a profile picture</label>
                <input
                  type="file"
                  className={s.picture_input}
                  placeholder="Upload Photo"
                  accept="image/jpeg, image/png, image/jpg"
                  id="inputImage"
                  onChange={handleImageChange}
                  required={isRegistering}
                />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" className={errorFields.includes('Name') ? s.error : ''} value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Name" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" className={errorFields.includes('Surname') ? s.error : ''} value={surname} onChange={(e) => {setSurname(e.target.value)}} placeholder="Surname" required={isRegistering} />
              </div>
              <div className={`${s.date_of_birth} ${isRegistering ? '' : s.hidden}`}>
                <label className={s.text_input_label} htmlFor="day">Date Of Birth:</label>
                <div className={s.dropdown_row}>

                  <div className={s.side_dropdown}>
                    <Select
                      onDropdownOpen={() => calculateDaysOptions(month, year, setDaysOptions)}
                      className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                      closeOnClickInput={true}
                      searchable={false}
                      options={daysOptions.map(day => ({ label: day, value: day }))}
                      values={[{ label: day, value: day }]}
                      onChange={(values) => setDay(values[0].value)}
                    />
                  </div>

                  <div className={s.middle_dropdown}>
                    <Select
                      className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                      searchable={false}
                      closeOnClickInput={true}
                      options={monthOptions.map(month => ({ label: month, value: month }))}
                      values={[{ label: month, value: month }]}
                      onChange={(values) => setMonth(values[0].value)}
                    />
                  </div>
                  
                  <div className={s.side_dropdown}>
                    <Select
                      className={errorFields.includes('Date Of Birth') ? 'error' : ''}
                      searchable={false}
                      closeOnClickInput={true}
                      options={yearOptions.map(year => ({ label: year, value: year }))}
                      values={[{ label: year, value: year }]}
                      onChange={(values) => setYear(values[0].value)}
                    />
                  </div>
                  
                </div>
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="tel" className={errorFields.includes('Phone Number') ? s.error : ''} value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} placeholder="Phone number" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" className={errorFields.includes('Working Position') ? s.error : ''} value={workingPosition} onChange={(e) => {setWorkingPosition(e.target.value)}} placeholder="Working Position" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" className={errorFields.includes('Employment Organization') ? s.error : ''} value={employmentOrganization} onChange={(e) => {setEmploymentOrganization(e.target.value)}} placeholder="Employment Organization" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" className={errorFields.includes('Place Of Residence') ? s.error : ''} value={placeOfResidence} onChange={(e) => {setPlaceOfResidence(e.target.value)}} placeholder="Place of Residence" required={isRegistering} />
              </div>
              <div className={s.input_field}>
                <input type="email" className={errorFields.includes('Email') ? s.error : ''} value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" required />
              </div>
              <div className={s.row}>
                <div className={s.password_field}>
                  <input type={isPasswordVisible ? "text" : "password"} className={errorFields.includes('Password') ? s.error : ''} value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" required />
                </div>
                {!isRegistering && <FontAwesomeIcon
                  className={isPasswordVisible ? s.visible_icon : s.not_visible_icon}
                  onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  title={isPasswordVisible ? "Hide Password" : "Show Password"}
                />}
              </div>
              <div className={`${s.row} ${isRegistering ? '' : s.hidden}`}>
                <div className={s.password_field}>
                  <input type={isPasswordVisible ? "text" : "password"} className={errorFields.includes('Confirm Password') ? s.error : ''} value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm Password" required={isRegistering}/>
                </div>
                <FontAwesomeIcon
                  className={isPasswordVisible ? s.visible_icon : s.not_visible_icon}
                  onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  title={isPasswordVisible ? "Hide Password" : "Show Password"}
                />
              </div>
            </div>
          </form>
          {/* Display error message */}
          {error && (
            <div className={s.error_message}>
                <b>{error}</b>
            </div>
          )}
          <button disabled={isLoading} onClick={isRegistering ? handleRegisterClick : handleLoginClick}> {isRegistering ? 'Register now' : 'Log in now'}</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
