// Retry utilities for better error handling

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryCondition?: (error: any) => boolean;
}

export const isRetryableError = (error: any): boolean => {
  // Don't retry auth errors
  if (error?.message?.includes('JWT') || 
      error?.message?.includes('auth') ||
      error?.message?.includes('row-level security')) {
    return false;
  }
  
  // Retry network errors
  if (error?.name === 'NetworkError' || 
      error?.message?.includes('fetch') ||
      error?.message?.includes('network')) {
    return true;
  }
  
  // Retry 5xx errors
  if (error?.status >= 500) {
    return true;
  }
  
  return false;
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    retryCondition = isRetryableError
  } = options;

  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if condition not met or last attempt
      if (!retryCondition(error) || attempt === maxAttempts) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const withConnectionCheck = async <T>(
  fn: () => Promise<T>
): Promise<T> => {
  return withRetry(fn, {
    maxAttempts: 2,
    baseDelay: 500,
    retryCondition: isRetryableError
  });
};