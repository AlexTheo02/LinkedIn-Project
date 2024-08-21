import s from "./PersonalDetailsPanelStyle.module.css"
import { InteractiveProfile } from "../PostComponent/PostComponents";
import { HorizontalSeparator } from "../Separators/Separators";
import { useAuthContext } from "../../Hooks/useAuthContext";
import NetworkUsersList from "../NetworkUsersList/NetworkUsersList"
import { useNavigate } from "react-router-dom";

function PersonalDetailsPanel({userData}){
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleNetworkShowMore = () => {
        navigate('/Network')
    }

    const handlePersonalDetailsShowMore = () => {
        navigate('/Personal Details')
    }

    return(
        <div className={s.personal_details_panel}>
            <h3>Personal Details Panel</h3>

            <div className={s.horizontal_separator}>
                <HorizontalSeparator/>
            </div>

            <InteractiveProfile profilePicture={userData.profilePicture} name={userData.name} surname={userData.surname} user_id={user.userId} altern={true}/>

            <div className={s.horizontal_separator}>
                <HorizontalSeparator/>
            </div>
            
            <div className={s.pdp_personal_details}>
                <div className={s.options_bar}>
                    <h3>Personal Details</h3>
                    <button onClick={handlePersonalDetailsShowMore}>
                        Go to my Personal Details
                    </button>
                </div>
                <h4>{userData.workingPosition} at {userData.employmentOrganization}</h4>
                <h4 className={s.place_of_residence_text}>Located at {userData.placeOfResidence}</h4>
                <h4>Your Skills:</h4>
                {userData.skills.length > 0 ? (
                    <p>
                        Mpla mpla1
                        Mpla mpla2
                        Mpla mpla3 jcjdncednchneyhcbhewbhrgb bhcbercbchrbchbcyhebchgbryhbcv c yrecedcbheucbiehric ne irnvjenu jnjv nj 
                    </p>
                ) : (
                    <p className={s.skills_empty}>You have not filled in your skills yet. Go to your personal details to set it up.</p>
                )}
            </div>

            <div className={s.horizontal_separator}>
                <HorizontalSeparator/>
            </div>

            <div className={s.pdp_network}>

                <div className={s.options_bar}>
                    <h3>Your Network</h3>
                    <button onClick={handleNetworkShowMore}>
                        Go to my Network
                    </button>
                </div>
                <NetworkUsersList network={userData.network} />
            </div>

        </div>
    );
}

export default PersonalDetailsPanel;