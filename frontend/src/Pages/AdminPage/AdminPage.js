import React, { useState, useEffect } from 'react';
import s from './AdminPageStyle.module.css';
import { useAuthContext } from '../../Hooks/useAuthContext';
import UsersList from './UsersList/UsersList';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";

function AdminPage() {
    const {user} = useAuthContext()
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const isSelectedUsersEmpty = selectedUsers.length === 0;

    // Fetch posts from database
    useEffect(() => {
        const fetchPosts = async() => {
            const response = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await response.json();

            if (response.ok){
                setUsers(json);
            }
        }

        if (user){
            fetchPosts()
        }
        // filter posts for user's timeline
    }, [user])

    if (users.length === 0){
        return <h1 className={s.loading_text}>Loading...</h1>;
    }

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId) 
            ? prevSelected.filter(id => id !== userId)
            : [...prevSelected, userId]
        );
    };

    const handleExportMany = async (format) => {
        const selectedData = {
            users: selectedUsers,
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

        setSelectedUsers([]);
    };
    
    return (
        <div className={s.admin_page}>
            <h1>User Management</h1>
            <div className={s.categories}>
                <div className={s.select_category}>
                    <FontAwesomeIcon icon={faListCheck} />
                </div>
                <div className={s.category}>
                    <h2>Main Info</h2>
                </div>
                <div className={s.category}>
                    <h2>Contact Info</h2>
                </div>
                <div className={s.options_category}>
                    <h2>Actions</h2>
                </div>
            </div>
            <div className={s.users}>
                <UsersList users={users} selectedUsers={selectedUsers} handleSelectUser={handleSelectUser}/>
            </div>
            <div className={s.export_buttons}>
                <button className={isSelectedUsersEmpty ? s.disabled : ''} disabled={isSelectedUsersEmpty} onClick={() => handleExportMany('xml')}>Export all selected as XML</button>
                <button className={isSelectedUsersEmpty ? s.disabled : ''} disabled={isSelectedUsersEmpty} onClick={() => handleExportMany('json')}>Export all selected as JSON</button>
            </div>
        </div>
    );
}

export default AdminPage;
