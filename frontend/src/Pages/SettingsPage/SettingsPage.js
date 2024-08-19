import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import s from './SettingsPageStyle.module.css';

import SettingControlBar from './SettingControlBar/SettingControlBar.js';
import ConfirmPassword from './ConfirmPassword/ConfirmPassword.js';

import NavBar from './../../Components/NavBar/NavBar.js';

import { useAuthContext } from '../../Hooks/useAuthContext.js';

function SettingsPage() {
    const {user} = useAuthContext();

    const [initialPassword, setInitialPassword] = useState("");
    const [previousPassword, setPreviousPassword] = useState("");

    // Fetch user's data
    const [userData, setUserData] = useState(null);
    const [isConfirmingPassword, setIsConfirmingPassword] = useState(true);

    const [currentEmail, setCurrentEmail] = useState("");
    const [isEmailChanging, setIsEmailChanging] = useState(false);
    const [isEmailWrong, setIsEmailWrong] = useState(false);
    const [emailMessage, setEmailMessage] = useState({status: null, message: ""});
    
    const [currentPassword, setCurrentPassword] = useState("");
    const [currentConfirmPassword, setCurrentConfirmPassword] = useState("");
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [isPasswordWrong, setIsPasswordWrong] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({status: null, message: ""});

    
    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user.userId}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);
                setCurrentEmail(data.email);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        setCurrentPassword(initialPassword);
        setCurrentConfirmPassword(initialPassword);
        setPreviousPassword(initialPassword);
    }, [initialPassword]);


    if (!userData) {
        return <h1 className={s.loading_text}>Loading...</h1>;
    }


    const confirmEmailChange = async () => {

        const response = await fetch("/api/users/change-email", {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({email: currentEmail})
        })

        const json = await response.json();
        console.log(json);
        if (response.ok){
            // User has changed on db, change current value to Lowercase
            setCurrentEmail(currentEmail.toLowerCase());
            
            // Update email on local userData object
            const newUserData = userData;
            newUserData.email = json.email;
            setUserData(newUserData);

            console.log(userData)
            setIsEmailChanging(false);
            setEmailMessage({status: true, message: json.message});
        }
        
        if (!response.ok){
            // Read errors and handle accordingly
            setIsEmailWrong(true);
            setCurrentEmail("");
            setEmailMessage({status: false, message: json.error});
        }
        
    };
    
    const confirmPasswordChange = async () => {
        const response = await fetch("/api/users/change-password", {
            headers: {
                "Authorization": `Bearer ${user.token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({password: currentPassword, confirmPassword: currentConfirmPassword})
        })

        const json = await response.json();
        console.log(json);
        if (response.ok){

            setPreviousPassword(currentPassword);
            
            // Update password on local userData object
            const newUserData = userData;
            newUserData.password = json.password;
            setUserData(newUserData);

            setIsPasswordChanging(false);
            setPasswordMessage({status: true, message: json.message});
        }
        
        if (!response.ok){
            // Read errors and handle accordingly
            setIsPasswordWrong(true);
            setCurrentPassword("");
            setCurrentConfirmPassword("");
            setPasswordMessage({status: false, message: json.error});
        }
        
    };
    
    const handleEmailCancel = () => {
        setIsEmailWrong(false);
    setIsEmailChanging(false);
    setCurrentEmail(userData.email);
    setEmailMessage({status: null, message:""});
    }

    const handlePasswordCancel = () => {
        setIsPasswordWrong(false);
        setIsPasswordChanging(false);
        setCurrentPassword(previousPassword);
        setCurrentConfirmPassword(previousPassword);
        setPasswordMessage({status: null, message:""});
    }

    const handlePwdChange = (e) => {
        setPasswordMessage({status: null, message: ""});
        setIsPasswordWrong(false);
        setCurrentPassword(e.target.value);
    };

    const handleConPwdChange = (e) => {
        setPasswordMessage({status: null, message: ""});
        setIsPasswordWrong(false);
        setCurrentConfirmPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmailMessage({status: null, message: ""});
        setIsEmailWrong(false);
        setCurrentEmail(e.target.value);
    }

    const emailHandler = {
        setCurrent: setCurrentEmail,
        isChanging: isEmailChanging,
        setIsChanging: setIsEmailChanging,
        setIsWrong: setIsEmailWrong,
        handleCancel: handleEmailCancel,
        onConfirm: confirmEmailChange,
        message: emailMessage,
        setMessage: setEmailMessage
    };

    const passwordHandler = {
        setCurrent: setCurrentPassword,
        setCurrentConfirm: setCurrentConfirmPassword,
        isChanging: isPasswordChanging,
        setIsChanging: setIsPasswordChanging,
        setIsWrong: setIsPasswordWrong,
        handleCancel: handlePasswordCancel,
        onConfirm: confirmPasswordChange,
        message: passwordMessage,
        setMessage: setPasswordMessage
    };

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
            <NavBar currentPage={"Settings"}/>
            <div className={s.background_image}>
                <div className={s.container}>

                    <div className={s.profile_container} id="profileContainer">
                        <img src={userData.profilePicture} alt="Profile Picture" id="profilePic" />
                        <h2>{`${userData.name} ${userData.surname}`}</h2>
                    </div>

                    <div className={s.settings_container}>
                        {isConfirmingPassword ? 
                            (
                            <ConfirmPassword setIsConfirmingPassword={setIsConfirmingPassword} setInitialPassword={setInitialPassword}/>
                        ) : (
                            <>
                            {/* Email field */}
                            <div className={s.setting_container}>
                                <label htmlFor="emailInput">Email address:</label>
                                <input
                                    type="text"
                                    id="emailInput"
                                    className={`${s.input_field} ${isEmailWrong ? s.wrong_input : ""}`} 
                                    placeholder={"Enter new email address"} 
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
                                        icon={isPasswordVisible ? faEyeSlash : faEye}
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
