import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import s from './RequestPopupStyle.module.css';

function RequestPopup({ user, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const timeout = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Κλείσιμο του πλαισίου μετά το animation εξόδου
        }, 4000);

        return () => clearTimeout(timeout);
    }, [onClose]);

    const popupContent = (
        <div className={`${s.popup_container} ${isVisible ? s.enterPopup : s.exitPopup}`}>
            <div className={s.user_info}>
                <img src={user.profilePicture} alt={`${user.name} ${user.surname}`} />
                <b>{user.name} {user.surname}</b>
            </div>
            <span>Added to your network</span>
        </div>
    );

    return ReactDOM.createPortal(popupContent, document.body);
}

export default RequestPopup;
