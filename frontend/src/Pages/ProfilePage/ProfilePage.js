import React, { useState, useEffect } from 'react';
import s from "./ProfilePageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCheck, faPen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { differenceInYears } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Hooks/useAuthContext';
import MessagePopup from './MessagePopup/MessagePopup';
import NetworkUsersList from '../../Components/NetworkUsersList/NetworkUsersList';
import { useConversationContext } from '../../Hooks/useConversationContext';
import TimelinePosts from '../../Components/TimelinePosts/TimelinePosts';
import { CommentsPopup } from '../../Components/PostComponent/PostComponents';

function calculateAge(birthDate) {
    const dateOfBirth = new Date(birthDate);
    const age = differenceInYears(new Date(), dateOfBirth);
    return age;
}

function formatListWithNewlines(list) {
    const formattedList = list.map(item => `• ${item}`);
    return formattedList.join('\n');
}

// Text with a show more button
function ExpandableText({ text, maxLines = 4, maxCharacters = 500 }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    // Split text into lines
    const lines = text.split('\n');
    const characters = text.length;
    const isTruncatedByLines = lines.length > maxLines;
    const isTruncatedByChars = characters > maxCharacters;
    const displayedText = isTruncatedByLines && !expanded
        ? lines.slice(0, maxLines).join('\n') + '...'   // If it is truncated by lines (over maxLines newlines)
        : isTruncatedByChars && !expanded
        ? text.substring(0, maxCharacters) + '...'      // If it is truncated by characted (over maxCharacters)
        : text;
    

    return (
        <div>
            <p className={s.expandable_text}>{displayedText}</p>
            {(isTruncatedByLines || isTruncatedByChars) && (
                <button className={s.show_more_button} onClick={toggleExpansion}>
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
}

function ProfilePage() {
    const {user} = useAuthContext();
    const isAdmin = user.admin;
    const navigate = useNavigate();
    
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [loggedInUserData, setLoggedInUserData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectButtonLoading, setConnectButtonLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for message popup
    const [isCommentsPopupVisible, setIsCommentsPopupVisible] = useState(false);
    
    const { conversationDispatch } = useConversationContext();
    const isLoggedInUserProfile = id === user.userId;
    const canView = isConnected || isAdmin || isLoggedInUserProfile;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);

                setIsConnected(data.network.includes(user.userId));
                setIsRequested(data.linkUpRequests.includes(user.userId));

                if (!isLoggedInUserProfile){
                    const loggedInUserResponse = await fetch(`/api/users/${user.userId}`,{
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
    
                    const loggedInData = await loggedInUserResponse.json();
                    setLoggedInUserData(loggedInData)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id, user]);

    if (!userData || (!isLoggedInUserProfile && !loggedInUserData)) {
        return <h1 className={s.loading_text}>Loading...</h1>;
    }

    const showCommentsPopup = (post_id) => {
        setIsCommentsPopupVisible(true);
    };

    const hideCommentsPopup = async () => {
        setIsCommentsPopupVisible(false);
    };
    
    // Struct for efficiency
    const commentsPopupHandler = {
        showCommentsPopup,
        hideCommentsPopup,
        isPopupVisible: isCommentsPopupVisible,
    }

    const handleConnectClick = async () => {
        setConnectButtonLoading(true);
        try {
            const response = await fetch(`/api/users/requestConnection/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                setIsRequested(true);
            } else {
                console.error('Error sending connection request');
            }
        } catch (error) {
            console.error('Error sending connection request:', error);
        }
        setConnectButtonLoading(false);
    };
    
    const handleRemoveRequest = async () => {
        setConnectButtonLoading(true);
        try {
            const response = await fetch(`/api/users/removeRequestConnection/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                setIsRequested(false);
            } else {
                console.error('Error removing connection');
            }
        } catch (error) {
            console.error('Error removing connection:', error);
        }
        setConnectButtonLoading(false);
    };

    const handleDisconnectClick = async () => {
        setConnectButtonLoading(true);
        try {
            const response = await fetch(`/api/users/removeConnection/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            if (response.ok) {
                setIsConnected(false);
            } else {
                console.error('Error removing connection');
            }
        } catch (error) {
            console.error('Error removing connection:', error);
        }
        setConnectButtonLoading(false);
    };

    const handleMessageClick = async () => {
        // If conversation exists, navigate to conversations
        const response = await fetch(`/api/conversations/find-conversation/${userData._id}`, {
            headers: {
                "Authorization": `Bearer ${user.token}`,
            }
        })
        
        const {populatedConversation:conversation} = await response.json();
        console.log(conversation)

        if (response.ok){
            conversationDispatch({type: "SET_FROM_PROFILE", payload: true})
            conversationDispatch({type: "SET_ACTIVE_CONVERSATION", payload: conversation})
            conversationDispatch({type: 'SET_ACTIVE_RECEIVER',
                payload: user.userId === conversation.participant_1._id 
                ? conversation.participant_2 : conversation.participant_1
            });
            navigate("/Conversations");
        }
        else{
            setIsPopupOpen(true); // Opens popup
        }   
    };

    const handleEditPersonalDetails = () => {
        navigate('/Personal Details/');
    };

    const handleModalClose = () => {
        setIsPopupOpen(false); // Closes popup
    };

    return (
        <div>
            {!isAdmin && <NavBar />}
            <div className={`${s.background_image} ${isAdmin ? s.admin : ''}`}>
                { canView && userData.publishedPosts.length > 0 &&
                    <CommentsPopup userData={isLoggedInUserProfile ? userData : loggedInUserData} commentsPopupHandler={commentsPopupHandler}/>
                }
                <div className={s.row}>
                    <div className={s.profile}>
                        <div className={s.container}>
                            <div className={s.profile_field}>
                                <img src={userData.profilePicture} alt="Profile" />
                                <h1>{userData.name} {userData.surname}</h1>
                                <b>{userData.workingPosition} at {userData.employmentOrganization}</b>
                                {!userData.privateDetails.includes("dateOfBirth") || canView ? (
                                    <p>{calculateAge(userData.dateOfBirth)} years old</p>
                                ) : null}
                                <p>{userData.placeOfResidence}</p>
                            </div>
                            <div className={s.operations}>
                                <div className={s.buttons}>
                                    {!isAdmin &&
                                        <>
                                        { !isLoggedInUserProfile ?
                                            <>
                                            { isConnected || isRequested ?
                                                <button disabled={connectButtonLoading}
                                                    className={s.followed_or_requested_button} onClick={isConnected ? handleDisconnectClick : handleRemoveRequest}>
                                                    {isConnected ? 'Connected' : 'Sent Request'}
                                                    <FontAwesomeIcon className={s.button_icon} icon={faCheck} />
                                                </button>
                                            :
                                                <button
                                                    className={s.follow_button} onClick={handleConnectClick}>
                                                    Connect
                                                    <FontAwesomeIcon className={s.button_icon} icon={faUserPlus} />
                                                </button>
                                            }
                                            { isConnected &&
                                                <button  disabled={connectButtonLoading} className={s.message_button} onClick={handleMessageClick}>
                                                    Message
                                                    <FontAwesomeIcon className={s.button_icon} icon={faPaperPlane} />
                                                </button>
                                            }
                                            </>
                                        :
                                            <button  disabled={connectButtonLoading} className={s.edit_personal_details_button} onClick={handleEditPersonalDetails}>
                                                Edit personal details
                                                <FontAwesomeIcon className={s.button_icon} icon={faPen} />
                                            </button>
                                        }
                                        </>
                                    }
                                </div>
                                <div className={s.contact_info}>
                                    {!userData.privateDetails.includes("phoneNumber") || canView ? (
                                        <>
                                            <p>Phone Number:</p>
                                            <p>{userData.phoneNumber}</p>
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        {userData.bio && <div className={s.container}>
                            <h3>About me:</h3>
                            <ExpandableText text={userData.bio}/>
                        </div>
                        }
                        { userData.professionalExperience.length > 0 && (!userData.privateDetails.includes("professionalExperience") || canView) ? (
                            <div className={s.container}>
                                <h3>Professional Experience:</h3>
                                <ExpandableText text={formatListWithNewlines(userData.professionalExperience)} />
                            </div>
                        ) : null}
                        {userData.education.length > 0 && (!userData.privateDetails.includes("education") || canView) ? (
                            <div className={s.container}>
                                <h3>Educational Experience:</h3>
                                <ExpandableText text={formatListWithNewlines(userData.education)} />
                            </div>
                        ) : null}
                        {userData.skills.length > 0 && (!userData.privateDetails.includes("skills") || canView) ? (
                            <div className={s.container}>
                                <h3>Skills:</h3>
                                <ExpandableText text={formatListWithNewlines(userData.skills)} />
                            </div>
                        ) : null}
                    </div>
                    { canView &&
                        <div className={s.network}>
                            <h2>Network:</h2>
                            {userData.network.length > 0 ? 
                                <NetworkUsersList network={userData.network} />
                                :
                                <div className={s.empty_network}>
                                    <h3>This user has not connected with any other user yet</h3>
                                </div>
                            }
                        </div>
                    }
                </div>
                { canView && userData.publishedPosts.length > 0 &&
                    <div className={s.posts}>
                        <TimelinePosts commentsPopupHandler={commentsPopupHandler} comingFrom={'ProfilePage'} postsToGet={userData.publishedPosts} />
                    </div>
                }
            </div>

            {isPopupOpen && (
                <MessagePopup userData={userData} onClose={handleModalClose} />
            )}
        </div>
    );
}

export default ProfilePage;
