
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, FileText, BarChart3, ChevronRight, BookOpen, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsCardProps {
  isMobile?: boolean;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/30 border-0 shadow-xl shadow-emerald-100/20 backdrop-blur-sm">
        <CardContent className="p-4">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            Быстрые действия
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm"
              onClick={() => navigate('/lab-analyses')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Анализы
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm"
              onClick={() => navigate('/my-recommendations')}
            >
              <Star className="h-4 w-4 mr-2" />
              Мои рекомендации
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/30 border-0 shadow-xl shadow-emerald-100/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg">Быстрые действия</span>
        </h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-between bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm group"
            onClick={() => navigate('/lab-analyses')}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-3" />
              Добавить анализы
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-between bg-white/80 hover:bg-white border-emerald-200 hover:border-emerald-300 text-emerald-700 shadow-sm group"
            onClick={() => navigate('/my-recommendations')}
          >
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-3" />
              Мои рекомендации
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
