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

function calculateAge(birthDate) {
    const dateOfBirth = new Date(birthDate);
    const age = differenceInYears(new Date(), dateOfBirth);
    return age;
}

function ExpandableText({ text, maxWords = 50 }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    const words = text.split(' ');
    const isTruncated = words.length > maxWords;
    const displayedText = isTruncated && !expanded ? words.slice(0, maxWords).join(' ') + '...' : text;

    return (
        <div>
            <p className={s.expandable_text}>{displayedText}</p>
            {isTruncated && (
                <button className={s.show_more_button} onClick={toggleExpansion}>
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
}

function ProfilePage() {
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const { id } = useParams(); // Ανάκτηση του id από το URL
    const [userData, setUserData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectButtonLoading, setConnectButtonLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State για το modal

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
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [id, user]);

    if (!userData) {
        return <h1 className={s.loading_text}>Loading...</h1>;
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

    const handleMessageClick = () => {
        setIsPopupOpen(true); // Ανοίγει το modal
    };

    const handleEditPersonalDetails = () => {
        navigate('/Personal Details/');
    };

    const handleModalClose = () => {
        setIsPopupOpen(false); // Κλείνει το modal
    };

    return (
        <div>
            <NavBar />
            <div className={s.background_image}>
                <div className={s.profile}>
                    <div className={s.container}>
                        <div className={s.profile_field}>
                            <img src={userData.profilePicture} alt="Profile" />
                            <h1>{userData.name} {userData.surname}</h1>
                            <b>{userData.workingPosition} at {userData.employmentOrganization}</b>
                            {!userData.privateDetails.includes("dateOfBirth") ? (
                                <p>{calculateAge(userData.dateOfBirth)} years old</p>
                            ) : null}
                            <p>{userData.placeOfResidence}</p>
                        </div>
                        <div className={s.operations}>
                            <div className={s.buttons}>
                                { userData._id !== user.userId ?
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
                                    { 
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
                            </div>
                            <div className={s.contact_info}>
                                {!userData.privateDetails.includes("phoneNumber") || isConnected ? (
                                    <>
                                        <p>Phone Number:</p>
                                        <p>{userData.phoneNumber}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {!userData.privateDetails.includes("professionalExperience") || isConnected ? (
                        <div className={s.container}>
                            <h3>Professional Experience:</h3>
                            <ExpandableText text={userData.professionalExperience} />
                        </div>
                    ) : null}
                    {!userData.privateDetails.includes("education") || isConnected ? (
                        <div className={s.container}>
                            <h3>Educational Experience:</h3>
                            <ExpandableText text={userData.education} />
                        </div>
                    ) : null}
                    {!userData.privateDetails.includes("skills") || isConnected ? (
                        <div className={s.container}>
                            <h3>Skills:</h3>
                            <ExpandableText text={userData.skills} />
                        </div>
                    ) : null}
                </div>
                { isConnected &&
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

            {isPopupOpen && (
                <MessagePopup userData={userData} onClose={handleModalClose} />
            )}
        </div>
    );
}

export default ProfilePage;
