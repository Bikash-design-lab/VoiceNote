import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { fetchLocationName } from '../Hooks/OpenCage';
import '../Styles/Home.css'

import MessageNote from '../Pages/MessageNote'

const Home = () => {
  // store longitude and latitude
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [statusGeoLocation, setStatusGeoLocation] = useState('');

  // store location name
  const [locationName, setLocationName] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  //  store network status and speed
  const [networkType, setNetworkType] = useState('');
  const [speedKBps, setSpeedKBps] = useState(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();

  // Check browser support
  if (!browserSupportsSpeechRecognition) {
    return <p>❌ Your browser doesn't support speech recognition.</p>;
  }

  // Get user's co-ordinates useing geolocation
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

  // Fetch human-readable location from coordinates useing OpenCage API
  useEffect(() => {
    if (longitude && latitude) {
      setLocationLoading(true);
      fetchLocationName(latitude, longitude)
        .then((name) => setLocationName(name))
        .finally(() => setLocationLoading(false));
    }
  }, [longitude, latitude]);

  // Track network type and speed
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection;

      const updateNetworkInfo = () => {
        setNetworkType(connection.effectiveType);
        // conver it into kb
        const kbps = connection.downlink * 1000 / 8;
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

  // Start listening to voice
  // const startListening = async() => {
  //   geoLocation()
  //   await navigator.mediaDevices.getUserMedia({ audio: true });
  //   SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  // };
  const startListening = async () => {
    geoLocation();
    try {
      // 🔐 Trigger browser mic permission prompt explicitly
      await navigator.mediaDevices.getUserMedia({ audio: true });
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    } catch (error) {
      console.error('Mic permission denied:', error);
      alert('🎤 Please allow microphone access to use speech recognition.');
    }
  };

  return (
    <div className="home-container">
  <h1 className="home-heading">Welcome User</h1>

  <div className="home-main">
    
    {/* <div className="card-column"> */}
      <div className="card">
        <h4>📌 Get User Location</h4>
        {/* <button onClick={geoLocation} className="location-button">Get Location</button> */}
        <p style={{ fontSize: '15px' }}>
          {locationLoading
            ? '🔄 Fetching address...'
            : locationName
              ? `📍 ${locationName}`
              : '📍 No location available'}
        </p>
        <p className="status-text">{statusGeoLocation}</p>
      </div>

      <div className="card">
        <h4>🌐 Network Info</h4>
        <p><strong>Type:</strong> {networkType}</p>
        <p><strong>Speed:</strong> {speedKBps ? `${speedKBps} KB/s` : 'Unknown'}</p>
      </div>
    {/* </div> */}
    <div className="voice-note-container">
        <p>🎤 Voice Listening: {listening ? '🎙️ Yes' : '⛔ No'}</p>
        <div className="voice-note-buttons">
          <button onClick={startListening}>Start Recording</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Recording</button>
          <button onClick={resetTranscript}>Reset</button>
        </div>
    </div>
      
  </div>
  <MessageNote transcript ={transcript} locationName={locationName} />
   {/* <div className='text-area-note'>
     <textarea value={transcript} />
    </div> */}
</div>
  );
};

export default Home;

