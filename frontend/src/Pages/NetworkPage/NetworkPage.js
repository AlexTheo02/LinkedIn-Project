import React from 'react';
import s from "./NetworkPageStyle.module.css";
import NavBar from '../../Components/NavBar/NavBar';
import GridViewUsers from './GridViewUsers/GridViewUsers';
import SearchBar from './SearchBar/SearchBar';

function NetworkPage(){

    return(
        <div className={s.network_page}>
            <NavBar currentPage={"Network"}/>
            <div className={s.container}>
                <SearchBar />
                <h2>Connected with you:</h2>
                <GridViewUsers />
            </div>
        </div>
    );
}

export default NetworkPage;
