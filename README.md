# VoiceNote 🎙️

A voice recording application with AI-powered text processing and location tracking.
 
# Deployed Link  
[Click here to view the app](https://voice-note-3d8b.vercel.app/)


## 📦 Installation

### Required Packages
```bash
npm install axios react-router-dom react-speech-recognition @google/generative-ai
```

## 🔧 Setup

### Environment Variables
```env
VITE_GeminiAPI_KEY=your_gemini_api_key_here
VITE_OPENCAGE_API_KEY=your_opencage_api_key_here
```

### API Keys
- **Gemini API**: [Google AI Studio](https://aistudio.google.com/)
- **OpenCage API**: [OpenCage Data](https://opencagedata.com/api#quickstart)

# Run VoiceNote locally

## Clone the repository
```
git clone https://github.com/Bikash-design-lab/VoiceNote.git
```
## Navigate to the frontend folder
```
cd VoiceNote/Frontend
```
## Install dependencies
```
npm install
```
## Start the development server
```
npm run dev
```

## 🎯 Features

- **Voice Recording**: Speech-to-text using react-speech-recognition
- **AI Processing**: Grammar correction and slang removal with Gemini AI
- **Location Tracking**: Current location using Geolocation API
- **Precise Location**: Address conversion with OpenCage API
- **Network Monitoring**: Network speed and type using Network Information API
- **Performance**: Intersection Observer API for lazy loading
- **Storage**: LocalStorage for data persistence

## 🚀 Usage

1. Click "Start Recording" button
2. Allow location permission
3. Allow microphone permission
4. Speak - text converts in real-time
5. AI processes text (removes slang, fixes grammar)
6. Note saved with location data

## 🔍 APIs Used

- **Geolocation API**: Get user coordinates
- **OpenCage API**: Convert coordinates to addresses
- **Network Information API**: Monitor network conditions
- **Intersection Observer API**: Performance optimization

## 📊 Data Storage

```javascript
{
  id: timestamp,
  message: "processed_text",
  locationName: "address_string",
  timestamp: "ISO_date_string",
  isProcessed: boolean
}
```

## 📚 Documentation

- [MDN Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [MDN Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [OpenCage API](https://opencagedata.com/api#quickstart)
- [React Speech Recognition](https://www.npmjs.com/package/react-speech-recognition)

## Manual:
Click the "Start Recording" button. The app will ask for permission to access your microphone and location. Once you allow both, it will start listening to your voice and convert it into text.
Gemini AI will automatically clean the text by removing slang and correcting any grammar mistakes. The final message, along with your location, is saved in localStorage.

# Screenshot 
## User Interface
<img width="1900" height="869" alt="Screenshot 2025-07-11 193526" src="https://github.com/user-attachments/assets/d212b83b-b58a-46aa-a28b-8882f060715c" />
##  Allow microphone and location permissions
<img width="1892" height="901" alt="Screenshot 2025-07-11 193553" src="https://github.com/user-attachments/assets/4055f83e-054e-4acd-84e6-41977766ff7e" />
## My voice messages will be converted to text 
<img width="1895" height="860" alt="Screenshot 2025-07-11 193654" src="https://github.com/user-attachments/assets/f6cd4268-f7e2-47de-b115-5e08fff4743b" />
## Users are allowed to edit and delete messages
<img width="1897" height="856" alt="Screenshot 2025-07-11 193713" src="https://github.com/user-attachments/assets/94340aed-8336-4554-bca3-4595ad50da8a" />
## VoiceNote
<img width="1880" height="862" alt="Screenshot 2025-07-11 210958" src="https://github.com/user-attachments/assets/3c60e424-a021-415d-a32d-8223f88aa448" />

## Future Implementation
1. Optimize the application
2. UI enhancement
3. Allow users to upload images or documents with their voice message 
4. Add authentication and more features...


 
