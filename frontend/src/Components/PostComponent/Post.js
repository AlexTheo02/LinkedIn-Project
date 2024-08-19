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
import { useAuthContext } from "../../Hooks/useAuthContext.js";
import { useEffect, useState } from "react";


function Post({postData, commentsPopupHandler}){
    const {user} = useAuthContext();
    const authorData = postData.author;
    const [likeCount, setLikeCount] = useState("");
    const [commentCount, setCommentCount] = useState("");

    // Update counters when data changes
    useEffect(() => {
        setLikeCount(postData.likesList.length)
        setCommentCount(postData.commentsList.length)
    }, [user, postData])

    return (
        <div className={s.post}>
            
            <div className={s.post_header}>
            <InteractiveProfile user_id={postData.author._id} profilePicture={authorData.profilePicture} name={authorData.name} surname={authorData.surname} />
            <Timestamp timestamp={postData.createdAt}/>
            </div>
            
            
            <PostCaption caption={postData.caption}/>
            { postData.multimediaURL && <PostMultimedia multimediaURL={postData.multimediaURL} multimediaType={postData.multimediaType}/> }
            <PostInfoBar likeCount={likeCount} commentCount={commentCount}/>
            <HorizontalSeparator/>
            <PostInteractionBar post_id={postData._id} commentsList={postData.commentsList} likesList={postData.likesList} commentsPopupHandler={commentsPopupHandler}/>
            {postData.commentsList.length > 0 ?  
                <>
                    <HorizontalSeparator/>
                    <PostPreviewComments post_id={postData._id} commentsList={postData.commentsList} commentsPopupHandler={commentsPopupHandler} />
                </> : <></>}
        </div>
    );
}

export default Post