import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GeminiAPI_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const MAX_REQUESTS_PER_DAY = 45;
let requestCount = 0;
let resetTime = Date.now() + 24 * 60 * 60 * 1000;
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

const makeAIRequest = async (message) => {
    if (!canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    const prompt = `
    Analyze this text: "${message}"
    Task:
    1. Replace slang words (English/Hindi) with "#"
    2. If no slang found, fix grammar
    Return as JSON: {
      "originalText": "input text",
      "cleanedText": "processed text",
      "slangWordsFound": ["found slang words"],
      "correctionsMade": [{"from": "original", "to": "corrected"}]
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        requestCount++;
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();

        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        return JSON.parse(text.slice(jsonStart, jsonEnd));
    } catch (error) {
        requestCount--;
        if (error instanceof SyntaxError) {
            return {
                originalText: message,
                cleanedText: message,
                slangWordsFound: [],
                correctionsMade: []
            };
        }
        throw error;
    }
};

const processQueue = async () => {
    if (isProcessingQueue || requestQueue.length === 0) return;
    isProcessingQueue = true;

    while (requestQueue.length > 0) {
        if (!canMakeRequest()) {
            await new Promise(resolve => setTimeout(resolve, 60000));
            continue;
        }

        const { message, resolve, reject } = requestQueue.shift();
        try {
            resolve(await makeAIRequest(message));
        } catch (error) {
            reject(error);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    isProcessingQueue = false;
};

export const getAIRecommendations = async (message) => {
    if (!message?.trim()) {
        return {
            originalText: message || '',
            cleanedText: message || '',
            slangWordsFound: [],
            correctionsMade: []
        };
    }

    if (!API_KEY) {
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

export const getRateLimitStatus = () => ({
    requestsRemaining: Math.max(0, MAX_REQUESTS_PER_DAY - requestCount),
    timeUntilReset: Math.max(0, resetTime - Date.now()),
    queueLength: requestQueue.length
});

export const clearRequestQueue = () => {
    requestQueue = [];
};