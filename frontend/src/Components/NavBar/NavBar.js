import s from './NavBarStyle.module.css';
import HomeLogo from "../HomeLogo/HomeLogo.js"
import NavBarNavigateButton from './NavbarCategories.js';
import { useLogout } from '../../Hooks/useLogout.js';

function NavBar({isHome, currentPage}){
  const {logout} = useLogout()

  const handleLogout = () => {
    logout();
  }
  
  return (
    <div className={s.navbar}>

        <div className={s.navbar_left}>
          <HomeLogo isWelcome={false} isHome={isHome}/>
        </div>

        <div className={s.navbar_center}>
            <ul>
                <li>
                <NavBarNavigateButton toRoute="Network" currentPage={currentPage}/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Jobs" currentPage={currentPage}/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Conversations" currentPage={currentPage}/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Notifications" currentPage={currentPage}/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Personal Details" currentPage={currentPage}/>
                </li>

                <li>
                <NavBarNavigateButton toRoute="Settings" currentPage={currentPage}/>
                </li>


            </ul>
            
        </div>

        <div className={s.logout_button}>
          <button onClick={handleLogout}>Log Out</button>
        </div>




        
    </div>
  );
}

export default NavBar;