import React, { useState, useEffect, useRef } from 'react';
import s from "./SearchBarStyle.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function SearchBar() {
    const imageForUsers = require('./../../../Images/logo.png');

    const availableKeywords = [
        { name: 'Joe', surname: 'Biden', profilePic: imageForUsers },
        { name: 'Donald', surname: 'Trump', profilePic: imageForUsers },
        { name: 'Barack', surname: 'Obama', profilePic: imageForUsers },
        { name: 'Travis', surname: 'Scott', profilePic: imageForUsers },
        { name: 'Andreas', surname: 'Papandreou', profilePic: imageForUsers },
        { name: 'Kostas', surname: 'Karamanlis', profilePic: imageForUsers },
        { name: 'Sakis', surname: 'Rouvas', profilePic: imageForUsers },
        { name: 'Kanye', surname: 'West', profilePic: imageForUsers },
        { name: 'Elon', surname: 'Musk', profilePic: imageForUsers },
        { name: 'Mark', surname: 'Zuckerberg', profilePic: imageForUsers },
        { name: 'Bill', surname: 'Gates', profilePic: imageForUsers },
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
                                <img src={result.profilePic} alt={`${result.name} ${result.surname}`} className={s.profile_pic} />
                                {result.name} {result.surname}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
