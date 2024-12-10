import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev)
  }

  return (
    // <ul>
    //   <li>
    //     <NavLink to="/">Home</NavLink>
    //   </li>
    //   {isLoaded && (
    //     <li>
    //       <ProfileButton user={sessionUser} />
    //     </li>
    //   )}
    // </ul>
    <nav className="navigation-bar">
      <div className='nav-left'>
        <NavLink to='/'>
          <img src='/airbnb-logo.png' alt='Site Logo' className='site-logo' />
        </NavLink>
      </div>
      <div className="nav-right">
        {sessionUser && (
            <NavLink
              to="/spots/new"
              className="nav-new-spot"
              onClick={toggleMenu}
            >
              Create a New Spot
            </NavLink>
        )}
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰ {isLoaded && <ProfileButton user={sessionUser} />}
        </button>
        {/* {showMenu && (
          <div className="menu-dropdown">
            <NavLink to="/" className="nav-link" onClick={toggleMenu}>
              Home
            </NavLink>
            
          </div>
        )} */}
        {/* {isLoaded && <ProfileButton user={sessionUser} />} */}

      </div>
      

  </nav>
  );
}

export default Navigation;