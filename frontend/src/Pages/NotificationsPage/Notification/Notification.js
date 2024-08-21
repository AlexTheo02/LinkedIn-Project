import React, { useState, useEffect } from 'react';
import s from './NotificationStyle.module.css';
import { useAuthContext } from '../../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function Notification({ id }) {
    const {user} = useAuthContext();
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await fetch(`/api/notifications/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                
                if (response.ok){
                    setNotification(data);
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchNotification();
    }, [user]);

    if (!notification) {
        return;
    }

    const onNotificationClick = async () => {
        if (!notification.isRead){
            const readNotification = await fetch(`/api/notifications/readNotification/${notification._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type" : "application/json",
                    'Authorization': `Bearer ${user.token}`
                }
            })
        }
        console.log(notification)
        navigate(`/Post/${notification.post_id._id}`)
    };

    return (
        <div className={`${s.notification} ${!notification.isRead ? s.notread : ''}`} onClick={onNotificationClick}>
            <img src={notification.author.profilePicture} alt="Profile" className={s.profilePic} />
            <div className={s.textContainer}>
                <div className={s.userDetails}>
                    <span className={s.name}>{notification.author.name}</span>
                    <span className={s.surname}>{notification.author.surname}</span>
                </div>
                <div className={s.interestOrComment}>
                    {notification.isLike ? "is interested in your post" : "commented on your post"}
                    {<span className={s.postCaption}>{notification.post_id.caption}</span>}
                </div>
                {!notification.isLike && <div className={s.comment}> " {notification.commentContent} " </div>}
            </div>
            <div className={s.column}>
                <div className={s.postContainer}>
                    {notification.post_id.multimediaURL &&
                        <>
                        { notification.post_id.multimediaType === "video" &&
                            <video src={notification.post_id.multimediaURL} alt="Post" className={s.postPic} ></video>
                        }
                        { notification.post_id.multimediaType === "image" &&
                            <img src={notification.post_id.multimediaURL} alt="Post" className={s.postPic} />
                        }
                        </>
                    }
                </div>
                <small className={s.timestamp}>{formatDistanceToNow(notification.createdAt,{addSuffix: true})}</small>
            </div>
        </div>
    );
}

export default Notification;