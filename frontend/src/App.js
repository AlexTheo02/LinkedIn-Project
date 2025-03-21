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
import { PostsContextProvider } from './Context/PostContext.js';
import { ConversationContextProvider } from './Context/ConversationContext.js';
import { useAuthContext } from './Hooks/useAuthContext.js';
import { useState, useEffect } from 'react';
import { JobsContextProvider } from './Context/JobsContext.js';
import AdminPage from './Pages/AdminPage/AdminPage.js';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  const {user} = useAuthContext()

  const [isAuthenticated, setIsAuthenticated] = useState(null);

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
      <div className='pages'>
        <Routes>

        {/* Welcome Route */}
        <Route
          path="/"
          element={
            !user ? <WelcomePage /> :
            user.admin ? <Navigate to="/Admin" /> : <Navigate to="/Home" />
          } 
        />

        {/* Home Route */}
        <Route path="/Home" element={
          user && !user.admin ?
          <PostsContextProvider>
            <HomePage />
          </PostsContextProvider>
          : 
          <Navigate to="/" />
        } />

        {/* Admin Route */}
        <Route path="/Admin" element={user && user.admin ? <AdminPage /> : <Navigate to="/" />} />

        {/* Network Route */}
        <Route path="/Network" element={user && !user.admin ? <NetworkPage /> : <Navigate to="/" />} />

        {/* Jobs Route */}
        <Route path="/Jobs" element={
          user && !user.admin ? 
          <JobsContextProvider>
            <JobsPage /> 
          </JobsContextProvider>
          : 
          <Navigate to="/" />
        } />

        {/* Conversations Route */}
        <Route path="/Conversations" element={
          user && !user.admin ?
          <ConversationContextProvider>
            <ConversationsPage />
          </ConversationContextProvider>  : <Navigate to="/" />
        } />

        {/* Notifications Route */}
        <Route path="/Notifications" element={user && !user.admin ? <NotificationsPage /> : <Navigate to="/" />} />

        {/* Personal Details Route */}
        <Route path="/Personal Details" element={user && !user.admin ? <PersonalDetailsPage /> : <Navigate to="/" />} />

        {/* Settings Route */}
        <Route path="/Settings" element={user && !user.admin ? <SettingsPage /> : <Navigate to="/" />} />
          
        {/* Profile Route */}
        <Route path="/Profile/:id" element={user ? 
          <PostsContextProvider>
            <ConversationContextProvider>
              <ProfilePage />
            </ConversationContextProvider>
          </PostsContextProvider> : <Navigate to="/" />} />

        {/* Post Page Route */}
          
        <Route path="/Post/:post_id" element={user && !user.admin ?
          <PostsContextProvider>
            <PostPage /> 
          </PostsContextProvider> : <Navigate to="/" />} />

        {/* Default redirect to welcome page*/}
        <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;