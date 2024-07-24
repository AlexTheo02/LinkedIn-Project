import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import s from './SettingsPageStyle.module.css';

import NavBar from './../../Components/NavBar/NavBar.js';

import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

const SettingControlBar = ({settingName, settingHandler}) => {
    
    console.log(settingHandler);

    const {initial, previous, setPrevious, current,setCurrent,isChanging,setIsChanging} = settingHandler;
    
    const handleSettingChange = () =>{
        setIsChanging(true);
    }

    // Set state and set value back to initial
    const cancelSettingChange = () =>{
        setIsChanging(false);
        setCurrent(previous);
    }

    const confirmSettingChange = () =>{
        // if (settingName === "Email"){
        //     if (!isEmail(current))
        //         check email.
        //         check for existing, not-email
        // }
        // else if (settingName === "Password"){
        //      check if password is acceptable (use strong password regex, or if new password is same as initial)
        //}
        setIsChanging(false);
        setPrevious(current);
    }

    return (
        <div className={s.control_bar}>
            {!isChanging ? (
                <button onClick={handleSettingChange}>
                    Change {settingName}
                </button>
            ) : 
            (<>
                <button onClick={cancelSettingChange}>
                    Cancel
                </button>
                <button onClick={confirmSettingChange}>
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

    const {initialEmail,initialPassword} = getEmailAndPassword(user_id);

    const [previousEmail, setPreviousEmail] = useState(initialEmail)
    const [currentEmail, setCurrentEmail] = useState(previousEmail);
    const [isEmailChanging, setIsEmailChanging] = useState(false);

    // Struct for efficiency
    const emailHandler = {
        initial: initialEmail,
        previous: previousEmail,
        setPrevious: setPreviousEmail,
        current: currentEmail,
        setCurrent: setCurrentEmail,
        isChanging: isEmailChanging,
        setIsChanging: setIsEmailChanging
    }

    const [previousPassword, setPreviousPassword] = useState(initialPassword)
    const [currentPassword, setCurrentPassword] = useState(previousPassword);
    const [isPasswordChanging, setIsPaswordChanging] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Struct for efficiency
    const passwordHandler = {
        initial: initialPassword,
        previous: previousPassword,
        setPrevious: setPreviousPassword,
        current: currentPassword,
        setCurrent: setCurrentPassword,
        isChanging: isPasswordChanging,
        setIsChanging: setIsPaswordChanging
    }

    const profilePic = getProfilePicById(user_id);
    const userName = getUserNameById(user_id);

    const handlePwdChange = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setCurrentEmail(e.target.value);
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

                        <div className={s.setting_container}>
                            <label htmlFor="emailInput">Email address</label>
                            <input
                                type="text"
                                id="emailInput"
                                className={s.input_field} 
                                placeholder={currentEmail} 
                                value={currentEmail}
                                onChange={handleEmailChange}
                                disabled={!isEmailChanging}
                            />
                            <SettingControlBar settingName="Email" settingHandler={emailHandler}/>
                        </div>

                        <div className={s.setting_container}>
                            <label>Change password:</label>
                            <div className={s.password_field}>
                                <input 
                                    className={`${s.input_field} ${s.password_field}`}
                                    type={isPasswordVisible ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={handlePwdChange}
                                    disabled={!isPasswordChanging}
                                />
                                <FontAwesomeIcon
                                    className={s.password_visibility_icon}
                                    onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                                    icon={isPasswordVisible ? faEyeSlash : faEye}
                                    title={isPasswordVisible ? "Hide Password" : "Show Password"}
                                />
                             </div>
                             <SettingControlBar settingName="Password" settingHandler={passwordHandler}/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
