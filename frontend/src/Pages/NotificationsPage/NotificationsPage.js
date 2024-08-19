import React from 'react';
import s from "./NotificationsPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import RequestsList from './RequestsList/RequestsList';
import PostNotifications from './PostNotifications/PostNotifications';

function NotificationsPage() {
    // const johnDoePic = require('./../../Images/profile_ergasiaSite.png');
    // const janeSmithPic = require('./../../Images/profile_ergasiaSite.png');
    // const aliceJohnsonPic = require('./../../Images/profile_ergasiaSite.png');
    // const bobBrownPic = require('./../../Images/profile_ergasiaSite.png');
    // const emilyDavisPic = require('./../../Images/profile_ergasiaSite.png');

    // const postpicture = require('./../../Images/personaldetails_background_ergasiaSite.png');

    const notifications = [
        // { id: 1, profilePic: johnDoePic, name: 'John', surname: 'Doe', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Check out my new post!' },
        // { id: 2, profilePic: janeSmithPic, name: 'Jane', surname: 'Smith', isInterestOrComment: false, comment: 'Nice post!', postPic: '', postCaption: 'Loving this!' },
        // { id: 3, profilePic: aliceJohnsonPic, name: 'Alice', surname: 'Johnson', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Amazing content!' },
        // { id: 4, profilePic: bobBrownPic, name: 'Bob', surname: 'Brown', isInterestOrComment: false, comment: 'This is awesome!', postPic: '', postCaption: 'Having a great time!' },
        // { id: 5, profilePic: emilyDavisPic, name: 'Emily', surname: 'Davis', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Loved it!' },
    ];

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
                    <PostNotifications notifications={notifications}/>
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage;
