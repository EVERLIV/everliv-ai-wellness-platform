import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Target, 
  Edit,
  Bell,
  Heart,
  Brain,
  Droplets,
  Coffee,
  Bed,
  Dumbbell
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue } from "@/utils/healthProfileTranslations";
import { translateGoalText, translateHealthGoal } from "@/utils/goalTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { useHealthProfile } from "@/hooks/useHealthProfile";
import { cn } from "@/lib/utils";

interface ModernHealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}

const ModernHealthProfileDisplay: React.FC<ModernHealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const { updateHealthProfile, saveHealthProfile } = useHealthProfile();

  const handleSaveHealthProfile = async (): Promise<void> => {
    await saveHealthProfile();
  };

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Недостаточный вес';
    if (bmi < 25) return 'Норма';
    if (bmi < 30) return 'Избыточный вес';
    return 'Ожирение';
  };

  const getBMIColor = (bmi: number): string => {
    if (bmi < 18.5) return 'text-orange-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);
  
  // Объединяем цели из базы данных и из профиля
  const databaseGoals = goals || [];
  const profileGoals = healthProfile.healthGoals || [];
  
  // Преобразуем цели из профиля в формат для отображения с переводом
  const convertedProfileGoals = profileGoals.map((goal, index) => ({
    id: `profile-${index}`,
    title: translateHealthGoal(goal), // Используем новую функцию перевода
    description: '',
    category: 'health',
    priority: 'medium' as const,
    progress_percentage: undefined // Убираем прогресс
  }));
  
  // Сначала свои цели, потом из профиля
  const allGoals = [
    ...databaseGoals.map(goal => ({ ...goal, progress_percentage: undefined })), // Убираем прогресс
    ...convertedProfileGoals
  ];

  const getPriorityColor = (priority: string | null | undefined) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string | null | undefined) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  const getCategoryText = (category: string | null | undefined) => {
    const categories: Record<string, string> = {
      'fitness': 'Фитнес',
      'nutrition': 'Питание',
      'sleep': 'Сон',
      'stress': 'Стресс',
      'weight': 'Вес',
      'health': 'Здоровье',
      'lifestyle': 'Образ жизни',
      'other': 'Другое'
    };
    return categories[category || ''] || category;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen overflow-hidden touch-pan-y">
      {/* Header - Safe area aware */}
      <div className="px-4 pt-safe py-3 bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95 touch-manipulation"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Профиль здоровья
              </h1>
              <p className="text-xs text-gray-600">
                Мониторинг здоровья
              </p>
            </div>
          </div>
          
          <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95 touch-manipulation">
            <Bell className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <button
          onClick={onEdit}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 touch-manipulation"
        >
          <Edit className="w-4 h-4" />
          Редактировать
        </button>
      </div>

      {/* Content Area - Direct on page without cards */}
      <div className="pb-safe p-4 space-y-6">

        {/* Basic Information Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Основная информация</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg active:scale-95 transition-transform touch-manipulation">
              <div className="text-xl font-bold text-blue-900">{healthProfile.age}</div>
              <div className="text-xs text-blue-700 font-medium">Возраст</div>
            </div>
            <div className="text-center p-2.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg active:scale-95 transition-transform touch-manipulation">
              <div className="text-xl font-bold text-purple-900">
                {healthProfile.gender === 'male' ? 'М' : 'Ж'}
              </div>
              <div className="text-xs text-purple-700 font-medium">Пол</div>
            </div>
            <div className="text-center p-2.5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg active:scale-95 transition-transform touch-manipulation">
              <div className="text-xl font-bold text-green-900">{healthProfile.height}</div>
              <div className="text-xs text-green-700 font-medium">Рост (см)</div>
            </div>
            <div className="text-center p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg active:scale-95 transition-transform touch-manipulation">
              <div className="text-xl font-bold text-orange-900">{healthProfile.weight}</div>
              <div className="text-xs text-orange-700 font-medium">Вес (кг)</div>
            </div>
          </div>
        </div>

        {/* BMI Section */}
        <div>
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">ИМТ</div>
              <div className="text-xs text-gray-600">Индекс массы тела</div>
            </div>
            <div className="text-right">
              <div className={cn("text-2xl font-bold", getBMIColor(bmi))}>
                {bmi.toFixed(1)}
              </div>
              <div className={cn("text-xs font-medium", getBMIColor(bmi))}>
                {getBMICategory(bmi)}
              </div>
            </div>
          </div>
        </div>


        {/* Health Goals Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 block">Цели</span>
              <span className="text-xs text-gray-500">{allGoals.length} активных</span>
            </div>
          </div>
          
          {allGoals.length > 0 ? (
            <div className="space-y-2">
              {allGoals.map((goal) => (
                <div key={goal.id} className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <h3 className="font-medium text-purple-900 text-sm mb-2">{goal.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {getPriorityText(goal.priority)}
                    </span>
                    <span className="text-xs text-purple-600 font-medium">{getCategoryText(goal.category)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-3">Нет активных целей</p>
            </div>
          )}
        </div>

        {/* Medical Information */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-900 block">Показатели</span>
              <span className="text-xs text-gray-500">Физические</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-red-50 to-red-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Brain className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <div className="text-xs text-red-700 font-medium">Стресс</div>
              <div className="text-lg font-bold text-red-900">{healthProfile.stressLevel}/10</div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Brain className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <div className="text-xs text-orange-700 font-medium">Тревога</div>
              <div className="text-lg font-bold text-orange-900">{healthProfile.anxietyLevel}/10</div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Bed className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <div className="text-xs text-blue-700 font-medium">Сон</div>
              <div className="text-lg font-bold text-blue-900">{healthProfile.sleepHours}ч</div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Dumbbell className="w-4 h-4 text-green-500 mx-auto mb-1" />
              <div className="text-xs text-green-700 font-medium">Спорт</div>
              <div className="text-lg font-bold text-green-900">{healthProfile.exerciseFrequency}/нед</div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Droplets className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
              <div className="text-xs text-cyan-700 font-medium">Вода</div>
              <div className="text-lg font-bold text-cyan-900">{healthProfile.waterIntake}</div>
            </div>
            <div className="p-2.5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg text-center active:scale-95 transition-transform touch-manipulation">
              <Coffee className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-xs text-amber-700 font-medium">Кофеин</div>
              <div className="text-lg font-bold text-amber-900">{healthProfile.caffeineIntake}</div>
            </div>
          </div>
          
          {/* Lab Results Section */}
          {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Лабораторные результаты</h4>
              <div className="space-y-2">
                {Object.entries(healthProfile.labResults).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-600 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernHealthProfileDisplay;