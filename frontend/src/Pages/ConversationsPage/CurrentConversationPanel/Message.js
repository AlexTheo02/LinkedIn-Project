import s from "./MessageStyle.module.css"
import { format } from "date-fns";


import InteractiveProfilePicture from "../../../Components/InteractiveProfilePicture/InteractiveProfilePicture";
import { useAuthContext } from "../../../Hooks/useAuthContext";

function Message({message, receiver}){
    const {user} = useAuthContext();
    const timestampFormat = "EEE, dd MMM yyyy, HH:mm";

    const isReceived = user.userId === message.sender ? false : true;
    if (isReceived)
        return (
        <div className={s.received_message_container}>
            <div className={s.received_message_content_container}>
                <InteractiveProfilePicture user_id={message.sender_id} userData={receiver} nonInter={true}/>
                <div className={`${s.message} ${s.message_received}`}>
                    {message.content}
                </div>
            </div>
            <small className={s.timestamp}>{format(message.timestamp, timestampFormat)}</small>
        </div>
        
        );

    return (
        <div className={s.sent_message_container}>
            <div className={`${s.message} ${s.message_sent}`}>
                {message.content}
            </div>
            <small className={s.timestamp}>{format(message.timestamp, timestampFormat)}</small>
            {message.failedToSend && <small className={s.error_message}>Failed to send. Please try again.</small>}
        </div>
    );
}

export default Message;