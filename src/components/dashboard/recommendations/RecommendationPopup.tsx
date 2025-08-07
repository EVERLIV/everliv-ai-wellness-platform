
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Check, 
  Lightbulb, 
  Clock, 
  AlertTriangle,
  BookOpen 
} from 'lucide-react';
import { SmartRecommendation } from './types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: SmartRecommendation[];
}

const RecommendationPopup: React.FC<RecommendationPopupProps> = ({
  isOpen,
  onClose,
  recommendations
}) => {
  const { user } = useAuth();
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const saveRecommendation = async (recommendation: SmartRecommendation) => {
    if (!user) {
      toast.error('Необходимо войти в систему');
      return;
    }

    setSavingStates(prev => ({ ...prev, [recommendation.id]: true }));

    try {
      const { error } = await supabase
        .from('health_recommendations')
        .insert({
          user_id: user.id,
          title: recommendation.title,
          description: recommendation.description,
          category: recommendation.category,
          priority: recommendation.priority,
          type: 'ai_generated',
          status: 'active'
        });

      if (error) throw error;

      setSavedStates(prev => ({ ...prev, [recommendation.id]: true }));
      toast.success('Рекомендация сохранена!');
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast.error('Ошибка при сохранении рекомендации');
    } finally {
      setSavingStates(prev => ({ ...prev, [recommendation.id]: false }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Критический';
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Средний';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            ИИ рекомендации для здоровья
          </DialogTitle>
          <DialogDescription>
            Персональные рекомендации на основе вашего профиля здоровья
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[60vh]">
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {recommendation.title}
                        </h3>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {getPriorityLabel(recommendation.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {recommendation.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Clock className="h-3 w-3" />
                        <span>{recommendation.timeframe}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => saveRecommendation(recommendation)}
                      disabled={savingStates[recommendation.id] || savedStates[recommendation.id]}
                      size="sm"
                      variant={savedStates[recommendation.id] ? "secondary" : "default"}
                      className="ml-4"
                    >
                      {savedStates[recommendation.id] ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Сохранено
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          {savingStates[recommendation.id] ? 'Сохранение...' : 'Сохранить'}
                        </>
                      )}
                    </Button>
                  </div>

                  {recommendation.specificActions && recommendation.specificActions.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        Конкретные действия:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recommendation.specificActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recommendation.scientificBasis && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-1 flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Научная основа:
                      </h4>
                      <p className="text-sm text-blue-800">
                        {recommendation.scientificBasis}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 pt-0 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {recommendations.length} рекомендаций • Основано на вашем профиле здоровья
            </p>
            <Button onClick={onClose} variant="outline">
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationPopup;
