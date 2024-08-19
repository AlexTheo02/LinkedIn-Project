import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import s from './MessagePopupStyle.module.css'; // Βεβαιωθείτε ότι το σωστό αρχείο CSS εισάγεται

function MessagePopup({ userData, onClose}) {
    const [message, setMessage] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);
        const trimmedMessage = message.trim(); // Αφαιρει τα περιττα spaces

        if (trimmedMessage.length > 0) {
            // Εδω στελνεις το μηνυμα απο το backend <=======================================================
        }
        handleClose();
        setIsLoading(false);
    };

    const handleClose = () => {
        setIsClosing(true); // Κάνουμε trigger το animation κλεισίματος
        setTimeout(() => {
            setIsLoading(true);
            onClose(); // Κλείνουμε το popup αφού ολοκληρωθεί το animation
            setIsLoading(false);
        }, 300); // Ο χρόνος αυτός πρέπει να ταιριάζει με τη διάρκεια του animation
    };

    return (
        <div className={s.popup_overlay}>
            <div className={`${s.popup_container} ${isClosing ? s.closePopup : s.openPopup}`}>
                <button disabled={isLoading} className={s.close_button} onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Write your message to {userData.name} {userData.surname}</h2>
                <textarea
                    className={s.message_textarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                />
                <button disabled={isLoading} onClick={handleSubmit} className={s.popup_send_button}>Send</button>
            </div>
        </div>
    );
}

export default MessagePopup;
