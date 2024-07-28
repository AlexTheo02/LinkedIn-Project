import React from 'react';
import s from './WelcomeNavBarStyle.module.css';
import HomeLogo from '../HomeLogo/HomeLogo';

const WelcomeNavBar = ({ onModeSwitch, isRegistering }) => {
  return (
    <div className={s.WelcomeNavBar}>
      <HomeLogo isWelcome={true}/>
      <div className={s.button_field}>
        <button
          type="button"
          id="registerButton"
          onClick={isRegistering ? () => {} : onModeSwitch}
          className={isRegistering ? '' : s.disabled}
        >
          Register
        </button>
        <button
          type="button"
          id="loginButton"
          onClick={isRegistering ? onModeSwitch : () => {}}
          className={isRegistering ? s.disabled : ''}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default WelcomeNavBar;