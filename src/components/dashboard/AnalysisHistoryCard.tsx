
import React from "react";
import { FileBarChart, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AnalysisHistoryCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <FileBarChart className="h-5 w-5 mr-2 text-blue-600" />
          История анализов
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-10 w-10 mx-auto text-gray-300 mb-2" />
          <p>У вас пока нет загруженных анализов</p>
          <Button size="sm" className="mt-4">
            Загрузить результаты
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistoryCard;
