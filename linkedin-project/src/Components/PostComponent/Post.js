import s from "./PostStyle.module.css";
import {
    InteractiveProfile,
    Timestamp,
    PostCaption,
    PostMultimedia,
    PostInfoBar,
    PostInteractionBar
} from "./PostComponents.js";

function Post({
    profilePicture,
    userName,
    timestamp,
    caption,
    multimedia,
    multimediaType,
    likeCount,
    commentCount,
    isLiked
}){
    return (
        <div className={s.post}>
            
            <div className={s.post_header}>
            <InteractiveProfile profilePicture={profilePicture} userName={userName}/>
            <Timestamp timestamp={timestamp}/>
            </div>
            
            
            <PostCaption caption={caption}/>
            <PostMultimedia multimedia={multimedia} multimediaType={multimediaType}/>
            <PostInfoBar likeCount={likeCount} commentCount={commentCount}/>
            <hr class={s.separator}/>
            <PostInteractionBar isLiked={isLiked}/>
            {/* Comments */}
        </div>
    );
}

export default Post