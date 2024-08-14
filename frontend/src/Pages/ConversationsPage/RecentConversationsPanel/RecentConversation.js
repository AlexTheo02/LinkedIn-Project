import s from "./RecentConversationStyle.module.css"
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from "../../../Hooks/useAuthContext"
import { useConversationContext } from "../../../Hooks/useConversationContext";

function RecentConversation({conversation}){
    const {user} = useAuthContext();
    const {receiver, activeConversation, conversationDispatch} = useConversationContext();

    // get message log's last message timestamp
    const [timestamp, setTimestamp] = useState(`${formatDistanceToNow(Date())} ago`);


    const handleRecentConversationClick = () => {
        // Change active conversation context if different from before
        if (activeConversation._id !== conversation._id){
            // Update active conversation and receiver
            const receiverId = user.userId === conversation.participant_1 ? conversation.participant_2 : conversation.participant_1;
            const getUserData = async () => {

                // Get receiver's data
                const response = await fetch(`api/users/${receiverId}`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                const userData = await response.json();
    
                if (response.ok){
                    conversationDispatch({type: 'SET_RECEIVER', payload: {
                        id: receiverId,
                        profilePicture: userData.profilePicture,
                        name: userData.name,
                        surname: userData.surname,
                    }})
                }
            }
    
            getUserData(); // will update the receiver on the context also
            conversationDispatch({type: 'SET_ACTIVE_CONVERSATION', payload:conversation})
        }
    }

    return (
        <div className={s.recent_conversation} onClick={handleRecentConversationClick}>
            <img src={receiver.profilePicture} alt="User Profile" className={s.recent_conversation_pfp}/>

            <div className={s.usr_time_container}>
                <span className={s.recent_conversation_username}> {`${receiver.name} ${receiver.surname}`} </span>
                <span className={s.recent_conversation_timestamp}> {/* FORMAT TIMESTAMP */timestamp} </span>
            </div>
            
        </div>
    );
}

export default RecentConversation;