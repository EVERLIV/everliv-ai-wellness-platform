
import OpenAI from "openai";

// Initialize OpenAI client with API key
export const initializeOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
  
  if (!apiKey) {
    console.error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
    throw new Error("OpenAI API key is not configured. Please add your API key to environment variables.");
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: This is for client-side use only
  });
};
