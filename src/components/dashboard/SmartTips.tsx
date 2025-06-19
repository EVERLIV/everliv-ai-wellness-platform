
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  X, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Heart,
  Utensils,
  Zap
} from "lucide-react";

interface SmartTipsProps {
  healthProfile?: any;
  recentActivity?: any[];
  pendingTasks?: any[];
}

interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'health' | 'nutrition' | 'exercise' | 'sleep';
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
}

const SmartTips: React.FC<SmartTipsProps> = ({ 
  healthProfile, 
  recentActivity, 
  pendingTasks 
}) => {
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [laterTips, setLaterTips] = useState<string[]>([]);

  // Статические умные подсказки
  const tips: Tip[] = [
    {
      id: '1',
      title: 'Добавьте анализы крови',
      description: 'Загрузите результаты анализов для получения персональных рекомендаций по здоровью',
      category: 'health',
      priority: 'high',
      action: 'Добавить анализы',
      actionLink: '/lab-analyses'
    },
    {
      id: '2', 
      title: 'Заполните профиль здоровья',
      description: 'Укажите свои параметры для более точных рекомендаций',
      category: 'health',
      priority: 'medium',
      action: 'Заполнить профиль',
      actionLink: '/health-profile'
    },
    {
      id: '3',
      title: 'Проверьте уровень витамина D',
      description: 'Зимой особенно важно контролировать уровень витамина D',
      category: 'health', 
      priority: 'medium'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'exercise': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'text-red-600 bg-red-50';
      case 'nutrition': return 'text-green-600 bg-green-50';
      case 'exercise': return 'text-blue-600 bg-blue-50';
      default: return 'text-purple-600 bg-purple-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50/50';
      case 'medium': return 'border-yellow-200 bg-yellow-50/50';
      default: return 'border-gray-200 bg-gray-50/50';
    }
  };

  const handleDismiss = (tipId: string) => {
    setDismissedTips([...dismissedTips, tipId]);
  };

  const handleLater = (tipId: string) => {
    setLaterTips([...laterTips, tipId]);
    setTimeout(() => {
      setLaterTips(prev => prev.filter(id => id !== tipId));
    }, 24 * 60 * 60 * 1000); // Показать снова через 24 часа
  };

  const handleComplete = (tipId: string) => {
    setDismissedTips([...dismissedTips, tipId]);
  };

  const activeTips = tips.filter(tip => 
    !dismissedTips.includes(tip.id) && !laterTips.includes(tip.id)
  );

  if (activeTips.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          Умные подсказки
          <Badge variant="outline" className="ml-auto text-xs">
            {activeTips.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {activeTips.map((tip) => (
            <div
              key={tip.id}
              className={`border rounded-lg p-4 ${getPriorityColor(tip.priority)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${getCategoryColor(tip.category)}`}>
                    {getCategoryIcon(tip.category)}
                  </div>
                  <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(tip.id)}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{tip.description}</p>
              
              <div className="flex items-center gap-2">
                {tip.action && tip.actionLink && (
                  <Button
                    size="sm"
                    onClick={() => {
                      window.location.href = tip.actionLink;
                      handleComplete(tip.id);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {tip.action}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLater(tip.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Позже
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {laterTips.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">
              📅 {laterTips.length} подсказок отложено на завтра
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartTips;
