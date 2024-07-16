import "./HomePageStyle.css";
import NavBar from "../../Components/NavBar/NavBar";
import Post from "../../Components/PostComponent/Post";
import postPFP from "../../Images/logo.png"
import malakes from "../../Images/ergasia_welcome_page_image.png"

function HomePage() {
    return(
        <div>
            <NavBar />
            <Post
             profilePicture={postPFP}
             userName={"Kyriakos Mitsotakis"}
             timestamp={"16 Jul 2024"}
             caption={"I am very excited to announce that i am joining Linkedin!"}
             multimedia={malakes}
             multimediaType={"image"}
             likeCount={666}
             commentCount={420}
             isLiked={true}
            />
        </div>
    );
}

export default HomePage;