import { useState } from "react";
import s from "./CreateJobListingStyle.module.css"

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

    const [title, setTitle] = useState("");

    const [location, setLocation] = useState("");

    const [isOnSite, setIsOnSite] = useState(true);
    const [isRemote, setIsRemote] = useState(false);
    const [isHybrid, setIsHybrid] = useState(false);

    const [isFullTime, setIsFullTime] = useState(true);
    const [isPartTime, setIsPartTime] = useState(false);

    const [requirementsList, setRequirementsList] = useState([{value: ""},{value: ""},{value: ""}]);

    const [responsibilitiesList, setResponsibilitiesList] = useState([{value: ""},{value: ""},{value: ""}]);

    const [benefitsList, setBenefitsList] = useState([{value: ""},{value: ""},{value: ""}]);

    const [description, setDescription] = useState("");

    const handlePublish = () => {
        console.log("Publishing job")
    }

    return(
        <div className={s.create_job_listing}>
            {/* Job Title */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} htmlFor="jobTitle">Job Title:</label>
                <input
                    type="text"
                    id="jobTitleInput"
                    placeholder={"Title"}
                    className={s.text_input}
                    value={title}
                    onChange={(e) => {setTitle(e.target.value)}}
                />
            </div>

            {/* Location */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} htmlFor="jobLocation">Location:</label>
                <input
                    type="text"
                    id="jobLocationInput"
                    placeholder={"City, Country"}
                    className={s.text_input}
                    value={location}
                    onChange={(e) => {setLocation(e.target.value)}}
                />
            </div>
            
            {/* Working Arrangement and Working Hours */}
            <div className={s.dual_field}>

                {/* Working Arrangement */}
                <div className={s.job_field_container}>
                    <label className={s.text_input_label} htmlFor="workingArrangement">Working Arrangement:</label>
                    <div className={s.vertical_container}>
                        <button
                            onClick={() => {setIsOnSite(true); setIsRemote(false); setIsHybrid(false);}}
                            className={`${s.category_selection_button} ${ isOnSite ? s.selected : ""}`}
                        >
                            On-site
                        </button>

                        <button
                            onClick={() => {setIsOnSite(false); setIsRemote(true); setIsHybrid(false);}}
                            className={`${s.category_selection_button} ${ isRemote ? s.selected : ""}`}
                        >
                            Remote
                        </button>

                        <button
                            onClick={() => {setIsOnSite(false); setIsRemote(false); setIsHybrid(true);}}
                            className={`${s.category_selection_button} ${ isHybrid ? s.selected : ""}`}
                        >
                            Hybrid
                        </button>
                    </div>
                </div>

                {/* Working Hours */}
                <div className={s.job_field_container}>
                    <label className={s.text_input_label} htmlFor="workingHours">Working Hours:</label>
                    <div className={s.vertical_container}>

                        <button 
                            onClick={() => {setIsFullTime(true); setIsPartTime(false);}}
                            className={`${s.category_selection_button} ${ isFullTime ? s.selected : ""}`}
                        >
                            Full-time
                        </button>

                        <button 
                            onClick={() => {setIsFullTime(false); setIsPartTime(true);}}
                            className={`${s.category_selection_button} ${ isPartTime ? s.selected : ""}`}
                        >
                            Part-Time
                        </button>

                    </div>
                </div>
            </div>

            {/* Description */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} htmlFor="jobDescription">Description:</label>
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
                <label className={s.text_input_label} htmlFor="jobRequirements">Requirements:</label>
                <ManyInputFields name={"Requirement"} list={requirementsList} setList={setRequirementsList} />
            </div>

            {/* Responsibilities */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} htmlFor="jobResponsibilities">Responsibilities:</label>
                <ManyInputFields name={"Responsibility"} list={responsibilitiesList} setList={setResponsibilitiesList} />
            </div>

            {/* Benefits */}
            <div className={s.job_field_container}>
                <label className={s.text_input_label} htmlFor="jobBenefits">Benefits:</label>
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