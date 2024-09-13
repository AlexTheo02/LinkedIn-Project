import s from "./InteractiveProfilePictureStyle.module.css"
import { useNavigate } from "react-router-dom";

// Clickable profile picture that redirects you to the user's profile
function InteractiveProfilePicture({user_id, userData, nonInter}){
    
    const navigate = useNavigate();

    const HandleImageClick = () => {
        navigate(`/Profile/${user_id}`);
    }

    // For alt, use the standard no pfp img
    if (nonInter)
        return(
            <img className={s.interactive_pfp_noninter} title={`${userData.name} ${userData.surname}`} src={userData.profilePicture} alt="nonInteractive PFP"/>
        );

    return(
        <img className={s.interactive_pfp} src={userData.profilePicture} onClick={HandleImageClick} alt="Interactive PFP"/>
    );
    
}

export default InteractiveProfilePicture;