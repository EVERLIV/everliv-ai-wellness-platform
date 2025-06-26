
// Production mode utilities - dev mode completely disabled
export const isDevelopmentMode = (): boolean => {
  // Always return false to disable development mode completely
  return false;
};

// Remove the ability to create fake users - security risk
export const createDevUser = () => {
  throw new Error('Development user creation disabled for security');
};

// Remove the ability to create fake sessions - security risk
export const createDevSession = () => {
  throw new Error('Development session creation disabled for security');
};
