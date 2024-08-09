import React, { useState } from 'react';
import s from './WelcomePageStyle.module.css';
import Select from "react-dropdown-select";
import WelcomeNavBar from './../../Components/WelcomeNavBar/WelcomeNavBar.js';
import "../../Components/SelectStyle.css"
import { useNavigate } from 'react-router-dom';
const {
  createYearOptions,
  calculateDaysOptions,
  createRange
} = require("../../Components/GeneralFunctions.js")

function WelcomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberIsValid, setPhoneNumberIsValid] = useState(true);

  const [workingPosition, setWorkingPosition] = useState("");
  const [employmentOrganization, setEmploymentOrganization] = useState("");
  const [placeOfResidence, setPlaceOfResidence] = useState("");

  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  
  const monthOptions = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const yearOptions = createYearOptions();
  
  const [daysOptions, setDaysOptions] = useState(createRange(31));
  const [day, setDay] = useState(daysOptions[0]);
  const [month, setMonth] = useState(monthOptions[0]);
  const [year, setYear] = useState(yearOptions[0]);

  const [fieldErrors, setFieldErrors] = useState(["", "", ""]);

  const duplicateEmailCheck = async () => {
    // changed some functions to async, used await, changed order of routes in users.js (js uses first match for requests)
    // response is either an array, or error message.
    const fieldName = "email";
    const fieldValue = email;
    const response = await fetch(`/api/users/find?fieldName=${encodeURIComponent(fieldName)}&fieldValue=${encodeURIComponent(fieldValue)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    const json = await response.json();
    console.log(json);
    if (response.ok){
      // User already exists
      if (json.length > 0){
        console.log("Duplicate email");
        return false;
      }
      else {
        console.log("Valid email");
        return true;
      }
    }

    return true;
  }
  
  const duplicatePhoneNumberCheck = async () => {
    const fieldName = "phoneNumber";
    const fieldValue = phoneNumber;

    const response = await fetch("/api/users/find", {
      method: "GET",
      body: JSON.stringify({fieldName, fieldValue})
    });
      
    return true;
  }
  
  const isFormValid = async (register) => {
    // 0 -> phone number, 1 -> email, 2 -> password
    
    let isValid = true;
    let isLoginValid = true;
    
    let fe = [...fieldErrors];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex = /^\+?\d{1,15}$/;
    
    // Phone number check
    if (register){
      if (!phoneNumberRegex.test(phoneNumber)){
        isValid = false;
        setPhoneNumberIsValid(false);
        fe[0] = "Phone number is invalid"
      }
      else if (register && !duplicatePhoneNumberCheck){
        isValid = false;
        setPhoneNumberIsValid(false);
        fe[0] = "Phone number is already in use"
      }
      else{
        setPhoneNumberIsValid(true);
        fe[0] = "";
      }
    }

    // Email check
    if (!emailRegex.test(email)){
      isValid = false;
      isLoginValid = false;
      setEmailIsValid(false);
      fe[1] = "Email is invalid"
    }
    else if (register && !(await duplicateEmailCheck())){
      isValid = false;
      setEmailIsValid(false);
      fe[1] = "Email is already in use"
    }
    else{
      setEmailIsValid(true);
      fe[1] = "";
    }
    
    // Password check
    if (password === ""){
      setPasswordIsValid(false);
      isValid = false;
      isLoginValid = false;
      fe[2] = "Password cannot be empty"
    }
    else if (password !== confirmPassword){
      setPasswordIsValid(false);
      isValid = false;
      fe[2] = "Passwords do not match"
    }
    else{
      setPasswordIsValid(true);
      fe[2] = "";
    }
    
    // Login
    if (!register){
      // fetch user,
      // if email does not match password
      isLoginValid = true; // Credentials match
      if (!isLoginValid){
        fe[0] = "Email or password is incorrect";
        fe[1] = "";
        fe[2] = "";
        isLoginValid = false;
        isValid = false;
        setEmailIsValid(false);
        setPasswordIsValid(false);
      }
      else{
        fe[0] = ""
        fe[1] = ""
        fe[2] = ""
        setEmailIsValid(true);
        setPasswordIsValid(true);
        isValid = true;
      }
    }
    setFieldErrors(fe);
    return isValid;
  };
  
  const handleLoginClick = async () => {
    if (await isFormValid(false)){
      navigate("/Home");
    }
  }

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    const dateOfBirth = new Date(`${month} ${day}, ${year} 00:00:00 GMT`);
    // Create form data object
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("phoneNumber", phoneNumber);
    formData.append("placeOfResidence", placeOfResidence);
    formData.append("workingPosition", workingPosition);
    formData.append("employmentOrganization", employmentOrganization);

    console.log(formData)
    // Send register request to the server
    const response = await fetch ("api/users/register", {
      method: "POST",
      body: formData,
    });

    const json = await response.json();

    // Registered user's json or error message
    console.log(json);

    // Fail
    if (!response.ok){
      console.log("User registration failed");
      const error = JSON.parse(json.error)

      // Access error fields like this
      console.log(error.email)
      console.log(error.dateOfBirth)

    }
    // Success
    else{
      console.log("User registeration successful");
      // Reset form fields
      // set styles to not invalid


      // setProfilePic and setProfilePicture
      // profilePic = preview
      // profilePicture = actual file

      // Maybe show a window that registration was completed successfuly


    }

    // Handle response accordingly
    // IMPORTANT: Response is in json format, if error, read userModel.statics.register function, else is the user's json stored in the database
    // READ userModel.js register function, check validator, check what format the response is given in, and handle accordingly
    // ALL FIELDS ARE REQUIRED IN THE VALIDATION LOGIC, IF ANY ARE NOT NEEDED, REMOVE THEIR CATEGORY (not advised, except employmentOrganization), can be null maybe
    // Any fields that do not have value 1 in error response, turn red, (error messages on the end of the form must be generated based on the error response)
    

    
    // if (isFormValid(true)){
    //   // Create dummy user
    //     const dateOfBirth = new Date(`${month} ${String(Number(day) + 1)}, ${year}`);
    //     const user = { 
    //       name,
    //       surname,
    //       dateOfBirth,
    //       phoneNumber,
    //       workingPosition,
    //       employmentOrganization,
    //       placeOfResidence,
    //       email,
    //       password,
    //   }

    //   const response = await fetch("/api/users", {
    //     method: "POST",
    //     body: JSON.stringify(user),
    //     headers: {
    //         "Content-Type" : "application/json"
    //     }
    //   })
    //   const json = await response.json();

    //   // Error publishing user
    //   if (!response.ok){
    //       setError(json.error);
    //   }
    //   // User register completed
    //   if (response.ok){

    //       // Clear fields
    //       setName("");
    //       setSurname("");
    //       setPhoneNumber("");
    //       setWorkingPosition("");
    //       setEmploymentOrganization("");
    //       setPlaceOfResidence("");
    //       setEmail("");
    //       setPassword("");
    //       setConfirmPassword("");
    //       setYear(yearOptions[0]);
    //       setMonth(monthOptions[0]);
    //       calculateDaysOptions();
    //       setDay(daysOptions[0]);
          
    //       // Clear error mesasage
    //       setError(null);

    //       console.log("User published successfully", json);
    //   }
    // }
  }
  const [isRegistering, setIsRegistering] = useState(false);
  const [profilePic, setProfilePic] = useState(require('./../../Images/profile_ergasiaSite.png'));
  const [profilePicture, setProfilePicture] = useState("");

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
    setPhoneNumberIsValid(true);
    setEmailIsValid(true);
    setPasswordIsValid(true);
    setFieldErrors(["","", ""])
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file); // actual file
      setProfilePic(URL.createObjectURL(file)); // preview
    }
  };
  
  return (
    <div className={s.welcome_page}>
      {/* Register page */}
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
                <input type="text" value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Name" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" value={surname} onChange={(e) => {setSurname(e.target.value)}} placeholder="Surname" required={isRegistering} />
              </div>
              <div className={`${s.date_of_birth} ${isRegistering ? '' : s.hidden}`}>
                <label className={s.text_input_label} htmlFor="day">Date Of Birth:</label>
                <div className={s.dropdown_row}>

                  <div className={s.side_dropdown}>
                    <Select
                      onDropdownOpen={() => calculateDaysOptions(month, year, setDaysOptions)}
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
              <div className={`${s.input_field} ${!phoneNumberIsValid ? s.invalid : ""} ${isRegistering ? '' : s.hidden}`}>
                <input type="tel" value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} placeholder="Phone number" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" value={workingPosition} onChange={(e) => {setWorkingPosition(e.target.value)}} placeholder="Working Position" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" value={employmentOrganization} onChange={(e) => {setEmploymentOrganization(e.target.value)}} placeholder="Employment Organization" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${isRegistering ? '' : s.hidden}`}>
                <input type="text" value={placeOfResidence} onChange={(e) => {setPlaceOfResidence(e.target.value)}} placeholder="Place of Residence" required={isRegistering} />
              </div>
              <div className={`${s.input_field} ${!emailIsValid ? s.invalid : ""}`}>
                <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Email" required />
              </div>
              <div className={`${s.input_field} ${!passwordIsValid ? s.invalid : ""}`}>
                <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Password" required />
              </div>
              <div className={`${s.input_field} ${!passwordIsValid ? s.invalid : ""} ${isRegistering ? '' : s.hidden}`}>
                <input type="password" value={confirmPassword} onChange={(e) => {setConfirmPassword(e.target.value)}} placeholder="Confirm Password" required={isRegistering}/>
              </div>
            </div>
          </form>
          <div className={s.error_messages}>
              {fieldErrors.map((item, index) => (item !== "" ? <p key={`error${index}`}>{`• ${item}`}</p> : <></>))}
          </div>
          <button onClick={isRegistering ? handleRegisterClick : handleLoginClick}> {isRegistering ? 'Register now' : 'Log in now'}</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
