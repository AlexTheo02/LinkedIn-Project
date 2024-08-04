import { useState, useEffect } from "react";
import Post from "../../../Components/PostComponent/Post";
import s from "./TimelinePostsStyle.module.css"

function TimelinePosts({commentsPopupHandler}) {
    const [posts, setPosts] = useState(null);

    // Fetch posts from database
    useEffect(() => {
        const fetchPosts = async() => {
            const response = await fetch('/api/posts');
            const json = await response.json();

            if (response.ok){
                setPosts(json);
            }
        }

        fetchPosts()

        // filter posts for user's timeline
    }, [])


    return(
        <div className={s.posts}>
            {posts && posts.map((post) => (
                <Post key={post._id} post={post} commentsPopupHandler={commentsPopupHandler}/>
            ))}
            
        </div>
        
    );
}

export default TimelinePosts;