import React, { useState, useEffect } from 'react';
import s from "./PostNotificationsStyle.module.css";
import Notification from '../Notification/Notification';
import { useAuthContext } from '../../../Hooks/useAuthContext';

function PostNotifications() {
    const {user} = useAuthContext()
    const [notifications, setNotifications] = useState(null);

    // Fetch posts from database
    useEffect(() => {
        const fetchPosts = async() => {
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok){
                setNotifications(json);
                console.log(json);
            }
        }

        if (user){
            fetchPosts()
        }
        
    }, [user])

    if (!notifications) {
        return;
    }

    return (
        <div className={s.notifications_list}>
            {notifications.map(notification => (
                <Notification 
                    key={notification} 
                    id={notification}
                />
            ))}
        </div>
    );
}

export default PostNotifications;