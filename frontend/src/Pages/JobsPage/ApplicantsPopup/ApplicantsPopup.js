import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import s from './ApplicantsPopupStyle.module.css';
import NetworkUsersList from '../../../Components/NetworkUsersList/NetworkUsersList';

function ApplicantsPopup({ applicantsData, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true); // Trigger animation's closing
        setTimeout(() => {
            onClose(); // Closes popup after animation completes
        }, 300); // Waiting for the animation to complete
    };

    return (
        <div className={s.popup_overlay}>
            <div className={`${s.popup_container} ${isClosing ? s.closePopup : s.openPopup}`}>
                <button className={s.close_button} onClick={handleClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Applicants for this Job</h2>
                <div className={s.applicants_list}>
                    {applicantsData.length > 0 ? (
                        <NetworkUsersList network={applicantsData}/>
                    ) : (
                        <p>No applicants yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ApplicantsPopup;
