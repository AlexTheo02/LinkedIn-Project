import s from "./PersonalDetailsPanelStyle.module.css"
import { InteractiveProfile } from "../PostComponent/PostComponents";
import { HorizontalSeparator } from "../Separators/Separators";

function PersonalDetailsPanel({userID}){
    // fetch user data from database using userID
    
    const HandleNetworkShowMore = () => {

    }

    return(
        <div className={s.personal_details_panel}>
            Personal Details Panel
            <HorizontalSeparator/>

            <InteractiveProfile user_id={3} altern={true}/>

            <HorizontalSeparator/>

            <div className={s.pdp_personal_details}>
                    Personal Details
            </div>

            <HorizontalSeparator/>

            <div className={s.pdp_network}>

                <div className={s.options_bar}>
                    Network
                    <button onClick={HandleNetworkShowMore}>
                        Show More
                    </button>
                </div>

            </div>

        </div>
    );
}

export default PersonalDetailsPanel;