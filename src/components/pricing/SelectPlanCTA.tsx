
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSmartAuth } from "@/hooks/useSmartAuth";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { ArrowRight } from "lucide-react";

interface SelectPlanCTAProps {
  location?: 'dashboard' | 'homepage' | 'feature';
  className?: string;
}

/**
 * Component that provides a call-to-action button for selecting a subscription plan
 */
export default function SelectPlanCTA({ location = 'dashboard', className = '' }: SelectPlanCTAProps) {
  const navigate = useNavigate();
  const { user } = useSmartAuth();
  const { isTrialActive } = useSubscription();
  
  const handleSelectPlan = () => {
    if (!user) {
      navigate('/signup?redirect=pricing');
      return;
    }
    
    navigate('/pricing');
  };
  
  // Customize text based on location and trial status
  const getButtonText = () => {
    if (!user) {
      return 'Начать бесплатно';
    }
    
    if (isTrialActive) {
      return 'Выбрать тариф';
    }
    
    switch (location) {
      case 'feature':
        return 'Оформить подписку для доступа';
      case 'homepage':
        return 'Смотреть тарифы';
      default:
        return 'Выбрать тарифный план';
    }
  };
  
  return (
    <Button 
      onClick={handleSelectPlan}
      className={`flex items-center gap-2 ${className}`}
      variant={location === 'feature' ? 'outline' : 'default'}
    >
      {getButtonText()}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
