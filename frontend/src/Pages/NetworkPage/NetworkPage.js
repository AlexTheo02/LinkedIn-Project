import React from 'react';
import s from "./NetworkPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import GridViewUsers from './GridViewUsers/GridViewUsers';
import SearchBar from './SearchBar/SearchBar';

function NetworkPage(){
    const imageForConnectedUsers = require('./../../Images/profile_ergasiaSite.png');

    const connectedUsers = [
        {
            id: 1,
            name: 'Donald',
            surname: 'Trump',
            workingPosition: 'Data Analyst',
            employmentOrganization: 'SonyAI',
            image: imageForConnectedUsers
        },
        {
            id: 2,
            name: 'Barack',
            surname: 'Obama',
            workingPosition: 'Software Engineer',
            employmentOrganization: 'Nvidia',
            image: imageForConnectedUsers
        },
        {
            id: 3,
            name: 'Travis',
            surname: 'Scott',
            workingPosition: 'Research Scientist',
            employmentOrganization: 'Meta',
            image: imageForConnectedUsers
        },
        {
            id: 4,
            name: 'Kanye',
            surname: 'West',
            workingPosition: 'Marketing Manager',
            employmentOrganization: 'Tesla',
            image: imageForConnectedUsers
        },
        {
            id: 5,
            name: 'Elon',
            surname: 'Musk',
            workingPosition: 'CEO',
            employmentOrganization: 'SpaceX',
            image: imageForConnectedUsers
        },
        {
            id: 6,
            name: 'Jeff',
            surname: 'Bezos',
            workingPosition: 'Founder',
            employmentOrganization: 'Amazon',
            image: imageForConnectedUsers
        },
        {
            id: 7,
            name: 'Bill',
            surname: 'Gates',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Microsoft',
            image: imageForConnectedUsers
        },
        {
            id: 8,
            name: 'Mark',
            surname: 'Zuckerberg',
            workingPosition: 'CEO',
            employmentOrganization: 'Meta',
            image: imageForConnectedUsers
        },
        {
            id: 9,
            name: 'Sundar',
            surname: 'Pichai',
            workingPosition: 'CEO',
            employmentOrganization: 'Google',
            image: imageForConnectedUsers
        },
        {
            id: 10,
            name: 'Tim',
            surname: 'Cook',
            workingPosition: 'CEO',
            employmentOrganization: 'Apple',
            image: imageForConnectedUsers
        },
        {
            id: 11,
            name: 'Satya',
            surname: 'Nadella',
            workingPosition: 'CEO',
            employmentOrganization: 'Microsoft',
            image: imageForConnectedUsers
        },
        {
            id: 12,
            name: 'Larry',
            surname: 'Page',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Google',
            image: imageForConnectedUsers
        },
        {
            id: 13,
            name: 'Sergey',
            surname: 'Brin',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Google',
            image: imageForConnectedUsers
        },
        {
            id: 14,
            name: 'Steve',
            surname: 'Jobs',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Apple',
            image: imageForConnectedUsers
        },
        {
            id: 15,
            name: 'Warren',
            surname: 'Buffett',
            workingPosition: 'CEO',
            employmentOrganization: 'Berkshire Hathaway',
            image: imageForConnectedUsers
        },
        {
            id: 16,
            name: 'Reed',
            surname: 'Hastings',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Netflix',
            image: imageForConnectedUsers
        },
        {
            id: 17,
            name: 'Susan',
            surname: 'Wojcicki',
            workingPosition: 'CEO',
            employmentOrganization: 'YouTube',
            image: imageForConnectedUsers
        },
        {
            id: 18,
            name: 'Sheryl',
            surname: 'Sandberg',
            workingPosition: 'COO',
            employmentOrganization: 'Facebook',
            image: imageForConnectedUsers
        },
        {
            id: 19,
            name: 'Jack',
            surname: 'Dorsey',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Twitter',
            image: imageForConnectedUsers
        },
        {
            id: 20,
            name: 'Marissa',
            surname: 'Mayer',
            workingPosition: 'Former CEO',
            employmentOrganization: 'Yahoo',
            image: imageForConnectedUsers
        },
        {
            id: 21,
            name: 'Evan',
            surname: 'Spiegel',
            workingPosition: 'Co-Founder',
            employmentOrganization: 'Snap Inc.',
            image: imageForConnectedUsers
        },
        {
            id: 22,
            name: 'Daniel',
            surname: 'Ek',
            workingPosition: 'CEO',
            employmentOrganization: 'Spotify',
            image: imageForConnectedUsers
        },
        {
            id: 23,
            name: 'Whitney',
            surname: 'Wolfe Herd',
            workingPosition: 'Founder',
            employmentOrganization: 'Bumble',
            image: imageForConnectedUsers
        },
        {
            id: 24,
            name: 'Elon',
            surname: 'Musk',
            workingPosition: 'CEO',
            employmentOrganization: 'Tesla',
            image: imageForConnectedUsers
        }
    ];

    return(
        <div className={s.network_page}>
            <NavBar currentPage={"Network"}/>
            <div className={s.container}>
                <SearchBar />
                <h2>Connected with you:</h2>
                <GridViewUsers users={connectedUsers} />
            </div>
        </div>
    );
}

export default NetworkPage;
