import s from "./HomePageStyle.module.css";
import NavBar from "../../Components/NavBar/NavBar";
import PersonalDetailsPanel from "../../Components/PersonalDetailsPanel/PersonalDetailsPanel.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faFileVideo, faFileAudio  } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useEffect } from "react";
import { CommentsPopup } from "../../Components/PostComponent/PostComponents.js";
import TextAreaAutosize from "react-textarea-autosize"
import { FileUploader } from "react-drag-drop-files";
import TimelinePosts from "./TimelinePosts/TimelinePosts.js"
import { usePostsContext } from "../../Hooks/usePostsContext.js";
import { useAuthContext } from "../../Hooks/useAuthContext.js";

function CreatePost({userData}) {
    const { postDispatch } = usePostsContext()
    const {user} = useAuthContext()

    const imgFileTypes = ["JPG", "PNG"];
    const vidFileTypes = ["MP4", "MOV"];
    const audFileTypes = ["MP3", "WAV"];

    // Caption control
    const [caption, setCaption] = useState("");
    const [commentsList, setCommentsList] = useState([]);
    const [likesList, setLikesList] = useState([]);
    const [error, setError] = useState(null);

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
    const handlePublisButtonClick = async () => {

        if (!user){
            setError("You must be logged in");
            return
        }
        // Check if post is not empty
        if (caption !== ""){

            const formData = new FormData();
            formData.append("author", user.userId);
            formData.append("caption", caption);
            formData.append("commentsList", JSON.stringify(commentsList));
            formData.append("likesList", JSON.stringify(likesList));
            formData.append("file", multimedia);

           const response = await fetch("/api/posts", {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
           });

           const json = await response.json();

            // Error publishing post
            if (!response.ok){
                setError(json.error);
            }
            // Publish post completed successfully
            if (response.ok){

                // Clear fields
                setCaption('');
                setMultimedia(null);
                setMultimediaPreview(null);
                setMultimediaType(null);
                setCommentsList([]);
                setLikesList([]);
                
                // Clear error mesasage
                setError(null);

                console.log("Post published successfully", json);

                postDispatch({type: 'CREATE_POST', payload: json});
            }
        }
    }

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
                    <img className={s.user_pfp} src={userData.profilePicture} alt="user pfp"/>
                    <span className={s.user_username}> {`${userData.name} ${userData.surname}`} </span>
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
                        </button>

                        <button className={`${s.create_post_button} ${s.add_video_button}`} onClick={handleAddVideoButtonClick}>
                            <FontAwesomeIcon icon={faFileVideo} />
                            Video
                        </button>

                        <button className={`${s.create_post_button} ${s.add_audio_button}`} onClick={handleAddAudioButtonClick}>
                            <FontAwesomeIcon icon={faFileAudio} />
                            Audio
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

function HomePage() {
    const {user} = useAuthContext();
    // Fetch user data
    const [userData, setUserData] = useState(null);
    const { activePostId, posts, postDispatch } = usePostsContext();

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${user.userId}`,{
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                setUserData(data);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [user]);

    // Comments popup state
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    if(!userData){
        return <h1 className={s.loading_text}>Loading...</h1>;
    }


    const showCommentsPopup = (post_id) => {
        setIsPopupVisible(true);
    };

    const hideCommentsPopup = async () => {
        setIsPopupVisible(false);
    };
    
    // Struct for efficiency
    const commentsPopupHandler = {
        showCommentsPopup,
        hideCommentsPopup,
        isPopupVisible,
    }

    return(
        <div className={s.home_page}>
            <NavBar isHome={true} currentPage={"HomePage"}/>
            <div className={s.container}>
                <PersonalDetailsPanel userData={userData} />
                <CommentsPopup userData={userData} commentsPopupHandler={commentsPopupHandler}/>
                <div className={s.timeline}>
                    <CreatePost userData={userData}/>
                    <TimelinePosts commentsPopupHandler={commentsPopupHandler}/>
                </div>
                
            </div>
            
        </div>
    );
}

export default HomePage;