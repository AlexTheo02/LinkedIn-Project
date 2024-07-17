import s from "./NavBarStyle.module.css"
import { useNavigate } from "react-router-dom";


function NavBarNavigateButton({toRoute}){

    const navigate = useNavigate();

    const handleClick = () =>{
        navigate(`/${toRoute}`)
    };
    return(
        <button
        className={s.navbar_navigate_button}
        onClick={handleClick}
        >
            {toRoute}
        </button>
    );
}

export default NavBarNavigateButton;