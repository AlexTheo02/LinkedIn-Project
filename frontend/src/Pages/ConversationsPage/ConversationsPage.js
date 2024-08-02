import s from "./ConversationsPageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import { HorizontalSeparator, VerticalSeparator } from "../../Components/Separators/Separators.js";
import { InteractiveProfile } from "../../Components/PostComponent/PostComponents.js";
import InteractiveProfilePicture from "../../Components/InteractiveProfilePicture/InteractiveProfilePicture.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"

function getRecentConversationInfoByConversationId(conversation_id){
    var user_id, lastMessageTimestamp;

    if (conversation_id === 3){
        user_id = 3;
        lastMessageTimestamp = "17:08 22 Jul 2024"
    }
    if (conversation_id === 2){
        user_id = 2;
        lastMessageTimestamp = "08:46 11 Sept 2001"
    }
    return({user_id, lastMessageTimestamp});
}

// USE GLOBALLY, MOVE FROM HERE
function getPfpUserNameByUserId(user_id){
    var userName,pfp;
    if (user_id === 3){
        userName = "Alexis Tsipras";
        pfp = tsipras;
    }
    if (user_id === 2){
        userName = "Kyriakos Mitsotakis";
        pfp = mitsotakis;
    }

    return ({userName,pfp})
}

function RecentConversation({conversation_id, conversationHandler}){
    
    // Database access to get information about recent conversation
    const {user_id, lastMessageTimestamp} = getRecentConversationInfoByConversationId(conversation_id);
    const {userName,pfp} = getPfpUserNameByUserId(user_id);

    const handleRecentConversationClick = () => {
        conversationHandler.setActiveConversation(conversation_id)
    }

    return (
        <div className={s.recent_conversation} onClick={handleRecentConversationClick}>
            <img src={pfp} className={s.recent_conversation_pfp}/>

            <div className={s.usr_time_container}>
                <span className={s.recent_conversation_username}> {userName} </span>
                <span className={s.recent_conversation_timestamp}> {lastMessageTimestamp} </span>
            </div>
            
        </div>
    );
}

function RecentConversationsPanel({conversationHandler}){

    const {recentConversations,setRecentConversations,setActiveConversation} = conversationHandler;

    // Use map to create different elements for recent conversations. create recent conversation component to go on the left panel

    return(
        <div className={s.recent_conversations_panel} >
            <div className={s.recent_conversations_panel_header}>
                Recent Conversations
            </div>
            <HorizontalSeparator/>
            {/* Recent Conversations list (map) */}
            <div className={s.recent_conversations_container}>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={3} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={3} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={3} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={2} conversationHandler={conversationHandler}/>
                <RecentConversation conversation_id={3} conversationHandler={conversationHandler}/>
            </div>
        </div>
    )
}



function Message({messageId}){

    const getSenderByMessageId = (messageId) => {
        if (messageId === 2)
            return 2; // tsipras
        if (messageId === 1)
            return 3; // mitsotakis
    }

    const sender_id = getSenderByMessageId(messageId); // Database access
    const isReceived = (messageId % 2 ) ? true : false;
    const content = isReceived ? "Hello there, i saw your post about joining linkedin and i would like to welcome you personally ;)" : "Χαχα 6/7 δουλειά χεχε";

    if (isReceived)
        return (
        <div className={s.message_container}>
            <InteractiveProfilePicture user_id={sender_id} nonInter={true}/>
            <div className={`${s.message} ${s.message_received}`}>
                {content}
            </div>
        </div>
        
        );

    return (
        <div className={`${s.message} ${s.message_sent}`}>
            {content}
        </div>
    );
}

function getInfoFromConversationById(conv_id){
    // Access database and fetch data
    if (conv_id === 3)
        return 3;
    return 2;
}

function CurrentConversationPanel({conversationHandler}){

    const getMessageLog = (conversation_id) => {
        // Access database and return a list of message ids
        if (conversation_id === 3){
            return ([1,2,1,2,1,2,1,2,1,2,1,2]);
        }
        if (conversation_id === 2){
            return ([2,1,2]);
        }
    }

    // Get data from conversation handler

    const activeConversation = conversationHandler.activeConversation;

    const receiver_id = getInfoFromConversationById(activeConversation)

    // const receiver_id = 3; // fetch from database

    const [message, setMessage] = useState("");

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSendMessage();
        }
      };

    const handleSendMessage = () => {
        setMessage("");
    };

    // When a message is sent. add it to the messageLog list of the conversation, and update the container to include that message
    return(
        <div className={s.current_conversation_panel}>
            <div className={s.conversation_header}>
                <InteractiveProfile user_id={receiver_id} altern={true}/>
            </div>

            <div className={s.conversation}>
                {getMessageLog(activeConversation).map(mid => (
                    <Message messageId={mid} />
                ))}
            </div>

            <div className={s.control_bar}>
                <input className={s.message_field} placeholder="Aa" value={message} onKeyDown={handleKeyDown} onChange={handleInputChange}/>
                <FontAwesomeIcon className={s.send_message_button} icon={faPaperPlane} onClick={handleSendMessage}/>
            </div>
        </div>
    );
}

function getRecentConversationsByUserId(user_id){
    // Access the database and fetch the user's conversations in most recent order
    return ([3,2,1,4]);
}

function ConversationsPage({user_id}){

    // Based on user id, fetch recent conversations and most recent conversation

    const [recentConversations,setRecentConversations] = useState(getRecentConversationsByUserId(user_id))

    const [activeConversation, setActiveConversation] = useState(recentConversations[0])

    // Create a handler struct
    const conversationHandler = {
        recentConversations,
        setRecentConversations,
        activeConversation,
        setActiveConversation
    }

    return(
        <div className="conversations-page">
            <NavBar currentPage={"Conversations"}/>
            <div className={s.container}>
                <RecentConversationsPanel conversationHandler={conversationHandler}/>
                <VerticalSeparator />
                <CurrentConversationPanel conversationHandler={conversationHandler}/>
            </div>
            
        </div>
    );
}

export default ConversationsPage;