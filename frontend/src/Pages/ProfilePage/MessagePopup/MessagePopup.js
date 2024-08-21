import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import s from './MessagePopupStyle.module.css'; // Βεβαιωθείτε ότι το σωστό αρχείο CSS εισάγεται
import { useAuthContext } from '../../../Hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useConversationContext } from '../../../Hooks/useConversationContext';

function MessagePopup({ userData, onClose }) {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { conversationDispatch } = useConversationContext();
    const [message, setMessage] = useState('');
    const [isClosing, setIsClosing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const validMessageRegex = /\S/; // matches any non-whitespace character

    const handleSubmit = async () => {
        setIsLoading(true);
        
        if (validMessageRegex.test(message)) {
            const trimmedMessage = message.trim(); // remove leading and trailing whitespace characters
            const msg = {sender: user.userId, receiver: userData._id, content: trimmedMessage.replace(/\s/g, ' '), timestamp: new Date()}

            // Create conversation for both users
            const conversationData = {
                participant_1: user.userId,
                participant_2: userData._id,
                initialMessage: msg
            }

            const createConversationResponse = await fetch("/api/conversations", {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(conversationData)
            });

            const {populatedConversation :conversation} = await createConversationResponse.json();

            console.log(conversation);

            // Redirect user to conversations page
            conversationDispatch({type: "SET_FROM_PROFILE", payload: true})
            conversationDispatch({type: "SET_ACTIVE_CONVERSATION", payload: conversation})
            conversationDispatch({type: 'SET_ACTIVE_RECEIVER',
                payload: user.userId === conversation.participant_1._id 
                ? conversation.participant_2 : conversation.participant_1
            });

            navigate("/Conversations")

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
