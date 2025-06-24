
import React from "react";
import { Sparkles } from "lucide-react";

interface SubscriptionStatusCardProps {
  currentPlan: string;
  getSubscriptionIcon: () => React.ReactNode;
  getSubscriptionColor: () => string;
}

const SubscriptionStatusCard: React.FC<SubscriptionStatusCardProps> = ({
  currentPlan,
  getSubscriptionIcon,
  getSubscriptionColor
}) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">
            Персональный центр здоровья
          </p>
          <p className="text-sm text-gray-600">Управляйте здоровьем с ИИ</p>
        </div>
      </div>
      <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border shadow-sm flex-shrink-0 ${getSubscriptionColor()}`}>
        {getSubscriptionIcon()}
        <span className="font-medium">{currentPlan}</span>
      </div>
    </div>
  );
};

export default SubscriptionStatusCard;
