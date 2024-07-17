import './NavBarStyle.css';
import HomeLogo from "../HomeLogo/HomeLogo.js"
import NavBarNavigateButton from './NavbarCategories.js';

function NavBar(){
  return (
    <div className="navbar">

        <div className="navbar-left">
        <HomeLogo isWelcome={false}/>
        </div>

        <div className="navbar-center">
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

        <div className="navbar-right">
            navbar-right
        </div>




        
    </div>
  );
}

export default NavBar;