// src/LoginForm.js
import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './form.css';
import _ from 'lodash';

const LoginForm = ({ setIsLoggedIn, setUsername: setAppUsername, setPassword: setAppPassword }) => {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const showPasswordButtonRef = useRef(null);
  const faceRef = useRef(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/login', {}, {
        auth: { username, password },
      });
      setIsLoggedIn(true);
      setAppUsername(username);
      setAppPassword(password);
      navigate('/ViewNotes');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    const handlePasswordFocus = () => {
      document.querySelectorAll('.hand').forEach(hand => hand.classList.add('hide'));
      document.querySelector('.tongue').classList.remove('breath');
    };

    const handlePasswordBlur = () => {
      document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.remove('hide');
        hand.classList.remove('peek');
      });
      document.querySelector('.tongue').classList.add('breath');
    };

    const handleUsernameFocus = () => {
      const length = Math.min(usernameRef.current.value.length - 16, 19);
      document.querySelectorAll('.hand').forEach(hand => {
        hand.classList.remove('hide');
        hand.classList.remove('peek');
      });
      faceRef.current.style.setProperty('--rotate-head', `${-length}deg`);
    };

    const handleUsernameBlur = () => {
      faceRef.current.style.setProperty('--rotate-head', '0deg');
    };

    const handleUsernameInput = _.throttle(event => {
      const length = Math.min(event.target.value.length - 16, 19);
      faceRef.current.style.setProperty('--rotate-head', `${-length}deg`);
    }, 100);

    const handleShowPasswordClick = () => {
      if (passwordType === 'text') {
        setPasswordType('password');
        document.querySelectorAll('.hand').forEach(hand => {
          hand.classList.remove('peek');
          hand.classList.add('hide');
        });
      } else {
        setPasswordType('text');
        document.querySelectorAll('.hand').forEach(hand => {
          hand.classList.remove('hide');
          hand.classList.add('peek');
        });
      }
    };

    const usernameInput = usernameRef.current;
    const passwordInput = passwordRef.current;
    const showPasswordButton = showPasswordButtonRef.current;

    passwordInput.addEventListener('focus', handlePasswordFocus);
    passwordInput.addEventListener('blur', handlePasswordBlur);
    usernameInput.addEventListener('focus', handleUsernameFocus);
    usernameInput.addEventListener('blur', handleUsernameBlur);
    usernameInput.addEventListener('input', handleUsernameInput);
    showPasswordButton.addEventListener('click', handleShowPasswordClick);

    return () => {
      passwordInput.removeEventListener('focus', handlePasswordFocus);
      passwordInput.removeEventListener('blur', handlePasswordBlur);
      usernameInput.removeEventListener('focus', handleUsernameFocus);
      usernameInput.removeEventListener('blur', handleUsernameBlur);
      usernameInput.removeEventListener('input', handleUsernameInput);
      showPasswordButton.removeEventListener('click', handleShowPasswordClick);
    };
  }, [passwordType]);

  return (
    <div className="center">
      <div className="ear ear--left"></div>
      <div className="ear ear--right"></div>

      <div className="face" ref={faceRef}>
        <div className="eyes">
          <div className="eye eye--left">
            <div className="glow"></div>
          </div>
          <div className="eye eye--right">
            <div className="glow"></div>
          </div>
        </div>
        <div className="nose">
          <svg width="38.161" height="22.03">
            <path d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z" fill="#243946"></path>
          </svg>
          <div className="glow"></div>
        </div>
        <div className="mouth">
          <svg className="smile" viewBox="-2 -2 84 23" width="84" height="23">
            <path d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161" fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="3"></path>
          </svg>
          <div className="mouth-hole"></div>
          <div className="tongue breath">
            <div className="tongue-top"></div>
            <div className="line"></div>
            <div className="median"></div>
          </div>
        </div>
      </div>

      <div className="hands">
        <div className="hand hand--left">
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
        </div>
        <div className="hand hand--right">
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
          <div className="finger">
            <div className="bone"></div>
            <div className="nail"></div>
          </div>
        </div>
      </div>

      <div className="login">
        <form onSubmit={handleLogin}>
          <label>
            <i className="fa fa-phone"></i>
            <input 
              className="username" 
              type="text" 
              autoComplete="on" 
              placeholder="Phone Number" 
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            <i className="fa fa-commenting"></i>
            <input 
              className="password" 
              type={passwordType} 
              autoComplete="off" 
              placeholder="Password" 
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="password-button" ref={showPasswordButtonRef}>Show Password</button>
          </label>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      <div className="social-buttons">
        <div className="social"><i className="fa fa-wechat"></i></div>
        <div className="social"><i className="fa fa-weibo"></i></div>
        <div className="social"><i className="fa fa-paw"></i></div>
      </div>

      <div className="footer">
        Don't have an account? <Link to="/signup">Signup</Link>
      </div>

      <a href="https://dribbble.com/shots/4485321-Login-Page-Homepage" className="inspiration" target="_blank" rel="noopener">
        <img src="https://cdn.dribbble.com/assets/logo-footer-hd-a05db77841b4b27c0bf23ec1378e97c988190dfe7d26e32e1faea7269f9e001b.png" alt="inspiration" />
      </a>
    </div>
  );
};

export default LoginForm;