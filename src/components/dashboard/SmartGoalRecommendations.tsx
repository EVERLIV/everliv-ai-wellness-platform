
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const SmartGoalRecommendations: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      title: 'Улучшить качество сна',
      description: 'Спать по 7-8 часов в день',
      progress: 60,
      priority: 'high',
      timeFrame: '2 недели'
    },
    {
      id: 2,
      title: 'Увеличить потребление воды',
      description: 'Пить 8 стаканов воды в день',
      progress: 80,
      priority: 'medium',
      timeFrame: '1 неделя'
    },
    {
      id: 3,
      title: 'Регулярные упражнения',
      description: '3 тренировки в неделю',
      progress: 40,
      priority: 'high',
      timeFrame: '1 месяц'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold">Цели здоровья</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/50 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {rec.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {rec.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{rec.timeFrame}</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                {rec.priority === 'high' ? 'Высокий' : 
                 rec.priority === 'medium' ? 'Средний' : 'Низкий'}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Прогресс</span>
                  <span>{rec.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${rec.progress}%` }}
                  />
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          Посмотреть все цели
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartGoalRecommendations;
