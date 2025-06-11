
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

interface LabAnalysesHeaderProps {
  onAddNewAnalysis: () => void;
  currentMonthAnalysesCount: number;
}

const LabAnalysesHeader: React.FC<LabAnalysesHeaderProps> = ({
  onAddNewAnalysis,
  currentMonthAnalysesCount,
}) => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();

  const getAnalysisLimit = () => {
    if (!subscription || subscription.plan_type === 'basic') return 1;
    if (subscription.plan_type === 'premium') return 15;
    return 1; // default for standard or other plans
  };

  const limit = getAnalysisLimit();
  const hasReachedLimit = currentMonthAnalysesCount >= limit;

  const handleButtonClick = () => {
    if (hasReachedLimit) {
      navigate('/subscription');
      toast.info('Для добавления новых анализов требуется обновление подписки');
    } else {
      onAddNewAnalysis();
    }
  };

  const getButtonText = () => {
    if (hasReachedLimit) {
      return subscription?.plan_type === 'basic' ? 'Обновить подписку' : 'Увеличить лимит';
    }
    return 'Добавить анализ';
  };

  const getButtonIcon = () => {
    if (hasReachedLimit) {
      return <Crown className="h-4 w-4" />;
    }
    return <Plus className="h-4 w-4" />;
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Назад к панели</span>
              <span className="sm:hidden">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Лабораторные анализы
                </h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Использовано {currentMonthAnalysesCount} из {limit} анализов в этом месяце
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button 
              onClick={handleButtonClick}
              className={`gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto ${
                hasReachedLimit 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } text-white`}
              size="sm"
            >
              {getButtonIcon()}
              <span className="sm:hidden">
                {hasReachedLimit ? 'Обновить' : 'Добавить'}
              </span>
              <span className="hidden sm:inline">{getButtonText()}</span>
            </Button>
            
            {hasReachedLimit && (
              <p className="text-xs text-amber-600 text-center">
                Лимит анализов исчерпан
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabAnalysesHeader;
