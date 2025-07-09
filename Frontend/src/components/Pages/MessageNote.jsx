import React, { useEffect, useState, useRef } from 'react';
import '../Styles/Home.css';
import { getAIRecommendations, getRateLimitStatus } from '../Hooks/AI_Recommendation';

const MessageNote = ({ transcript, locationName }) => {
  const [message, setMessage] = useState({});
  const [savedNotes, setSavedNotes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  
  // Refs for Intersection Observer
  const textAreaRef = useRef(null);
  const savedNotesRef = useRef(null);

  // ✅ Intersection Observer setup
  useEffect(() => {
    const textAreaElement = textAreaRef.current;
    const savedNotesElement = savedNotesRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === textAreaElement) {
            setIsVisible(entry.isIntersecting);
            
            if (entry.isIntersecting) {
              console.log('Textarea is now visible');
            }
          }
          
          if (entry.target === savedNotesElement) {
            if (entry.isIntersecting) {
              console.log('Saved notes section is now visible');
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (textAreaElement) {
      observer.observe(textAreaElement);
    }
    if (savedNotesElement) {
      observer.observe(savedNotesElement);
    }

    return () => {
      if (textAreaElement) {
        observer.unobserve(textAreaElement);
      }
      if (savedNotesElement) {
        observer.unobserve(savedNotesElement);
      }
      observer.disconnect();
    };
  }, []);

  // ✅ Load existing notes on component mount
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('myNote') || '[]');
    setSavedNotes(existing);
  }, []);

  // ✅ Update rate limit status periodically
  useEffect(() => {
    const updateRateLimitStatus = () => {
      const status = getRateLimitStatus();
      setRateLimitStatus(status);
    };

    updateRateLimitStatus();
    const interval = setInterval(updateRateLimitStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ Update when transcript changes
  useEffect(() => {
    if (!transcript) return;

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      
      getAIRecommendations(transcript)
        .then((res) => {
          setMessage(res);
          setIsLoading(false);

          // Only save if we got a valid response
          if (res && !res.error) {
            const newNote = {
              id: Date.now(),
              message: res.cleanedText || transcript,
              locationName: locationName || 'Unknown',
              timestamp: new Date().toISOString(),
            };

            const oldNotes = JSON.parse(localStorage.getItem('myNote') || '[]');
            const updatedNotes = [...oldNotes, newNote];

            localStorage.setItem('myNote', JSON.stringify(updatedNotes));
            setSavedNotes(updatedNotes);
          } else if (res && res.error) {
            setError(res.error);
          }
        })
        .catch((err) => {
          console.error('Error from AI:', err);
          setIsLoading(false);
          
          if (err.message.includes('Rate limit exceeded')) {
            setError('Rate limit exceeded. Your request has been queued and will be processed shortly.');
          } else if (err.message.includes('quota')) {
            setError('Daily quota exceeded. Please try again tomorrow or upgrade your plan.');
          } else {
            setError('An error occurred while processing your request. Please try again.');
          }
          
          // Save transcript without AI processing as fallback
          const newNote = {
            id: Date.now(),
            message: transcript,
            locationName: locationName || 'Unknown',
            timestamp: new Date().toISOString(),
            isProcessed: false,
          };

          const oldNotes = JSON.parse(localStorage.getItem('myNote') || '[]');
          const updatedNotes = [...oldNotes, newNote];

          localStorage.setItem('myNote', JSON.stringify(updatedNotes));
          setSavedNotes(updatedNotes);
        });
    }, 600);

    return () => clearTimeout(timer);
  }, [transcript, locationName]);

  return (
    <>
      <div 
        className={`text-area-note ${isVisible ? 'visible' : ''}`}
        ref={textAreaRef}
      >
        <textarea
          value={(message.cleanedText || transcript) || ""}
          placeholder="Voice transcript will appear here..."
          readOnly
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="loading-indicator">
            <p>Processing with AI...</p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="error-message">
            <p style={{ color: 'red' }}>⚠️ {error}</p>
          </div>
        )}
        
        {/* Rate limit status */}
        {rateLimitStatus && (
          <div className="rate-limit-status">
            <small>
              Requests remaining: {rateLimitStatus.requestsRemaining} | 
              Queue: {rateLimitStatus.queueLength}
              {rateLimitStatus.timeUntilReset > 0 && (
                <span> | Reset in: {Math.ceil(rateLimitStatus.timeUntilReset / (1000 * 60 * 60))}h</span>
              )}
            </small>
          </div>
        )}
      </div>

      <div 
        className="saved-notes" 
        ref={savedNotesRef}
      >
        {savedNotes.length > 0 && savedNotes.some(note => note.message || note.locationName) ? (
          <>
            <h3>Saved Notes:</h3>
            {savedNotes
              .filter(note => note.message || note.locationName)
              .map(note => (
                <div key={note.id} className={note.isProcessed === false ? 'unprocessed-note' : ''}>
                  {note.message && <p><strong>Message:</strong> {note.message}</p>}
                  {note.locationName && <p><strong>Location:</strong> {note.locationName}</p>}
                  {note.timestamp && (
                    <p><small>Time: {new Date(note.timestamp).toLocaleString()}</small></p>
                  )}
                  {note.isProcessed === false && (
                    <p><small style={{ color: 'orange' }}>⚠️ Not processed by AI</small></p>
                  )}
                </div>
              ))}
          </>
        ) : (
          <p>No saved notes yet.</p>
        )}
      </div>
    </>
  );
};

export default MessageNote;
