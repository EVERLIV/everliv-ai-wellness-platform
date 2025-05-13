
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Flask, BarChart, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardActionPanel = () => {
  const actions = [
    {
      icon: FileText,
      label: "Добавить новый протокол",
      path: "/protocols/add",
      color: "text-blue-500",
    },
    {
      icon: Flask,
      label: "Загрузить анализы",
      path: "/blood-analysis",
      color: "text-green-500",
    },
    {
      icon: BarChart,
      label: "Отчёт о прогрессе",
      path: "/progress",
      color: "text-purple-500",
    },
    {
      icon: Calendar,
      label: "Запланировать анализы",
      path: "/schedule",
      color: "text-orange-500",
    },
    {
      icon: Users,
      label: "Получить консультацию",
      path: "/consultation",
      color: "text-red-500",
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {actions.map((action, index) => (
            <Link to={action.path} key={index}>
              <Button
                variant="outline"
                className="w-full justify-start mb-2 border-gray-200 hover:border-everliv-100 hover:bg-everliv-50"
              >
                <action.icon className={`h-4 w-4 mr-2 ${action.color}`} />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActionPanel;
