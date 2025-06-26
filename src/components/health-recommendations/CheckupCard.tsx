
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  Star,
  AlertCircle
} from 'lucide-react';
import { RecommendationCheckup, LONGEVITY_GOALS } from '@/types/healthRecommendations';
import { useHealthRecommendations } from '@/hooks/useHealthRecommendations';

interface CheckupCardProps {
  checkup: RecommendationCheckup;
}

const CheckupCard: React.FC<CheckupCardProps> = ({ checkup }) => {
  const { completeCheckup } = useHealthRecommendations();
  const [isCompleting, setIsCompleting] = useState(false);
  const [rating, setRating] = useState([7]);
  const [result, setResult] = useState('');

  const handleComplete = async () => {
    if (!checkup.id) return;
    
    setIsCompleting(true);
    try {
      await completeCheckup(checkup.id, rating[0], result);
      setResult('');
      setRating([7]);
    } catch (error) {
      console.error('Ошибка завершения чекапа:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getDaysUntil = () => {
    const today = new Date();
    const scheduledDate = new Date(checkup.scheduled_date);
    const diffTime = scheduledDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntil();
  const isOverdue = daysUntil < 0;
  const isToday = daysUntil === 0;

  const getStatusColor = () => {
    if (checkup.status === 'completed') return 'bg-green-50 border-green-200';
    if (isOverdue) return 'bg-red-50 border-red-200';
    if (isToday) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusText = () => {
    if (checkup.status === 'completed') return 'Завершён';
    if (isOverdue) return `Просрочен на ${Math.abs(daysUntil)} дн.`;
    if (isToday) return 'Сегодня';
    return `Через ${daysUntil} дн.`;
  };

  const getRelatedGoalsText = () => {
    if (!checkup.related_goals?.length) return '';
    
    const goalNames = checkup.related_goals.map(goalType => {
      const goalInfo = Object.values(LONGEVITY_GOALS).find(g => g.type === goalType);
      return goalInfo?.title || goalType;
    });
    
    return goalNames.join(', ');
  };

  return (
    <Card className={`${getStatusColor()} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              checkup.status === 'completed' ? 'bg-green-100' :
              isOverdue ? 'bg-red-100' :
              isToday ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              {checkup.status === 'completed' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : isOverdue ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Clock className={`h-4 w-4 ${
                  isToday ? 'text-orange-600' : 'text-blue-600'
                }`} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {checkup.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {checkup.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(checkup.scheduled_date).toLocaleDateString('ru-RU')}</span>
              </div>
              {checkup.related_goals && checkup.related_goals.length > 0 && (
                <div className="text-xs text-gray-500">
                  Связано с: {getRelatedGoalsText()}
                </div>
              )}
            </div>
          </div>
          <Badge variant={
            checkup.status === 'completed' ? 'default' :
            isOverdue ? 'destructive' :
            isToday ? 'secondary' : 'outline'
          }>
            {getStatusText()}
          </Badge>
        </div>

        {checkup.status === 'completed' && checkup.result && (
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Оценка: {checkup.rating}/10</span>
            </div>
            <p className="text-sm text-gray-700">{checkup.result}</p>
          </div>
        )}

        {checkup.status === 'pending' && (isToday || isOverdue) && (
          <div className="mt-4 p-4 bg-white rounded-lg border space-y-4">
            <div>
              <Label className="text-sm font-medium">Результат чекапа</Label>
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Опишите результаты и ваши ощущения..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Оценка прогресса: {rating[0]}/10</Label>
              <div className="mt-2">
                <Slider
                  value={rating}
                  onValueChange={setRating}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              onClick={handleComplete}
              disabled={isCompleting || !result.trim()}
              className="w-full"
            >
              {isCompleting ? 'Завершение...' : 'Завершить чекап'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckupCard;
