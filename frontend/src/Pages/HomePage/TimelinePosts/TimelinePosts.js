import { useEffect } from "react";
import Post from "../../../Components/PostComponent/Post";
import s from "./TimelinePostsStyle.module.css"
import { usePostsContext } from "../../../Hooks/usePostsContext";
import { useAuthContext } from "../../../Hooks/useAuthContext";

function TimelinePosts({commentsPopupHandler}) {
    const {posts, activeCommentsList, postDispatch} = usePostsContext()
    const {user} = useAuthContext()

    // Fetch posts from database
    useEffect(() => {
        const fetchPosts = async() => {
            const response = await fetch('/api/posts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok){
                postDispatch({type: 'SET_POSTS', payload: json})
            }
        }

        if (user){
            fetchPosts()
        }
        // filter posts for user's timeline
    }, [postDispatch, user])


    return(
        <div className={s.posts}>
            {posts && posts.map((post) => (
                <Post key={post._id} postData={post} commentsPopupHandler={commentsPopupHandler}/>
            ))}
            
        </div>
        
    );
}

export default TimelinePosts;