import React, { useState } from 'react';
import s from './WelcomePageStyle.module.css';

import WelcomeNavBar from './../../Components/WelcomeNavBar/WelcomeNavBar.js';

function WelcomePage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className={s.welcome_page}>
      <WelcomeNavBar onModeSwitch={handleModeSwitch} isRegistering={isRegistering} />
      <div className={s.container}>
        <div className={s.form_box}>
          <h1 id="title">{isRegistering ? 'Register' : 'Log in'}</h1>
          <form>
            <div className={s.input_group}>
              <div className={`${s.profile_field} ${isRegistering ? '' : s.hidden}`} id="profileField">
                <img src={profilePic} alt="Profile Picture" id="profilePic" />
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
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="nameInput">
                <input type="text" placeholder="Name" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="surnameInput">
                <input type="text" placeholder="Surname" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="workingPositionInput">
                <input type="text" placeholder="Working Position" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="employmentOrganizationInput">
                <input type="text" placeholder="Employment Organization" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="phonenumberInput">
                <input type="tel" placeholder="Phone number" required={isRegistering} />
              </div>
              <div className={s.input_field}>
                <input type="email" placeholder="Email" required />
              </div>
              <div className={s.input_field}>
                <input type="password" placeholder="Password" required />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`} id="confirmpasswordInput">
                <input type="password" placeholder="Confirm Password" required={isRegistering}/>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
