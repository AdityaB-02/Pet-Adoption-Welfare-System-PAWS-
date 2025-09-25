// In client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Basic inline styles for the navbar
  const navStyle = {
    background: '#333',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-around'
  };
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none'
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/pets" style={linkStyle}>Browse Pets</Link>
    </nav>
  );
};

export default Navbar;