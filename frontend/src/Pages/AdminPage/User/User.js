import React from 'react';
import s from './UserStyle.module.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faSquare } from "@fortawesome/free-solid-svg-icons";
import { useAuthContext } from '../../../Hooks/useAuthContext';

function User({ userData, isSelected, handleSelectUser }) {
    const {user} = useAuthContext();
    const navigate = useNavigate();

    const handleExportOne = async (format) => {
        const selectedData = {
            users: userData._id,
            format: format
        };

        const response = await fetch('/api/users/export', {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(selectedData)
        });

        const fileData = await response.blob();
        const url = window.URL.createObjectURL(fileData);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `users.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleUserClick = (userId) => {
        navigate(`/Profile/${userId}`);
    };

    return (
        <div className={s.network_user}>
            <div className={s.select_section} onClick={() => handleSelectUser(userData._id)}>
                {isSelected ? <FontAwesomeIcon className={s.check_icon} icon={faSquareCheck} /> : <FontAwesomeIcon className={s.box_icon} icon={faSquare} />}
            </div>
            <div className={s.main_section} onClick={() => handleUserClick(userData._id)}>
                <div className={s.section}>
                    <img src={userData.profilePicture} alt={`${userData.name} ${userData.surname}`} />
                    <div className={s.user_info}>
                        <b>{userData.name} {userData.surname}</b>
                        <b className={s.position}>{userData.workingPosition} at {userData.employmentOrganization}</b>
                    </div>
                </div>
                <div className={s.section}>
                    <div className={s.contact_info}>
                        <b>{userData.phoneNumber}</b>
                        <b>{userData.email}</b>
                    </div>
                </div>
            </div>
            <div className={s.options_section}>
                <button className={s.profile_button} onClick={() => handleUserClick(userData._id)}>
                    View Profile
                </button>
                <button className={s.export_button} onClick={() => handleExportOne('xml')}>
                    Export XML
                </button>
                <button className={s.export_button} onClick={() => handleExportOne('json')}>
                    Export JSON
                </button>
            </div>
        </div>
    );
}

export default User;