import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useHealthGoalsManager } from '@/hooks/useHealthGoalsManager';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { translateHealthGoals } from '@/utils/healthProfileTranslations';


interface UserHealthGoalsTabProps {
  healthProfile: any;
}

const UserHealthGoalsTab: React.FC<UserHealthGoalsTabProps> = ({ healthProfile }) => {
  const { goals, deleteGoal, isLoading } = useHealthGoalsManager();

  const handleDeleteGoal = async (goalId: string | undefined) => {
    if (!goalId) return;
    await deleteGoal(goalId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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

  const getCategoryText = (category: string) => {
    const categories: Record<string, string> = {
      'fitness': 'Фитнес',
      'nutrition': 'Питание',
      'mental': 'Ментальное здоровье',
      'medical': 'Медицинские',
      'lifestyle': 'Образ жизни',
      'other': 'Другое'
    };
    return categories[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h2 className="text-base font-medium text-gray-900 mb-1">Мои цели здоровья</h2>
        <p className="text-sm text-gray-500">Ваши персональные цели, созданные при настройке профиля</p>
      </div>

      {/* Цели из профиля здоровья */}
      {healthProfile?.healthGoals && healthProfile.healthGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Цели из профиля здоровья</h3>
          <div className="space-y-3">
            {translateHealthGoals(healthProfile.healthGoals).map((goal: string, index: number) => (
              <div key={`profile-${index}`} className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{goal}</h4>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-50 text-blue-700">
                        Из профиля
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700">
                        Активная
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Цель создана при настройке профиля здоровья
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Пользовательские цели */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-sm font-medium text-gray-900 mb-2">Пока нет пользовательских целей</h3>
          <p className="text-sm text-gray-500">
            Пользовательские цели создаются при заполнении профиля здоровья
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Пользовательские цели</h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{goal.title}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${getPriorityColor(goal.priority || 'medium')}`}>
                        {getPriorityText(goal.priority || 'medium')}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                        {getCategoryText(goal.category || 'other')}
                      </span>
                      {goal.is_active && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700">
                          Активная
                        </span>
                      )}
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {goal.end_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            До: {format(new Date(goal.end_date), "d MMMM yyyy", { locale: ru })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Создана: {goal.created_at ? format(new Date(goal.created_at), "d MMMM", { locale: ru }) : 'Неизвестно'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHealthGoalsTab;