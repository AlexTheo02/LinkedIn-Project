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
    const {receiver, activeConversation, conversationDispatch} = useConversationContext();

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
        const validMessageRegex = /\S/;
        if(validMessageRegex.test(message)){
            // Create new message object
            const msg = {sender: user.userId, content: message, timestamp: new Date(), failedToSend: false}

            // Clear input field
            setMessage("");

            // Update local messageLog state
            activeConversation.messageLog = [msg, ...activeConversation.messageLog]
            console.log(activeConversation)

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
                console.log(failedMessage)
                if (failedMessage){
                    failedMessage.failedToSend = true;
                }
            }
            conversationDispatch({type: "SET_ACTIVE_CONVERSATION", payload: activeConversation})
            
        }
    };

    return(
        <div className={s.current_conversation_panel}>
            <div className={s.conversation_header}>
                <InteractiveProfile
                    user_id={receiver.id}
                    profilePicture={receiver.profilePicture}
                    name={receiver.name}
                    surname={receiver.surname}
                    altern={true}
                />
            </div>

            <div className={s.conversation}>
                {/* Change to map the activeConversation.messageLog field */}
                {activeConversation.messageLog.map((msg, index) => (
                    <Message key={`message-${index}`} message={msg} receiver={receiver}/>
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