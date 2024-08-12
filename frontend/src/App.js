import './App.css';

import WelcomePage from "./Pages/WelcomePage/WelcomePage.js";
import HomePage from "./Pages/HomePage/HomePage.js";
import NetworkPage from "./Pages/NetworkPage/NetworkPage.js"
import JobsPage from "./Pages/JobsPage/JobsPage.js"
import ConversationsPage from "./Pages/ConversationsPage/ConversationsPage.js"
import NotificationsPage from "./Pages/NotificationsPage/NotificationsPage.js"
import PersonalDetailsPage from "./Pages/PersonalDetailsPage/PersonalDetailsPage.js"
import SettingsPage from "./Pages/SettingsPage/SettingsPage.js"
import ProfilePage from './Pages/ProfilePage/ProfilePage.js';
import PostPage from './Pages/PostPage/PostPage.js';
import NavBar from './Components/NavBar/NavBar.js';
import { PostsContextProvider } from './Context/PostContext.js';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <div className='pages'>
        <Routes>

        {/* Welcome Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Home Route */}
        <Route path="/Home" element={
          <PostsContextProvider>
            <HomePage user_id={2} />
          </PostsContextProvider>
        } />

        {/* Network Route */}
        <Route path="/Network" element={<NetworkPage />} />

        {/* Jobs Route */}
        <Route path="/Jobs" element={<JobsPage />} />

        {/* Conversations Route */}
        <Route path="/Conversations" element={<ConversationsPage />} />

        {/* Notifications Route */}
        <Route path="/Notifications" element={<NotificationsPage />} />

        {/* Personal Details Route */}
        <Route path="/Personal Details" element={<PersonalDetailsPage />} />

        {/* Settings Route */}
        <Route path="/Settings" element={<SettingsPage user_id={3}/>} />
          
        {/* Profile Route */}
        <Route path="/Profile" element={<ProfilePage />} />
=======
        <Route path="/Profile/:id" element={user ? <ProfilePage /> : <Navigate to="/" />} />
>>>>>>> Stashed changes

        {/* Post Page Route */}
        <Route path="/Post" element={<PostPage post_id={2}/>} />

        {/* Default redirect to welcome page*/}
        <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Export both components
export default App;