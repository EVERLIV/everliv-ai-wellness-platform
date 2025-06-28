
import React from "react";
import { Activity, Calendar, User, FileText, Apple, BookOpen, Star } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const QuickActionsCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Быстрые действия
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/nutrition-diary">
            <Button variant="outline" className="w-full justify-start">
              <Apple className="h-4 w-4 mr-2" />
              Дневник питания
            </Button>
          </Link>
          <Link to="/my-recommendations">
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Мои рекомендации
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Мой профиль
            </Button>
          </Link>
          <Link to="/lab-analyses">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Анализ крови
            </Button>
          </Link>
          <Link to="/analytics">
            <Button variant="outline" className="w-full justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Оценка здоровья
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
