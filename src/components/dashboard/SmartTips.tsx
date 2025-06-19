
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSmartTips, SmartTip } from "@/hooks/useSmartTips";
import { 
  Lightbulb, 
  X, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Heart,
  Utensils,
  Zap,
  Cloud,
  Activity,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface SmartTipsProps {
  healthProfile?: any;
  recentActivity?: any[];
  pendingTasks?: any[];
}

const SmartTips: React.FC<SmartTipsProps> = ({ 
  healthProfile, 
  recentActivity, 
  pendingTasks 
}) => {
  const navigate = useNavigate();
  const { tips, isLoading, error, generateTips, shouldRefresh } = useSmartTips();
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [laterTips, setLaterTips] = useState<string[]>([]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <Cloud className="h-4 w-4" />;
      case 'magnetic': return <Sparkles className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'meditation': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'exercise': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weather': return 'text-blue-600 bg-blue-50';
      case 'magnetic': return 'text-purple-600 bg-purple-50';
      case 'health': return 'text-red-600 bg-red-50';
      case 'meditation': return 'text-green-600 bg-green-50';
      case 'nutrition': return 'text-orange-600 bg-orange-50';
      case 'exercise': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'weather': return 'Погода';
      case 'magnetic': return 'Магнитные бури';
      case 'health': return 'Здоровье';
      case 'meditation': return 'Медитация';
      case 'nutrition': return 'Питание';
      case 'exercise': return 'Активность';
      default: return 'Общее';
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
    }, 4 * 60 * 60 * 1000); // Показать снова через 4 часа
  };

  const handleAction = (tip: SmartTip) => {
    handleDismiss(tip.id);
    
    switch (tip.actionType) {
      case 'reminder':
        // Показываем уведомление
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(tip.title, {
            body: tip.description,
            icon: '/favicon.ico'
          });
        }
        break;
      case 'meditation':
        // Можно перенаправить на страницу медитации
        break;
      case 'exercise':
        // Можно перенаправить на страницу упражнений
        break;
      default:
        break;
    }
  };

  const activeTips = tips.filter(tip => 
    !dismissedTips.includes(tip.id) && !laterTips.includes(tip.id)
  );

  // Запрашиваем разрешение на уведомления при первом рендере
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (isLoading && activeTips.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
            <span className="text-purple-700">Генерируем умные подсказки...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && activeTips.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">Ошибка загрузки подсказок</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateTips}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Повторить
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {shouldRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={generateTips}
              className="h-6 w-6 p-0 hover:bg-purple-200 ml-2"
              disabled={isLoading}
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          )}
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
                  <div>
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                    <div className="text-xs text-gray-500 mt-1">
                      {getCategoryName(tip.category)}
                    </div>
                  </div>
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
                {tip.action && (
                  <Button
                    size="sm"
                    onClick={() => handleAction(tip)}
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
              📅 {laterTips.length} подсказок отложено на 4 часа
            </p>
          </div>
        )}
        
        {tips.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Подсказки обновляются каждые 30 минут на основе актуальных данных
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartTips;
