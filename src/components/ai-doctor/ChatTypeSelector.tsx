
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
    <div className="px-2 space-y-4">
      {/* Chat Type Cards */}
      <div className="space-y-3">
        {chatTypes.map((chatType, index) => (
          <div
            key={index}
            className={`
              relative rounded-lg p-4 cursor-pointer transition-all duration-200
              bg-gradient-to-br ${chatType.gradient} shadow-md active:scale-95
              ${!chatType.available ? 'opacity-70' : ''}
            `}
            onClick={chatType.onClick}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <chatType.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-base">
                      {chatType.title}
                    </h3>
                    {!chatType.available && (
                      <Lock className="h-4 w-4 text-white/80" />
                    )}
                  </div>
                  <p className="text-white/90 text-sm">
                    {chatType.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-white/70" />
            </div>
            
            {/* Features Preview */}
            <div className="mt-3 flex flex-wrap gap-1">
              {chatType.features.slice(0, 2).map((feature, fIndex) => (
                <span 
                  key={fIndex}
                  className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm"
                >
                  {feature}
                </span>
              ))}
              {chatType.features.length > 2 && (
                <span className="text-xs text-white/60">
                  +{chatType.features.length - 2} еще
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Information Notice */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-1 text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Важная информация
        </h4>
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
