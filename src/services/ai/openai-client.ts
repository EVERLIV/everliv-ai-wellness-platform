
import OpenAI from "openai";

// Initialize OpenAI client with API key
export const initializeOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY || "";
  
  if (!apiKey) {
    console.error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: This is for client-side use only, not recommended for production
  });
};
