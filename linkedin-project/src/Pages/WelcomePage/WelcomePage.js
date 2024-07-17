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
              {isRegistering && (
                <div className={s.profile_field} id="profileField" style={{ maxHeight: isRegistering ? '200px' : '0' }}>
                  <img src={profilePic} alt="Profile Picture" id="profilePic" />
                  <label htmlFor="inputImage">Upload a profile picture</label>
                  <input
                    type="file"
                    className={s.picture_input}
                    placeholder="Upload Photo"
                    accept="image/jpeg, image/png, image/jpg"
                    id="inputImage"
                    onChange={handleImageChange}
                    required
                  />
                </div>
              )}
              {isRegistering && (
                <>
                  <div className={s.input_field} id="nameInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                    <input type="text" placeholder="Name" required />
                  </div>
                  <div className={s.input_field} id="surnameInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                    <input type="text" placeholder="Surname" required />
                  </div>
                  <div className={s.input_field} id="phonenumberInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                    <input type="tel" placeholder="Phone number" required />
                  </div>
                </>
              )}
              <div className={s.input_field}>
                <input type="email" placeholder="Email" required />
              </div>
              <div className={s.input_field}>
                <input type="password" placeholder="Password" required />
              </div>
              {isRegistering && (
                <>
                  <div className={s.input_field} id="confirmpasswordInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                    <input type="password" placeholder="Confirm Password" required/>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
