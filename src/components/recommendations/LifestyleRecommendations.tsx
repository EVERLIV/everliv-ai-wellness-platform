import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Moon, Droplets, Brain, Target } from 'lucide-react';

interface LifestyleRecommendationsProps {
  recommendations: any;
  healthProfile: any;
}

const LifestyleRecommendations: React.FC<LifestyleRecommendationsProps> = ({ 
  recommendations, 
  healthProfile 
}) => {
  const lifestyle = recommendations?.lifestyle || [];
  const mealPlan = recommendations?.mealPlan || [];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exercise':
      case 'физическая активность': return Activity;
      case 'sleep':
      case 'сон': return Moon;
      case 'stress':
      case 'стресс': return Brain;
      case 'hydration':
      case 'гидратация': return Droplets;
      default: return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exercise':
      case 'физическая активность': return 'text-success bg-success/10 border-success/20';
      case 'sleep':
      case 'сон': return 'text-info bg-info/10 border-info/20';
      case 'stress':
      case 'стресс': return 'text-warning bg-warning/10 border-warning/20';
      case 'hydration':
      case 'гидратация': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  // Анализ текущего образа жизни
  const getCurrentLifestyleAnalysis = () => {
    if (!healthProfile) return null;

    const analyses = [];
    
    if (healthProfile.exerciseFrequency < 3) {
      analyses.push({
        category: 'Физическая активность',
        current: `${healthProfile.exerciseFrequency} раз в неделю`,
        recommendation: 'Увеличить до 3-4 раз в неделю',
        priority: 'high'
      });
    }

    if (healthProfile.sleepHours < 7) {
      analyses.push({
        category: 'Сон',
        current: `${healthProfile.sleepHours} часов в сутки`,
        recommendation: 'Увеличить до 7-8 часов',
        priority: 'high'
      });
    }

    if (healthProfile.stressLevel > 7) {
      analyses.push({
        category: 'Стресс',
        current: `${healthProfile.stressLevel}/10`,
        recommendation: 'Применять техники управления стрессом',
        priority: 'medium'
      });
    }

    if (healthProfile.waterIntake < 8) {
      analyses.push({
        category: 'Гидратация',
        current: `${healthProfile.waterIntake} стаканов в день`,
        recommendation: 'Увеличить до 8-10 стаканов',
        priority: 'medium'
      });
    }

    return analyses;
  };

  const currentAnalysis = getCurrentLifestyleAnalysis();

  return (
    <div className="space-y-content">
      {/* Current Lifestyle Analysis */}
      {currentAnalysis && currentAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Анализ текущего образа жизни
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentAnalysis.map((analysis, index) => {
                const IconComponent = getCategoryIcon(analysis.category);
                const priorityColor = analysis.priority === 'high' 
                  ? 'border-destructive/20 bg-destructive/5' 
                  : 'border-warning/20 bg-warning/5';
                
                return (
                  <div key={index} className={`p-3 rounded-lg border ${priorityColor}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium text-primary">{analysis.category}</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Текущее состояние:</span>
                            <span className="text-foreground">{analysis.current}</span>
                          </div>
                          <div className="text-secondary-foreground">
                            <strong>Рекомендация:</strong> {analysis.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Lifestyle Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Рекомендации по образу жизни
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lifestyle.length > 0 ? (
            <div className="space-y-3">
              {lifestyle.map((recommendation: any, index: number) => {
                const IconComponent = getCategoryIcon(recommendation.category);
                const colorClass = getCategoryColor(recommendation.category);
                
                return (
                  <div key={index} className={`p-4 rounded-lg border ${colorClass}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass.replace('border-', 'bg-').replace('/20', '/20')}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{recommendation.category}</h4>
                        </div>
                        <p className="text-sm opacity-90">{recommendation.advice}</p>
                        {recommendation.goal && (
                          <div className="text-xs p-2 bg-background/50 rounded">
                            <strong>Цель:</strong> {recommendation.goal}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Рекомендации по образу жизни будут доступны после анализа ваших данных</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal Planning */}
      {mealPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              План питания
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mealPlan.map((meal: any, index: number) => (
                <div key={index} className="p-3 bg-surface rounded-lg">
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">{meal.mealType}</h4>
                    <div className="space-y-1">
                      {meal.foods?.map((food: string, foodIndex: number) => (
                        <div key={foodIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-foreground">{food}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LifestyleRecommendations;