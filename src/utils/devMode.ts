
// Утилита для определения development окружения
export const isDevelopmentMode = (): boolean => {
  const hostname = window.location.hostname;
  
  // SECURITY: Only allow dev mode on actual localhost - never on production domains
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  
  console.log('🔧 Dev mode check:', { hostname, isDev });
  return isDev;
};

// Определяем staging окружение отдельно
export const isStagingMode = (): boolean => {
  const hostname = window.location.hostname;
  return hostname.includes('preview--') ||
         hostname.includes('.lovable.app') ||
         hostname === 'int.everliv.online';
};

// Создаем фиктивного пользователя только для настоящего dev режима
export const createDevUser = () => {
  if (!isDevelopmentMode()) {
    throw new Error('Dev user creation only allowed in development mode');
  }
  
  return {
    id: 'dev-user-123',
    email: 'dev@test.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    aud: 'authenticated',
    role: 'authenticated',
    user_metadata: {
      nickname: 'Dev User'
    },
    app_metadata: {}
  };
};

// Создаем фиктивную сессию только для настоящего dev режима
export const createDevSession = () => {
  if (!isDevelopmentMode()) {
    throw new Error('Dev session creation only allowed in development mode');
  }
  
  const user = createDevUser();
  return {
    access_token: 'dev-access-token',
    refresh_token: 'dev-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: user
  };
};
