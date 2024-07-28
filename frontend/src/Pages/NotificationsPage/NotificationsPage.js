import React from 'react';
import s from "./NotificationsPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import RequestsList from './RequestsList/RequestsList';
import PostNotifications from './PostNotifications/PostNotifications';

function NotificationsPage() {
    // Δημιουργία λίστας με δεδομένα
    const requests = [
        { id: 1, name: "Donald Trump", position: "Data Analyst at DataCompany, Athens" },
        { id: 2, name: "Joe Biden", position: "Software Engineer at TechCompany, New York" },
        { id: 3, name: "Barack Obama", position: "Product Manager at Startup, San Francisco" },
        { id: 4, name: "Hillary Clinton", position: "Marketing Manager at AdAgency, Los Angeles" },
        { id: 5, name: "Bernie Sanders", position: "Research Scientist at LabCorp, Boston" },
        { id: 6, name: "Kamala Harris", position: "HR Specialist at HRConsult, Chicago" },
        { id: 7, name: "Mike Pence", position: "Operations Director at LogisticsInc, Miami" },
        { id: 8, name: "Elizabeth Warren", position: "Finance Analyst at FinTech, Seattle" },
    ];

    const johnDoePic = require('./../../Images/profile_ergasiaSite.png');
    const janeSmithPic = require('./../../Images/profile_ergasiaSite.png');
    const aliceJohnsonPic = require('./../../Images/profile_ergasiaSite.png');
    const bobBrownPic = require('./../../Images/profile_ergasiaSite.png');
    const emilyDavisPic = require('./../../Images/profile_ergasiaSite.png');

    const postpicture = require('./../../Images/personaldetails_background_ergasiaSite.png');

    const notifications = [
        { id: 1, profilePic: johnDoePic, name: 'John', surname: 'Doe', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Check out my new post!' },
        { id: 2, profilePic: janeSmithPic, name: 'Jane', surname: 'Smith', isInterestOrComment: false, comment: 'Nice post!', postPic: '', postCaption: 'Loving this!' },
        { id: 3, profilePic: aliceJohnsonPic, name: 'Alice', surname: 'Johnson', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Amazing content!' },
        { id: 4, profilePic: bobBrownPic, name: 'Bob', surname: 'Brown', isInterestOrComment: false, comment: 'This is awesome!', postPic: '', postCaption: 'Having a great time!' },
        { id: 5, profilePic: emilyDavisPic, name: 'Emily', surname: 'Davis', isInterestOrComment: true, comment: '', postPic: postpicture, postCaption: 'Loved it!' },
    ];

    return (
        <div className={s.container}>
            <NavBar />
            <div className={s.split_screen}>
                <div className={s.link_up_requests_field}>
                    <h2 className={s.requests_header}>Connect Requests</h2>
                    {requests.length > 0 ? (
                        <RequestsList requests={requests} />
                    ) : (
                        <span className={s.noRequestsMessage}>You haven't any link up requests.</span>
                    )}
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
