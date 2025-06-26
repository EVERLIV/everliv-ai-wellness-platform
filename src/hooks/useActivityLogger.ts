
import { useState } from 'react';
import { ActivityLog } from '@/types/healthRecommendations';
import { useAuth } from '@/contexts/AuthContext';

export const useActivityLogger = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const logActivity = async (
    actionType: ActivityLog['action_type'],
    actionDescription: string,
    relatedId?: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    const logEntry: ActivityLog = {
      id: crypto.randomUUID(),
      user_id: user.id,
      action_type: actionType,
      action_description: actionDescription,
      related_id: relatedId,
      metadata,
      timestamp: new Date().toISOString(),
    };

    console.log('🔍 АКТИВНОСТЬ:', {
      пользователь: user.id,
      действие: actionType,
      описание: actionDescription,
      время: logEntry.timestamp,
      связанный_объект: relatedId,
      метаданные: metadata
    });

    setLogs(prev => [logEntry, ...prev]);
    
    // В реальном приложении здесь был бы запрос к API для сохранения лога
    try {
      // Сохранение в localStorage для демонстрации
      const existingLogs = JSON.parse(localStorage.getItem(`activity_logs_${user.id}`) || '[]');
      existingLogs.unshift(logEntry);
      localStorage.setItem(`activity_logs_${user.id}`, JSON.stringify(existingLogs.slice(0, 100))); // Храним последние 100 записей
    } catch (error) {
      console.error('Ошибка сохранения лога активности:', error);
    }
  };

  const getActivityLogs = () => {
    if (!user) return [];
    
    try {
      const existingLogs = JSON.parse(localStorage.getItem(`activity_logs_${user.id}`) || '[]');
      return existingLogs as ActivityLog[];
    } catch (error) {
      console.error('Ошибка загрузки логов активности:', error);
      return [];
    }
  };

  return {
    logActivity,
    getActivityLogs,
    logs
  };
};
