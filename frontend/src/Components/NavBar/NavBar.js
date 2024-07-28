import s from './NavBarStyle.module.css';
import HomeLogo from "../HomeLogo/HomeLogo.js"
import NavBarNavigateButton from './NavbarCategories.js';

function NavBar({isHome}){
  return (
    <div className={s.navbar}>

        <div className={s.navbar_left}>
        <HomeLogo isWelcome={false} isHome={isHome}/>
        </div>

        <div className={s.navbar_center}>
            <ul>
                <li>
                <NavBarNavigateButton toRoute="Network"/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Jobs"/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Conversations"/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Notifications"/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Personal Details"/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Settings"/>
                </li>


            </ul>
            
        </div>

        <div className={s.navbar_right}>
            navbar-right
        </div>




        
    </div>
  );
}

export default NavBar;