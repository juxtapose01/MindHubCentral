import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import ChatbotPopup from "./components/ChatbotPopup";
import Home from "./pages/Home";
import AssessmentPage from "./pages/AssessmentPage";
import ResourcesPage from "./pages/ResourcesPage";
import ExercisesPage from "./pages/ExercisesPage.js";
import Navbar from "./components/Navbar";
import AssessmentResults from "./pages/AssessmentResults";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return JSON.parse(savedMode);
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark" : "light"}`}>
        <Navbar
          toggleTheme={toggleTheme}
          toggleChat={toggleChat}
          isDarkMode={isDarkMode}
          isChatOpen={isChatOpen}
        />

        <Routes>
          <Route path="/" element={<Home toggleChat={toggleChat} />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/results" element={<AssessmentResults />} />
        </Routes>

        <footer>
          <p>
            Made for Stillwater, OK | Partnered with{" "}
            <a href="https://go.okstate.edu/undergraduate-academics/global-engagement/counseling-services.html">
              OSU Counseling
            </a>
          </p>
          <p>
            <strong>Disclaimer:</strong> This app is not a substitute for
            professional mental health care. For immediate help, call the
            National Suicide Lifeline at 988.
          </p>
        </footer>

        {isChatOpen && (
          <ChatbotPopup onClose={toggleChat} isDarkMode={isDarkMode} />
        )}
      </div>
    </Router>
  );
}

export default App;
