export const isDevelopmentMode = (): boolean => {
  try {
    // Определяем dev режим только по домену, так как import.meta.env может быть ненадежным
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    
    // Dev режим ТОЛЬКО для localhost (НЕ для опубликованных Lovable проектов)
    const isDevDomain = hostname === 'localhost' || 
                       hostname === '127.0.0.1';
    
    const hasDevParam = typeof window !== 'undefined' && 
                       new URLSearchParams(window.location.search).has('dev');
    
    // Для production доменов НИКОГДА не должен быть dev режим
    const isProductionDomain = hostname.includes('everliv.online') || 
                              (hostname.includes('.app') && !hostname.includes('lovableproject.com'));
    
    // Результат: dev режим только для dev доменов или с явным параметром
    const result = !isProductionDomain && (isDevDomain || hasDevParam);
    
    console.log('🔧 Development mode check:', {
      hostname,
      isDevDomain,
      isProductionDomain,
      hasDevParam,
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