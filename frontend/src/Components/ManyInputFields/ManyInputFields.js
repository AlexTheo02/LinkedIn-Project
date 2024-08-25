import React from "react";
import s from "./ManyInputFieldsStyle.module.css"

const ManyInputFields = ({name, list, setList, limit = 10, isEditing = true}) => {

    const handleListChange = (index, event) => {
        // Create a copy of the original list
        const newList = [...list];

        // Update value on specific index
        newList[index] = event.target.value;

        // Update actual list
        setList(newList);
    }
    
    // Add element at the end of the list (up to 10 total elements)
    const addElement = () => {
        if (list.length < limit)
            setList([...list, ""])
    }

    // Remove the top element from the list (not if it's the only one)
    const removeElement = () => {
        if (list.length > 1)
            setList(list.slice(0, -1));
    }

    return (
        <div className={s.many_input_fields_container}>

            {/* Fields container */}
            <div className={s.many_fields_container}>
                {list.map((listElement, index) => (
                    <input
                        key={`${name}Input${index}`}
                        type="text"
                        id={`${name}Input${index}`}
                        placeholder={`${name} ${index + 1}`}
                        className={s.text_input}
                        value={listElement}
                        onChange={(event) => {handleListChange(index, event)}}
                        disabled={!isEditing}
                    />
                ))}
            </div>
            
            {/* Interaction bar */}
            {isEditing && 
                <div className={s.many_input_fields_interaction_bar}>
                    <button onClick={removeElement}>
                        Remove {name}
                    </button>
                    <button onClick={addElement} className={s.main}>
                        Add {name}
                    </button>
                </div>
            }
        </div>
    )
}

export default ManyInputFields;