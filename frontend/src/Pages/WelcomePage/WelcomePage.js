import React, { useState } from 'react';
import s from './WelcomePageStyle.module.css';
import Select from "react-dropdown-select";
import WelcomeNavBar from './../../Components/WelcomeNavBar/WelcomeNavBar.js';
import "./SelectDropdownStyle.css"

function WelcomePage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));

  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function createYearOptions(){
    const years = [];
    for (let year = 1900 ; year <= 2024 ; year++) {
      years.push(String(year));
    }
    return years.sort((a, b) => {
      if (a > b) return -1;
      if (a < b) return 1;
      return 0;
    });
  }

  const yearOptions = createYearOptions();

  const [daysOptions, setDaysOptions] = useState(createRange(31));
  const [day, setDay] = useState(daysOptions[0]);
  const [month, setMonth] = useState(monthOptions[0]);
  const [year, setYear] = useState(yearOptions[0]);

  const calculateDaysOptions = () => {
    if (month === "February"){
      if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)){
        setDaysOptions(createRange(29));
      }
      else{
        setDaysOptions(createRange(28));
      }
    }
    else if (["January", "March", "May", "July", "August", "October", "December"].includes(month)){
      setDaysOptions(createRange(31));
    }
    else{
      setDaysOptions(createRange(30));
    }
  }

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); /* Να το κρατησουμε καπου για database!!! */
    }
  };

  function createRange(n) {
    return Array.from({ length: n }, (_, i) => String(i + 1));
  }

  return (
    <div className={s.welcome_page}>
      <WelcomeNavBar onModeSwitch={handleModeSwitch} isRegistering={isRegistering} />
      <div className={s.background_image}>
        <div className={s.form_box}>
          <h1 id="title">{isRegistering ? 'Register' : 'Log in'}</h1>
          <form>
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
                <input type="text" placeholder="Name" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" placeholder="Surname" required={isRegistering} />
              </div>
              <div className={`${s.date_of_birth} ${isRegistering ? '' : s.hidden}`}>
                <label className={s.text_input_label} htmlFor="day">Date Of Birth:</label>
                <div className={s.dropdown_row}>

                  <div className={s.side_dropdown}>
                    <Select
                      onDropdownOpen={calculateDaysOptions}
                      closeOnClickInput={true}
                      searchable={false}
                      options={daysOptions.map(day => ({ label: day, value: day }))}
                      values={[{ label: day, value: day }]}
                      onChange={(values) => setDay(values[0].value)}
                    />
                  </div>

                  <div className={s.middle_dropdown}>
                    <Select
                      searchable={false}
                      closeOnClickInput={true}
                      options={monthOptions.map(month => ({ label: month, value: month }))}
                      values={[{ label: month, value: month }]}
                      onChange={(values) => setMonth(values[0].value)}
                    />
                  </div>
                  
                  <div className={s.side_dropdown}>
                    <Select
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
                <input type="tel" placeholder="Phone number" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" placeholder="Working Position" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" placeholder="Employment Organization" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" placeholder="Place of Residence" required={isRegistering} />
              </div>
              <div className={s.input_field}>
                <input type="email" placeholder="Email" required />
              </div>
              <div className={s.input_field}>
                <input type="password" placeholder="Password" required />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="password" placeholder="Confirm Password" required={isRegistering}/>
              </div>
            </div>
          </form>
          <button>{isRegistering ? 'Register now' : 'Log in now'}</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
