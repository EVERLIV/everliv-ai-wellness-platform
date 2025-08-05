export const isDevelopmentMode = (): boolean => {
  try {
    // В продакшене НИКОГДА не должен быть dev режим
    if (import.meta.env.PROD) {
      return false;
    }
    
    // Проверяем несколько условий для определения dev режима
    const isViteDev = import.meta.env.DEV;
    const isLocalhost = typeof window !== 'undefined' && 
                       (window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname.includes('lovableproject.com'));
    const hasDevParam = typeof window !== 'undefined' && 
                       new URLSearchParams(window.location.search).has('dev');
    
    // Dev режим активен ТОЛЬКО для localhost, lovableproject.com или явного dev параметра
    // И ТОЛЬКО если НЕ production
    const result = !import.meta.env.PROD && (isViteDev || isLocalhost || hasDevParam);
    
    console.log('🔧 Development mode check:', {
      isProd: import.meta.env.PROD,
      isViteDev,
      isLocalhost,
      hasDevParam,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
      result
    });
    
    return result;
  } catch (error) {
    console.warn('Error checking dev mode:', error);
    // В случае ошибки, возвращаем false для безопасности
    return false;
  }
};

// Remove the ability to create fake users - security risk
export const createDevUser = () => {
  throw new Error('Development user creation disabled for security');
};

// Remove the ability to create fake sessions - security risk
export const createDevSession = () => {
  throw new Error('Development session creation disabled for security');
};