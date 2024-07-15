import React, { useState } from 'react';
import './WelcomePageStyle.css';

import WelcomeNavBar from './../../Components/WelcomeNavBar/WelcomeNavBar.js';

function WelcomePage() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
  };

  const handleImageChange = (event) => {
    setProfilePic(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="container">
      <WelcomeNavBar onModeSwitch={handleModeSwitch} isRegistering={isRegistering} />
      <div className="form-box">
        <h1 id="title">{isRegistering ? 'Register' : 'Log in'}</h1>
        <form>
          <div className="input-group">
            {isRegistering && (
              <div className="profile-field" id="profileField" style={{ maxHeight: isRegistering ? '200px' : '0' }}>
                <img src={profilePic} alt="Profile Picture" id="profilePic" />
                <label htmlFor="inputImage">Upload a profile picture</label>
                <input
                  type="file"
                  className="picture-input"
                  placeholder="Upload Photo"
                  accept="image/jpeg, image/png, image/jpg"
                  id="inputImage"
                  onChange={handleImageChange}
                />
              </div>
            )}
            {isRegistering && (
              <>
                <div className="input-field" id="nameInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                  <input type="text" placeholder="Name" />
                </div>
                <div className="input-field" id="surnameInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                  <input type="text" placeholder="Surname" />
                </div>
                <div className="input-field" id="phonenumberInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                  <input type="tel" placeholder="Phone number" />
                </div>
                <div className="input-field" id="confirmpasswordInput" style={{ maxHeight: isRegistering ? '65px' : '0' }}>
                  <input type="password" placeholder="Confirm Password" />
                </div>
              </>
            )}
            <div className="input-field">
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Password" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WelcomePage;
