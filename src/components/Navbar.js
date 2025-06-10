import React from "react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = ({ toggleTheme, toggleChat, isDarkMode, isChatOpen }) => {
  return (
    <nav className="navbar">
      <div className="logo-title-container">
        <img src="/osulogo.png" alt="OSU Logo" className="navbar-logo" />
        <h1>OSU MindHub</h1>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/assessment">Self-Assessment</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/exercises">Exercises</Link>
        <Link to="/results">View Assessment Results</Link>
      </div>
      <div className="header-controls">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button className="chat-button" onClick={toggleChat}>
          {isChatOpen ? "Close Chat" : "Talk Now"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
