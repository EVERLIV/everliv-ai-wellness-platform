
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Clock, 
  CheckCircle, 
  Calendar,
  Star
} from 'lucide-react';
import { RecommendationCheckup } from '@/types/healthRecommendations';
import { useHealthRecommendations } from '@/hooks/useHealthRecommendations';

interface CheckupCardProps {
  checkup: RecommendationCheckup;
}

const CheckupCard: React.FC<CheckupCardProps> = ({ checkup }) => {
  const { completeCheckup } = useHealthRecommendations();
  const [isCompleting, setIsCompleting] = useState(false);
  const [rating, setRating] = useState(5);
  const [result, setResult] = useState('');

  const handleComplete = async () => {
    const success = await completeCheckup(checkup.id!, rating, result);
    if (success) {
      setIsCompleting(false);
    }
  };

  const isOverdue = new Date(checkup.scheduled_date) < new Date();
  const daysUntil = Math.ceil((new Date(checkup.scheduled_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`hover:bg-gray-50 transition-colors ${isOverdue ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              isOverdue ? 'bg-orange-100' : 'bg-blue-100'
            }`}>
              <Clock className={`h-4 w-4 ${isOverdue ? 'text-orange-600' : 'text-blue-600'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {checkup.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                {checkup.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(checkup.scheduled_date).toLocaleDateString('ru-RU')}
                  {daysUntil > 0 && ` (через ${daysUntil} дн.)`}
                  {daysUntil === 0 && ' (сегодня)'}
                  {daysUntil < 0 && ` (просрочен на ${Math.abs(daysUntil)} дн.)`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Просрочен
              </Badge>
            )}
            <Badge 
              variant={checkup.status === 'pending' ? 'secondary' : 'default'}
              className="text-xs"
            >
              {checkup.status === 'pending' ? 'Ожидает' : 
               checkup.status === 'completed' ? 'Завершен' : 'Пропущен'}
            </Badge>
          </div>
        </div>

        {checkup.status === 'pending' && (
          <div className="mt-4">
            {!isCompleting ? (
              <Button 
                size="sm" 
                onClick={() => setIsCompleting(true)}
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Завершить чекап
              </Button>
            ) : (
              <div className="space-y-3 p-3 bg-white rounded-lg border">
                <div>
                  <Label htmlFor="rating" className="text-sm">
                    Оценка прогресса (1-10)
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="result" className="text-sm">
                    Результат и комментарии
                  </Label>
                  <Textarea
                    id="result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="Опишите ваш прогресс и наблюдения..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleComplete} className="flex-1">
                    Сохранить результат
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsCompleting(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {checkup.status === 'completed' && checkup.result && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Результат: {checkup.rating}/10
              </span>
            </div>
            <p className="text-sm text-green-700">{checkup.result}</p>
            {checkup.completed_at && (
              <p className="text-xs text-green-600 mt-1">
                Завершен: {new Date(checkup.completed_at).toLocaleDateString('ru-RU')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckupCard;
