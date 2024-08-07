import React, { useState, useEffect, useRef } from 'react';
import s from "./SearchBarStyle.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchBar() {
    const imageForUsers = require('./../../../Images/logo.png');

    const availableKeywords = [
        { name: 'Joe', surname: 'Biden', profilePic: imageForUsers, workingPosition: 'President', employmentOrganization: 'United States Government' },
        { name: 'Donald', surname: 'Trump', profilePic: imageForUsers, workingPosition: 'Businessman', employmentOrganization: 'Trump Organization' },
        { name: 'Barack', surname: 'Obama', profilePic: imageForUsers, workingPosition: 'Former President', employmentOrganization: 'United States Government' },
        { name: 'Travis', surname: 'Scott', profilePic: imageForUsers, workingPosition: 'Rapper', employmentOrganization: 'Cactus Jack Records' },
        { name: 'Andreas', surname: 'Papandreou', profilePic: imageForUsers, workingPosition: 'Former Prime Minister', employmentOrganization: 'Greek Government' },
        { name: 'Kostas', surname: 'Karamanlis', profilePic: imageForUsers, workingPosition: 'Former Prime Minister', employmentOrganization: 'Greek Government' },
        { name: 'Sakis', surname: 'Rouvas', profilePic: imageForUsers, workingPosition: 'Singer', employmentOrganization: 'Self-employed' },
        { name: 'Kanye', surname: 'West', profilePic: imageForUsers, workingPosition: 'Rapper', employmentOrganization: 'GOOD Music' },
        { name: 'Elon', surname: 'Musk', profilePic: imageForUsers, workingPosition: 'CEO', employmentOrganization: 'SpaceX' },
        { name: 'Mark', surname: 'Zuckerberg', profilePic: imageForUsers, workingPosition: 'CEO', employmentOrganization: 'Meta' },
        { name: 'Bill', surname: 'Gates', profilePic: imageForUsers, workingPosition: 'Co-founder', employmentOrganization: 'Microsoft' },
    ];
    

    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.length > 0) {
            const filteredResults = availableKeywords.filter((keyword) =>
                `${keyword.name} ${keyword.surname}`.toLowerCase().includes(value.toLowerCase())
            );
            setResults(filteredResults);
            setShowResults(true);
        } else {
            setResults([]);
            setShowResults(false);
        }
    };

    const selectInput = (keyword) => {
        setInput(`${keyword.name} ${keyword.surname}`);
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={searchInputRef} className={(input.length === 0 || results.length === 0 || !showResults) ? s.search_bar_no_results : s.search_bar_with_results}>
            <div className={s.row}>
                <input
                    type='text'
                    id='searchInput'
                    placeholder='Search any user'
                    autoComplete='off'
                    value={input}
                    onChange={handleInputChange}
                    onFocus={() => setShowResults(true)}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className={s.search_icon} />
            </div>
            {showResults && (
                <div className={s.results_list}>
                    <ul>
                        {results.map((result, index) => (
                            <li key={index} onClick={() => selectInput(result)}>
                                <img src={result.profilePic} alt={`${result.name} ${result.surname}`} />
                                <div className={s.user_info}>
                                    <b>{result.name} {result.surname}</b>
                                    <b className={s.position}>{result.workingPosition} at {result.employmentOrganization}</b>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
