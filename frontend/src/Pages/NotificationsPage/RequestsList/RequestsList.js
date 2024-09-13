import React, { useRef, useState, useEffect } from 'react';
import s from "./RequestsListStyle.module.css";
import LinkUpRequest from '../LinkUpRequest/LinkUpRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../../Hooks/useAuthContext';
import RequestPopup from '../RequestPopup/RequestPopup';

function RequestsList() {
    const {user} = useAuthContext();
    const listRef = useRef(null);
    const [requests, setRequests] = useState(null);
    const [showArrows, setShowArrows] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [acceptedUser, setAcceptedUser] = useState(null);
    const [popupQueue, setPopupQueue] = useState([]); // Popup requests queue

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user.userId}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                
                if (response.ok){
                    setRequests(data.linkUpRequests);

                    setTimeout(() => {
                        setShowArrows(true);
                    }, 500);
                }
                
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);
    
    useEffect(() => {
        if (!showPopup && popupQueue.length > 0) {
            const nextPopupUser = popupQueue.shift(); // Gets next user from popupQueue
            setAcceptedUser(nextPopupUser);
            setShowPopup(true);
        }
    }, [showPopup, popupQueue]);
    
    if (!requests) {
        return <h1 className={s.loading_text}>Loading...</h1>;
    }

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    const scrollLeft = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    const handleShowPopup = (popupUser) => {
        setPopupQueue(prevQueue => [...prevQueue, popupUser]); // Adds user to popupQueue
    }

    return ( requests.length > 0 ? (
        <div className={s.requests_list_container}>
            {showArrows && (
            <FontAwesomeIcon icon={faAnglesLeft} className={s.angles} onClick={scrollLeft} />
            )}
            <div className={s.requests_list} ref={listRef}>
                {requests.map(request => (
                    <LinkUpRequest key={request} id={request} onAccept={handleShowPopup} />
                ))}
            </div>
            {showArrows && (
            <FontAwesomeIcon icon={faAnglesRight} className={s.angles} onClick={scrollRight} />
            )}
            {showPopup && <RequestPopup user={acceptedUser} onClose={handlePopupClose} />}
        </div>
        ) : (
            <span className={s.noRequestsMessage}>You don't have any link up request.</span>
        )
    );
}

export default RequestsList;
