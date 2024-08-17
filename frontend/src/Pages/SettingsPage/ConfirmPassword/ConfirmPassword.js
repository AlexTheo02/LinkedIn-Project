import s from "./ConfirmPasswordStyle.module.css"
import ss from "../SettingsPageStyle.module.css"
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../../../Hooks/useAuthContext";

const ConfirmPassword = ({setIsConfirmingPassword, setInitialPassword}) => {

    const {user} = useAuthContext();

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

    const handleConfirmPassword = async () => {
        // Not empty
        if (currentPassword){

            // Send request to server to confirm password
            const response = await fetch("/api/users/confirm-password", {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({password: currentPassword})
            });

            const json = await response.json();

            console.log(json)

            // Correct password
            if (response.ok){
                setInitialPassword(currentPassword);
                setIsConfirmingPassword(false);
            }
            
            // Wrong password
            else {
                console.log(json);
                setWrongInput(true);
                setCurrentPassword("")
                const counter = wrongInputCounter + 1
                setWrongInputCounter(counter);
                (counter >= 3) ? setPlaceholderText("Too many attempts. Please try again later") : setPlaceholderText("Incorrect password");
            }
        }
        else{
            setWrongInput(true);
        }
    };

    const handleKeyDown = (e) =>{
        if (e.key === "Enter"){
            e.preventDefault();
            handleConfirmPassword();
        }
    };

    return (
        <div className={ss.setting_container}>
            <label>Please confirm your password before you continue:</label>
            <div className={ss.password_field}>
                <input 
                    className={`${ss.input_field} ${ss.password_field} ${wrongInput ? ss.wrong_input : ""}`}
                    type={isPasswordVisible ? "text" : "password"}
                    value={currentPassword}
                    onChange={handleChange}
                    onClick={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholderText}
                    disabled={(wrongInputCounter >= 3) ? true : false}
                />
                <FontAwesomeIcon
                    className={ss.password_visibility_icon}
                    onClick={() => {setIsPasswordVisible(!isPasswordVisible)}}
                    icon={isPasswordVisible ? faEyeSlash : faEye}
                    title={isPasswordVisible ? "Hide Password" : "Show Password"}
                />
            </div>
            <button className={s.confirm_password_button} onClick={handleConfirmPassword}>
                Confirm Password
            </button>
        </div>
    )
}

export default ConfirmPassword;