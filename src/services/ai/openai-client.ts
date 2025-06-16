
// This file is deprecated for security reasons
// OpenAI API calls should only be made through Supabase Edge Functions
// to prevent API key exposure on the client side

console.warn(
  'OpenAI client is deprecated for security reasons. ' +
  'Use SecureOpenAIService instead, which routes all requests through Edge Functions.'
);

// Stub implementation that throws an error
export const initializeOpenAI = () => {
  throw new Error(
    'Direct OpenAI client access is disabled for security. ' +
    'Use SecureOpenAIService for AI functionality.'
  );
};
