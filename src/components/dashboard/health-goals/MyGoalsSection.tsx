import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Plus, ArrowRight, AlertTriangle, TestTube, Clock } from 'lucide-react';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { useNavigate } from 'react-router-dom';
const MyGoalsSection: React.FC = () => {
  const {
    healthProfile,
    isLoading
  } = useHealthProfile();
  const navigate = useNavigate();

  // Перевод целей на русский язык - расширенный список
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

  // Компактные рекомендации для достижения целей
  const goalRecommendations = [{
    id: '1',
    title: 'Анализы крови',
    description: 'Расширенная метаболическая панель, Маркеры воспаления',
    priority: 'high',
    category: 'Анализы',
    reason: 'Хроническое воспаление - основа большинства возрастных заболеваний'
  }, {
    id: '2',
    title: 'Консультация кардиолога',
    description: 'Оценка сердечно-сосудистых рисков',
    priority: 'medium',
    category: 'Консультации',
    reason: 'Профилактика сердечно-сосудистых заболеваний'
  }, {
    id: '3',
    title: 'Витамин D',
    description: 'Проверка уровня в крови',
    priority: 'medium',
    category: 'Анализы',
    reason: 'Важен для костной системы и иммунитета'
  }];
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
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Неизвестно';
    }
  };
  if (isLoading) {
    return <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
          <div className="animate-pulse">Загрузка...</div>
        </div>
      </div>;
  }
  const healthGoals = healthProfile?.healthGoals || [];
  return <div className="space-y-3">
      {/* Мои цели из профиля здоровья */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Мои цели
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/health-profile')} className="text-xs px-2 py-1 h-6">
            Редактировать
          </Button>
        </div>
        
        {healthGoals.length === 0 ? <div className="text-center py-4">
            <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            
            <Button size="sm" onClick={() => navigate('/health-profile')} className="text-xs px-3 py-1 h-7">
              <Plus className="h-3 w-3 mr-1" />
              Добавить цели
            </Button>
          </div> : <div className="space-y-2">
            {healthGoals.slice(0, 4).map((goal, index) => <div key={index} className="flex items-center gap-2 p-2 bg-gray-50/50 rounded text-xs">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-900 font-medium">
                  {translateGoal(goal)}
                </span>
              </div>)}
            
            {healthGoals.length > 4 && <div className="pt-1">
                <Button variant="ghost" size="sm" className="w-full text-xs h-6" onClick={() => navigate('/health-profile')}>
                  Показать все ({healthGoals.length})
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>}
          </div>}
      </div>

      {/* Рекомендации для достижения целей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Рекомендации для достижения целей
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')} className="text-xs px-2 py-1 h-6">
            Все
          </Button>
        </div>
        
        <div className="space-y-2">
          {goalRecommendations.map(rec => <div key={rec.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    {rec.category === 'Анализы' ? <TestTube className="h-3 w-3 text-blue-600" /> : <Clock className="h-3 w-3 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-0.5">
                      {rec.title}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1">
                      {rec.description}
                    </p>
                  </div>
                </div>
                <Badge className={`${getPriorityColor(rec.priority)} border text-xs px-1.5 py-0.5 ml-2 flex-shrink-0`}>
                  {getPriorityText(rec.priority)}
                </Badge>
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded p-2 ml-8">
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed">{rec.reason}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default MyGoalsSection;