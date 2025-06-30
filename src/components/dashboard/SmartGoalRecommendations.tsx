import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Plus, Lightbulb, ArrowRight, Maximize2 } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';
import { useSmartRecommendations } from './recommendations/useSmartRecommendations';
import RecommendationPopup from './recommendations/RecommendationPopup';

const SmartGoalRecommendations: React.FC = () => {
  const { healthProfile } = useHealthProfile();
  const navigate = useNavigate();
  const { recommendations, isGenerating } = useSmartRecommendations();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Переводим цели здоровья на русский
  const translateGoal = (goal: string): string => {
    const translations: Record<string, string> = {
      'cognitive': 'Улучшение когнитивных функций',
      'cardiovascular': 'Здоровье сердечно-сосудистой системы',
      'weight_loss': 'Снижение веса',
      'muscle_gain': 'Набор мышечной массы',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'biological_age': 'Биологический возраст',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты'
    };
    return translations[goal] || goal;
  };

  // Получаем цели из профиля здоровья
  const healthGoals = healthProfile?.healthGoals || [];

  if (isGenerating) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Цели здоровья</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">Цели здоровья</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Цели из профиля здоровья */}
          {healthGoals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ваши цели:</h4>
              {healthGoals.slice(0, 3).map((goal, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-800">{translateGoal(goal)}</span>
                </div>
              ))}
              {healthGoals.length > 3 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => navigate('/health-profile')}
                >
                  +{healthGoals.length - 3} ещё
                </Button>
              )}
            </div>
          )}

          {/* ИИ рекомендации на основе профиля */}
          {recommendations.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  ИИ рекомендации:
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPopupOpen(true)}
                  className="text-xs text-purple-600 hover:text-purple-700"
                >
                  <Maximize2 className="h-3 w-3 mr-1" />
                  Открыть все
                </Button>
              </div>
              
              {recommendations.slice(0, 2).map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm mb-1">
                        {rec.title}
                      </h5>
                      <p className="text-xs text-gray-600 mb-2">
                        {rec.description}
                      </p>
                      <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded-full inline-block">
                        {rec.timeframe}
                      </div>
                    </div>
                  </div>
                  
                  {rec.scientificBasis && (
                    <div className="mt-2 p-2 bg-blue-50/50 border border-blue-100 rounded text-xs text-blue-800">
                      <strong>Научная основа:</strong> {rec.scientificBasis}
                    </div>
                  )}
                </div>
              ))}
              
              {recommendations.length > 2 && (
                <Button 
                  variant="outline" 
                  className="w-full mt-2 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => navigate('/my-recommendations')}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Показать все рекомендации ({recommendations.length})
                </Button>
              )}
            </div>
          )}

          {/* Если нет целей и рекомендаций */}
          {healthGoals.length === 0 && recommendations.length === 0 && (
            <div className="text-center py-6">
              <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-3">Создайте профиль здоровья для получения персональных целей</p>
              <Button 
                size="sm" 
                onClick={() => navigate('/health-profile')}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Создать профиль
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <RecommendationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        recommendations={recommendations}
      />
    </>
  );
};

export default SmartGoalRecommendations;
