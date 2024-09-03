import s from "./PostPageStyle.module.css"
import { useEffect, useState } from "react";

import NavBar from "../../Components/NavBar/NavBar.js"
import Post from "../../Components/PostComponent/Post.js"
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";
import { useAuthContext } from "../../Hooks/useAuthContext.js";
import { usePostsContext } from "../../Hooks/usePostsContext.js";
import { useParams } from 'react-router-dom';

function PostPage() {
    const {user} = useAuthContext();

    const { post_id } = useParams(); // Ανάκτηση του post_id από το URL
    const [userData, setUserData] = useState(null);

    const {posts, postDispatch} = usePostsContext();

    useEffect(() => {
        const fetchPostData = async () => {
            const response = await fetch(`/api/posts/${post_id}`,{
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const post = await response.json();

            if (response.ok){
                postDispatch({type: "SET_POSTS", payload: [post]})
            }
            else{
                console.log("Error fetching post");
                return <h1 className={s.loading_text}>Error 404, Post not found</h1>;
            }
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user.userId}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchPostData();
        fetchUserData();

    }, [post_id, user, postDispatch])

    // Comments popup state
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    if(!posts || !userData){
        return <h1 className={s.loading_text}>Loading...</h1>
    }

    const showCommentsPopup = (post_id) => {
        setIsPopupVisible(true);
    };

    const hideCommentsPopup = () => {
        setIsPopupVisible(false);          
    };
    
    // Struct for efficiency
    const commentsPopupHandler = {
        showCommentsPopup,
        hideCommentsPopup,
        isPopupVisible,
    }

    return (
        <div className={s.post_page}>
            <NavBar />
            <div className={s.post_page_contents_container}>
                <CommentsPopup userData={userData} commentsPopupHandler={commentsPopupHandler}/>
                <Post postData={posts[0]} commentsPopupHandler={commentsPopupHandler}/>
            </div>
        </div>
    );
}

export default PostPage;