import s from "./HomePageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import PersonalDetailsPanel from "../../Components/PersonalDetailsPanel/PersonalDetailsPanel.js"
import Post from "../../Components/PostComponent/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faFileVideo, faFileAudio  } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback } from "react";
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";
import tsipras from "../../Images/tsipras.jpg"
import mitsotakis from "../../Images/mitsotakis.jpg"
import TextAreaAutosize from "react-textarea-autosize"
import { FileUploader } from "react-drag-drop-files";

function CreatePost({user_id}) {

    const imgFileTypes = ["JPG", "PNG"];
    const vidFileTypes = ["MP4", "MOV"];
    const audFileTypes = ["MP3", "WAV"];
    
    const getUserProfilePicture = (user_id) =>{
        // Database access
        if (user_id === 3){
            return tsipras;
        }
        if (user_id === 2){
            return mitsotakis;
        }
    }

    const getUserUsername = (user_id) =>{
        // Database access
        if (user_id === 3){
            return "Alexis Tsipras";
        }
        if (user_id === 2){
            return "Kyriakos Mitsotakis";
        }
    }

    // Caption control
    const [caption, setCaption] = useState("");

    // Multimedia control
    const [multimediaType, setMultimediaType] = useState(null);
    const [multimedia, setMultimedia] = useState(null);
    const [multimediaPreview, setMultimediaPreview] = useState(null);


    // Cancel multimedia upload
    const handleCancelButtonClick = () => {
        setMultimediaType(null);
        setMultimedia(null);
        setMultimediaPreview(null);
    }

    // Image handling
    const handleAddImageButtonClick = () => {
        setMultimediaType("image");
    }

    // Video handling
    const handleAddVideoButtonClick = () => {
        setMultimediaType("video")
    }

    // Audio handling
    const handleAddAudioButtonClick = () => {
        setMultimediaType("audio")
    }

    // Publish post
    const handlePublisButtonClick = () => {
        
        // Check if post is not empty
        if (caption !== "" && multimedia !== null){
            // Add post to user's post list on database
        }
    }

    const usr_pfp = getUserProfilePicture(user_id);
    const usr_username = getUserUsername(user_id);


    const handleCaptionChange = (event) => {
        setCaption(event.target.value);
    }

    const MultimediaComponent = useCallback(({multimediaType, multimedia, multimediaPreview, setMultimedia, setMultimediaPreview}) => {

        const handleChange = (file) => {
            setMultimedia(file);
            setMultimediaPreview(URL.createObjectURL(file));
        };
        
        if (multimediaType === "image"){
            if (multimedia === null)
                return (
                    <div className={s.multimedia_component}>
                        <FileUploader handleChange={handleChange} label="Upload Image" classes={s.drag_and_drop_box} types={imgFileTypes}/>
                    </div>
                );
            else
                return (
                    <div className={s.post_preview_multimedia_container}>
                        <img className={s.post_preview_multimedia} alt="Post Img" src={multimediaPreview}/>
                    </div>
                );
        }
        
        if (multimediaType === "video"){
            if (multimedia === null)
                return (
                    <div className={s.multimedia_component}>
                        <FileUploader handleChange={handleChange} label="Upload Video" classes={s.drag_and_drop_box} types={vidFileTypes}/>
                    </div>
                );
            else
                return (
                    <div className={s.post_preview_multimedia_container}>
                        <video className={s.post_preview_multimedia} src={multimediaPreview} controls/>
                    </div>
                );
        }

        if (multimediaType === "audio"){
            if (multimedia === null)
                return (
                    <div className={s.multimedia_component}>
                        <FileUploader handleChange={handleChange} label="Upload Audio" classes={s.drag_and_drop_box} types={audFileTypes}/>
                    </div>
                );
            else
                return (
                    <div className={s.post_preview_multimedia_container}>
                        <audio className={s.post_preview_multimedia} src={multimediaPreview} controls/>
                    </div>
                );
        }
        
        // No component
        return(<></>);
    }, []);

    return (
        <div className={s.create_post_container}>
            <div className={s.create_post_header}>
                Create Post
            </div>

            <div className={s.create_post_preview}>
                <div className={s.post_preview_header}>
                    <img className={s.user_pfp} src={usr_pfp} alt="user pfp"/>
                    <span className={s.user_username}> {usr_username} </span>
                </div>

                <div className={ multimediaType === null ? s.post_preview_content_container : `${s.post_preview_content_container} ${s.post_preview_content_container_expanded}`}>
                    <TextAreaAutosize className={multimediaType === null ? s.create_post_caption_area : `${s.create_post_caption_area} ${s.create_post_caption_area_expanded}`} value={caption} onChange={handleCaptionChange} placeholder="Your caption"/>
                    <MultimediaComponent multimediaType={multimediaType} multimedia={multimedia} multimediaPreview={multimediaPreview} setMultimedia={setMultimedia} setMultimediaPreview={setMultimediaPreview} />
                </div>

            </div>

            <div className={`${s.create_post_control_bar} ${multimediaType !== null ? s.adding_multimedia : ""}`}>

                {multimediaType === null ? (
                    <>
                        <button className={`${s.create_post_button} ${s.add_image_button}`} onClick={handleAddImageButtonClick}>
                            <FontAwesomeIcon icon={faFileImage} />
                            Image
                            {/* Maybe add fontawesome icon */}
                        </button>

                        <button className={`${s.create_post_button} ${s.add_video_button}`} onClick={handleAddVideoButtonClick}>
                            <FontAwesomeIcon icon={faFileVideo} />
                            Video
                            {/* Maybe add fontawesome icon */}
                        </button>

                        <button className={`${s.create_post_button} ${s.add_audio_button}`} onClick={handleAddAudioButtonClick}>
                            <FontAwesomeIcon icon={faFileAudio} />
                            Audio
                            {/* Maybe add fontawesome icon */}
                        </button>
                    </>
                ) : null}

                {multimediaType !== null ? (
                    <>
                        <button className={`${s.create_post_button} ${s.cancel_button}`} onClick={handleCancelButtonClick}>
                            Cancel
                            {/* Maybe add fontawesome icon */}
                        </button>
                    </>
                ) : null}
                
                <button className={`${s.create_post_button} ${s.publish_button}`} onClick={handlePublisButtonClick}>
                    Publish
                    {/* Maybe add fontawesome icon */}
                </button>

                
            </div>
        </div>
    );
}

