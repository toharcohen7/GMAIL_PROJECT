import React from "react";
import './WelcomePage.css';
import logo from '../../images/logo.png';
import inboxIcon from '../../images/inboxIcon.png';

const WelcomePage = ({ onCreateUser, onSignIn }) => (
  <div className="page-container">
    <div className="top-bar">
      <img src={logo} alt="Logo" className="logo" />
      <div className="button-group">
        <button className="sign-in-btn" onClick={onSignIn}>Sign In</button>
        <button onClick={onCreateUser}>Create a User</button>
      </div>
    </div>
    <div className="welcome-row">
      <div className="welcome-text">
        <h1>
          Welcome to our{" "}
          <span>
            <span style={{ color: "#4285F4" }}>E</span>
            <span style={{ color: "#DB4437" }}>m</span>
            <span style={{ color: "#F4B400" }}>a</span>
            <span style={{ color: "#4285F4" }}>i</span>
            <span style={{ color: "#0F9D58" }}>l</span>
          </span>
          !
        </h1>
        <p>Smart, secure, and simple email for everyone.</p>
        <button onClick={onCreateUser}>Create a User</button>
      </div>

      <img src={inboxIcon} alt="Inbox UI" className="inbox-image" />
    </div>
  </div>
);

export default WelcomePage;