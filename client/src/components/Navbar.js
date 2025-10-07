// In client/src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isShelterPage = location.pathname.startsWith('/shelter');
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);
  const showClientLinks = !isShelterPage && !isAuthPage;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">PAWS</Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          {showClientLinks && (
            <>
              <Link to="/pets" className="navbar-link">Browse Pets</Link>
              <Link to="/my-messages" className="navbar-link">💬 My Messages</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;