import React from 'react';
import s from "./PostNotificationsStyle.module.css";
import Notification from '../Notification/Notification';

function PostNotifications({ notifications }) {

    return (
        <div className={s.notifications_list}>
            {notifications.map(notification => (
                <Notification 
                    key={notification.id} 
                    profilePic={notification.profilePic} 
                    name={notification.name} 
                    surname={notification.surname} 
                    isInterestOrComment={notification.isInterestOrComment}
                    comment={notification.comment}
                    postPic={notification.postPic}
                    postCaption={notification.postCaption} 
                />
            ))}
        </div>
    );
}

export default PostNotifications;