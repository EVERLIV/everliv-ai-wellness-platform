
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Clock, 
  Activity, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  Coffee,
  Moon,
  Sun
} from 'lucide-react';

interface SmartTip {
  id: string;
  type: 'time_based' | 'activity_based' | 'reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  timeRelevant?: boolean;
  actionable?: boolean;
  completed?: boolean;
}

interface SmartTipsProps {
  healthProfile?: any;
  recentActivity?: any[];
  pendingTasks?: any[];
}

const SmartTips: React.FC<SmartTipsProps> = ({ 
  healthProfile, 
  recentActivity = [], 
  pendingTasks = [] 
}) => {
  // Генерация умных подсказок на основе времени и активности
  const smartTips = useMemo((): SmartTip[] => {
    const tips: SmartTip[] = [];
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    
    // Контекстные советы на основе времени дня
    if (currentHour >= 6 && currentHour <= 9) {
      tips.push({
        id: 'morning_hydration',
        type: 'time_based',
        title: 'Утреннее увлажнение',
        message: 'Выпейте стакан воды после пробуждения для запуска метаболизма',
        priority: 'medium',
        timeRelevant: true,
        actionable: true
      });
      
      if (currentDay >= 1 && currentDay <= 5) { // рабочие дни
        tips.push({
          id: 'morning_exercise',
          type: 'time_based',
          title: 'Утренняя зарядка',
          message: 'Уделите 10 минут легкой разминке перед работой',
          priority: 'low',
          timeRelevant: true,
          actionable: true
        });
      }
    }
    
    if (currentHour >= 12 && currentHour <= 14) {
      tips.push({
        id: 'lunch_break',
        type: 'time_based',
        title: 'Перерыв на обед',
        message: 'Сделайте паузу в работе и сходите прогуляться после еды',
        priority: 'medium',
        timeRelevant: true,
        actionable: true
      });
    }
    
    if (currentHour >= 18 && currentHour <= 21) {
      tips.push({
        id: 'evening_reflection',
        type: 'time_based',
        title: 'Вечернее планирование',
        message: 'Подведите итоги дня и запланируйте завтрашние здоровые привычки',
        priority: 'low',
        timeRelevant: true,
        actionable: true
      });
    }
    
    if (currentHour >= 22 || currentHour <= 5) {
      tips.push({
        id: 'sleep_preparation',
        type: 'time_based',
        title: 'Подготовка ко сну',
        message: 'Уменьшите яркость экранов и создайте спокойную атмосферу',
        priority: 'high',
        timeRelevant: true,
        actionable: true
      });
    }
    
    // Предложения на основе истории активности
    if (recentActivity.length > 0) {
      const lastActivity = recentActivity[0];
      if (lastActivity?.type === 'analysis') {
        tips.push({
          id: 'analysis_followup',
          type: 'activity_based',
          title: 'Следуйте рекомендациям',
          message: 'Просмотрите рекомендации из последнего анализа и начните их выполнять',
          priority: 'high',
          actionable: true
        });
      }
    }
    
    // Напоминания о незавершенных задачах
    if (pendingTasks.length > 0) {
      tips.push({
        id: 'pending_tasks',
        type: 'reminder',
        title: `Незавершенные задачи (${pendingTasks.length})`,
        message: 'У вас есть невыполненные рекомендации по здоровью',
        priority: 'medium',
        actionable: true
      });
    }
    
    // Общие советы по здоровью
    if (healthProfile?.physicalActivity === 'низкая') {
      tips.push({
        id: 'increase_activity',
        type: 'activity_based',
        title: 'Увеличьте активность',
        message: 'Попробуйте добавить 15-20 минут ходьбы в свой день',
        priority: 'medium',
        actionable: true
      });
    }
    
    return tips.slice(0, 4); // Показываем максимум 4 подсказки
  }, [healthProfile, recentActivity, pendingTasks]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'time_based': return Clock;
      case 'activity_based': return Activity;
      case 'reminder': return Bell;
      default: return Lightbulb;
    }
  };

  const getTimeIcon = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour <= 11) return Sun;
    if (currentHour >= 12 && currentHour <= 17) return Coffee;
    return Moon;
  };

  if (smartTips.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Умные подсказки
          <Badge variant="secondary" className="ml-2 text-xs">
            {smartTips.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {smartTips.map((tip) => {
          const IconComponent = getTypeIcon(tip.type);
          const TimeIcon = getTimeIcon();
          
          return (
            <div
              key={tip.id}
              className={`p-4 rounded-lg border-l-4 ${
                tip.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                tip.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {tip.timeRelevant ? (
                    <TimeIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                    {tip.timeRelevant && (
                      <Badge variant="outline" className="text-xs">
                        Сейчас актуально
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{tip.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getPriorityColor(tip.priority)}`}>
                      {tip.priority === 'high' ? 'Важно' :
                       tip.priority === 'medium' ? 'Средне' : 'Информация'}
                    </Badge>
                    
                    {tip.actionable && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => console.log('Отложить:', tip.id)}
                        >
                          Позже
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() => console.log('Выполнить:', tip.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Выполнить
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Кнопка для просмотра всех подсказок */}
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Посмотреть все рекомендации
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartTips;
