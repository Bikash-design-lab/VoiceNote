import React, { useEffect, useState, useRef, useMemo } from 'react';
import '../Styles/Home.css';
import { getAIRecommendations, getRateLimitStatus } from '../Hooks/AI_Recommendation';

const MessageNote = ({ transcript, locationName, isRecording }) => {
  const [message, setMessage] = useState({});
  const [savedNotes, setSavedNotes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimitStatus, setRateLimitStatus] = useState(null);
  const [previousTranscript, setPreviousTranscript] = useState('');
  const [editingMessage, setEditingMessage] = useState('');

  const savedNotesRef = useRef(null);
  const processingTimeoutRef = useRef(null);

  // Memoize rate limit status
  const memoizedRateLimitStatus = useMemo(() => {
    if (!rateLimitStatus) return null;
    return {
      requestsRemaining: rateLimitStatus.requestsRemaining,
      queueLength: rateLimitStatus.queueLength,
      timeUntilReset: rateLimitStatus.timeUntilReset
    };
  }, [rateLimitStatus]);

  // Handle transcript updates and saving
  useEffect(() => {
    if (transcript && !isRecording && transcript !== previousTranscript) {
      // Clear any existing timeout
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }

      // Set new timeout for processing
      processingTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
        setError(null);

        getAIRecommendations(transcript)
          .then((res) => {
            setMessage(res);
            setIsLoading(false);

            if (res && !res.error) {
              const newNote = {
                id: Date.now(),
                message: res.cleanedText || transcript,
                locationName: locationName || 'Unknown',
                timestamp: new Date().toISOString(),
              };

              // Save to localStorage and update state
              const oldNotes = JSON.parse(localStorage.getItem('myNote') || '[]');
              const updatedNotes = [...oldNotes, newNote];
              localStorage.setItem('myNote', JSON.stringify(updatedNotes));
              setSavedNotes(updatedNotes);

              // Update previous transcript to prevent duplicate saves
              setPreviousTranscript(transcript);
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

            // Even on error, save the original transcript
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
            setPreviousTranscript(transcript);
          });
      }, 1000); // Wait 1 second after recording stops
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [transcript, isRecording, locationName]);

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

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatLocation = (location) => {
    if (!location || location === 'Unknown') return '📍 Location not available';
    return `📍 ${location}`;
  };

  const handleEditClick = (id) => {
    const noteToEdit = savedNotes.find(note => note.id === id);
    setEditingMessage(noteToEdit.message);
    const updatedNotes = savedNotes.map(note => 
      note.id === id ? { ...note, isEditing: true } : note
    );
    setSavedNotes(updatedNotes);
  };

  const handleSaveClick = (id) => {
    const updatedNotes = savedNotes.map(note => 
      note.id === id ? { ...note, message: editingMessage, isEditing: false } : note
    );
    setSavedNotes(updatedNotes);
    localStorage.setItem('myNote', JSON.stringify(updatedNotes));
    setEditingMessage('');
  };

  const handleMessageChange = (e) => {
    setEditingMessage(e.target.value);
  };

  const handleDeleteClick = (id) => {
    const updatedNotes = savedNotes.filter(note => note.id !== id);
    setSavedNotes(updatedNotes);
    localStorage.setItem('myNote', JSON.stringify(updatedNotes));
  };

  return (
    <>
      <div 
        className="saved-notes" 
        ref={savedNotesRef}
        style={{ padding: '20px' }}
      >
        {savedNotes.length > 0 && savedNotes.some(note => note.message || note.locationName) ? (
          <>
            <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>📝 Saved Notes</h3>
            <div className="notes-container" style={{ display: 'grid', gap: '20px' }}>
              {savedNotes
                .filter(note => note.message || note.locationName)
                .map(note => (
                  <div 
                    key={note.id} 
                    className={`note-card ${note.isProcessed === false ? 'unprocessed-note' : ''}`}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <div className="note-header">
                      <p>{formatDate(note.timestamp)} | {formatLocation(note.locationName)} | AI Status: {note.isProcessed ? 'Processed' : 'Pending'}</p>
                      <div className="note-actions">
                        <button onClick={() => handleDeleteClick(note.id)} 
                          style={{ backgroundColor: '#f44336', color: 'white', marginRight: '8px' }}>
                          Delete
                        </button>
                        {note.isEditing ? (
                          <button onClick={() => handleSaveClick(note.id)} 
                            style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                            Save
                          </button>
                        ) : (
                          <button onClick={() => handleEditClick(note.id)}
                            style={{ backgroundColor: '#2196F3', color: 'white' }}>
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="note-content">
                      {note.isEditing ? (
                        <textarea
                          value={editingMessage}
                          onChange={handleMessageChange}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            resize: 'vertical',
                            marginTop: '8px'
                          }}
                        />
                      ) : (
                        <p style={{ marginTop: '8px' }}>{note.message}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px 0' }}>
            <p>📝 No saved notes yet. Start recording to create your first note!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageNote;
