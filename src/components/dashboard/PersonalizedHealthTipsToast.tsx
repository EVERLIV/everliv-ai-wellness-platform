
import React, { useState, useEffect } from "react";
import { usePersonalizedHealthTips } from "@/hooks/usePersonalizedHealthTips";
import { 
  Heart,
  Activity,
  Utensils,
  Moon,
  Brain,
  Shield,
  X
} from "lucide-react";

const PersonalizedHealthTipsToast: React.FC = () => {
  const { tip, isLoading } = usePersonalizedHealthTips();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health': return <Heart className="h-4 w-4" />;
      case 'exercise': return <Activity className="h-4 w-4" />;
      case 'nutrition': return <Utensils className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'stress': return <Brain className="h-4 w-4" />;
      case 'prevention': return <Shield className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'from-red-500 to-red-600';
      case 'exercise': return 'from-blue-500 to-blue-600';
      case 'nutrition': return 'from-green-500 to-green-600';
      case 'sleep': return 'from-purple-500 to-purple-600';
      case 'stress': return 'from-orange-500 to-orange-600';
      case 'prevention': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  useEffect(() => {
    if (!tip || isLoading) return;
    
    // Проверяем, не была ли уже показана эта подсказка
    if (dismissedTips.includes(tip.id)) return;

    // Показываем подсказку через небольшую задержку
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Автоматически скрываем через 5 секунд
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [tip, isLoading, dismissedTips]);

  const handleDismiss = () => {
    if (tip) {
      setDismissedTips(prev => [...prev, tip.id]);
    }
    setIsVisible(false);
  };

  if (!tip || isLoading || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`
          bg-gradient-to-r ${getCategoryColor(tip.category)} text-white
          rounded-lg shadow-lg p-4 max-w-sm
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          hover:scale-105 cursor-pointer
          animate-in slide-in-from-right-full
        `}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-0.5 opacity-90">
              {getCategoryIcon(tip.category)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed">{tip.description}</p>
              {tip.action && (
                <button 
                  className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Действие: ${tip.action}`);
                  }}
                >
                  {tip.action}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors p-1 -mt-1 -mr-1"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedHealthTipsToast;
