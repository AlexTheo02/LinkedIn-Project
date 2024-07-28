import s from "./InteractiveProfilePictureStyle.module.css"
import { useNavigate } from "react-router-dom";
import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

function InteractiveProfilePicture({user_id, nonInter}){
    
    const navigate = useNavigate();

    const HandleImageClick = () => {
        navigate("/");
    }

    // Replace with database access
    var profilePicture,userName;

    
    if (user_id === 3){
        profilePicture = tsipras;
        userName = "Alexis Tsipras"
    }

    if (user_id === 2){
        profilePicture = mitsotakis;
        userName = "Kyriakos Mitsotakis"
    }

    // For alt, use the standard no pfp img
    if (nonInter)
        return(
            <img className={s.interactive_pfp_noninter} title={userName} src={profilePicture} alt="nonInteractive PFP"/>
        );

    return(
        <img className={s.interactive_pfp} src={profilePicture} onClick={HandleImageClick} alt="Interactive PFP"/>
    );
    
}

export default InteractiveProfilePicture;