// This .js file contains every component needed to construct a Post

import s from "./PostStyle.module.css";
import {useState} from "react"
import likedButtonImg from "../../Images/LikedButton.png"
import notLikedButtonImg from "../../Images/LikeButton.png"
import { useNavigate } from "react-router-dom";
import { HorizontalSeparator, VerticalSeparator } from "../Separators/Separators";

import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"



function InteractiveProfile({user_id, altern}){
    // Replace with database access
    var profilePicture,userName
    if (user_id === 3){
        profilePicture = tsipras;
        userName = "Alexis Tsipras";
    }
    if (user_id === 2){
        profilePicture = mitsotakis;
        userName = "Kyriakos Mitsotakis"
    }


    // Change arguments to user_id, then get pfp and username from database
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/");
    }

    const style = altern ? s.alt_interactive_profile : s.interactive_profile

    return(
        // Should be clickable and redirect you to the user's profile
        <div onClick={handleProfileClick} className={style}>
            <img className= {s.post_profile_picture} src={profilePicture} alt="NO PROFILE PIC"/>
            <strong className={s.username}>{userName}</strong>
        </div>
    );
}

function Timestamp({timestamp}){
    return (
        <small className={s.timestamp}>{timestamp}</small>
    );
}

function PostCaption({caption}){
    return(
        <div className={s.post_caption}>{caption}</div>
    )
}

function PostMultimedia({multimedia, multimediaType}){
    return(
        <div className={s.multimedia}>
            {multimediaType === "image" && <img src={multimedia} alt="No img source found" />}
            {multimediaType === "video" && <video src={multimedia} controls alt="No vid source found" />}
            {multimediaType === "audio" && <audio src={multimedia} controls alt="No aud source found" />}
        </div>
    )
}

function PostInfoBar({likeCount, commentCount}){
    return (
        <div className={s.post_info_bar}>
            <div className={s.info_bar_left}>
                <img src={likedButtonImg} alt="Like Button"/>
                <small className={s.like_count}>{likeCount} Likes</small>
            </div>
            <small className={s.comment_count}>{commentCount} Comments</small>
            
        </div>
    )
}

function LikeButton({ initialLiked }) {
    const [isLiked, setIsLiked] = useState(initialLiked);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <button className={s.like_button} onClick={toggleLike}>
            {isLiked ? <img src={likedButtonImg} alt="Liked Button"/> : <img src={notLikedButtonImg} alt="Not Liked Button"/>}
        </button>
    );
}

function PostInteractionBar({isLiked}){
    return (
        <div className={s.interaction_bar}>
            <LikeButton />
            <VerticalSeparator/>
            <button className={s.comment_button}>
                Comment
            </button>
        </div>
    );
}

function PostPreviewComments({post_id, commentsPopupHandler}){

    const preview_comment_id = 3; // Use function to fetch from database using post_id

    return(
        <div className={s.post_preview_comments}>
            <Comment comment_id={preview_comment_id}/>
            <ShowAllCommentsButton post_id={post_id} commentsPopupHandler={commentsPopupHandler}/>
        </div>
    )
}

function Comment({comment_id}){

    // const user_id = getUserByCommentId(comment_id) // Implement function on backend

    const user_id = 3;
    const content = "I am very proud of you my dear friend Koulis!"
    return(
        <div className={s.comment}>
            <InteractiveProfile user_id={user_id} altern={true}/>
            <div className={s.comment_content}>
                {content}
            </div>
        </div>
    )
}

function ShowAllCommentsButton({post_id, commentsPopupHandler}){

    const handleClick = () => {
        commentsPopupHandler.showCommentsPopup(post_id)
    }

    return (
        <button className={s.show_comments_popup_button} onClick={handleClick}>
            Show all comments
        </button>
    );
}

function CommentsPopup({commentsPopupHandler}){
    // Fetch from database
    // const comments = commentsData[post_id] || [];

    // Fetch all comments and render them on a floating window

    // MODIFY TO GET THE COMMENTS IN A LIST, AND RENDER THEM HERE (i think use .map, check)
    if (commentsPopupHandler.selectedPostId === 3)
        return(
            <div className={commentsPopupHandler.isPopupVisible ? s.comments_popup_visible : s.comments_popup_invisible}>
                <div className={s.comments_popup_header}>
                    All Comments
                    <button className={s.hide_comments_popup_button} onClick={commentsPopupHandler.hideCommentsPopup}>
                        Hide comments
                    </button>
                </div>
                <HorizontalSeparator />
                <div className={s.comments_popup_container}>
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                </div>
            </div>
        );
    else
        return(
            <div className={commentsPopupHandler.isPopupVisible ? s.comments_popup_visible : s.comments_popup_invisible}>
                <div className={s.comments_popup_header}>
                    All Comments
                    <button className={s.hide_comments_popup_button} onClick={commentsPopupHandler.hideCommentsPopup}>
                        Hide comments
                    </button>
                </div>
                <HorizontalSeparator />
                <div className={s.comments_popup_container}>
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                    <HorizontalSeparator />
                    <Comment comment_id={3}/>
                </div>
            </div>
    );
}


// Export all components
export {
    InteractiveProfile,
    Timestamp,
    PostCaption,
    PostMultimedia,
    PostInfoBar,
    PostInteractionBar,
    PostPreviewComments,
    CommentsPopup
}