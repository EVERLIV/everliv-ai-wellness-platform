
import OpenAI from "openai";

/**
 * Initialize OpenAI client with appropriate API key
 */
export const initializeOpenAI = () => {
  // Use built-in API key instead of requiring user input
  const HIDDEN_API_KEY = "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";
  
  // Try to use stored API key if available, otherwise use hidden key
  const userApiKey = localStorage.getItem('OPENAI_API_KEY');
  const apiKey = userApiKey || HIDDEN_API_KEY;

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Note: In production, use backend calls
  });
};
