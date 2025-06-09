
import React, { useState, useEffect } from "react";
import { Star, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PersonalAIDoctorChat from "@/components/dashboard/ai-doctor/PersonalAIDoctorChat";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";

const AIDoctorPersonalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // Проверяем доступ к персональному ИИ доктору
  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');
  const messageLimit = 3;
  const remainingMessages = messageLimit - messagesUsed;

  useEffect(() => {
    // Загружаем количество использованных сообщений только для пользователей без премиума
    if (!hasPersonalAIDoctorAccess && user) {
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user?.id}_${today}`;
      const savedMessages = localStorage.getItem(storageKey);
      if (savedMessages) {
        const count = parseInt(savedMessages, 10);
        setMessagesUsed(count);
        setIsLimitReached(count >= messageLimit);
      }
    }
  }, [user?.id, hasPersonalAIDoctorAccess]);

  const handleMessageSent = () => {
    if (!hasPersonalAIDoctorAccess) {
      const newCount = messagesUsed + 1;
      setMessagesUsed(newCount);
      
      const today = new Date().toDateString();
      const storageKey = `ai_doctor_messages_${user?.id}_${today}`;
      localStorage.setItem(storageKey, newCount.toString());
      
      if (newCount >= messageLimit) {
        setIsLimitReached(true);
      }
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        {!hasPersonalAIDoctorAccess && (
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Компактный заголовок страницы */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Персональный ИИ-Доктор EVERLIV</h1>
                    <p className="text-sm text-gray-600">
                      {hasPersonalAIDoctorAccess ? "Неограниченные консультации" : `${remainingMessages} сообщений осталось`}
                    </p>
                  </div>
                </div>

                {hasPersonalAIDoctorAccess ? (
                  <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Премиум
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">
                    Пробная версия
                  </Badge>
                )}
              </div>

              {/* Status Alert for Basic Users */}
              <Alert className="mb-4 bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200">
                <Crown className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm">
                  {isLimitReached ? (
                    <div>
                      <p className="font-medium text-orange-800 mb-1">Лимит сообщений исчерпан</p>
                      <p className="text-orange-700 text-xs">
                        Обновите подписку для неограниченного доступа к персональному ИИ-доктору
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-orange-800 mb-1">
                        Осталось {remainingMessages} из {messageLimit} бесплатных сообщений сегодня
                      </p>
                      <p className="text-orange-700 text-xs">
                        Я помню нашу историю общения и имею доступ к вашим анализам
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          {!hasPersonalAIDoctorAccess && isLimitReached ? (
            <div className="h-full flex items-center justify-center p-4">
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Лимит сообщений исчерпан</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                    Вы использовали все бесплатные сообщения на сегодня. Обновите подписку для продолжения консультаций.
                  </p>
                  <Button onClick={() => navigate("/pricing")} className="bg-gradient-to-r from-purple-600 to-orange-500">
                    Обновить подписку
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <PersonalAIDoctorChat 
              onBack={() => navigate("/ai-doctor")}
            />
          )}
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorPersonalPage;
