// In client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Updated styles for a cleaner and modern look
  const navStyle = {
    background: '#f8f9fa', // Light background color
    color: '#343a40', // Dark text color for contrast
    padding: '0.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000
  };
  const linkStyle = {
    color: '#007bff', // Blue color for links
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    margin: '0 1rem',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background 0.3s, color 0.3s',
  };
  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#343a40', // Dark color for the logo
    textDecoration: 'none'
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={logoStyle}>PAWS</Link> {/* Website name */}
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;