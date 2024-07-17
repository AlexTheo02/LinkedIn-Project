import "./NavBarStyle.css"
import { useNavigate } from "react-router-dom";


function NavBarNavigateButton({toRoute}){

    const navigate = useNavigate();

    const handleClick = () =>{
        navigate(`/${toRoute}`)
    };
    return(
        <button
        className="navbar-navigate-button"
        onClick={handleClick}
        >
            {toRoute}
        </button>
    );
}

export default NavBarNavigateButton;