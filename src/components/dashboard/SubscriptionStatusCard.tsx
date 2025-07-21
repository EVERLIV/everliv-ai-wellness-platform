
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Crown, Zap, ArrowUp, Clock, CheckCircle } from "lucide-react";

const SubscriptionStatusCard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    subscription, 
    isLoading, 
    isTrialActive, 
    trialTimeRemaining, 
    currentPlan, 
    hasActiveSubscription,
    isPremiumActive
  } = useSubscription();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSubscriptionDisplay = () => {
    console.log('🎯 SubscriptionStatusCard getSubscriptionDisplay:', { 
      subscription, 
      isPremiumActive,
      currentPlan
    });
    
    // Проверяем премиум подписку
    if (isPremiumActive) {
      console.log('✅ Premium subscription confirmed in status card');
      const expiresAt = new Date(subscription!.expires_at);
      return {
        title: 'Премиум подписка',
        description: `Активна до ${expiresAt.toLocaleDateString('ru-RU')}`,
        gradient: 'from-yellow-400 to-yellow-600',
        icon: <Crown className="h-5 w-5 text-white" />,
        badge: 'premium'
      };
    }
    
    // Проверяем другие активные подписки
    if (subscription && subscription.status === 'active' && new Date(subscription.expires_at) > new Date()) {
      const expiresAt = new Date(subscription.expires_at);
      
      switch (subscription.plan_type) {
        case 'basic':
          console.log('✅ Basic subscription in status card');
          return {
            title: 'Базовая подписка',
            description: `Активна до ${expiresAt.toLocaleDateString('ru-RU')}`,
            gradient: 'from-gray-400 to-gray-600',
            icon: <CheckCircle className="h-5 w-5 text-white" />,
            badge: 'basic'
          };
      }
    }
    
    // Проверяем пробный период
    if (isTrialActive && trialTimeRemaining) {
      console.log('🎯 Trial period in status card:', trialTimeRemaining);
      return {
        title: 'Пробный период',
        description: `Осталось: ${trialTimeRemaining}`,
        gradient: 'from-green-400 to-green-600',
        icon: <Clock className="h-5 w-5 text-white" />,
        badge: 'trial'
      };
    }
    
    console.log('📋 Defaulting to basic plan in status card');
    return {
      title: 'Базовый план',
      description: 'Ограниченный доступ к функциям',
      gradient: 'from-gray-400 to-gray-600',
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      badge: 'basic'
    };
  };

  const subscriptionDisplay = getSubscriptionDisplay();
  const isBasic = subscriptionDisplay.badge === 'basic' || (!isPremiumActive && !hasActiveSubscription);

  console.log('🔍 SubscriptionStatusCard render:', {
    isPremiumActive,
    isBasic,
    shouldShowUpgrade: isBasic
  });

  return (
    <Card className={`bg-gradient-to-r ${subscriptionDisplay.gradient} text-white border-0 shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {subscriptionDisplay.icon}
            <CardTitle className="text-white text-lg">
              {subscriptionDisplay.title}
            </CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            {currentPlan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-white/90 text-sm mb-4">
          {subscriptionDisplay.description}
        </p>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/subscription')}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 flex-1"
          >
            Управление
          </Button>
          
          {isBasic && (
            <Button 
              size="sm"
              onClick={() => navigate('/subscription')}
              className="bg-white text-gray-900 hover:bg-gray-100 flex-1 font-medium"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Улучшить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatusCard;
