
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface HealthOverviewCardsProps {
  trendsAnalysis: {
    improving: number;
    worsening: number;
    stable: number;
  };
  totalAnalyses: number;
}

const HealthOverviewCards: React.FC<HealthOverviewCardsProps> = ({
  trendsAnalysis,
  totalAnalyses
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                {trendsAnalysis.improving}
              </p>
              <p className="text-sm text-gray-600">Улучшающихся показателей</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">
                {trendsAnalysis.worsening}
              </p>
              <p className="text-sm text-gray-600">Ухудшающихся показателей</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {totalAnalyses}
              </p>
              <p className="text-sm text-gray-600">Всего анализов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthOverviewCards;
