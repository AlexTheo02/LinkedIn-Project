import s from "./RecentConversationsPanelStyle.module.css"
import { HorizontalSeparator } from "../../../Components/Separators/Separators";
import RecentConversation from "./RecentConversation";


function RecentConversationsPanel({conversations}){
    // conversations is a list containing all of the user's recent conversations
    // For each conversation:
    // Check the other participant's id, (find the one you are not) and fetch name,surname,profilePicture,
    // get timestamp, and send them to RecentConversation component, that will display profile picture, name surname and timestamp, and onClick,
    // display the correct conversation (set Current Conversation to the messageLog)
    // Use map to create different elements for recent conversations. create recent conversation component to go on the left panel
    // WHEN A CONVERSATION IS CREATED FOR ONE USER, CREATE IT FOR THE OTHER AS WELL

    return(
        <div className={s.recent_conversations_panel} >
            <div className={s.recent_conversations_panel_header}>
                Recent Conversations
            </div>
            <HorizontalSeparator/>
            {/* Recent Conversations list (map) */}
            <div className={s.recent_conversations_container}>
                {conversations && conversations.length ? conversations.map((conv, index) => (
                    <RecentConversation key={`recent-conversation-${index}`} conversation={conv}/>
                )) : <h5>No Recent Conversations</h5>}
            </div>
        </div>
    )
}

export default RecentConversationsPanel;