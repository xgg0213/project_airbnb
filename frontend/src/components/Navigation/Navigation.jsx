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
      <div className="nav-right">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        {showMenu && (
          <div className="menu-dropdown">
            <NavLink exact to="/" className="nav-link" onClick={toggleMenu}>
              Home
            </NavLink>
            {sessionUser && (
              <NavLink
                to="/spots/new"
                className="nav-new-spot"
                onClick={toggleMenu}
              >
                Create a New Spot
              </NavLink>
            )}
          </div>
        )}
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
      

  </nav>
  );
}

export default Navigation;