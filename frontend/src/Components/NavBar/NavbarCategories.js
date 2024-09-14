import s from "./NavBarStyle.module.css"
import { useNavigate } from "react-router-dom";

function NavBarNavigateButton({toRoute, currentPage}){

    const navigate = useNavigate();

    const handleClick = () =>{
        toRoute === currentPage ? window.location.reload() : navigate(`/${toRoute}`)
    };
    return(
        <button
        className={`${s.navbar_navigate_button} ${toRoute === currentPage ? s.active : ''}`}
        onClick={handleClick}
        >
            {toRoute}
        </button>
    );
}

export default NavBarNavigateButton;