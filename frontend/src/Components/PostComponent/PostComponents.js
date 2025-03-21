import s from "./PostStyle.module.css";
import {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { HorizontalSeparator, VerticalSeparator } from "../Separators/Separators";

import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as faThumbsUpSolid} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";
import {faThumbsUp as faThumbsUpRegular} from "@fortawesome/free-regular-svg-icons";
import TextAreaAutosize from "react-textarea-autosize"
import { useAuthContext } from "../../Hooks/useAuthContext";
import { usePostsContext } from "../../Hooks/usePostsContext";

// Components that are needed to construct a Post Component

function InteractiveProfile({profilePicture, name, surname, user_id, altern, nonInteractive, closeCommentsPopup}){

    // Change arguments to user_id, then get pfp and username from database
    const navigate = useNavigate();

    const handleProfileClick = () => {
        // Navigate to user's profile based on the id
        closeCommentsPopup && closeCommentsPopup();
        if (!nonInteractive) { navigate(`/Profile/${user_id}`); }
    }

    const style = altern ? s.alt_interactive_profile : s.interactive_profile

    return(
        // Should be clickable and redirect you to the user's profile
        <div onClick={handleProfileClick} className={`${style} ${nonInteractive ? s.non_interactive : ""}`}>
            <img className= {s.post_profile_picture} src={profilePicture} alt="User Profile"/>
            <strong className={s.username}>{`${name} ${surname}`}</strong>
        </div>
    );
}

function Timestamp({timestamp}){
    return (
        <small className={s.timestamp}>{formatDistanceToNow(timestamp,{addSuffix: true})}</small>
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
            {(multimediaType === "Image" || multimediaType === "image") && <img src={multimediaURL} alt="No img source found" />}
            {(multimediaType === "Video" || multimediaType === "video") && <video src={multimediaURL} controls alt="No vid source found" />}
            {(multimediaType === "Audio" || multimediaType === "audio") && <audio src={multimediaURL} controls alt="No aud source found" />}
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

function LikeButton({post_id, likesList}) {
    const { user, dispatch } = useAuthContext();
    const { postDirectory, postDispatch } = usePostsContext();
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const author = postDirectory[post_id].author._id;

    useEffect(() => {
        setIsLiked(likesList.includes(user.userId) ? true : false);
    }, [user,likesList])

    const toggleLike = async () => {
        setIsLoading(true);
        setIsLiked(!isLiked);
        if(isLiked){
            const removeIndex = likesList.findIndex(i => i === user.userId);
            // Remove user from likes list
            likesList.splice(removeIndex, 1)
        }
        else{
            // Add user to likes list
            likesList.push(user.userId);            
        }

        try{
            // Send request to the server to update the likes list
            const postResponse = await fetch(`/api/posts/${post_id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                method: "PATCH",
                body: JSON.stringify({likesList})
            })

            if (postResponse.ok){

                if (user.userId !== author && !user.interactionSource){
                    // Update localStorage's interactionSource after successful like
                    let localStorageUser = JSON.parse(localStorage.getItem('user'));
                    if (localStorageUser) {
                        localStorageUser.interactionSource = true;
                        localStorage.setItem('user', JSON.stringify(localStorageUser));
                    }
    
                    dispatch({type: 'LOGIN', payload: localStorageUser});
                }
        
                // Update the local context
                postDispatch({type: "UPDATE_POST_LIKE", payload: {post_id: post_id, likesList: likesList}});

                // Send request to the server to update the likedPosts on user
                const userLikeResponse = await fetch(`/api/users/toggleLikePost/${post_id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    },
                    method: "PATCH",
                })

                if (userLikeResponse.ok && user.userId !== author){
                    // Create notification object
                    if (!isLiked){
                        const notification = {
                            post_id,
                            isLike: true,
                            commentContent: ""
                        }
    
                        // Send request to create notification on the database
                        const notificationResponse = await fetch("/api/notifications/", {
                            method: "POST",
                            body: JSON.stringify(notification),
                            headers: {
                                "Content-Type" : "application/json",
                                'Authorization': `Bearer ${user.token}`
                            }
                        })
        
                        const json = await notificationResponse.json();
        
                        if (notificationResponse.ok){
                            try{
                                // Notify author
                                const userResponse = await fetch(`/api/users/postNotify/${json._id}/${author}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${user.token}`
                                    }
                                });
                        
                                if (userResponse.ok) {
                                    console.log('User notified successfully');
                                } else {
                                    console.error('Error notifying user');
                                }
                            } catch (error){
                                console.error('Error notifying user:', error);
                            }
                        }
                        else{
                            console.error('Error creating notification');
                        }
                    }
                }
            }
            else{
                console.error('Error liking the post');
            }
            
        } catch (error) {
            console.error('Error liking the post:', error);
        }
        setIsLoading(false);
    };

    return (
        <>
            {isLiked ? <FontAwesomeIcon icon={faThumbsUpSolid} onClick={!isLoading ? toggleLike : () => {}} className={s.post_interaction_bar_button}/> : <FontAwesomeIcon icon={faThumbsUpRegular} onClick={!isLoading ? toggleLike : () => {}} className={s.post_interaction_bar_button}/>}
        </>
    );
}

