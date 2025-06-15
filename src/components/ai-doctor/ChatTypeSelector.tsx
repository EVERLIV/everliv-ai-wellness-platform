
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Crown, Sparkles, Clock, Database, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";

const ChatTypeSelector: React.FC = () => {
  const navigate = useNavigate();
  const { canUseFeature } = useSubscription();
  
  const hasBasicAccess = true; // Все пользователи имеют базовый доступ
  const hasPremiumAccess = canUseFeature('personal_ai_doctor');

  console.log('ChatTypeSelector - Premium access:', hasPremiumAccess);

  const handleBasicChatClick = () => {
    navigate("/ai-doctor/basic");
  };

  const handlePremiumChatClick = () => {
    if (hasPremiumAccess) {
      navigate("/ai-doctor/personal");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Выберите тип консультации
        </h2>
        <p className="text-gray-600">
          Доступны два варианта чата с ИИ-доктором в зависимости от вашей подписки
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Базовый чат */}
        <Card className="relative overflow-hidden border-2 hover:border-blue-300 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                Базовый ИИ-Доктор
              </CardTitle>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                Бесплатно
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Получите общие медицинские рекомендации и информацию о здоровье
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span>Общие медицинские консультации</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span>Анализ симптомов</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Ограничено 3 сообщения в день</span>
              </div>
            </div>

            <Button 
              onClick={handleBasicChatClick}
              className="w-full"
              variant="default"
            >
              Начать базовую консультацию
            </Button>
          </CardContent>
        </Card>

        {/* Премиум чат */}
        <Card className={`relative overflow-hidden border-2 transition-colors ${
          hasPremiumAccess 
            ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50" 
            : "hover:border-amber-300"
        }`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-amber-600" />
                Премиум ИИ-Доктор
              </CardTitle>
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                <Crown className="h-3 w-3 mr-1" />
                Премиум
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Персонализированные консультации с доступом к вашим анализам и полной истории
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-green-500" />
                <span>Доступ к истории анализов</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span>Сохранение истории переписки</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span>Персонализированные рекомендации</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-amber-500" />
                <span>Неограниченные сообщения</span>
              </div>
            </div>

            <Button 
              onClick={handlePremiumChatClick}
              className={`w-full ${
                hasPremiumAccess 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                  : ""
              }`}
              variant={hasPremiumAccess ? "default" : "outline"}
            >
              {hasPremiumAccess ? (
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Начать премиум консультацию
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Обновить до премиум
                </div>
              )}
            </Button>
          </CardContent>

          {!hasPremiumAccess && (
            <div className="absolute inset-0 bg-gray-100/20 rounded-lg"></div>
          )}
        </Card>
      </div>

      {/* Информационная секция */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Важная информация</h3>
        <p className="text-blue-800 text-sm">
          Рекомендации ИИ-доктора носят информационный характер и не заменяют 
          консультацию с врачом. Для точной диагностики и лечения обязательно 
          проконсультируйтесь с квалифицированным медицинским специалистом.
        </p>
      </div>
    </div>
  );
};

export default ChatTypeSelector;
