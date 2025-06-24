
import React, { useState, useEffect } from "react";
import { useSmartTips } from "@/hooks/useSmartTips";
import { 
  Cloud,
  Sparkles,
  Heart,
  Activity,
  Utensils,
  Zap,
  X
} from "lucide-react";

interface SmartTipsToastProps {
  healthProfile?: any;
  recentActivity?: any[];
  pendingTasks?: any[];
}

const SmartTipsToast: React.FC<SmartTipsToastProps> = ({ 
  healthProfile, 
  recentActivity, 
  pendingTasks 
}) => {
  const { tips, isLoading } = useSmartTips();
  const [visibleTips, setVisibleTips] = useState<string[]>([]);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <Cloud className="h-4 w-4" />;
      case 'magnetic': return <Sparkles className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'meditation': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'exercise': return <Zap className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weather': return 'from-blue-500 to-blue-600';
      case 'magnetic': return 'from-purple-500 to-purple-600';
      case 'health': return 'from-red-500 to-red-600';
      case 'meditation': return 'from-green-500 to-green-600';
      case 'nutrition': return 'from-orange-500 to-orange-600';
      case 'exercise': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  useEffect(() => {
    if (!tips.length) return;

    const activeTips = tips.filter(tip => 
      !dismissedTips.includes(tip.id) && !visibleTips.includes(tip.id)
    );

    if (activeTips.length === 0) return;

    // Показываем первый доступный совет
    const nextTip = activeTips[0];
    setVisibleTips(prev => [...prev, nextTip.id]);

    // Автоматически скрываем через 5 секунд
    const timer = setTimeout(() => {
      setVisibleTips(prev => prev.filter(id => id !== nextTip.id));
    }, 5000);

    return () => clearTimeout(timer);
  }, [tips, dismissedTips, visibleTips]);

  const handleDismiss = (tipId: string) => {
    setVisibleTips(prev => prev.filter(id => id !== tipId));
    setDismissedTips(prev => [...prev, tipId]);
  };

  if (isLoading || !tips.length) return null;

  const currentVisibleTips = tips.filter(tip => visibleTips.includes(tip.id));

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {currentVisibleTips.map((tip, index) => (
        <div
          key={tip.id}
          className={`
            bg-gradient-to-r ${getCategoryColor(tip.category)} text-white
            rounded-lg shadow-lg p-4 max-w-sm
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
            hover:scale-105 cursor-pointer
          `}
          style={{
            animationDelay: `${index * 100}ms`,
            marginBottom: index > 0 ? '8px' : '0'
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-0.5">
                {getCategoryIcon(tip.category)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                <p className="text-xs opacity-90 leading-relaxed">{tip.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(tip.id)}
              className="text-white/70 hover:text-white transition-colors p-1 -mt-1 -mr-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartTipsToast;
