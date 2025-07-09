import { GoogleGenerativeAI } from '@google/generative-ai';

let VITE_GEMINI_API_KEY = import.meta.env.VITE_GeminiAPI_KEY;
const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY || import.meta.env.VITE_GeminiAPI_KEY);

let requestCount = 0;
let resetTime = Date.now() + 24 * 60 * 60 * 1000;
const MAX_REQUESTS_PER_DAY = 45;

// Request queue for managing rate limits
let requestQueue = [];
let isProcessingQueue = false;

const canMakeRequest = () => {
    const now = Date.now();

    if (now > resetTime) {
        requestCount = 0;
        resetTime = now + 24 * 60 * 60 * 1000;
    }

    return requestCount < MAX_REQUESTS_PER_DAY;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processQueue = async () => {
    if (isProcessingQueue || requestQueue.length === 0) return;

    isProcessingQueue = true;

    while (requestQueue.length > 0) {
        if (!canMakeRequest()) {
            await wait(60000);
            continue;
        }

        const { message, resolve, reject } = requestQueue.shift();

        try {
            const result = await makeAIRequest(message);
            resolve(result);
        } catch (error) {
            reject(error);
        }

        await wait(1000);
    }

    isProcessingQueue = false;
};

const makeAIRequest = async (message) => {
    if (!canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    const prompt = `
    You will be provided with a text: "${message}".
    
    Your task is to:
    1. Detect and replace any slang words (in English or Hindi) with the "#" symbol.
    2. If no slang words are found, check and correct any grammar mistakes in the text.
    
    Return the output in the following structured JSON format:
    
    {
      "originalText": "...",
      "cleanedText": "...",
      "slangWordsFound": [ "..." ],
      "correctionsMade": [ { "from": "...", "to": "..." } ]
    }
  `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        requestCount++;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);
            const json = JSON.parse(jsonString);
            return json;
        } catch (parseErr) {
            console.error("Failed to parse Gemini response:", parseErr, text);
            return {
                originalText: message,
                cleanedText: message,
                slangWordsFound: [],
                correctionsMade: []
            };
        }
    } catch (error) {
        requestCount--;

        if (error.message.includes('429') || error.message.includes('quota')) {
            console.error('Rate limit exceeded:', error.message);
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        throw error;
    }
};

export const getAIRecommendations = async (message) => {
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return {
            originalText: message || '',
            cleanedText: message || '',
            slangWordsFound: [],
            correctionsMade: []
        };
    }

    if (!VITE_GEMINI_API_KEY && !import.meta.env.VITE_GeminiAPI_KEY) {
        console.error('Gemini API key is not configured');
        return {
            originalText: message,
            cleanedText: message,
            slangWordsFound: [],
            correctionsMade: [],
            error: 'API key not configured'
        };
    }

    if (canMakeRequest() && requestQueue.length === 0) {
        try {
            return await makeAIRequest(message);
        } catch (error) {
            if (error.message.includes('Rate limit exceeded')) {
                return new Promise((resolve, reject) => {
                    requestQueue.push({ message, resolve, reject });
                    processQueue();
                });
            }
            throw error;
        }
    }

    return new Promise((resolve, reject) => {
        requestQueue.push({ message, resolve, reject });
        processQueue();
    });
};

export const getRateLimitStatus = () => {
    const now = Date.now();
    const timeUntilReset = resetTime - now;

    return {
        requestsRemaining: Math.max(0, MAX_REQUESTS_PER_DAY - requestCount),
        timeUntilReset: Math.max(0, timeUntilReset),
        queueLength: requestQueue.length
    };
};

export const clearRequestQueue = () => {
    requestQueue = [];
};