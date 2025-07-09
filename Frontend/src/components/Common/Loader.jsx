import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [screenSize, setScreenSize] = useState('desktop');

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

  const loaderSize =
    screenSize === 'mobile' ? '40px' : screenSize === 'tablet' ? '60px' : '80px';

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    flexDirection: 'column',
  };

  const spinnerStyle = {
    width: loaderSize,
    height: loaderSize,
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  };

  const textStyle = {
    fontSize:
      screenSize === 'mobile' ? '14px' : screenSize === 'tablet' ? '16px' : '18px',
    color: '#555',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      <div style={textStyle}>Loading, please wait...</div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
