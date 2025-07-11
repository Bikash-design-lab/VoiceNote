import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { fetchLocationName } from '../Hooks/OpenCage';
import '../Styles/Home.css';
import MessageNote from './MessageNote';

const Home = () => {
  // Location
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [statusGeoLocation, setStatusGeoLocation] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  // Network
  const [networkType, setNetworkType] = useState('');
  const [speedKBps, setSpeedKBps] = useState(null);

  // Recording
  const [isPaused, setIsPaused] = useState(false);
  const [sessionTranscript, setSessionTranscript] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ continuous: true });

  // Geolocation
  const geoLocation = () => {
    if (!navigator.geolocation) {
      setStatusGeoLocation('❌ Geolocation is not supported by your browser.');
      return;
    }

    setStatusGeoLocation('📍 Locating...');
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setStatusGeoLocation('✅ Location retrieved successfully.');
      },
      (error) => {
        setStatusGeoLocation('❌ Unable to retrieve location.');
        console.error('Geolocation error:', error);
        setLocationLoading(false);
      }
    );
  };

  // Fetch readable location
  useEffect(() => {
    if (longitude && latitude) {
      setLocationLoading(true);
      fetchLocationName(latitude, longitude)
        .then((name) => setLocationName(name))
        .finally(() => setLocationLoading(false));
    }
  }, [longitude, latitude]);

  // Network Info
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      const updateNetworkInfo = () => {
        setNetworkType(connection.effectiveType);
        const kbps = (connection.downlink * 1000) / 8;
        setSpeedKBps(kbps.toFixed(2));
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);

      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    } else {
      setNetworkType('Not supported');
      setSpeedKBps(null);
    }
  }, []);

  // Update transcript management
  useEffect(() => {
    if (isSessionActive && !isPaused && transcript) {
      // Append new transcript to current transcript
      setCurrentTranscript(prev => {
        const newTranscript = prev ? `${prev} ${transcript}` : transcript;
        console.log('Current transcript:', newTranscript); // Debug log
        return newTranscript;
      });
      resetTranscript(); // Clear the temporary transcript
    }
  }, [transcript, isSessionActive, isPaused]);

  // Start voice session
  const startListening = async () => {
    geoLocation();
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      setIsSessionActive(true);
      setIsPaused(false);
      setCurrentTranscript(''); // Clear current transcript
      setSessionTranscript(''); // Clear session transcript
    } catch (error) {
      console.error('Mic permission denied:', error);
      alert('🎤 Please allow microphone access to use speech recognition.');
    }
  };

  const pauseListening = () => {
    SpeechRecognition.stopListening();
    setIsPaused(true);
    // Don't save to session transcript yet, keep current transcript as is
  };

  const resumeListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    setIsPaused(false);
    // Continue with existing currentTranscript
  };

  const finishSession = () => {
    SpeechRecognition.stopListening();
    // Save the complete transcript
    setSessionTranscript(currentTranscript.trim());
    setCurrentTranscript('');
    setIsSessionActive(false);
    setIsPaused(false);
  };

  const handleReset = () => {
    resetTranscript();
    setSessionTranscript('');
    setCurrentTranscript('');
    setIsSessionActive(false);
    setIsPaused(false);
  };

  const updateMessage = (newMessage) => {
    localStorage.setItem('homeMessage', newMessage);
    setSessionTranscript(newMessage);
  };

  const deleteMessage = () => {
    localStorage.removeItem('homeMessage');
    setSessionTranscript('');
  };

  // Check browser support early
  if (!browserSupportsSpeechRecognition) {
    return <p>❌ Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div className="home-container">
      <h1 className="home-heading">Welcome User</h1>

      <div className="home-main">
        {/* Location */}
        <div className="card">
          <h4>📌 Get User Location</h4>
          <p style={{ fontSize: '15px' }}>
            {locationLoading
              ? '🔄 Fetching address...'
              : locationName
              ? `📍 ${locationName}`
              : '📍 No location available'}
          </p>
          <p className="status-text">{statusGeoLocation}</p>
        </div>

        {/* Network */}
        <div className="card">
          <h4>🌐 Network Info</h4>
          <p><strong>Type:</strong> {networkType}</p>
          <p><strong>Speed:</strong> {speedKBps ? `${speedKBps} KB/s` : 'Unknown'}</p>
        </div>

        {/* Voice Note Section */}
        <div className="voice-note-container">
          <p>🎤 Voice Listening: {listening ? '🎙️ Yes' : '⛔ No'}</p>

          {/* Buttons */}
          <div className="voice-note-buttons">
            {!isSessionActive ? (
              <button 
                onClick={startListening}
                style={{ backgroundColor: '#4CAF50' }}
              >
                Start Recording
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button 
                    onClick={resumeListening}
                    style={{ backgroundColor: '#2196F3' }}
                  >
                    Resume
                  </button>
                ) : (
                  <button 
                    onClick={pauseListening}
                    style={{ backgroundColor: '#FFC107' }}
                  >
                    Pause
                  </button>
                )}
                <button 
                  onClick={finishSession}
                  style={{ backgroundColor: '#4CAF50' }}
                >
                  Done
                </button>
              </>
            )}
            <button 
              onClick={handleReset}
              style={{ backgroundColor: '#f44336' }}
            >
              Reset
            </button>
          </div>

          {isSessionActive && (
            <p style={{ fontSize: '14px', color: '#666' }}>
              {isPaused ? '⏸️ Recording paused' : '⏺️ Recording in progress...'}
            </p>
          )}
        </div>
      </div>

      {/* Final Transcript */}
      <MessageNote 
        transcript={sessionTranscript} 
        locationName={locationName}
        isRecording={isSessionActive && !isPaused}
      />
    </div>
  );
};

export default Home;
