import s from "./CurrentConversationPanelStyle.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InteractiveProfile } from "../../../Components/PostComponent/PostComponents";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Message from "./Message";
import { useConversationContext } from "../../../Hooks/useConversationContext";

function CurrentConversationPanel(){
    const {receiver, activeConversation, conversationDispatch} = useConversationContext();

    const messageLog=[]

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
        // Add message to the message log of current conversation (update on DB also)
        // Send request to the db for update with the included message, then if response.ok, update the context using dispatch
        
        // Clear input field
        setMessage("");
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
                {messageLog.map(mid => (
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

export default CurrentConversationPanel;