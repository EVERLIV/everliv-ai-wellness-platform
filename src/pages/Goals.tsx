
import React, { useState } from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { usePersonalRecommendations } from "@/hooks/usePersonalRecommendations";
import { useHealthGoals } from "@/hooks/useHealthGoals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Star,
  Heart,
  Dumbbell,
  Moon,
  Brain,
  Apple,
  Shield
} from "lucide-react";

const Goals = () => {
  const { recommendations, isLoading: recommendationsLoading, completeRecommendation, getCompletionPercentage } = usePersonalRecommendations();
  const { goals, activeGoal, isLoading: goalsLoading } = useHealthGoals();
  const [activeTab, setActiveTab] = useState("recommendations");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return <Dumbbell className="h-4 w-4" />;
      case 'nutrition': return <Apple className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'stress': return <Brain className="h-4 w-4" />;
      case 'medical': return <Shield className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'nutrition': return 'bg-green-50 text-green-700 border-green-200';
      case 'sleep': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'stress': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'medical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (recommendationsLoading || goalsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Загрузка целей и рекомендаций...</p>
          </div>
        </div>
        <MinimalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Заголовок */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Цели и рекомендации
            </h1>
            <p className="text-gray-600">
              Отслеживайте прогресс выполнения персональных рекомендаций и достижения целей здоровья
            </p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">{getCompletionPercentage()}%</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Прогресс рекомендаций</h3>
                <Progress value={getCompletionPercentage()} className="h-2 mb-2" />
                <p className="text-sm text-blue-700">
                  Выполнено {recommendations.filter(r => r.is_completed).length} из {recommendations.length}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">{goals.length}</span>
                </div>
                <h3 className="font-semibold text-green-900 mb-1">Активные цели</h3>
                <p className="text-sm text-green-700">
                  {goals.filter(g => g.is_active).length} активных целей
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-900">
                    {recommendations.filter(r => r.priority === 'high' && !r.is_completed).length}
                  </span>
                </div>
                <h3 className="font-semibold text-purple-900 mb-1">Приоритетные задачи</h3>
                <p className="text-sm text-purple-700">Требуют внимания</p>
              </CardContent>
            </Card>
          </div>

          {/* Вкладки */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
              <TabsTrigger value="goals">Цели здоровья</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-6">
              {recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Нет персональных рекомендаций
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Заполните профиль здоровья, чтобы получить персональные рекомендации от ИИ
                    </p>
                    <Button onClick={() => window.location.href = '/health-profile'}>
                      Заполнить профиль
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.map((recommendation) => (
                    <Card key={recommendation.id} className={`transition-all duration-200 ${
                      recommendation.is_completed ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getCategoryColor(recommendation.category)}`}>
                              {getCategoryIcon(recommendation.category)}
                            </div>
                            <div>
                              <CardTitle className={`text-lg ${
                                recommendation.is_completed ? 'line-through text-gray-500' : ''
                              }`}>
                                {recommendation.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={getPriorityColor(recommendation.priority)} className="text-xs">
                                  {recommendation.priority === 'high' ? 'Высокий' : 
                                   recommendation.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                                </Badge>
                                {recommendation.is_completed && (
                                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    Выполнено
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className={`text-gray-600 mb-4 ${
                          recommendation.is_completed ? 'text-gray-400' : ''
                        }`}>
                          {recommendation.description}
                        </p>
                        {!recommendation.is_completed && (
                          <Button 
                            size="sm" 
                            onClick={() => completeRecommendation(recommendation.id)}
                            className="w-full"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Отметить как выполненное
                          </Button>
                        )}
                        {recommendation.is_completed && recommendation.completed_at && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Выполнено {new Date(recommendation.completed_at).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="goals">
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Функция целей здоровья
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Эта функция находится в разработке. Скоро вы сможете устанавливать и отслеживать личные цели здоровья.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MinimalFooter />
    </div>
  );
};

export default Goals;
