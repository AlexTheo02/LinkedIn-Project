import s from "./ConversationsPageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import { VerticalSeparator } from "../../Components/Separators/Separators.js";
import CurrentConversationPanel from "./CurrentConversationPanel/CurrentConversationPanel.js";
import { useEffect } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext.js";
import { useConversationContext } from "../../Hooks/useConversationContext.js";
import { useNavigate } from "react-router-dom";

import RecentConversationsPanel from "./RecentConversationsPanel/RecentConversationsPanel.js";

function ConversationsPage(){
    const navigate = useNavigate();
    // Get current logged in user
    const {user} = useAuthContext();

    // Fetch current user's recent conversations
    const {fromProfile, conversations, conversationDispatch} = useConversationContext();

    useEffect(() => {
        const getRecentConversations = async () => {

            // Get user's recent conversation ids
            const response = await fetch(`api/conversations/`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                }
            });
            const json = await response.json();

            if (response.ok && json.length){
                conversationDispatch({type:"SET_CONVERSATIONS", payload: json})
                
                // If redirected from profile page message, do not set most recent as active
                if (!fromProfile){
                    const mostRecentConversation = json[0];
                    conversationDispatch({type:"SET_ACTIVE_CONVERSATION", payload: mostRecentConversation}) // Most recent conversation
                    conversationDispatch({type: 'SET_ACTIVE_RECEIVER',
                        payload: user.userId === mostRecentConversation.participant_1._id 
                        ? mostRecentConversation.participant_2 : mostRecentConversation.participant_1
                    });
                }
            }
        }

        if (user){
            getRecentConversations();
        }
    }, [user, conversationDispatch, fromProfile])



    return(
        <div className="conversations-page">
            <NavBar currentPage={"Conversations"}/>
            <div className={s.container}>
                {conversations.length ?
                    <>
                        <RecentConversationsPanel conversations={conversations}/>
                        <VerticalSeparator />
                        <CurrentConversationPanel />
                    </>
                    : 
                    <div className={s.error_message_container}>
                        <h2>No Recent Conversations</h2>
                        <button onClick={() => {navigate("/Network")}}>Start one</button>
                    </div>
                }
            </div>

            
        </div>
    );
}

export default ConversationsPage;