function HomePage({user_id}) {

        // Comments popup state
        const [isPopupVisible, setIsPopupVisible] = useState(false);
        const [selectedPostId, setSelectedPostId] = useState(null);
    
        const showCommentsPopup = (post_id) => {
            setIsPopupVisible(true);
            setSelectedPostId(post_id)
        };
    
        const hideCommentsPopup = () => {
            setIsPopupVisible(false);
            setSelectedPostId(null);            
        };
        
        // Struct for efficiency
        const commentsPopupHandler = {
            showCommentsPopup,
            hideCommentsPopup,
            isPopupVisible,
            selectedPostId
        }

    return(
        <div className={s.home_page}>
            <NavBar isHome={true}/>
            <container className={s.container}>
                <PersonalDetailsPanel />
                <CommentsPopup commentsPopupHandler={commentsPopupHandler}/>
                <timeline className={s.timeline}>
                    <CreatePost user_id={user_id}/>
                    {/* Replase Posts with map of TimelineList (fetched from database) */}
                    <Post post_id={3} commentsPopupHandler={commentsPopupHandler}/>
                    <Post post_id={2} commentsPopupHandler={commentsPopupHandler}/>
                    <Post post_id={3} commentsPopupHandler={commentsPopupHandler}/>
                </timeline>
                
            </container>
            
        </div>
    );
}

export default HomePage;