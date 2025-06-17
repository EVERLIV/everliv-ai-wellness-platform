
// Enhanced environment detection for Lovable development environment
export const isLovableDevelopment = (): boolean => {
  const hostname = window.location.hostname;
  const origin = window.location.origin;
  
  // Check for Lovable-specific development indicators
  const isLovablePreview = hostname.includes('.lovableproject.com') || 
                          hostname.includes('.lovable.app') ||
                          hostname.includes('localhost') ||
                          hostname === '127.0.0.1';
  
  console.log('🔧 Environment check:', { 
    hostname, 
    origin, 
    isLovablePreview,
    userAgent: navigator.userAgent.includes('Lovable') 
  });
  
  return isLovablePreview;
};

export const isProductionEnvironment = (): boolean => {
  return !isLovableDevelopment();
};

// Create a dev admin user for Lovable environment
export const createDevAdminUser = () => {
  if (!isLovableDevelopment()) {
    throw new Error('Dev admin user can only be created in Lovable development environment');
  }
  
  return {
    id: 'dev-admin-lovable-12345',
    email: 'admin@lovable.dev',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'dev', providers: ['dev'] },
    user_metadata: { 
      full_name: 'Lovable Dev Admin',
      nickname: 'Admin',
      role: 'admin'
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const createDevAdminSession = () => {
  if (!isLovableDevelopment()) {
    throw new Error('Dev admin session can only be created in Lovable development environment');
  }

  const user = createDevAdminUser();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    access_token: 'dev-access-token-lovable',
    refresh_token: 'dev-refresh-token-lovable',
    expires_in: 86400,
    expires_at: Math.floor(expiresAt.getTime() / 1000),
    token_type: 'bearer',
    user
  };
};
