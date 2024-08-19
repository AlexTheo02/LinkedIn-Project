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
import { ConversationContextProvider } from './Context/ConversationContext.js';
import { useAuthContext } from './Hooks/useAuthContext.js';
import { useState, useEffect } from 'react';
import { JobsContextProvider } from './Context/JobsContext.js';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  const {user} = useAuthContext()

  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize with null

  useEffect(() => {
      if (user) {
          setIsAuthenticated(true);
      } else {
          setIsAuthenticated(false);
      }
  }, [user]);

  if (isAuthenticated === null) {
      return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <div className='pages'>
        <Routes>

        {/* Welcome Route */}
        <Route path="/" element={!user ? <WelcomePage /> : <Navigate to="/Home" />} />

        {/* Home Route */}
        <Route path="/Home" element={
          user ?
          <PostsContextProvider>
            <HomePage user_id={2} />
          </PostsContextProvider>
          : 
          <Navigate to="/" />
        } />

        {/* Network Route */}
        <Route path="/Network" element={user ? <NetworkPage /> : <Navigate to="/" />} />

        {/* Jobs Route */}
        <Route path="/Jobs" element={
          user ? 
          <JobsContextProvider>
            <JobsPage /> 
          </JobsContextProvider>
          : 
          <Navigate to="/" />
        } />

        {/* Conversations Route */}
        <Route path="/Conversations" element={user ?
        <ConversationContextProvider>
          <ConversationsPage />
        </ConversationContextProvider>  : <Navigate to="/" />} />

        {/* Notifications Route */}
        <Route path="/Notifications" element={user ? <NotificationsPage /> : <Navigate to="/" />} />

        {/* Personal Details Route */}
        <Route path="/Personal Details" element={user ? <PersonalDetailsPage /> : <Navigate to="/" />} />

        {/* Settings Route */}
        <Route path="/Settings" element={user ? <SettingsPage /> : <Navigate to="/" />} />
          
        {/* Profile Route */}
        <Route path="/Profile/:id" element={user ? <ProfilePage /> : <Navigate to="/" />} />

        {/* Post Page Route */}
        <Route path="/Post" element={user ? <PostPage /> : <Navigate to="/" />} />

        {/* Default redirect to welcome page*/}
        <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Export both components
export default App;