
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Plus, Loader2 } from 'lucide-react';

interface GeneratingRecommendationsStateProps {
  isGenerating: boolean;
  onRegenerateRecommendations: () => void;
}

const GeneratingRecommendationsState: React.FC<GeneratingRecommendationsStateProps> = ({ 
  isGenerating, 
  onRegenerateRecommendations 
}) => {
  return (
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
        <Brain className="h-6 w-6 text-purple-500" />
      </div>
      <p className="text-sm text-gray-600 mb-3">
        Генерируем персональные рекомендации на основе ваших целей...
      </p>
      <Button 
        size="sm"
        variant="outline"
        onClick={onRegenerateRecommendations}
        disabled={isGenerating}
        className="text-xs"
      >
        {isGenerating ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Plus className="h-3 w-3 mr-1" />
        )}
        {isGenerating ? 'Генерируем...' : 'Обновить рекомендации'}
      </Button>
    </div>
  );
};

export default GeneratingRecommendationsState;
