import s from "./CurrentConversationPanelStyle.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InteractiveProfile } from "../../../Components/PostComponent/PostComponents";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Message from "./Message";
import { useConversationContext } from "../../../Hooks/useConversationContext";
import { useAuthContext } from "../../../Hooks/useAuthContext";

function CurrentConversationPanel(){

    const {user} = useAuthContext();
    const {activeReceiver, activeConversation, conversationDispatch} = useConversationContext();

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

    const handleSendMessage = async () => {
        const validMessageRegex = /\S/; // matches any non whitespace character
        if(validMessageRegex.test(message)){
            const trimmedMessage = message.trim()
            // Create new message object
            const msg = {sender: user.userId, content: trimmedMessage.replace(/\s/g, ' '), timestamp: new Date(), failedToSend: false}

            // Clear input field
            setMessage("");

            // Update local messageLog state
            activeConversation.messageLog = [msg, ...activeConversation.messageLog];

            // Update the conversation on the database
            const filteredMessageLog = activeConversation.messageLog.filter(msg => msg.failedToSend !== true);
            const filteredConv = activeConversation;
            filteredConv.messageLog=filteredMessageLog;

            const response = await fetch(`/api/conversations/${activeConversation._id}`, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify(filteredConv)
            });
            
            const json = await response.json();
            
            if (!response.ok){
                // find failed message based on the timestamp, then update the failed to send field
                
                const failedMessage = activeConversation.messageLog.find(msg =>new Date(msg.timestamp).getTime() === new Date(json.timestamp).getTime())
                if (failedMessage){
                    failedMessage.failedToSend = true;
                }
            }
            conversationDispatch({type: "SET_ACTIVE_CONVERSATION", payload: activeConversation})
            conversationDispatch({type: "UPDATE_CONVERSATIONS"})
            
        }
    };

    return(
        <div className={s.current_conversation_panel}>
            <div className={s.conversation_header}>
                <InteractiveProfile
                    user_id={activeReceiver._id}
                    profilePicture={activeReceiver.profilePicture}
                    name={activeReceiver.name}
                    surname={activeReceiver.surname}
                    altern={true}
                />
            </div>

            <div className={s.conversation}>
                {/* Change to map the activeConversation.messageLog field */}
                {activeConversation.messageLog.map((msg, index) => (
                    <Message key={`message-${index}`} message={msg} receiver={activeReceiver}/>
                ))}
            </div>

            <div className={s.control_bar}>
                <input className={s.message_field} placeholder="Aa" value={message} onKeyDown={handleKeyDown} onChange={handleInputChange}/>
                <FontAwesomeIcon className={s.send_message_button} icon={faPaperPlane} onClick={handleSendMessage}/>
            </div>
        </div>
    );
}

export default CurrentConversationPanel;