
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HealthProfileQuickView: React.FC = () => {
  const navigate = useNavigate();

  const profileData = {
    completeness: 85,
    age: 32,
    goals: ['Улучшить биологический возраст', 'Оптимизировать сон'],
    lastUpdate: '3 дня назад'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Профиль здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Заполненность профиля */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Заполненность</span>
            <Badge variant={profileData.completeness >= 80 ? 'default' : 'secondary'}>
              {profileData.completeness}%
            </Badge>
          </div>

          {/* Возраст */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Возраст: {profileData.age} лет</span>
          </div>

          {/* Цели */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Активные цели:</span>
            </div>
            <div className="space-y-1">
              {profileData.goals.map((goal, index) => (
                <div key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1">
                  {goal}
                </div>
              ))}
            </div>
          </div>

          {/* Последнее обновление */}
          <div className="text-xs text-gray-500">
            Обновлено: {profileData.lastUpdate}
          </div>

          {/* Кнопка перехода */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate('/health-profile')}
          >
            Редактировать профиль
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthProfileQuickView;
