
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HealthGoalsSection: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToRecommendations = () => {
    // Переходим на страницу трекинга здоровья вместо дашборда
    navigate('/health-tracking');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Цели здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Управление целями здоровья
          </h3>
          <p className="text-gray-500 mb-4">
            Создавайте и отслеживайте рекомендации для улучшения здоровья
          </p>
          <Button onClick={handleGoToRecommendations}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Перейти к рекомендациям
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthGoalsSection;
