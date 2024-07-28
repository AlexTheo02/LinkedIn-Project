import s from "./PostPageStyle.module.css"
import { useState } from "react";

import NavBar from "../../Components/NavBar/NavBar.js"
import Post from "../../Components/PostComponent/Post.js"
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";

function PostPage({post_id}) {

    // Comments popup state
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(post_id);

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

    return (
        <div className={s.post_page}>
            <NavBar />
            <div className={s.post_page_contents_container}>
                <CommentsPopup commentsPopupHandler={commentsPopupHandler}/>
                <Post post_id={post_id} commentsPopupHandler={commentsPopupHandler}/>
            </div>
        </div>
    );
}

export default PostPage;