import s from "./MessageStyle.module.css"

import InteractiveProfilePicture from "../../../Components/InteractiveProfilePicture/InteractiveProfilePicture";

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

export default Message;