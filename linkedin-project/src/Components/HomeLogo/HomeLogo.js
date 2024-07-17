import logoImage from "../../Images/logo.png";
import "./HomeLogoStyle.css";
import {useNavigate} from "react-router-dom";

function HomeLogo({isWelcome}){
    const navigate = useNavigate();

    const handleLogoClick = () =>{
        isWelcome ? navigate("/") : navigate("/Home")
    };

    return (
        <img 
        src={logoImage}
        alt="Logo"
        className="logo"
        onClick={handleLogoClick}
        />
    );
}

export default HomeLogo;