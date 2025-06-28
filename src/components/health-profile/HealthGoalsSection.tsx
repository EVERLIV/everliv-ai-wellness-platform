
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Check, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { HealthProfileData } from '@/types/healthProfile';
import { useHealthGoalsManager, GOAL_CATEGORIES } from '@/hooks/useHealthGoalsManager';
import AddCustomGoalModal from './AddCustomGoalModal';

interface HealthGoalsSectionProps {
  healthProfile: HealthProfileData;
  isEditMode: boolean;
  onUpdate: (updates: Partial<HealthProfileData>) => void;
}

const PRESET_GOALS = [
  {
    id: 'biological_age',
    title: 'Улучшить биологический возраст',
    description: 'Снизить биологический возраст относительно хронологического через оптимизацию клеточных процессов.'
  },
  {
    id: 'cardiovascular',
    title: 'Оптимизировать работу сердечно-сосудистой системы',
    description: 'Укрепить сердечную мышцу, улучшить кровообращение, нормализовать артериальное давление.'
  },
  {
    id: 'cognitive',
    title: 'Повысить когнитивные функции и здоровье мозга',
    description: 'Улучшить память, концентрацию, скорость мышления и защитить от нейродегенеративных заболеваний.'
  },
  {
    id: 'musculoskeletal',
    title: 'Укрепить костно-мышечную систему',
    description: 'Увеличить плотность костей, мышечную массу и силу, улучшить гибкость и координацию.'
  },
  {
    id: 'metabolism',
    title: 'Оптимизировать метаболизм и гормональный баланс',
    description: 'Нормализовать уровень сахара в крови, улучшить инсулиновую чувствительность.'
  },
  {
    id: 'immunity',
    title: 'Укрепить иммунную систему и детоксикацию',
    description: 'Повысить способность организма противостоять инфекциям, улучшить работу печени и почек.'
  }
];

const HealthGoalsSection: React.FC<HealthGoalsSectionProps> = ({ 
  healthProfile, 
  isEditMode, 
  onUpdate 
}) => {
  const { goals, createCustomGoal, deleteGoal, toggleGoalStatus } = useHealthGoalsManager();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const selectedPresetGoals = healthProfile.healthGoals || [];

  const handlePresetGoalToggle = (goalId: string) => {
    if (!isEditMode) return;
    
    try {
      console.log('Toggling preset goal:', goalId);
      const currentGoals = Array.isArray(selectedPresetGoals) ? selectedPresetGoals : [];
      const isSelected = currentGoals.includes(goalId);
      
      const updatedGoals = isSelected
        ? currentGoals.filter(id => id !== goalId)
        : [...currentGoals, goalId];
      
      console.log('Updated preset goals:', updatedGoals);
      
      setTimeout(() => {
        onUpdate({ healthGoals: updatedGoals });
      }, 0);
      
    } catch (error) {
      console.error('Error toggling preset goal:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Неизвестно';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Группируем цели по категориям
  const groupedCustomGoals = goals.reduce((acc, goal) => {
    const category = goal.category || 'custom';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, typeof goals>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Цели здоровья
        </CardTitle>
        {isEditMode && (
          <p className="text-sm text-gray-600">
            Выберите готовые цели или создайте свои собственные для персонализированных рекомендаций.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Предустановленные цели */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Check className="h-4 w-4 text-blue-600" />
            Рекомендуемые цели
          </h4>
          <div className="space-y-3">
            {PRESET_GOALS.map((goal) => {
              const isSelected = selectedPresetGoals.includes(goal.id);
              
              if (!isEditMode && !isSelected) {
                return null;
              }
              
              return (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => isEditMode && handlePresetGoalToggle(goal.id)}
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
                        <h5 className="font-medium text-gray-900">
                          {goal.title}
                        </h5>
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
          </div>
        </div>

        {/* Пользовательские цели */}
        {(goals.length > 0 || isEditMode) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                Мои цели ({goals.length})
              </h4>
              {isEditMode && (
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить цель
                </Button>
              )}
            </div>

            {goals.length === 0 && isEditMode && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-3">У вас пока нет пользовательских целей</p>
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Создать первую цель
                </Button>
              </div>
            )}

            {/* Отображение пользовательских целей по категориям */}
            {Object.entries(groupedCustomGoals).map(([categoryKey, categoryGoals]) => {
              const category = GOAL_CATEGORIES[categoryKey as keyof typeof GOAL_CATEGORIES];
              
              return (
                <div key={categoryKey} className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{category?.icon || '⭐'}</span>
                    <h5 className="font-medium text-gray-800">
                      {category?.name || 'Другие цели'}
                    </h5>
                    <Badge variant="secondary" className="text-xs">
                      {categoryGoals.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 ml-6">
                    {categoryGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-4 border border-gray-200 rounded-lg bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h6 className="font-medium text-gray-900">
                                {goal.title}
                              </h6>
                              <Badge 
                                className={`${getPriorityColor(goal.priority)} border text-xs px-1.5 py-0.5`}
                              >
                                {getPriorityText(goal.priority)}
                              </Badge>
                            </div>
                            {goal.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {goal.description}
                              </p>
                            )}
                            
                            {/* Прогресс */}
                            {goal.progress_percentage > 0 && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getProgressColor(goal.progress_percentage)}`}
                                    style={{ width: `${goal.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">
                                  {goal.progress_percentage}%
                                </span>
                              </div>
                            )}
                            
                            {/* Целевое значение */}
                            {goal.target_value && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <TrendingUp className="h-3 w-3" />
                                <span>Цель: {goal.target_value} {goal.unit}</span>
                              </div>
                            )}
                            
                            {/* Даты */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Начало: {new Date(goal.start_date).toLocaleDateString('ru-RU')}</span>
                              </div>
                              {goal.end_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Окончание: {new Date(goal.end_date).toLocaleDateString('ru-RU')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {isEditMode && (
                            <div className="flex items-center gap-1 ml-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteGoal(goal.id!)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Итоговая информация */}
        {!isEditMode && (selectedPresetGoals.length > 0 || goals.length > 0) && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Всего целей:</strong> {selectedPresetGoals.length + goals.length}
              ({selectedPresetGoals.length} готовых + {goals.length} пользовательских)
            </p>
            <p className="text-xs text-green-600 mt-1">
              Персонализированные рекомендации создаются на основе ваших целей
            </p>
          </div>
        )}
      </CardContent>

      {/* Модальное окно добавления цели */}
      <AddCustomGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={createCustomGoal}
      />
    </Card>
  );
};

export default HealthGoalsSection;
