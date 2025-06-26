
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Check } from 'lucide-react';
import { HealthProfileData } from '@/types/healthProfile';

interface HealthGoalsSectionProps {
  healthProfile: HealthProfileData;
  isEditMode: boolean;
  onUpdate: (updates: Partial<HealthProfileData>) => void;
}

const AVAILABLE_GOALS = [
  {
    id: 'biological_age',
    title: 'Улучшить биологический возраст',
    description: 'Снизить биологический возраст относительно хронологического через оптимизацию клеточных процессов, уменьшение воспалений и улучшение регенеративных функций организма.'
  },
  {
    id: 'cardiovascular',
    title: 'Оптимизировать работу сердечно-сосудистой системы',
    description: 'Укрепить сердечную мышцу, улучшить кровообращение, нормализовать артериальное давление и снизить риск сердечно-сосудистых заболеваний.'
  },
  {
    id: 'cognitive',
    title: 'Повысить когнитивные функции и здоровье мозга',
    description: 'Улучшить память, концентрацию, скорость мышления и защитить от нейродегенеративных заболеваний через стимуляцию нейропластичности.'
  },
  {
    id: 'musculoskeletal',
    title: 'Укрепить костно-мышечную систему',
    description: 'Увеличить плотность костей, мышечную массу и силу, улучшить гибкость и координацию для предотвращения падений и травм в пожилом возрасте.'
  },
  {
    id: 'metabolism',
    title: 'Оптимизировать метаболизм и гормональный баланс',
    description: 'Нормализовать уровень сахара в крови, улучшить инсулиновую чувствительность, стабилизировать гормональный фон и поддержать здоровый вес.'
  },
  {
    id: 'immunity',
    title: 'Укрепить иммунную систему и детоксикацию',
    description: 'Повысить способность организма противостоять инфекциям, улучшить работу печени и почек, оптимизировать процессы очищения организма от токсинов.'
  }
];

const HealthGoalsSection: React.FC<HealthGoalsSectionProps> = ({ 
  healthProfile, 
  isEditMode, 
  onUpdate 
}) => {
  const selectedGoals = healthProfile.healthGoals || [];

  const handleGoalToggle = (goalId: string) => {
    if (!isEditMode) return;
    
    const currentGoals = healthProfile.healthGoals || [];
    const isSelected = currentGoals.includes(goalId);
    
    const updatedGoals = isSelected
      ? currentGoals.filter(id => id !== goalId)
      : [...currentGoals, goalId];
    
    onUpdate({ healthGoals: updatedGoals });
  };

  if (!isEditMode && selectedGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Цели здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Цели здоровья не выбраны</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Цели здоровья
        </CardTitle>
        {isEditMode && (
          <p className="text-sm text-gray-600">
            Выберите цели, которые важны для вас. Каждая цель включает персонализированные рекомендации.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {AVAILABLE_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            
            if (!isEditMode && !isSelected) {
              return null;
            }
            
            return (
              <div
                key={goal.id}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isEditMode ? 'cursor-default' : ''}`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {isSelected ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {goal.title}
                      </h4>
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          Выбрано
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {goal.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {!isEditMode && selectedGoals.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Выбрано целей:</strong> {selectedGoals.length} из {AVAILABLE_GOALS.length}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Персонализированные рекомендации будут созданы на основе ваших целей
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthGoalsSection;
