
import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AIRecommendationsCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
          Рекомендации AI
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="font-medium">Пройдите оценку биологического возраста</div>
            <div className="text-sm text-gray-600 mt-1">
              Получите персонализированные рекомендации для улучшения здоровья
            </div>
            <Link to="/analytics">
              <Button size="sm" className="mt-2 w-full">
                Начать анализ
              </Button>
            </Link>
          </div>
          <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
            <div className="font-medium">Расшифровка анализа крови</div>
            <div className="text-sm text-gray-600 mt-1">
              Загрузите результаты для AI-анализа и получения рекомендаций
            </div>
            <Link to="/blood-analysis">
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Перейти
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsCard;
