import React from 'react';
import s from "./NotificationsPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';

function NotificationsPage() {
    return (
        <div className={s.container}>
            <NavBar></NavBar>
            <div className={s.link_up_requests_field}>
                {/* Περιεχόμενο του επάνω container */}
                <h2>Top Container</h2>
                <p>This is the top container.</p>
            </div>
            <div className={s.interest_notes}>
                {/* Περιεχόμενο του κάτω container */}
                <h2>Bottom Container</h2>
                <p>This is the bottom container.</p>
            </div>
        </div>
    );
}

export default NotificationsPage;