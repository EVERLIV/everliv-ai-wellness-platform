
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, MessageCircle, Star, Users, FileText, Brain, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

const AIDoctorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useSubscription();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleGeneralDoctorClick = () => {
    navigate("/ai-doctor/general");
  };

  const handlePersonalDoctorClick = () => {
    navigate("/ai-doctor/personal");
  };

  const isBasicUser = !subscription || subscription.plan_type === 'basic';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Моя Панель
            </Button>
          </div>

          {/* Main Title */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ИИ-Доктор EVERLIV</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Выберите тип консультации с искусственным интеллектом для получения медицинских рекомендаций
            </p>
          </div>

          {/* Doctor Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* General AI Doctor */}
            <Card className="relative hover:shadow-lg transition-shadow cursor-pointer" onClick={handleGeneralDoctorClick}>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Общий ИИ-Доктор</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">Бесплатно</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Общие медицинские советы без сохранения данных</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Простые вопросы и ответы</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Базовые рекомендации</span>
                </div>
                
                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  Начать базовую консультацию
                </Button>
              </CardContent>
            </Card>

            {/* Personal AI Doctor */}
            <Card className="relative hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-200" onClick={handlePersonalDoctorClick}>
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Персональный ИИ-Доктор</CardTitle>
                <Badge variant="outline" className="w-fit mx-auto text-orange-600 border-orange-300">
                  Рекомендуем
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Сохранение истории переписок и памяти</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Доступ к результатам ваших анализов</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <span className="text-sm text-gray-600">Персонализированные рекомендации</span>
                </div>

                {isBasicUser && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Пробный доступ</span>
                    </div>
                    <p className="text-xs text-orange-700">
                      1 из 3 бесплатных сообщений сегодня
                    </p>
                  </div>
                )}
                
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                  Попробовать (3 сообщения)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Important Info */}
          <Card className="bg-blue-50 border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Важная информация</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    ИИ-консультации не заменяют профессиональную медицинскую помощь. При серьезных симптомах обратитесь к врачу.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-blue-700">
                    <span>• Только рекомендации</span>
                    <span>• Не диагностика</span>
                    <span>• Консультируйтесь с врачом</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIDoctorPage;
