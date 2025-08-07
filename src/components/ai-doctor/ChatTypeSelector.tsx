
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Crown, ChevronRight, Clock, Database, Sparkles, Lock } from "lucide-react";
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

  const chatTypes = [
    {
      icon: MessageCircle,
      title: 'Базовый ИИ-Доктор',
      description: 'Общие медицинские консультации',
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-100',
      onClick: handleBasicChatClick,
      available: true,
      features: ['Общие медицинские консультации', 'Анализ симптомов', 'Ограничено 3 сообщения в день']
    },
    {
      icon: Crown,
      title: 'Премиум ИИ-Доктор',
      description: 'Персонализированные консультации',
      gradient: 'from-amber-500 to-amber-600',
      iconColor: 'text-amber-100',
      onClick: handlePremiumChatClick,
      available: hasPremiumAccess,
      features: ['Доступ к истории анализов', 'Сохранение истории переписки', 'Персонализированные рекомендации', 'Неограниченные сообщения']
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Выберите тип консультации
        </h3>
        <p className="text-sm text-gray-600">
          Доступны два варианта чата с ИИ-доктором в зависимости от вашей подписки
        </p>
      </div>

      {/* Quick Actions Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {chatTypes.map((chatType, index) => (
          <Button
            key={index}
            variant="ghost"
            className="h-auto p-0 group hover:scale-[1.01] transition-all duration-200"
            onClick={chatType.onClick}
          >
            <div className={`
              w-full bg-gradient-to-br ${chatType.gradient} rounded-lg p-4 text-left
              shadow-md hover:shadow-lg transition-all duration-200
              min-h-[80px] relative
              ${!chatType.available ? 'opacity-70' : ''}
            `}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <chatType.icon className={`h-5 w-5 ${chatType.iconColor} flex-shrink-0`} />
                    <h4 className="font-medium text-white text-sm">
                      {chatType.title}
                    </h4>
                    {!chatType.available && (
                      <Lock className="h-3 w-3 text-white/80 ml-1" />
                    )}
                  </div>
                  <p className="text-white/90 text-xs leading-tight mb-2">
                    {chatType.description}
                  </p>
                  <div className="text-xs text-white/70">
                    {chatType.available 
                      ? `${chatType.features.length} функций доступно`
                      : 'Требуется подписка'
                    }
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Features Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {chatTypes.map((chatType, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <chatType.icon className="h-4 w-4 text-gray-600" />
              <h4 className="font-medium text-gray-900 text-sm">{chatType.title}</h4>
              {!chatType.available && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Премиум
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {chatType.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Information Notice */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
        <h4 className="font-medium text-blue-900 mb-1 text-sm">Важная информация</h4>
        <p className="text-blue-800 text-xs">
          Рекомендации ИИ-доктора носят информационный характер и не заменяют 
          консультацию с врачом. Для точной диагностики и лечения обязательно 
          проконсультируйтесь с квалифицированным медицинским специалистом.
        </p>
      </div>
    </div>
  );
};

export default ChatTypeSelector;
