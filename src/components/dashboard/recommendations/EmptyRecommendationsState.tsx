
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Plus } from 'lucide-react';

interface EmptyRecommendationsStateProps {
  onNavigateToProfile: () => void;
}

const EmptyRecommendationsState: React.FC<EmptyRecommendationsStateProps> = ({ onNavigateToProfile }) => {
  return (
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <Target className="h-6 w-6 text-purple-500" />
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Установите цели здоровья для получения персональных рекомендаций
      </p>
      <Button 
        size="sm"
        onClick={onNavigateToProfile}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs px-4 py-2"
      >
        <Plus className="h-3 w-3 mr-1" />
        Добавить цели
      </Button>
    </div>
  );
};

export default EmptyRecommendationsState;
