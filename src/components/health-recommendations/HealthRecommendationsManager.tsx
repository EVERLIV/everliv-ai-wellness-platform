
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';
import { useHealthRecommendations } from '@/hooks/useHealthRecommendations';
import RecommendationForm from './RecommendationForm';
import RecommendationCard from './RecommendationCard';
import CheckupCard from './CheckupCard';
import ActivityLogger from './ActivityLogger';

const HealthRecommendationsManager: React.FC = () => {
  const { 
    recommendations, 
    checkups, 
    isLoading, 
    createRecommendation,
    getActiveRecommendations,
    getPendingCheckups
  } = useHealthRecommendations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'checkups' | 'activity'>('recommendations');

  const activeRecommendations = getActiveRecommendations();
  const pendingCheckups = getPendingCheckups();
  const overdueCheckups = pendingCheckups.filter(checkup => {
    const today = new Date();
    const scheduledDate = new Date(checkup.scheduled_date);
    return scheduledDate < today;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка рекомендаций...</div>
        </CardContent>
      </Card>
    );
  }

  const handleCreateRecommendation = async (data: any) => {
    const success = await createRecommendation(data);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Система управления здоровьем
            </CardTitle>
            
            {!isFormOpen && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить рекомендацию
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {isFormOpen ? (
            <RecommendationForm
              onSubmit={handleCreateRecommendation}
              onCancel={() => setIsFormOpen(false)}
            />
          ) : (
            <div className="space-y-4">
              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{activeRecommendations.length}</div>
                  <div className="text-sm text-gray-600">Активных рекомендаций</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{pendingCheckups.length}</div>
                  <div className="text-sm text-gray-600">Запланированных чекапов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{overdueCheckups.length}</div>
                  <div className="text-sm text-gray-600">Просроченных чекапов</div>
                </div>
              </div>

              {/* Табы */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'recommendations' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Рекомендации
                    <Badge variant="secondary">{activeRecommendations.length}</Badge>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('checkups')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'checkups' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Чекапы
                    <Badge variant="secondary">{pendingCheckups.length}</Badge>
                    {overdueCheckups.length > 0 && (
                      <Badge variant="destructive">{overdueCheckups.length}</Badge>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-4 py-2 border-b-2 transition-colors ${
                    activeTab === 'activity' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Журнал активности
                  </div>
                </button>
              </div>

              {/* Контент табов */}
              {activeTab === 'recommendations' ? (
                activeRecommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Нет активных рекомендаций
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Создайте рекомендацию для улучшения здоровья
                    </p>
                    <Button onClick={() => setIsFormOpen(true)}>
                      Создать рекомендацию
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeRecommendations.map((recommendation) => (
                      <RecommendationCard
                        key={recommendation.id}
                        recommendation={recommendation}
                      />
                    ))}
                  </div>
                )
              ) : activeTab === 'checkups' ? (
                pendingCheckups.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Нет запланированных чекапов
                    </h3>
                    <p className="text-gray-500">
                      Чекапы будут создаваться автоматически для ваших рекомендаций
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Просроченные чекапы */}
                    {overdueCheckups.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <h3 className="font-semibold text-red-600">Просроченные чекапы</h3>
                        </div>
                        <div className="space-y-4">
                          {overdueCheckups.map((checkup) => (
                            <CheckupCard key={checkup.id} checkup={checkup} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Предстоящие чекапы */}
                    {pendingCheckups.filter(c => new Date(c.scheduled_date) >= new Date()).length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-600">Предстоящие чекапы</h3>
                        </div>
                        <div className="space-y-4">
                          {pendingCheckups
                            .filter(c => new Date(c.scheduled_date) >= new Date())
                            .map((checkup) => (
                              <CheckupCard key={checkup.id} checkup={checkup} />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <ActivityLogger />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRecommendationsManager;
