import './App.css';

import WelcomePage from "./Pages/WelcomePage/WelcomePage.js";
import HomePage from "./Pages/HomePage/HomePage.js";
import NetworkPage from "./Pages/NetworkPage/NetworkPage.js"
import JobsPage from "./Pages/JobsPage/JobsPage.js"
import ConversationsPage from "./Pages/ConversationsPage/ConversationsPage.js"
import NotificationsPage from "./Pages/NotificationsPage/NotificationsPage.js"
import PersonalDetailsPage from "./Pages/PersonalDetailsPage/PersonalDetailsPage.js"
import SettingsPage from "./Pages/SettingsPage/SettingsPage.js"

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Welcome Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Home Route */}
        <Route path="/Home" element={<HomePage />} />

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
        <Route path="/Settings" element={<SettingsPage />} />
        
        
        {/* Default redirect to welcome page*/}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

// Export both components
export default App;