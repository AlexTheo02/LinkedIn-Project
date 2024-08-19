import s from "./PostPageStyle.module.css"
import { useEffect, useState } from "react";

import NavBar from "../../Components/NavBar/NavBar.js"
import Post from "../../Components/PostComponent/Post.js"
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";
import { useAuthContext } from "../../Hooks/useAuthContext.js";
import { usePostsContext } from "../../Hooks/usePostsContext.js";
import { useParams, useNavigate } from 'react-router-dom';

function PostPage() {
    const [isLoading, setIsLoading] = useState(null);

    const {user} = useAuthContext();

    const { post_id } = useParams(); // Ανάκτηση του post_id από το URL

    const [postData, setPostData] = useState(null);

    const {activeComments, postDispatch} = usePostsContext();

    useEffect(() => {
        const fetchPostData = async () => {
            const response = await fetch(`/api/posts/${post_id}`,{
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const post = await response.json();

            if (response.ok){
                setPostData(post)
                postDispatch({type: "SET_ACTIVE_COMMENTS", payload: post.commentsList});
            }
            else{
                setPostData(false);
                console.log("Error fetching post");
                return <h1 className={s.loading_text}>Error 404, Post not found</h1>;
            }
        }

        fetchPostData();
    }, [post_id, user])

    // Comments popup state
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(post_id);

    if(!postData){
        return postData === null ? <h1 className={s.loading_text}>Loading...</h1> : <h1 className={s.loading_text}>Error 404, post not found.</h1>;;
    }


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
            {
                isLoading ? <h1 className={s.loading_text}>Loading...</h1> :
                <div className={s.post_page_contents_container}>
                <CommentsPopup commentsPopupHandler={commentsPopupHandler}/>
                <Post postData={postData} commentsPopupHandler={commentsPopupHandler}/>
                </div>
            }
        </div>
    );
}

export default PostPage;