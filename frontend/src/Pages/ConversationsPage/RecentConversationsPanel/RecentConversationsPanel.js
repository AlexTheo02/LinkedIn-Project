import s from "./RecentConversationsPanelStyle.module.css"
import { HorizontalSeparator } from "../../../Components/Separators/Separators";
import RecentConversation from "./RecentConversation";

function RecentConversationsPanel({conversations}){

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