import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './AdminPageStyle.module.css';
import { useAuthContext } from '../../Hooks/useAuthContext';

function AdminPage() {
    const {user} = useAuthContext()
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();

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

    const handleExport = async (format) => {
        const selectedData = {
            users: selectedUsers
        };

        const response = await fetch(`/api/users/export?format=${format}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

    return (
        <div className={s.admin_page}>
            <h1>User Management</h1>
            <div className={s.categories}>
                <div className={s.select_category}>
                    <h2>Select</h2>
                </div>
                <div className={s.category}>
                    <h2>Main Info</h2>
                </div>
                <div className={s.category}>
                    <h2>Contact Info</h2>
                </div>
            </div>
            
            {/* <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user._id)} 
                                    onChange={() => handleSelectUser(user._id)} 
                                />
                            </td>
                            <td>{user.name} {user.surname}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => {}}>
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> */}

            <div className={s.export_buttons}>
                <button onClick={() => handleExport('json')}>Export as JSON</button>
                <button onClick={() => handleExport('xml')}>Export as XML</button>
            </div>
        </div>
    );
}

export default AdminPage;
