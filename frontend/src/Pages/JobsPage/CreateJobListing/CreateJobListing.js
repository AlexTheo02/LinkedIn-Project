import { useState } from "react";
import 'react-dropdown/style.css';
import Dropdown from 'react-dropdown';
import s from "./CreateJobListingStyle.module.css";
import "./CustomDropdownStyle.css";

const ManyInputFields = ({name, list, setList}) => {

    const handleListChange = (index, event) => {
        // Create a copy of the original list
        const newList = [...list];

        // Update value on specific index
        newList[index].value = event.target.value;

        // Update actual list
        setList(newList);
    }
    
    // Add element at the end of the list (up to 10 total elements)
    const addElement = () => {
        if (list.length < 10)
            setList([...list, {value: ""}])
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
                        value={listElement.value}
                        onChange={(event) => {handleListChange(index, event)}}
                    />
                ))}
            </div>
            
            {/* Interaction bar */}
            <div className={s.many_input_fields_interaction_bar}>
                <button onClick={removeElement}>
                    Remove {name}
                </button>
                <button onClick={addElement} className={s.main}>
                    Add {name}
                </button>
            </div>

        </div>

    )
}

const CreateJobListing = ({jobListingsHandler}) => {

    const {handleCancel} = jobListingsHandler;
    const [author, setAuthor] = useState(null);
    const [title, setTitle] = useState("");
    const [employer, setEmployer] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [workingArrangement, setWorkingArrangement] = useState(0);
    const [employmentType, setEmploymentType] = useState(0);
    const [employeesRange, setEmployeesRange] = useState({value: 0, label: "1-10"});
    const [requirementsList, setRequirementsList] = useState([{value: ""},{value: ""},{value: ""}]);
    const [responsibilitiesList, setResponsibilitiesList] = useState([{value: ""},{value: ""},{value: ""}]);
    const [benefitsList, setBenefitsList] = useState([{value: ""},{value: ""},{value: ""}]);

    const [error, setError] = useState(null);
    // Publish job
    const handlePublish = async () => {
        const applicants = [];

        // Μετατροπή των λιστών σε πίνακες από strings και φιλτράρισμα των κενών strings
        const requirements = requirementsList.map(item => item.value).filter(item => item.trim() !== "");
        const responsibilities = responsibilitiesList.map(item => item.value).filter(item => item.trim() !== "");
        const benefits = benefitsList.map(item => item.value).filter(item => item.trim() !== "");
        
        // Check validity of fields, then proceed
        if (true){
            // Create dummy job
            const job = { 
                // author,
                title,
                employer,
                location,
                description,
                requirements,
                benefits,
                responsibilities,
                workingArrangement,
                employmentType,
                employeesRange: employeesRange.value,
                applicants
            }

            const response = await fetch("/api/jobs", {
                method: "POST",
                body: JSON.stringify(job),
                headers: {
                    "Content-Type" : "application/json"
                }
            })

            const json = await response.json();

            // Error publishing job
            if (!response.ok){
                setError(json.error);
                console.log(error)
            }
            // Publish job completed successfully
            if (response.ok){

                // Clear fields
                setAuthor("");
                setTitle("");
                setEmployer("");
                setLocation("");
                setDescription("");
                setRequirementsList([]);
                setBenefitsList([]);
                setResponsibilitiesList([]);
                setWorkingArrangement(0);
                setEmploymentType(0);
                setEmployeesRange({value: 0, label: "1-10"});
                
                // Clear error mesasage
                setError(null);

                console.log("Job published successfully", json);
            }
        }
    }

    return(
        <div className={s.create_job_listing}>
            {/* Job Title */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label}>Job Title:</label>
                <input
                    type="text"
                    id="jobTitleInput"
                    placeholder={"Title"}
                    className={s.text_input}
                    value={title}
                    onChange={(e) => {setTitle(e.target.value)}}
                />
            </div>

            {/* Employer */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label}>Employer:</label>
                <input
                    type="text"
                    id="jobEmployerInput"
                    placeholder={"Employer"}
                    className={s.text_input}
                    value={employer}
                    onChange={(e) => {setEmployer(e.target.value)}}
                />
            </div>

            {/* Location */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label}>Location:</label>
                <input
                    type="text"
                    id="jobLocationInput"
                    placeholder={"City, Country"}
                    className={s.text_input}
                    value={location}
                    onChange={(e) => {setLocation(e.target.value)}}
                />
            </div>
            
            {/* Working Arrangement and Working Hours and Number of employees range*/}
            {/* dual field now contains 3 elements, but the style remains the same */}
            <div className={s.dual_field}> 

                {/* Working Arrangement */}
                <div className={s.job_field_container}>
                    <label className={s.text_input_label}>Working Arrangement:</label>
                    <div className={s.vertical_container}>
                        <button
                            onClick={() => {setWorkingArrangement(0)}}
                            className={`${s.category_selection_button} ${ workingArrangement === 0 ? s.selected : ""}`}
                        >
                            On-site
                        </button>

                        <button
                            onClick={() => {setWorkingArrangement(1)}}
                            className={`${s.category_selection_button} ${ workingArrangement === 1 ? s.selected : ""}`}
                        >
                            Remote
                        </button>

                        <button
                            onClick={() => {setWorkingArrangement(2)}}
                            className={`${s.category_selection_button} ${ workingArrangement === 2 ? s.selected : ""}`}
                        >
                            Hybrid
                        </button>
                    </div>
                </div>

                {/* Employment Type */}
                <div className={s.job_field_container}>
                    <label className={s.text_input_label}>Working Hours:</label>
                    <div className={s.vertical_container}>

                        <button 
                            onClick={() => {setEmploymentType(0)}}
                            className={`${s.category_selection_button} ${ employmentType === 0 ? s.selected : ""}`}
                        >
                            Full-time
                        </button>

                        <button 
                            onClick={() => {setEmploymentType(1)}}
                            className={`${s.category_selection_button} ${ employmentType === 1 ? s.selected : ""}`}
                        >
                            Part-Time
                        </button>

                    </div>
                </div>

                {/* Number of employees range */}
                <div className={s.job_field_container}>
                    <label className={s.text_input_label}>Employees Range:</label>
                    <Dropdown
                        options={[
                            { value: 0, label: "1-10" },
                            { value: 1, label: "11-50" },
                            { value: 2, label: "51-100" },
                            { value: 3, label: "101-200" },
                            { value: 4, label: "201-500" },
                            { value: 5, label: "501-1000" },
                            { value: 6, label: "1001-2000" },
                            { value: 7, label: "2001-5000" },
                            { value: 8, label: "5001-10000" },
                            { value: 9, label: "10000+" }
                        ]}
                        value={employeesRange.label}
                        onChange={(option) => {setEmployeesRange(option)}}
                        placeholder={"Select Employee Number Range"}
                    />

                </div>
                
            </div>

            {/* Description */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} >Description:</label>
                <textarea
                    id="jobDescriptionInput"
                    placeholder={"Description"}
                    className={s.text_area_input}
                    value={description}
                    onChange={(e) => {setDescription(e.target.value)}}
                />
            </div>

            {/* Requirements */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} >Requirements:</label>
                <ManyInputFields name={"Requirement"} list={requirementsList} setList={setRequirementsList} />
            </div>

            {/* Responsibilities */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} >Responsibilities:</label>
                <ManyInputFields name={"Responsibility"} list={responsibilitiesList} setList={setResponsibilitiesList} />
            </div>

            {/* Benefits */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} >Benefits:</label>
                <ManyInputFields name={"Benefit"} list={benefitsList} setList={setBenefitsList} />
            </div>

            {/* Interaction Bar */}
            <div className={s.create_job_listing_interaction_bar}>
                <button className={s.altern} onClick={handleCancel}>
                    Cancel
                </button>

                <button onClick={handlePublish}>
                    Publish
                </button>

            </div>
            
        </div>
    )
}

export default CreateJobListing;