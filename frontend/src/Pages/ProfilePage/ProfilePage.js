import React, { useState, useEffect } from 'react';
import s from "./ProfilePageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { differenceInYears } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Hooks/useAuthContext';

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
    const {user} = useAuthContext()

    const { id } = useParams(); // Ανάκτηση του id από το URL
    const [userData, setUserData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectButtonLoading, setConnectButtonLoading] = useState(false)
    const [isRequested, setIsRequested] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Εδώ μπορείς να κάνεις fetch δεδομένων από το API χρησιμοποιώντας το id
                const response = await fetch(`/api/users/${id}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);

                // RIGHT THERE I LOOK IF THE USER OF THE PROFILE PAGE HAS CONNECTED OR HAS BEEN SENT A REQUEST BY THE USER LOGGED IN !!!
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
                setIsRequested(false);
            } else {
                console.error('Error removing connection');
            }
        } catch (error) {
            console.error('Error removing connection:', error);
        }
        setConnectButtonLoading(false);
    };
    

    const handleNetworkUserClick = (userId) => {
        navigate(`/profile/${userId}`);
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
                                { isConnected || isRequested ?
                                    <button disabled={connectButtonLoading}
                                        className={s.followed_or_requested_button} onClick={handleDisconnectClick}>
                                        {isConnected ? 'Connected' : 'Sent Request'}
                                        <FontAwesomeIcon className={s.follow_button_icon} icon={faCheck} />
                                    </button>
                                    :
                                    <button
                                        className={s.follow_button} onClick={handleConnectClick}>
                                        Connect
                                        <FontAwesomeIcon className={s.follow_button_icon} icon={faUserPlus} />
                                    </button>
                                }
                                { isConnected &&
                                    <button  disabled={connectButtonLoading} className={s.message_button}>Message</button>
                                }
                            </div>
                            <div className={s.contact_info}>
                                {!userData.privateDetails.includes("phoneNumber") ? (
                                    <>
                                        <p>Phone Number:</p>
                                        <p>{userData.phoneNumber}</p>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {!userData.privateDetails.includes("phoneNumber") || isConnected ? (
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
                            <div className={s.users_list}>
                                <ul>
                                    {userData.network.map((connected_user, index) => (
                                        <li key={index} onClick={() => handleNetworkUserClick(connected_user._id)}>
                                            <img src={connected_user.profilePic} alt={`${connected_user.name} ${connected_user.surname}`} />
                                            <div className={s.user_info}>
                                                <b>{connected_user.name} {connected_user.surname}</b>
                                                <b className={s.position}>{connected_user.workingPosition} at {connected_user.employmentOrganization}</b>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            :
                            <div className={s.empty_network}>
                                <h3>This user has not connected with any other user yet</h3>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default ProfilePage;
