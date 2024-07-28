import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import s from './SettingsPageStyle.module.css';

import NavBar from './../../Components/NavBar/NavBar.js';

import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

const ConfirmPassword = ({correctPassword, IsConfirmingPassword, setIsConfirmingPassword}) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [wrongInput, setWrongInput] = useState(false);
    const [wrongInputCounter, setWrongInputCounter] = useState(0);
    const [placeholderText, setPlaceholderText] = useState("Confirm your password");

    const handleChange = (e) => {
        setPlaceholderText("Confirm your password");
        setCurrentPassword(e.target.value);
        setWrongInput(false);
    };

    const handleConfirmPassword = () => {
        // Correct password
        if (correctPassword === currentPassword)
            setIsConfirmingPassword(false);

        // Wrong password
        else if (currentPassword !== ""){
            setWrongInput(true);
            setCurrentPassword("")
            const counter = wrongInputCounter + 1
            setWrongInputCounter(counter);
            (counter >= 3) ? setPlaceholderText("Too many attempts. Please try again later") : setPlaceholderText("Incorrect password");
        }
    };

    const handleKeyDown = (e) =>{
        if (e.key === "Enter"){
            e.preventDefault();
            handleConfirmPassword();
        }
    };

    return (
        <div className={s.setting_container}>
            <label>Please confirm your password before you continue:</label>
            <div className={s.password_field}>
                <input 
                    className={`${s.input_field} ${s.password_field} ${wrongInput ? s.wrong_input : ""}`}
                    type={isPasswordVisible ? "text" : "password"}
                    value={currentPassword}
                    onChange={handleChange}
                    onClick={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholderText}
                    disabled={(wrongInputCounter >= 3) ? true : false}
                />
                <FontAwesomeIcon
                    className={s.password_visibility_icon}
                    onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                    icon={isPasswordVisible ? faEye : faEyeSlash}
                    title={isPasswordVisible ? "Hide Password" : "Show Password"}
                />
            </div>
            <button className={s.confirm_password_button} onClick={handleConfirmPassword}>
                Confirm Password
            </button>
        </div>
    )
}

const SettingControlBar = ({settingName, settingHandler}) => {
    
    console.log(settingHandler);

    const {initial, previous, setPrevious, current,setCurrent, isChanging, setIsChanging, isWrong, setIsWrong, onConfirm, onCancel} = settingHandler;
    
    const handleSettingChange = () =>{
        setPrevious(current);
        setCurrent("");
        setIsChanging(true);
        setIsWrong(false);
    };

    return (
        <div className={s.control_bar}>
            {!isChanging ? (
                <button onClick={handleSettingChange}>
                    Change {settingName}
                </button>
            ) : 
            (<>
                <button onClick={onCancel}>
                    Cancel
                </button>
                <button onClick={onConfirm}>
                    Confirm
                </button>
            </>)}
            
        </div>
    )
}

