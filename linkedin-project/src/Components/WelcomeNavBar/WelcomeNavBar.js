import React from 'react';
import './WelcomeNavBarStyle.css';

const WelcomeNavBar = ({ onModeSwitch, isRegistering }) => {
  return (
    <div className="WelcomeNavBar">
      <div className="logo">
        <button>Replace with the logo!!!</button>
      </div>
      <div className="button-field">
        <button
          type="button"
          id="registerButton"
          onClick={onModeSwitch}
          className={isRegistering ? '' : 'disabled'}
        >
          Register
        </button>
        <button
          type="button"
          id="loginButton"
          onClick={onModeSwitch}
          className={isRegistering ? 'disabled' : ''}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default WelcomeNavBar;