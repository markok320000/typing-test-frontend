
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchTypingTestPrompt = async (): Promise<string> => {
  try {
    const prompt = `Generate a random, interesting paragraph for a typing speed test. 
    The paragraph should be between 40 and 60 words, suitable for all audiences. 
    It should contain common English words, correct punctuation like commas and periods, and be a single block of text with no line breaks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 100 },
      }
    });

    const text = response.text.trim().replace(/\n/g, ' '); // Ensure it's a single line
    
    if (!text) {
        throw new Error("Received an empty prompt from the API.");
    }

    return text;

  } catch (error) {
    console.error("Error fetching typing prompt:", error);
    return "The quick brown fox jumps over the lazy dog. This is a default fallback text. If you see this, there might be an issue with the API key or service.";
  }
};
