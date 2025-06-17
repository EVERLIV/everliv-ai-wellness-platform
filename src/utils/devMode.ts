
import { isLovableDevelopment } from './environmentDetection';

// Use the enhanced environment detection
export const isDevelopmentMode = (): boolean => {
  return isLovableDevelopment();
};

// Remove the ability to create fake users - security risk
export const createDevUser = () => {
  throw new Error('Use environmentDetection.ts for dev user creation');
};

// Remove the ability to create fake sessions - security risk  
export const createDevSession = () => {
  throw new Error('Use environmentDetection.ts for dev session creation');
};
