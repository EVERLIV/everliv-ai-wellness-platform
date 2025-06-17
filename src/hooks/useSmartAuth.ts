
import { useContext } from 'react';
import { isLovableDevelopment } from '@/utils/environmentDetection';
import { useAuth } from '@/contexts/AuthContext';
import { useDevAuth } from '@/contexts/DevAuthContext';

export const useSmartAuth = () => {
  const isLovableDev = isLovableDevelopment();
  
  if (isLovableDev) {
    return useDevAuth();
  }
  
  return useAuth();
};
