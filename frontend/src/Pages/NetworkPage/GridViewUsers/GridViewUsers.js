import React from 'react';
import s from "./GridViewUsersStyle.module.css";
import ConnectedUser from '../ConnectedUser/ConnectedUser';

function GridViewUsers({ users }) {
    return (
        <div className={s.grid_container}>
            {users.map((user) => (
                <div className={s.grid_item} key={user.id}>
                    <ConnectedUser 
                        name={user.name} 
                        surname={user.surname} 
                        workingPosition={user.workingPosition} 
                        employmentOrganization={user.employmentOrganization}
                        profilePic={user.image}
                    />
                </div>
            ))}
        </div>
    );
}

export default GridViewUsers;
