# VoiceNote 🎙️

A voice recording application with AI-powered text processing and location tracking.

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