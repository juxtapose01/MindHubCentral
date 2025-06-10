import React from "react";

const Home = ({ toggleChat }) => {
  return (
    <>
      <section className="hero" id="home">
        <div className="hero-content">
          <h2>Mental Health Support for Stillwater</h2>
          <p>Free, anonymous, and tailored to our community.</p>
          <div
            className="chat-bubble-cta"
            onClick={toggleChat}
            role="button"
            tabIndex={0}
            aria-label="Start talking with the chatbot"
            onKeyPress={(e) => e.key === "Enter" && toggleChat()}
          >
            <span className="chat-icon">💬</span>
            <span className="chat-text">Start Talking</span>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="feature-card">
          <span className="feature-icon">🤝</span>
          <h3>Local Resources</h3>
          <p>Connect to Stillwater counselors, hotlines, and support groups.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🧠</span>
          <h3>Self-Assessment</h3>
          <p>Quick screenings for stress, anxiety, or depression.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔒</span>
          <h3>100% Anonymous</h3>
          <p>No accounts needed—just support when you need it.</p>
        </div>
      </section>
    </>
  );
};

export default Home;
