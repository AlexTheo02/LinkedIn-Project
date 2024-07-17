// This .js file contains every component needed to construct a Post

import s from "./PostStyle.module.css";
import {useState} from "react"
import likedButtonImg from "../../Images/LikedButton.png"
import notLikedButtonImg from "../../Images/LikeButton.png"
import { useNavigate } from "react-router-dom";


function InteractiveProfile({profilePicture, userName}){
    
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate("/");
    }

    return(
        // Should be clickable and redirect you to the user's profile
        <div onClick={handleProfileClick} className={s.interactive_profile}>
            <img className={s.post_profile_picture} src={profilePicture} alt="NO PROFILE PICTURE"/>
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
            {multimediaType === "image" && <img src={multimedia} alt="No image source found" />}
            {multimediaType === "video" && <video src={multimedia} controls alt="No video source found" />}
            {multimediaType === "audio" && <audio src={multimedia} controls alt="No audio source found" />}
        </div>
    )
}

function PostInfoBar({likeCount, commentCount}){
    return (
        <div className={s.post_info_bar}>
            <div className={s.info_bar_left}>
                <img src={likedButtonImg}/>
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

function PostInteractionBar(isLiked){
    return (
        <div className={s.interaction_bar}>
            <LikeButton />
            <button className={s.comment_button}>
                Comment
            </button>
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
    PostInteractionBar
}