function PostInteractionBar({post_id, commentsList, likesList, commentsPopupHandler}){

    const { postDispatch } = usePostsContext();

    const handleClick = () => {
        postDispatch({type: "SET_ACTIVE_COMMENTS_LIST", payload: commentsList});
        postDispatch({type: "SET_ACTIVE_POST_ID", payload: post_id});
        commentsPopupHandler.showCommentsPopup();

    }

    return (
        <div className={s.interaction_bar}>
            <LikeButton post_id={post_id} likesList={likesList}/>
            <VerticalSeparator/>
            <FontAwesomeIcon icon={faComment} className={s.post_interaction_bar_button} onClick={handleClick}/>
        </div>
    );
}

function PostPreviewComments({post_id, commentsList, commentsPopupHandler}){

    const previewCommentData = commentsList[0];
    const previewAuthor = previewCommentData.author;

    return(
        <div className={s.post_preview_comments}>
            <Comment commentData={previewCommentData} author={previewAuthor}/>
            <ShowAllCommentsButton post_id={post_id} commentsList={commentsList} commentsPopupHandler={commentsPopupHandler}/>
        </div>
    )
}

function Comment({commentData, author, onProfileClick}){

    return(
        <div className={s.comment}>
            <InteractiveProfile profilePicture={author.profilePicture} user_id={author._id} name={author.name} surname={author.surname} altern={true} closeCommentsPopup={onProfileClick}/>
            <div className={s.comment_content}>
                {commentData.content}
            </div>
            <Timestamp timestamp={commentData.createdAt}/>
        </div>
    )
}

function ShowAllCommentsButton({post_id, commentsList, commentsPopupHandler}){

    const { postDispatch } = usePostsContext();

    const handleClick = () => {
        commentsPopupHandler.showCommentsPopup(post_id)
        postDispatch({type: "SET_ACTIVE_COMMENTS_LIST", payload: commentsList});
        postDispatch({type: "SET_ACTIVE_POST_ID", payload: post_id});
    }

    return (
        <button className={s.show_comments_popup_button} onClick={handleClick}>
            Show all comments
        </button>
    );
}

