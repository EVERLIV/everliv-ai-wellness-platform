
import React from 'react';
import { isDevelopmentMode } from '@/utils/devMode';

const DevModeIndicator = () => {
  // Development mode is disabled, don't render anything
  if (!isDevelopmentMode()) {
    return null;
  }

  // This will never render since isDevelopmentMode() always returns false
  return null;
};

export default DevModeIndicator;
