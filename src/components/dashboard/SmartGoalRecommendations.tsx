
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { supabase } from '@/integrations/supabase/client';
import { Target, Plus, Activity, Heart, Clock, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  category: 'exercise' | 'nutrition' | 'sleep' | 'stress' | 'supplements';
  priority: 'high' | 'medium' | 'low';
  scientificBasis: string;
  specificActions: string[];
}

const SmartGoalRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const { healthProfile, isLoading: profileLoading } = useHealthProfile();
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Heart className="h-4 w-4" />;
      case 'sleep': return <Clock className="h-4 w-4" />;
      case 'stress': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'exercise': 
        return {
          bg: 'from-purple-50 to-indigo-50',
          border: 'border-purple-100',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600'
        };
      case 'nutrition':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-100',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case 'sleep':
        return {
          bg: 'from-blue-50 to-cyan-50',
          border: 'border-blue-100',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      case 'stress':
        return {
          bg: 'from-amber-50 to-orange-50',
          border: 'border-amber-100',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      default:
        return {
          bg: 'from-gray-50 to-slate-50',
          border: 'border-gray-100',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        };
    }
  };

  const generateRecommendations = async () => {
    if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-goal-recommendations', {
        body: {
          healthGoals: healthProfile.healthGoals,
          userProfile: {
            age: healthProfile.age,
            gender: healthProfile.gender,
            weight: healthProfile.weight,
            height: healthProfile.height,
            activityLevel: healthProfile.activityLevel,
            chronicConditions: healthProfile.chronicConditions,
            medications: healthProfile.medications,
            stressLevel: healthProfile.stressLevel,
            sleepHours: healthProfile.sleepHours
          }
        }
      });

      if (error) {
        console.error('Error generating recommendations:', error);
        toast.error('Ошибка при генерации рекомендаций');
        return;
      }

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка при генерации рекомендаций');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (healthProfile?.healthGoals && healthProfile.healthGoals.length > 0) {
      generateRecommendations();
    }
  }, [healthProfile?.healthGoals]);

  if (profileLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!healthProfile?.healthGoals || healthProfile.healthGoals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Рекомендации для достижения целей
        </h3>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="h-6 w-6 text-purple-500" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Установите цели здоровья для получения персональных рекомендаций
          </p>
          <Button 
            size="sm"
            onClick={() => navigate('/health-profile')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs px-4 py-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Добавить цели
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
        Рекомендации для достижения целей
        {isGenerating && <Loader2 className="h-3 w-3 animate-spin" />}
      </h3>
      
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => {
            const colors = getCategoryColors(recommendation.category);
            return (
              <div key={recommendation.id} className={`p-3 bg-gradient-to-r ${colors.bg} rounded-lg border ${colors.border}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className={colors.iconColor}>
                      {getCategoryIcon(recommendation.category)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      {recommendation.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{recommendation.timeframe}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
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
              onClick={generateRecommendations}
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
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/health-profile')}
          className="w-full text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <Plus className="h-3 w-3 mr-1" />
          Персональные рекомендации
        </Button>
      </div>
    </div>
  );
};

export default SmartGoalRecommendations;
