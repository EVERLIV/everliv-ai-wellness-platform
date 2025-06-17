
import React from 'react';
import { useRealtimeAnalyses } from '@/hooks/useRealtimeAnalyses';
import { useSmartAuth } from '@/hooks/useSmartAuth';

const RealtimeNotifications: React.FC = () => {
  const { user } = useSmartAuth();
  
  // This hook handles showing toast notifications for new analyses
  useRealtimeAnalyses();

  // This component doesn't render anything visible, it just manages realtime notifications
  if (!user) return null;
  
  return null;
};

export default RealtimeNotifications;
