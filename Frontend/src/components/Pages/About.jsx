import React from 'react';
import BikashImage from '../Image/Bikash_.jpg';

const About = () => {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
    boxSizing: 'border-box',
  };

  const cardStyle = {
    maxWidth: '800px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px 20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    boxSizing: 'border-box',
  };

  const imageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '24px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '20px',
  };

  const textStyle = {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={BikashImage} alt="Profile" style={imageStyle} />
        <h1 style={headingStyle}>About Us</h1>
        <p style={textStyle}>
          At VoiceNote, we try to capture the moment that was special to record while traveling.
          Click the "Start Recording" button. The app will ask for permission to access your
          microphone and location. Once you allow both, it will start listening to your voice and
          convert it into text. Gemini AI will automatically clean the text by removing slang and
          correcting any grammar mistakes. The final message, along with your location, time and date is saved in
          localStorage.
        </p>
      </div>
    </div>
  );
};

export default About;
