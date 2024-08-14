import React, { useRef } from 'react';
import s from "./RequestsListStyle.module.css";
import LinkUpRequest from '../LinkUpRequest/LinkUpRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

function RequestsList({ requests }) {
    const listRef = useRef(null);

    

    const scrollLeft = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (listRef.current) {
            listRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className={s.requests_list_container}>
            <FontAwesomeIcon icon={faAnglesLeft} className={s.angles} onClick={scrollLeft} />
            <div className={s.requests_list} ref={listRef}>
                {requests.map(request => (
                    <LinkUpRequest key={request.id} name={request.name} position={request.position} />
                ))}
            </div>
            <FontAwesomeIcon icon={faAnglesRight} className={s.angles} onClick={scrollRight} />
        </div>
    );
}

export default RequestsList;
