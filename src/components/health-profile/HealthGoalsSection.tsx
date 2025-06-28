
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Check, Trash2, Calendar, TrendingUp, Sparkles } from 'lucide-react';
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
    title: 'Повысить когнитивные функции',
    description: 'Улучшить память, концентрацию, скорость мышления и защитить от нейродегенеративных заболеваний.'
  },
  {
    id: 'musculoskeletal',
    title: 'Укрепить костно-мышечную систему',
    description: 'Увеличить плотность костей, мышечную массу и силу, улучшить гибкость.'
  },
  {
    id: 'metabolism',
    title: 'Оптимизировать метаболизм',
    description: 'Нормализовать уровень сахара в крови, улучшить инсулиновую чувствительность.'
  },
  {
    id: 'immunity',
    title: 'Укрепить иммунную систему',
    description: 'Повысить способность организма противостоять инфекциям, улучшить детоксикацию.'
  }
];

const HealthGoalsSection: React.FC<HealthGoalsSectionProps> = ({ 
  healthProfile, 
  isEditMode, 
  onUpdate 
}) => {
  const { goals, createCustomGoal, deleteGoal } = useHealthGoalsManager();
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
      case 'high': return 'bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-700 border-red-200/50';
      case 'medium': return 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200/50';
      case 'low': return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-200/50';
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
    if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const groupedCustomGoals = goals.reduce((acc, goal) => {
    const category = goal.category || 'custom';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(goal);
    return acc;
  }, {} as Record<string, typeof goals>);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-b border-white/20">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Цели здоровья
            </span>
            {isEditMode && (
              <p className="text-sm text-gray-600 font-normal mt-1">
                Выберите готовые цели или создайте свои для персонализированных рекомендаций
              </p>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Preset Goals */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Рекомендуемые цели
          </h4>
          <div className="grid gap-3">
            {PRESET_GOALS.map((goal) => {
              const isSelected = selectedPresetGoals.includes(goal.id);
              
              if (!isEditMode && !isSelected) return null;
              
              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 shadow-md'
                      : 'border-gray-200/50 bg-white/50 hover:border-gray-300/50 hover:shadow-md'
                  } ${isEditMode ? 'hover:scale-[1.02]' : ''}`}
                  onClick={() => isEditMode && handlePresetGoalToggle(goal.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                        : 'bg-gray-100'
                    }`}>
                      {isSelected ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Plus className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900">{goal.title}</h5>
                        {isSelected && (
                          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xs px-2 py-1">
                            Выбрано
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{goal.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Goals */}
        {(goals.length > 0 || isEditMode) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-600" />
                Мои цели ({goals.length})
              </h4>
              {isEditMode && (
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Добавить
                </Button>
              )}
            </div>

            {goals.length === 0 && isEditMode && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200/50 rounded-xl bg-gray-50/30">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="text-gray-500 mb-4">У вас пока нет пользовательских целей</p>
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Создать первую цель
                </Button>
              </div>
            )}

            {Object.entries(groupedCustomGoals).map(([categoryKey, categoryGoals]) => {
              const category = GOAL_CATEGORIES[categoryKey as keyof typeof GOAL_CATEGORIES];
              
              return (
                <div key={categoryKey} className="mb-6">
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-lg border border-gray-200/30">
                    <span className="text-2xl">{category?.icon || '⭐'}</span>
                    <h5 className="font-medium text-gray-800">{category?.name || 'Другие цели'}</h5>
                    <Badge variant="secondary" className="text-xs bg-white/70 text-gray-700">
                      {categoryGoals.length}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {categoryGoals.map((goal) => (
                      <div
                        key={goal.id}
                        className="p-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h6 className="font-medium text-gray-900">{goal.title}</h6>
                              <Badge className={`${getPriorityColor(goal.priority)} border text-xs px-2 py-1`}>
                                {getPriorityText(goal.priority)}
                              </Badge>
                            </div>
                            
                            {goal.description && (
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {goal.description}
                              </p>
                            )}
                            
                            {goal.progress_percentage > 0 && (
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-2 rounded-full ${getProgressColor(goal.progress_percentage)} transition-all duration-500`}
                                    style={{ width: `${goal.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-600 min-w-[40px]">
                                  {goal.progress_percentage}%
                                </span>
                              </div>
                            )}
                            
                            {goal.target_value && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span>Цель: <span className="font-medium">{goal.target_value} {goal.unit}</span></span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
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
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteGoal(goal.id!)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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

        {!isEditMode && (selectedPresetGoals.length > 0 || goals.length > 0) && (
          <div className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-green-800">
                Всего целей: {selectedPresetGoals.length + goals.length}
              </p>
            </div>
            <p className="text-xs text-green-700 ml-11">
              {selectedPresetGoals.length} готовых + {goals.length} пользовательских
            </p>
            <p className="text-xs text-green-600 mt-1 ml-11">
              Персонализированные рекомендации создаются на основе ваших целей
            </p>
          </div>
        )}
      </CardContent>

      <AddCustomGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={createCustomGoal}
      />
    </Card>
  );
};

export default HealthGoalsSection;
