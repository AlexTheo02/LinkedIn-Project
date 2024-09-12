import React from 'react';
import s from "./NotificationsPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import RequestsList from './RequestsList/RequestsList';
import PostNotifications from './PostNotifications/PostNotifications';

function NotificationsPage() {
    return (
        <div className={s.container}>
            <NavBar currentPage={"Notifications"}/>
            <div className={s.split_screen}>
                <div className={s.link_up_requests_field}>
                    <h2 className={s.requests_header}>Connect Requests</h2>
                    <RequestsList />
                </div>
                <div className={s.post_notifications_field}>
                    <h2>Post Notifications</h2>
                    <PostNotifications />
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage;