const AddComment = ({userData}) => {
    const { postDirectory, activePostId, activeCommentsList, postDispatch } = usePostsContext();
    const validCommentRegex = /\S/;
    const {user, dispatch} = useAuthContext();
    const [commentValue, setCommentValue] = useState("");

    const postComment = async () => {
        if(validCommentRegex.test(commentValue)){
            const trimmedComment = commentValue.trim();

            const comment = {
                author: user.userId,
                content: trimmedComment.replace(/\s+/g, ' '), // Replace extra whitespace with a single space.
            }

            setCommentValue("");
            
            const response = await fetch(`/api/posts/add-comment/${activePostId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                method: "PATCH",
                body: JSON.stringify(comment)
            });
            
            const json = await response.json();

            // Add comment to user's publishedComments list
            const userCommentResponse = await fetch(`/api/users/publishComment/${json.populatedComment._id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                method: "PATCH"
            });

            if (response.ok && userCommentResponse.ok){

                if (user.userId !== postDirectory[activePostId].author._id && !user.interactionSource){
                    // Update localStorage's interactionSource after successful comment
                    let localStorageUser = JSON.parse(localStorage.getItem('user'));
                    if (localStorageUser) {
                        localStorageUser.interactionSource = true;
                        localStorage.setItem('user', JSON.stringify(localStorageUser));
                    }

                    dispatch({type: 'LOGIN', payload: localStorageUser});
                }

                postDispatch({type: "SET_ACTIVE_COMMENTS_LIST", payload: [json.populatedComment, ...activeCommentsList]});

                // Update post on posts context
                postDispatch({type: "UPDATE_COMMENTS_LIST_ON_POST"});

                if (user.userId !== postDirectory[activePostId].author._id){
                    // Κώδικας για δημιουργία notification
                    const notification = {
                        post_id: activePostId,
                        isLike: false,
                        commentContent: trimmedComment.replace(/\s+/g, ' ')
                    }

                    const notificationResponse = await fetch("/api/notifications/", {
                        method: "POST",
                        body: JSON.stringify(notification),
                        headers: {
                            "Content-Type" : "application/json",
                            'Authorization': `Bearer ${user.token}`
                        }
                    });

                    const notification_json = await notificationResponse.json();

                    if (notificationResponse.ok){
                        try{
                            const userResponse = await fetch(`/api/users/postNotify/${notification_json._id}/${postDirectory[activePostId].author._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user.token}`
                                }
                            });
                    
                            if (userResponse.ok) {
                                console.log('User notified successfully');
                            } else {
                                console.error('Error notifying user');
                            }
                        } catch (error){
                            console.error('Error notifying user:', error);
                        }
                    }
                    else{
                        console.error('Error creating notification');
                    }
                }
            }
        }       
    }

    // Press enter to post comment
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          postComment();
        }
      };

    return (
        <div className={s.add_comment_container}>
            <div className={s.comment}>
                <InteractiveProfile user_id={user.userId} profilePicture={userData.profilePicture} name={userData.name} surname={userData.surname} altern={true} nonInteractive={true}/>
                <div className={s.add_comment_field_container}>
                    <TextAreaAutosize
                        type="text"
                        value={commentValue}
                        onChange={(e) => {setCommentValue(e.target.value)}}
                        onKeyDown={handleKeyDown}
                        className={s.add_comment_field} placeholder="Add comment"
                    />
                    <FontAwesomeIcon className={s.post_comment_icon} onClick={postComment} icon={faPaperPlane}/>
                </div>
            </div>
        </div>
    )
}


function CommentsPopup({userData, commentsPopupHandler}){
    // Use context to access active comments list
    const { activeCommentsList } = usePostsContext();
    const {user} = useAuthContext()

    return(
        <div className={commentsPopupHandler.isPopupVisible ? s.comments_popup_visible : s.comments_popup_invisible}>
            <div className={s.comments_popup_header}>
                All Comments
                <button className={s.hide_comments_popup_button} onClick={commentsPopupHandler.hideCommentsPopup}>
                    Hide comments
                </button>
            </div>
            <HorizontalSeparator />
            {/* MAP COMMENTS LIST */}
            <div className={s.comments_popup_container}>
                {activeCommentsList && activeCommentsList.map((comment, index) => (
                    <div key={`comment-map-${index}`}>
                        <Comment commentData={comment} author={comment.author} onProfileClick={commentsPopupHandler.hideCommentsPopup}/>
                    </div>
                ))
                }
            </div>
            {!user.admin &&
                <AddComment userData={userData}/>
            }
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