import React from 'react';
import s from './NotificationStyle.module.css';

function Notification({ profilePic, name, surname, isInterestOrComment, comment, postPic, postCaption }) {

    const onNotificationClick = () => {
        // useNavigate(use path)
    };

    return (
        <div className={s.notification} onClick={onNotificationClick}>
            <img src={profilePic} alt="Profile" className={s.profilePic} />
            <div className={s.textContainer}>
                <div className={s.userDetails}>
                    <span className={s.name}>{name}</span>
                    <span className={s.surname}>{surname}</span>
                </div>
                <div className={s.interestOrComment}>
                    {isInterestOrComment ? "is interested in your post" : "commented on your post"}
                    {<span className={s.postCaption}>{postCaption}</span>}
                </div>
                {!isInterestOrComment && <div className={s.comment}> " {comment} " </div>}
            </div>
            <div className={s.postContainer}>
                {postPic ? <img src={postPic} alt="Post" className={s.postPic} /> : ''}
            </div>
        </div>
    );
}

export default Notification;