function SettingsPage({user_id}) {
    
    const getProfilePicById = (user_id) => {
        if (user_id === 3)
            return tsipras
        if (user_id === 2)
            return mitsotakis
    };

    const getUserNameById = (user_id) => {
        if (user_id === 3)
            return "Alexis Tsipras"
        if (user_id === 2)
            return "Kyriakos Mitsotakis"
    }
    
    const getEmailAndPassword = (user_id) => {
        if (user_id === 3)
            return {
        initialEmail: "tsipras.o.ntriplas@yahoo.com",
        initialPassword: "MitsotakiGamiesai!"
    };
    
    if (user_id === 2)
        return {
    initialEmail: "mitsos.takis@gmail.com",
    initialPassword: "JHx6z#hu&3"
};
};

    const [isConfirmingPassword, setIsConfirmingPassword] = useState(true);

    const {initialEmail,initialPassword} = getEmailAndPassword(user_id);

    const [previousEmail, setPreviousEmail] = useState(initialEmail);
    const [currentEmail, setCurrentEmail] = useState(previousEmail);
    const [isEmailChanging, setIsEmailChanging] = useState(false);
    const [isEmailWrong, setIsEmailWrong] = useState(false);

    // If there is going to be a message display for errors, split these cases and use setPasswordErrorMessage()
    const confirmEmailChange = () => {
        // if is not email, setIsEmailWrong(true)
        // if(isEmail(currentEmail)) (isEmail = function that returns if a string is considered an email (use regex))
        if (currentEmail === "not an email" || currentEmail === ""){
            setIsEmailWrong(true);
        }
        else{
            setIsEmailChanging(false);
            setPreviousEmail(currentEmail);
        }
    };

    const cancelEmailChange = () => {
        setIsEmailWrong(false);
        setIsEmailChanging(false);
        setCurrentEmail(previousEmail);
    }

    // Struct for efficiency
    const emailHandler = {
        initial: initialEmail,
        previous: previousEmail,
        setPrevious: setPreviousEmail,
        current: currentEmail,
        setCurrent: setCurrentEmail,
        isChanging: isEmailChanging,
        setIsChanging: setIsEmailChanging,
        isWrong: isEmailWrong,
        setIsWrong: setIsEmailWrong,
        onConfirm: confirmEmailChange,
        onCancel: cancelEmailChange
    }

    const [previousPassword, setPreviousPassword] = useState(initialPassword)
    const [currentPassword, setCurrentPassword] = useState(previousPassword);
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState("");
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);

    // Returns wether a value is considered a strong password or not
    const isStrongPassword = (value) => {
    // A strong password is a string that has a length of 8 - 16 characters and contains at least:
    // > One capital letter
    // > One lowercase letter
    // > One number
    // > One special character={!, @, $, %, ^, &, *, +, #}

    // Use regex
        return true;
    }

    // If there is going to be a message display for errors, split these cases and use setPasswordErrorMessage()
    const confirmPasswordChange = () =>{
        // Invalid password, not confirmed or same as previous
        if (currentConfirmPassword !== currentPassword || currentPassword === "" || !isStrongPassword(currentPassword) || currentPassword === previousPassword){
            setIsPasswordWrong(true);
        }
        // Valid password + confirmed, continue
        else{
            setIsPasswordChanging(false);
            setPreviousPassword(currentPassword);
            setCurrentConfirmPassword("");
        }
        
    };

    const cancelPasswordChange = () => {
        
        setIsPasswordWrong(false);
        setIsPasswordChanging(false);
        setCurrentPassword(previousPassword);
        setCurrentConfirmPassword("");
    }

    // Struct for efficiency
    const passwordHandler = {
        initial: initialPassword,
        previous: previousPassword,
        setPrevious: setPreviousPassword,
        current: currentPassword,
        setCurrent: setCurrentPassword,
        isChanging: isPasswordChanging,
        setIsChanging: setIsPasswordChanging,
        isWrong: isPasswordWrong,
        setIsWrong: setIsPasswordWrong,
        onConfirm: confirmPasswordChange,
        onCancel: cancelPasswordChange
    }

    const profilePic = getProfilePicById(user_id);
    const userName = getUserNameById(user_id);

    const handlePwdChange = (e) => {
        setIsPasswordWrong(false);
        setCurrentPassword(e.target.value);
    };

    const handleConPwdChange = (e) => {
        setIsPasswordWrong(false);
        setCurrentConfirmPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setIsEmailWrong(false);
        setCurrentEmail(e.target.value);
    }

    

    const handleKeyDown = (e) => {
        if (e.key === "Enter"){
            if (e.target.id === "emailInput")
                confirmEmailChange();

            if (e.target.id === "passwordInput" || e.target.id === "confirmPasswordInput")
                confirmPasswordChange();
        }
    }
    

    return (
        <div>
            <NavBar />
            <div className={s.background_image}>
                <div className={s.container}>

                    <div className={s.profile_container} id="profileContainer">
                        <img src={profilePic} alt="Profile Picture" id="profilePic" />
                        <h2>{userName}</h2>
                    </div>

                    <div className={s.settings_container}>
                        {isConfirmingPassword ? 
                            (
                            <ConfirmPassword correctPassword={initialPassword} isConfirmingPassword={isConfirmingPassword} setIsConfirmingPassword={setIsConfirmingPassword} />
                        ) : (
                            <>
                            <div className={s.setting_container}>
                                <label htmlFor="emailInput">Email address:</label>
                                <input
                                    type="text"
                                    id="emailInput"
                                    className={`${s.input_field} ${isEmailWrong ? s.wrong_input : ""}`} 
                                    placeholder={"Enter email address"} 
                                    value={currentEmail}
                                    onClick={handleEmailChange}
                                    onChange={handleEmailChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={!isEmailChanging}
                                />
                                <SettingControlBar settingName="Email" settingHandler={emailHandler}/>
                            </div>
                            
                            {/* First password field */}
                            <div className={`${s.setting_container} ${isPasswordChanging ? s.pwd_changing : ""}`}>
                                <label>Password:</label>
                                <div className={s.password_field}>
                                    <input 
                                        className={`${s.input_field} ${s.password_field} ${isPasswordWrong ? s.wrong_input : ""}`}
                                        type={isPasswordVisible ? "text" : "password"}
                                        id ="passwordInput"
                                        placeholder={"Enter new password"}
                                        value={currentPassword}
                                        onClick={handlePwdChange}
                                        onChange={handlePwdChange}
                                        onKeyDown={handleKeyDown}
                                        disabled={!isPasswordChanging}
                                    />
                                    <FontAwesomeIcon
                                        className={s.password_visibility_icon}
                                        onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                                        icon={isPasswordVisible ? faEye : faEyeSlash}
                                        title={isPasswordVisible ? "Hide Password" : "Show Password"}
                                    />
                                </div>
                            </div>
                            {/* Confirm Password Field */}
                            <div className={`${s.setting_container} ${s.confirm_password_container} ${isPasswordChanging ? "": s.hidden}`}>
                                <label>Confirm Password:</label>
                                <div className={s.password_field}>
                                    <input 
                                        className={`${s.input_field} ${s.password_field} ${isPasswordWrong ? s.wrong_input : ""}`}
                                        type={isPasswordVisible ? "text" : "password"}
                                        id ="confirmPasswordInput"
                                        placeholder={"Confirm new password"}
                                        value={currentConfirmPassword}
                                        onClick={handleConPwdChange}
                                        onChange={handleConPwdChange}
                                        onKeyDown={handleKeyDown}
                                        disabled={!isPasswordChanging}
                                    />
                                </div>
                            </div>
                            <SettingControlBar settingName="Password" settingHandler={passwordHandler}/>
                        </>
                        )}
                </div>
                        

                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
