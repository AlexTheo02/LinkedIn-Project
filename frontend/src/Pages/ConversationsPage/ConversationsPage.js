import s from "./ConversationsPageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import { VerticalSeparator } from "../../Components/Separators/Separators.js";
import CurrentConversationPanel from "./CurrentConversationPanel/CurrentConversationPanel.js";
import { useEffect } from "react";
import { useAuthContext } from "../../Hooks/useAuthContext.js";
import { useConversationContext } from "../../Hooks/useConversationContext.js";
import { useNavigate } from "react-router-dom";

import RecentConversationsPanel from "./RecentConversationsPanel/RecentConversationsPanel.js";

function ConversationsPage({user_id}){
    const navigate = useNavigate();
    // Get current logged in user
    const {user} = useAuthContext();

    // Fetch current user's recent conversations
    const {conversations, conversationDispatch} = useConversationContext();

    useEffect(() => {
        const getRecentConversations = async () => {

            // Get user's recent conversation ids
            const response = await fetch(`api/conversations/`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            console.log("CONV ID ARRAY",json)

            if (response.ok && json.length){
                // Update conversation context to contain the actual conversation objects
                const resp = await fetch(`api/conversations/multiple?ids=${json.join(',')}`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                })
                const jsn = await resp.json();
                if (resp.ok){
                    // Update the context
                    const mrc = jsn[0]; // most recent conversation
                    // Find out who the receiver is
                    const receiverId = user.userId === mrc.participant_1 ? mrc.participant_2 : mrc.participant_1
                    // Gather their data and update the receiver context
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
                    conversationDispatch({type:"SET_CONVERSATIONS", payload: jsn})
                    conversationDispatch({type:"SET_ACTIVE_CONVERSATION", payload: mrc}) // Most recent conversation
                }
            }
        }

        if (user){
            getRecentConversations();
        }
    }, [user])

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