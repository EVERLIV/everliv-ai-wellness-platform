import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Activity, 
  Target, 
  Pill, 
  Stethoscope, 
  FileText,
  Edit,
  Settings,
  Home,
  Calendar,
  BarChart3,
  Heart,
  Brain,
  Users,
  MessageCircle,
  Bell
} from "lucide-react";
import { HealthProfileData } from "@/types/healthProfile";
import { translateValue, translateHealthGoals, translateMedications, translateLabResultKey, formatLabResultValue } from "@/utils/healthProfileTranslations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useHealthGoalsManager } from "@/hooks/useHealthGoalsManager";
import { useDailyHealthMetrics } from "@/hooks/useDailyHealthMetrics";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";

interface EnhancedHealthProfileDisplayProps {
  healthProfile: HealthProfileData;
  onEdit: () => void;
}


const EnhancedHealthProfileDisplay: React.FC<EnhancedHealthProfileDisplayProps> = ({
  healthProfile,
  onEdit
}) => {
  const { user } = useAuth();
  const { goals } = useHealthGoalsManager();
  const { metrics: dailyMetrics, todayMetrics, isLoading: metricsLoading } = useDailyHealthMetrics();

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Недостаточный вес";
    if (bmi < 25) return "Нормальный вес";
    if (bmi < 30) return "Избыточный вес";
    return "Ожирение";
  };


  const bmi = calculateBMI(healthProfile.weight, healthProfile.height);

  const menuItems = [
    { icon: Home, label: 'Главная', path: '/', active: false },
    { icon: User, label: 'Профиль здоровья', path: '/health-profile', active: true },
    { icon: BarChart3, label: 'Анализы', path: '/analysis', active: false },
    { icon: Brain, label: 'ИИ Доктор', path: '/ai-doctor', active: false },
    { icon: Target, label: 'Цели', path: '/goals', active: false },
    { icon: Activity, label: 'Метрики', path: '/metrics', active: false },
    { icon: Heart, label: 'Рекомендации', path: '/recommendations', active: false },
    { icon: Calendar, label: 'Календарь', path: '/calendar', active: false },
    { icon: MessageCircle, label: 'Чат', path: '/chat', active: false },
    { icon: Users, label: 'Профиль', path: '/profile', active: false },
    { icon: Settings, label: 'Настройки', path: '/settings', active: false },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700';
      case 'medium': return 'bg-amber-50 text-amber-700';
      case 'low': return 'bg-green-50 text-green-700';
      default: return 'bg-gray-50 text-gray-700';
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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Боковое меню */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          {/* Профиль пользователя */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Пользователь'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded ${
                  item.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1">
        {/* Хедер */}
        <div className="border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">Профиль здоровья</h1>
              <p className="text-sm text-gray-500">Управление личной информацией и показателями здоровья</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Bell className="w-4 h-4 mr-2" />
                Уведомления
              </Button>
              <Button onClick={onEdit} variant="outline" size="sm" className="border-gray-300">
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </div>
        </div>

        {/* Прокручиваемый контент */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          <div className="p-8">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Основная информация */}
              <section>
                <h2 className="text-base font-medium text-gray-900 mb-6">Основная информация</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Имя</label>
                        <div className="text-sm text-gray-900">{user?.user_metadata?.full_name || 'Не указано'}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Email</label>
                        <div className="text-sm text-gray-900">{user?.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Возраст</label>
                        <div className="text-sm text-gray-900">{healthProfile.age} лет</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Пол</label>
                        <div className="text-sm text-gray-900">{translateValue('gender', healthProfile.gender)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Рост</label>
                        <div className="text-sm text-gray-900">{healthProfile.height} см</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Вес</label>
                        <div className="text-sm text-gray-900">{healthProfile.weight} кг</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">ИМТ</label>
                        <div className="text-sm text-gray-900">{bmi.toFixed(1)}</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Категория ИМТ</label>
                        <div className="text-sm text-gray-900">{getBMICategory(bmi)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Уровень стресса</label>
                        <div className="text-sm text-gray-900">{healthProfile.stressLevel}/10</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Часы сна</label>
                        <div className="text-sm text-gray-900">{healthProfile.sleepHours} часов</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Частота упражнений</label>
                        <div className="text-sm text-gray-900">{healthProfile.exerciseFrequency} раз в неделю</div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Потребление воды</label>
                        <div className="text-sm text-gray-900">{healthProfile.waterIntake} стаканов</div>
                      </div>
                    </div>
                    {(todayMetrics || dailyMetrics.length > 0) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Последние шаги</label>
                          <div className="text-sm text-gray-900">{(todayMetrics?.steps || dailyMetrics[0]?.steps)?.toLocaleString() || 'Нет данных'}</div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Тренировки (мин)</label>
                          <div className="text-sm text-gray-900">{todayMetrics?.exercise_minutes || dailyMetrics[0]?.exercise_minutes || 'Нет данных'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Цели здоровья */}
              <section className="border-t border-gray-200 pt-8">
                <h2 className="text-base font-medium text-gray-900 mb-6">Мои цели здоровья</h2>
                
                {/* Цели из профиля */}
                {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Цели из профиля здоровья</h3>
                    <div className="grid gap-3">
                      {translateHealthGoals(healthProfile.healthGoals).map((goal: string, index: number) => (
                        <div key={`profile-${index}`} className="bg-gray-50 p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">{goal}</span>
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700">
                              Из профиля
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Пользовательские цели */}
                {goals.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Пользовательские цели</h3>
                    <div className="grid gap-3">
                      {goals.map((goal) => (
                        <div key={goal.id} className="bg-white border border-gray-200 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-900">{goal.title}</span>
                                <span className={`inline-flex items-center px-2 py-1 text-xs ${getPriorityColor(goal.priority || 'medium')}`}>
                                  {getPriorityText(goal.priority || 'medium')}
                                </span>
                                <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700">
                                  {getCategoryText(goal.category || 'other')}
                                </span>
                              </div>
                              {goal.description && (
                                <p className="text-sm text-gray-500 mb-2">{goal.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-xs text-gray-400">
                                {goal.end_date && (
                                  <span>До: {format(new Date(goal.end_date), "d MMMM yyyy", { locale: ru })}</span>
                                )}
                                <span>Создана: {goal.created_at ? format(new Date(goal.created_at), "d MMMM", { locale: ru }) : 'Неизвестно'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Медицинская информация */}
              <section className="border-t border-gray-200 pt-8">
                <h2 className="text-base font-medium text-gray-900 mb-6">Медицинская информация</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-700">Медицинская история</h3>
                    
                    {healthProfile.chronicConditions && healthProfile.chronicConditions.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Хронические заболевания</label>
                        <div className="text-sm text-gray-900">{healthProfile.chronicConditions.join(', ')}</div>
                      </div>
                    )}
                    
                    {healthProfile.allergies && healthProfile.allergies.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Аллергии</label>
                        <div className="text-sm text-gray-900">{healthProfile.allergies.join(', ')}</div>
                      </div>
                    )}

                    {healthProfile.familyHistory && healthProfile.familyHistory.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Семейный анамнез</label>
                        <div className="text-sm text-gray-900">{healthProfile.familyHistory.join(', ')}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-700">Лекарства и добавки</h3>
                    
                    {healthProfile.medications && healthProfile.medications.length > 0 && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-2">Текущие лекарства</label>
                        <div className="text-sm text-gray-900">{translateMedications(healthProfile.medications).join(', ')}</div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Потребление кофеина</label>
                      <div className="text-sm text-gray-900">{healthProfile.caffeineIntake} чашек в день</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Результаты анализов */}
              {healthProfile.labResults && Object.keys(healthProfile.labResults).length > 0 && (
                <section className="border-t border-gray-200 pt-8">
                  <h2 className="text-base font-medium text-gray-900 mb-6">Результаты анализов</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(healthProfile.labResults).map(([key, value]) => {
                      if (value !== undefined && value !== null && value !== '') {
                        return (
                          <div key={key} className="space-y-1">
                            <label className="block text-xs text-gray-500">{translateLabResultKey(key)}</label>
                            <div className="text-sm text-gray-900">{formatLabResultValue(key, value)}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </section>
              )}

              {/* Последние метрики */}
              {dailyMetrics.length > 0 && (
                <section className="border-t border-gray-200 pt-8">
                  <h2 className="text-base font-medium text-gray-900 mb-6">Последние метрики</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {dailyMetrics[0].steps && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Шаги</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].steps.toLocaleString()}</div>
                      </div>
                    )}
                    {dailyMetrics[0].sleep_hours && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Сон</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].sleep_hours} часов</div>
                      </div>
                    )}
                    {dailyMetrics[0].exercise_minutes && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Тренировки</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].exercise_minutes} минут</div>
                      </div>
                    )}
                    {dailyMetrics[0].water_intake && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Вода</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].water_intake} л</div>
                      </div>
                    )}
                    {dailyMetrics[0].mood_level && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Настроение</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].mood_level}/10</div>
                      </div>
                    )}
                    {dailyMetrics[0].stress_level && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Стресс</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].stress_level}/10</div>
                      </div>
                    )}
                    {dailyMetrics[0].sleep_quality && (
                      <div className="space-y-1">
                        <label className="block text-xs text-gray-500">Качество сна</label>
                        <div className="text-sm text-gray-900">{dailyMetrics[0].sleep_quality}/10</div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHealthProfileDisplay;