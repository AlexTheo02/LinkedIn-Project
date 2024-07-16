// This .js file contains every component needed to construct a Post

import "./PostStyle.css";
import {useState} from "react"
import likedButtonImg from "../../Images/LikedButton.png"
import notLikedButtonImg from "../../Images/LikeButton.png"


function InteractiveProfile({profilePicture, userName}){
    return(
        // Should be clickable and redirect you to the user's profile
        <div className="interactive-profile">
            <img className="post-profile-picture" src={profilePicture} alt="NO PROFILE PICTURE"/>
            <strong className="username">{userName}</strong>
        </div>
    );
}

function Timestamp({timestamp}){
    return (
        <small className="timestamp">{timestamp}</small>
    );
}

function PostCaption({caption}){
    return(
        <div className="post-caption">{caption}</div>
    )
}

function PostMultimedia({multimedia, multimediaType}){
    return(
        <div className="multimedia">
            {multimediaType === "image" && <img src={multimedia} alt="No image source found" />}
            {multimediaType === "video" && <video src={multimedia} controls alt="No video source found" />}
            {multimediaType === "audio" && <audio src={multimedia} controls alt="No audio source found" />}
        </div>
    )
}

function PostInfoBar({likeCount, commentCount}){
    return (
        <div className="post-info-bar">
            <small className="like-count">{likeCount} Likes</small>

            <small className="comment-count">{commentCount} Comments</small>
        </div>
    )
}

function LikeButton({ initialLiked }) {
    const [isLiked, setIsLiked] = useState(initialLiked);

    const toggleLike = () => {
        setIsLiked(!isLiked);
    };

    return (
        <button className="like-button" onClick={toggleLike}>
            {isLiked ? <img src={likedButtonImg} alt="Liked Button"/> : <img src={notLikedButtonImg} alt="Not Button"/>}
        </button>
    );
}

function PostInteractionBar(isLiked){
    return (
        <div className="interaction-bar">
            <LikeButton />
            <button className="comment-button">
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