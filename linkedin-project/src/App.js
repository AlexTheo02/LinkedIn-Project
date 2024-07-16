import './App.css';

import WelcomePage from "./Pages/WelcomePage/WelcomePage.js";
import HomePage from "./Pages/HomePage/HomePage.js";

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
        <Route path="/" element={<HomePage />} />

        {/* Home Route */}
        <Route path="/HomePage" element={<HomePage />} />
        
        
        {/* Default redirect to welcome page*/}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

// Export both components
export default App;