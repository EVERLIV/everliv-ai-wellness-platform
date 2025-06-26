
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Activity, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsPageHeaderProps {
  healthScore: number;
  riskLevel: string;
}

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  healthScore,
  riskLevel
}) => {
  const navigate = useNavigate();

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'низкий':
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'средний':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'высокий':
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'критический':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад к панели</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Аналитика здоровья
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Персональные рекомендации на основе ваших данных здоровья
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="gap-2 w-full sm:w-auto"
              size="sm"
              onClick={() => navigate('/lab-analyses')}
            >
              <TestTube className="h-4 w-4" />
              <span className="sm:hidden">Анализы</span>
              <span className="hidden sm:inline">Мои анализы</span>
            </Button>
            <Button 
              onClick={() => navigate('/health-profile')}
              className="gap-2 bg-primary hover:bg-secondary text-white w-full sm:w-auto"
              size="sm"
            >
              <Activity className="h-4 w-4" />
              <span className="sm:hidden">Профиль</span>
              <span className="hidden sm:inline">Профиль здоровья</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Общий балл</p>
                  <p className="text-gray-900 font-semibold">65.0/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <TestTube className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Анализов</p>
                  <p className="text-gray-900 font-semibold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Биомаркеров</p>
                  <p className="text-gray-900 font-semibold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPageHeader;
