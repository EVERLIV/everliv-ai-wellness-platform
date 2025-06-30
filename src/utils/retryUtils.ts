
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => isRetryableError(error)
  } = options;

  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error);
      
      // Если это последняя попытка или ошибка не подлежит повтору
      if (attempt === maxAttempts || !retryCondition(error)) {
        throw error;
      }
      
      // Вычисляем задержку с экспоненциальным backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt - 1),
        maxDelay
      );
      
      console.log(`Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

export const isRetryableError = (error: any): boolean => {
  if (!error) return false;
  
  // Сетевые ошибки
  if (error.code === 'ERR_CONNECTION_RESET' || 
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_INTERNET_DISCONNECTED') {
    return true;
  }
  
  // HTTP статусы, которые можно повторить
  if (error.status) {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.status);
  }
  
  // Ошибки Supabase
  if (error.message) {
    const retryableMessages = [
      'connection reset',
      'network error',
      'timeout',
      'failed to fetch',
      'load failed'
    ];
    return retryableMessages.some(msg => 
      error.message.toLowerCase().includes(msg)
    );
  }
  
  return false;
};

export const withConnectionCheck = async <T>(
  operation: () => Promise<T>
): Promise<T> => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету');
  }
  
  return withRetry(operation, {
    maxAttempts: 3,
    baseDelay: 1000,
    retryCondition: isRetryableError
  });
};
