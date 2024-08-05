import s from "./PostStyle.module.css";
import {HorizontalSeparator} from "../Separators/Separators.js"
import malakes from "../../Images/ergasia_welcome_page_image.png"
import mitsotakis_desk from "../../Images/mitsotakis_desk.jpg"

import {
    InteractiveProfile,
    Timestamp,
    PostCaption,
    PostMultimedia,
    PostInfoBar,
    PostInteractionBar,
    PostPreviewComments
} from "./PostComponents.js";

function getPostById(pid){
    var user_id,timestamp,caption,multimedia,multimediaType,likeCount,commentCount,isLiked

    // Access database and fetch variables
    if (pid === 3){
        user_id = 2;
        timestamp = "8:46 AM 11/09/2001"
        caption = "I am very excited to announce that i am joining Linkedin!"
        multimedia = malakes;
        multimediaType = "image"
        likeCount = 1;
        commentCount = 1;
        isLiked = true; 
    }
    if (pid === 2){
        user_id = 2;
        timestamp = "5:06 PM 20/07/2024"
        caption = "This is me in my office today. I guess you could say i am truly commited to what i do!"
        multimedia = mitsotakis_desk;
        multimediaType = "image"
        likeCount = 666;
        commentCount = 420;
        isLiked = true; 
    }

    return(
        {
            user_id,
            timestamp,
            caption,
            multimedia,
            multimediaType,
            likeCount,
            commentCount,
            isLiked
        }
    )
}

function Post({post, commentsPopupHandler}){


    // Fetch from database
    // const {
    //     user_id,
    //     timestamp,
    //     caption,
    //     multimediaURL,
    //     multimediaType,
    //     likeCount,
    //     commentCount,
    //     isLiked
    // } = getPostById(post_id);
    

    // Then create components

    // if (commentCount > 0)
    //     return (
    //         <div className={s.post}>
                
    //             <div className={s.post_header}>
    //             <InteractiveProfile user_id={user_id}/>
    //             <Timestamp timestamp={timestamp}/>
    //             </div>
                
                
    //             <PostCaption caption={caption}/>
    //             <PostMultimedia multimedia={multimedia} multimediaType={multimediaType}/>
    //             <PostInfoBar likeCount={likeCount} commentCount={commentCount}/>
    //             <HorizontalSeparator/>
    //             <PostInteractionBar isLiked={isLiked}/>

    //             If comments_num > 0, then render these, else, render none
    //             <HorizontalSeparator/>
    //             Comments
    //             <PostPreviewComments post_id={post_id} commentsPopupHandler={commentsPopupHandler} />
    //         </div>
    //     );
    const multimediaURL="https://storage.googleapis.com/linkedin_project_bucket/1722867620034-christmas%20small%20doge.png"
    const multimediaType = "image";
    return (
        <div className={s.post}>
            
            {/* <div className={s.post_header}>
            <InteractiveProfile user_id={user_id}/>
            <Timestamp timestamp={timestamp}/>
            </div> */}
            
            
            <PostCaption caption={post.caption}/>
            <PostMultimedia multimediaURL={multimediaURL} multimediaType={multimediaType}/>
            {/* <PostInfoBar likeCount={likeCount} commentCount={commentCount}/>
            <HorizontalSeparator/>
            <PostInteractionBar isLiked={isLiked}/> */}
        </div>
    );
}

export default Post