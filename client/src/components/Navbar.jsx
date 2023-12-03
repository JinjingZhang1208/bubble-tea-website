import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../img/boba.png';
import CartLogo from "../img/shoppingCart.png";
import "./Navbar.css";
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout({ returnTo: window.location.origin });
    } else {
      loginWithRedirect();
    }
  };

  return (
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <h1>Bubble Tea Company</h1>
        <div className="links">
          {isAuthenticated ? (
            <>
              <Link className="link" to="/profile">
                <h6>{user.name}</h6>
              </Link>
              <button onClick={handleAuthAction}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={handleAuthAction}>
                <h6>Login</h6>
              </button>

              <button onClick={() => loginWithRedirect({ screen_hint: "signup" })}>
                <h6>Register</h6>
              </button>
            </>
          )}
          <Link className="link" to="/cart">
            <img src={CartLogo} alt="cartLogo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

