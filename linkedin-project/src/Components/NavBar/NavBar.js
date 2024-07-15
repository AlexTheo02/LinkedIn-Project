import './NavBarStyle.css';
import HomeLogo from "../HomeLogo/HomeLogo.js"

function NavBar(){
  return (
    <div className="navbar">

        <div className="navbar-left">
        <HomeLogo />
        </div>

        <div className="navbar-center">
            <ul>
                <li>
                Network
                </li>

                <li>
                Jobs
                </li>

                <li>
                Conversations
                </li>

                <li>
                Notifications
                </li>

                <li>
                Personal Details
                </li>

                <li>
                Options
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