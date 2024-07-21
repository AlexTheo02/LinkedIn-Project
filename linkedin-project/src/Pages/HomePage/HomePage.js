import s from "./HomePageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import PersonalDetailsPanel from "../../Components/PersonalDetailsPanel/PersonalDetailsPanel.js"
import Post from "../../Components/PostComponent/Post";
import { useState } from "react";
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";

function HomePage() {

        // Comments popup state
        const [isPopupVisible, setIsPopupVisible] = useState(false);
        const [selectedPostId, setSelectedPostId] = useState(null);
    
        const showCommentsPopup = (post_id) => {
            setIsPopupVisible(true);
            setSelectedPostId(post_id)
        };
    
        const hideCommentsPopup = () => {
            setIsPopupVisible(false);
            setSelectedPostId(null);            
        };
        
        // Struct for efficiency
        const commentsPopupHandler = {
            showCommentsPopup,
            hideCommentsPopup,
            isPopupVisible,
            selectedPostId
        }

    return(
        <div className={s.home_page}>
            <NavBar isHome={true}/>
            <container className={s.container}>
                <PersonalDetailsPanel />
                <CommentsPopup commentsPopupHandler={commentsPopupHandler}/>
                <timeline className={s.timeline}>
                    <Post post_id={3} commentsPopupHandler={commentsPopupHandler}/>
                    <Post post_id={2} commentsPopupHandler={commentsPopupHandler}/>
                    <Post post_id={3} commentsPopupHandler={commentsPopupHandler}/>
                </timeline>
                
            </container>
            
        </div>
    );
}

export default HomePage;