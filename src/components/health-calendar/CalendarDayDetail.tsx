import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  Activity, 
  Moon, 
  Heart, 
  Footprints, 
  Droplets, 
  Utensils, 
  Dumbbell,
  Edit,
  TrendingUp,
  AlertCircle,
  Brain
} from 'lucide-react';
import { useDailyHealthMetrics } from '@/hooks/useDailyHealthMetrics';

interface CalendarDayDetailProps {
  date: Date;
  dayData: any;
  onClose: () => void;
}

export const CalendarDayDetail = ({ date, dayData, onClose }: CalendarDayDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { saveMetrics } = useDailyHealthMetrics();

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, d MMMM yyyy', { locale: ru });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Отлично';
    if (score >= 60) return 'Хорошо';
    if (score >= 40) return 'Удовлетворительно';
    return 'Требует внимания';
  };

  const metrics = [
    {
      icon: Footprints,
      label: 'Шаги',
      value: dayData?.steps || 0,
      target: 10000,
      unit: '',
      color: 'bg-blue-500'
    },
    {
      icon: Moon,
      label: 'Сон',
      value: dayData?.sleep_hours || 0,
      target: 8,
      unit: 'ч',
      color: 'bg-purple-500'
    },
    {
      icon: Droplets,
      label: 'Вода',
      value: dayData?.water_intake || 0,
      target: 8,
      unit: 'ст',
      color: 'bg-cyan-500'
    },
    {
      icon: Dumbbell,
      label: 'Тренировки',
      value: dayData?.exercise_minutes || 0,
      target: 30,
      unit: 'мин',
      color: 'bg-green-500'
    },
    {
      icon: Heart,
      label: 'Настроение',
      value: dayData?.mood_level || 0,
      target: 10,
      unit: '/10',
      color: 'bg-pink-500'
    },
    {
      icon: Activity,
      label: 'Стресс',
      value: dayData?.stress_level || 0,
      target: 5,
      unit: '/10',
      color: 'bg-red-500',
      inverse: true
    }
  ];

  const aiSuggestions = [
    {
      type: 'recommendation',
      message: 'Рекомендуется увеличить количество шагов на 2000 для достижения цели'
    },
    {
      type: 'warning',
      message: 'Недостаточное количество сна может повлиять на восстановление'
    },
    {
      type: 'insight',
      message: 'Ваше настроение коррелирует с физической активностью'
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{formatDate(date)}</span>
            <div className="flex items-center space-x-2">
              {dayData?.healthScore && (
                <Badge 
                  variant="outline" 
                  className={getScoreColor(dayData.healthScore)}
                >
                  {dayData.healthScore}/100 - {getScoreLabel(dayData.healthScore)}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Показатели</TabsTrigger>
            <TabsTrigger value="insights">ИИ Анализ</TabsTrigger>
            <TabsTrigger value="trends">Тренды</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                const progress = metric.inverse 
                  ? ((metric.target - metric.value) / metric.target) * 100
                  : (metric.value / metric.target) * 100;
                
                return (
                  <Card key={metric.label}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center space-x-2 text-sm">
                        <Icon className="h-4 w-4" />
                        <span>{metric.label}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">
                            {metric.value}{metric.unit}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            из {metric.target}{metric.unit}
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {dayData?.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Заметки</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{dayData.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {suggestion.type === 'recommendation' && (
                          <Brain className="h-5 w-5 text-blue-500" />
                        )}
                        {suggestion.type === 'warning' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {suggestion.type === 'insight' && (
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Badge 
                          variant="outline" 
                          className="mb-2 capitalize"
                        >
                          {suggestion.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Недельные тренды</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Анализ трендов за последние 7 дней показывает улучшение в области сна и физической активности.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Активность</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Сон</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Настроение</span>
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};