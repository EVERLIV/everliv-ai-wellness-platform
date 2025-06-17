
// Secure development mode utilities with strict controls
export const isDevelopmentMode = (): boolean => {
  const hostname = window.location.hostname;
  
  // Only allow true localhost for development mode
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  
  console.log('🔧 Dev mode check:', { hostname, isDev });
  return isDev;
};

// Remove the ability to create fake users - security risk
export const createDevUser = () => {
  throw new Error('Development user creation disabled for security');
};

// Remove the ability to create fake sessions - security risk
export const createDevSession = () => {
  throw new Error('Development session creation disabled for security');
};
