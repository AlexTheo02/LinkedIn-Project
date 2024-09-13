import s from "./RecentConversationStyle.module.css"
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from "../../../Hooks/useAuthContext"
import { useConversationContext } from "../../../Hooks/useConversationContext";

function RecentConversation({conversation}){

    const {user} = useAuthContext();
    const { conversations, activeConversation, conversationDispatch} = useConversationContext();
    const receiver = conversation.participant_1._id === user.userId ? conversation.participant_2 : conversation.participant_1;

    const isActive = conversation._id === activeConversation._id ? true : false;

    // get message log's last message timestamp
    const [timestamp, setTimestamp] = useState(formatDistanceToNow(conversation.messageLog[0].timestamp, {addSuffix: true}));

    useEffect(() => {
        setTimestamp(formatDistanceToNow(conversation.messageLog[0].timestamp, {addSuffix: true}));
    }, [conversations, conversation])

    const handleRecentConversationClick = () => {
        // Change active conversation context if different from before
        if (activeConversation._id !== conversation._id){
            // Update active conversation and receiver
            conversationDispatch({type: 'SET_ACTIVE_CONVERSATION', payload: conversation});
            conversationDispatch({type: 'SET_ACTIVE_RECEIVER', payload: receiver})
        }
    }

    return (
        <div className={`${s.recent_conversation} ${isActive && s.active}`} onClick={handleRecentConversationClick}>
            <img src={receiver.profilePicture} alt="User Profile" className={s.recent_conversation_pfp}/>

            <div className={s.usr_time_container}>
                <span className={s.recent_conversation_username}> {`${receiver.name} ${receiver.surname}`} </span>
                <span className={s.recent_conversation_timestamp}> {timestamp} </span>
            </div>
            
        </div>
    );
}

export default RecentConversation;