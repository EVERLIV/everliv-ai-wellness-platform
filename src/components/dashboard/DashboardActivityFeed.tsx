
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingDown } from "lucide-react";

const activities = [
  {
    title: "Анализ крови загружен",
    time: "2 часа назад",
    icon: FileText,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50"
  },
  {
    title: "Консультация с ИИ-доктором",
    time: "5 часов",
    icon: MessageSquare,
    iconColor: "text-green-500",
    iconBg: "bg-green-50"
  }
];

const DashboardActivityFeed = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-blue-500" />
          Последняя активность
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
