
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Wifi, WifiOff } from 'lucide-react';

interface EmptyStateProps {
  isGenerating?: boolean;
  isOnline?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isGenerating, isOnline }) => {
  if (isGenerating) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isOnline 
              ? 'Генерируем персональные рекомендации от ИИ-доктора...' 
              : 'Подготавливаем локальные рекомендации...'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Рекомендации загружаются...</p>
      </CardContent>
    </Card>
  );
};

interface StatusFooterProps {
  isOnline: boolean;
}

export const StatusFooter: React.FC<StatusFooterProps> = ({ isOnline }) => {
  return (
    <div className="text-center text-sm text-gray-500 mt-6 space-y-1">
      <p>Последнее обновление: {new Date().toLocaleString('ru-RU')}</p>
      <p className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3 text-green-500" />
            <span>Подключение к ИИ-сервису активно</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3 text-red-500" />
            <span>Автономный режим • Экспертные рекомендации</span>
          </>
        )}
      </p>
    </div>
  );
};
