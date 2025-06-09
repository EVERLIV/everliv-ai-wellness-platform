
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsSummary = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-700 mb-2">14</div>
          <div className="text-sm text-blue-600">Выше нормального</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-green-700 mb-2">14</div>
          <div className="text-sm text-green-600">В норме</div>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-red-700 mb-2">0</div>
          <div className="text-sm text-red-600">Отклонения</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
