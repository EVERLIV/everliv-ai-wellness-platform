
import React, { createContext, useContext, ReactNode } from 'react';
import { useSecureHealthProfile } from '@/hooks/useSecureHealthProfile';
import { useSecureMedicalAnalyses } from '@/hooks/useSecureMedicalAnalyses';
import { useSecureSubscription } from '@/hooks/useSecureSubscription';
import { useSecureProtocols } from '@/hooks/useSecureProtocols';
import { useSecureAIDoctor } from '@/hooks/useSecureAIDoctor';
import { useSecureFoodEntries } from '@/hooks/useSecureFoodEntries';

interface SecureDataContextType {
  healthProfile: ReturnType<typeof useSecureHealthProfile>;
  medicalAnalyses: ReturnType<typeof useSecureMedicalAnalyses>;
  subscription: ReturnType<typeof useSecureSubscription>;
  protocols: ReturnType<typeof useSecureProtocols>;
  aiDoctor: ReturnType<typeof useSecureAIDoctor>;
  foodEntries: ReturnType<typeof useSecureFoodEntries>;
}

const SecureDataContext = createContext<SecureDataContextType | null>(null);

interface SecureDataProviderProps {
  children: ReactNode;
}

export const SecureDataProvider = ({ children }: SecureDataProviderProps) => {
  const healthProfile = useSecureHealthProfile();
  const medicalAnalyses = useSecureMedicalAnalyses();
  const subscription = useSecureSubscription();
  const protocols = useSecureProtocols();
  const aiDoctor = useSecureAIDoctor();
  const foodEntries = useSecureFoodEntries();

  const value = {
    healthProfile,
    medicalAnalyses,
    subscription,
    protocols,
    aiDoctor,
    foodEntries
  };

  return (
    <SecureDataContext.Provider value={value}>
      {children}
    </SecureDataContext.Provider>
  );
};

export const useSecureData = () => {
  const context = useContext(SecureDataContext);
  if (!context) {
    throw new Error('useSecureData must be used within a SecureDataProvider');
  }
  return context;
};
