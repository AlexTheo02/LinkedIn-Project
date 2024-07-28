import s from "./HomeLogoStyle.module.css";
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

function HomeLogo({isWelcome, isHome}){
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        isWelcome || isHome ? window.location.reload() : navigate("/Home")
    };

    return (
        <FontAwesomeIcon 
            icon={faLinkedin} 
            className={s.logo} 
            alt="Logo"
            onClick={handleLogoClick}
            title= {isWelcome ? "Return to Welcome Page" : "Return to Home Page"} 
        />
    );
}

export default HomeLogo;