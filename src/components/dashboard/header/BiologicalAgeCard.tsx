
import React from "react";
import { Activity } from "lucide-react";

interface BiologicalAgeCardProps {
  biologicalAge: number;
}

const BiologicalAgeCard: React.FC<BiologicalAgeCardProps> = ({ biologicalAge }) => {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 rounded-xl border border-indigo-200/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Биологический возраст</span>
            <p className="text-xs text-gray-500">Рассчитан на основе ваших данных</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {biologicalAge}
          </span>
          <span className="text-lg text-gray-600 ml-1">лет</span>
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeCard;
