import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext()

    const register = async (user) => {
        setIsLoading(true);
        setError(null);
        setErrorFields([])

        // Create form data object
        const formData = new FormData();
        formData.append("profilePicture", user.profilePicture);
        formData.append("name", user.name);
        formData.append("surname", user.surname);
        formData.append("dateOfBirth", user.dateOfBirth);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("confirmPassword", user.confirmPassword);
        formData.append("phoneNumber", user.phoneNumber);
        formData.append("placeOfResidence", user.placeOfResidence);
        formData.append("workingPosition", user.workingPosition);
        formData.append("employmentOrganization", user.employmentOrganization);

        console.log(formData)
        // Send register request to the server
        const response = await fetch ("api/users/register", {
        method: "POST",
        body: formData,
        });

        const json = await response.json();

        // Registered user's json or error message
        console.log(json);

        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
            setErrorFields(json.errorFields)
        }
        if (response.ok){
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update auth context
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    const login = async (user) => {
        setIsLoading(true);
        setError(null);
        setErrorFields([])
        
        // Send register request to the server
        const response = await fetch ("api/users/login", {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type" : "application/json"
            }
        });
    
        const json = await response.json();
    
        // Registered user's json or error message
        console.log(json);
    
        // Fail
        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
            setErrorFields(json.errorFields)
        }
        // Success
        if (response.ok){
            // save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // update auth context
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    return {register, login, isLoading, error, errorFields, setError, setErrorFields};
}