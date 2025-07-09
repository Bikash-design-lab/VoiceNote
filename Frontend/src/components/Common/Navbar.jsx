import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#1a202c',
    color: 'white',
    flexWrap: 'wrap',
  };

  const brandStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const navStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? '#63b3ed' : 'white',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    borderBottom: isActive(path) ? '2px solid #63b3ed' : 'none',
    paddingBottom: '2px',
    fontSize: '16px',
  });

  return (
    <div style={containerStyle}>
      <div style={brandStyle}>VoiceNote</div>
      <div style={navStyle}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/about" style={linkStyle('/about')}>About</Link>
      </div>
    </div>
  );
};

export default Navbar;
