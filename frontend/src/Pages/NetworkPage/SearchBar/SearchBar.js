import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import s from "./SearchBarStyle.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../../Hooks/useAuthContext';

function SearchBar() {
    const {user} = useAuthContext();

    const imageForUsers = require('./../../../Images/logo.png');

    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const searchInputRef = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchData = async () => {
            if (input.length > 0) {
                try {
                    const response = await fetch(`/api/users?searchTerm=${input}`,{
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    const data = await response.json();
                    if (input.length > 0) {
                        setResults(data);
                        setShowResults(true);
                    }
                } catch (error) {
                    console.error('Error fetching the users:', error);
                    setResults([]);
                    setShowResults(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [input, user]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const selectInput = (keyword) => {
        // Αρχικοποιούμε το input με το όνομα και το επίθετο του χρήστη
        setInput(`${keyword.name} ${keyword.surname}`);
        // Καθαρίζουμε τα αποτελέσματα
        setResults([]);
        setShowResults(false);

        // Ανακατεύθυνση στο profile του χρήστη
        navigate(`/Profile/${keyword._id}`);
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
                                <img src={result.profilePicture} alt={`${result.name} ${result.surname}`} />
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
