import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [screenSize, setScreenSize] = useState('desktop');

  // Detect screen size for responsive styles
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width < 1024) setScreenSize('tablet');
      else setScreenSize('desktop');
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Styles based on screen size
  const baseStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      textAlign: 'center',
      padding: '20px',
    },
    heading: {
      color: '#e53e3e',
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize:
        screenSize === 'mobile'
          ? '48px'
          : screenSize === 'tablet'
          ? '60px'
          : '72px',
    },
    subheading: {
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '10px',
      fontSize:
        screenSize === 'mobile'
          ? '18px'
          : screenSize === 'tablet'
          ? '22px'
          : '26px',
    },
    message: {
      color: '#4a5568',
      marginBottom: '20px',
      fontSize:
        screenSize === 'mobile'
          ? '14px'
          : screenSize === 'tablet'
          ? '16px'
          : '18px',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#3182ce',
      color: '#fff',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize:
        screenSize === 'mobile'
          ? '14px'
          : screenSize === 'tablet'
          ? '16px'
          : '18px',
    },
  };

  return (
    <div style={baseStyles.container}>
      <h1 style={baseStyles.heading}>404</h1>
      <h2 style={baseStyles.subheading}>Oops! Page not found</h2>
      <p style={baseStyles.message}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" style={baseStyles.button}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
