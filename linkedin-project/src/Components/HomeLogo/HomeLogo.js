import logoImage from "../../Images/logo.png";
import s from "./HomeLogoStyle.module.css";
import {useNavigate} from "react-router-dom";

function HomeLogo({isWelcome, isHome}){
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        isWelcome || isHome ? window.location.reload() : navigate("/Home")
    };

    return (
        <img 
        src={logoImage}
        alt="Logo"
        className={s.logo}
        onClick={handleLogoClick}
        title={isWelcome ? undefined : "Home"}
        />
    );
}

export default HomeLogo;