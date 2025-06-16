
// Утилита для определения development окружения
export const isDevelopmentMode = (): boolean => {
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || 
                hostname === '127.0.0.1' ||
                hostname.includes('preview--') ||
                hostname.includes('.lovable.app') ||
                hostname === 'int.everliv.online'; // Добавляем новый домен
  
  console.log('🔧 Dev mode check:', { hostname, isDev });
  return isDev;
};

// Создаем фиктивного пользователя для разработки
export const createDevUser = () => {
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

// Создаем фиктивную сессию для разработки
export const createDevSession = () => {
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

// Проверяем, нужно ли использовать dev данные для конкретного хука/компонента
export const shouldUseDevData = (user: any): boolean => {
  return isDevelopmentMode() && !user;
};
