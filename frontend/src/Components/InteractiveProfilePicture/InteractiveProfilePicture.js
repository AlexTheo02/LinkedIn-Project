import s from "./InteractiveProfilePictureStyle.module.css"
import { useNavigate } from "react-router-dom";
import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

function InteractiveProfilePicture({user_id, userData, nonInter}){
    
    const navigate = useNavigate();

    const HandleImageClick = () => {
        navigate("/");
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