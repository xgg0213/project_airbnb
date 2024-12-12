// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
// import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div onClick={toggleMenu}>
      <>☰</>
      <button id='menu-button'>
        <FaUserCircle />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div>
            <div>Hello, {user.firstName}</div>
            {/* <li>{user.firstName} {user.lastName}</li> */}
            <div>{user.email}</div>
            <div>
              <NavLink to="/spots/current" onClick={closeMenu}>
                Manage Spots
              </NavLink>
            </div>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <OpenModalMenuItem
                // buttonText="Log In"
                itemText = "Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div>
              <OpenModalMenuItem
                // buttonText="Sign Up"
                itemText = 'Sign Up'
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;