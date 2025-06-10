
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface Statistics {
  total: number;
  normal: number;
  attention: number;
}

interface LabAnalysesStatsProps {
  statistics: Statistics;
}

const LabAnalysesStats: React.FC<LabAnalysesStatsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Всего анализов</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">В норме</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.normal}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Требуют внимания</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.attention}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabAnalysesStats;
