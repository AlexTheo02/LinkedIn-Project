// This .js file contains every component needed to construct a Post

import s from "./PostStyle.module.css";
import {useState} from "react"
import { useNavigate } from "react-router-dom";
import { HorizontalSeparator, VerticalSeparator } from "../Separators/Separators";

import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as faThumbsUpSolid} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp as faThumbsUpRegular} from "@fortawesome/free-regular-svg-icons";
import TextAreaAutosize from "react-textarea-autosize"



function InteractiveProfile({user_id, altern, nonInteractive}){
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
        if (!nonInteractive) { navigate("/"); }
    }

    const style = altern ? s.alt_interactive_profile : s.interactive_profile

    return(
        // Should be clickable and redirect you to the user's profile
        <div onClick={handleProfileClick} className={`${style} ${nonInteractive ? s.non_interactive : ""}`}>
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

function PostMultimedia({multimediaURL, multimediaType}){
    return(
        <div className={s.multimedia}>
            {multimediaType === "image" && <img src={multimediaURL} alt="No img source found" />}
            {multimediaType === "video" && <video src={multimediaURL} controls alt="No vid source found" />}
            {multimediaType === "audio" && <audio src={multimediaURL} controls alt="No aud source found" />}
        </div>
    )
}

function PostInfoBar({likeCount, commentCount}){
    return (
        <div className={s.post_info_bar}>
            <div className={s.info_bar_left}>
                <small className={s.like_count}>{likeCount} Likes</small>
            </div>
            <small className={s.comment_count}>{commentCount} Comments</small>
            
        </div>
    )
}

function LikeButton({ initialLiked }) {
    const [isLiked, setIsLiked] = useState(initialLiked);

    // Move state upwards and get the function
    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <>
            {isLiked ? <FontAwesomeIcon icon={faThumbsUpSolid} onClick={toggleLike} className={s.post_interaction_bar_button}/> : <FontAwesomeIcon icon={faThumbsUpRegular} onClick={toggleLike} className={s.post_interaction_bar_button}/>}
        </>
    );
}

function PostInteractionBar({isLiked, commentsPopupHandler}){
    return (
        <div className={s.interaction_bar}>
            <LikeButton />
            <VerticalSeparator/>
            <FontAwesomeIcon icon={faComment} className={s.post_interaction_bar_button} onClick={commentsPopupHandler.showCommentsPopup}/>
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
    // Add timestamp on top right
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

const AddComment = ({user}) => {
    const user_id = 3;
    const [commentValue, setCommentValue] = useState("");

    const postComment = () => {
        setCommentValue("");    
    }
    return (
        <div className={s.add_comment_container}>
            <div className={s.comment}>
                <InteractiveProfile user_id={user_id} altern={true} nonInteractive={true}/>
                <div className={s.add_comment_field_container}>
                    <TextAreaAutosize
                        type="text"
                        value={commentValue}
                        onChange={(e) => {setCommentValue(e.target.value)}}
                        className={s.add_comment_field} placeholder="Add comment"
                        
                    />
                    <FontAwesomeIcon className={s.post_comment_icon} onClick={postComment} icon={faPaperPlane}/>
                </div>
            </div>
        </div>
    )
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
                <AddComment />
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
                <AddComment />
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