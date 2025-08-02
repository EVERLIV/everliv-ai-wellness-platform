
export const isDevelopmentMode = (): boolean => {
  // Проверяем несколько условий для определения dev режима
  const isViteDev = import.meta.env.DEV;
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('lovable.app');
  const hasDevParam = new URLSearchParams(window.location.search).has('dev');
  
  // Dev режим активен если это Vite dev сервер ИЛИ localhost ИЛИ есть dev параметр
  const result = isViteDev || isLocalhost || hasDevParam;
  
  console.log('🔧 Development mode check:', {
    isViteDev,
    isLocalhost,
    hasDevParam,
    hostname: window.location.hostname,
    result
  });
  
  return result;
};

// Remove the ability to create fake users - security risk
export const createDevUser = () => {
  throw new Error('Development user creation disabled for security');
};

// Remove the ability to create fake sessions - security risk
export const createDevSession = () => {
  throw new Error('Development session creation disabled for security');
};
