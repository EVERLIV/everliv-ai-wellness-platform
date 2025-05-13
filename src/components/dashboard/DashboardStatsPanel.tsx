
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Activity, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";

const DashboardStatsPanel = () => {
  const [stats] = useState({
    biologicalAge: 34,
    chronologicalAge: 38,
    activeProtocols: 3,
    completedProtocols: 12,
    upcomingTests: 2,
    healthScore: 76
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Биологический возраст
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <HeartPulse className="h-5 w-5 text-everliv-500 mr-2" />
            <span className="text-2xl font-bold">
              {stats.biologicalAge} лет
            </span>
            <span className="ml-2 text-sm text-emerald-500">
              (-{stats.chronologicalAge - stats.biologicalAge} лет)
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Активные протоколы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-everliv-500 mr-2" />
            <span className="text-2xl font-bold">{stats.activeProtocols}</span>
            <span className="ml-2 text-sm text-gray-500">
              (Завершено: {stats.completedProtocols})
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Предстоящие анализы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-everliv-500 mr-2" />
            <span className="text-2xl font-bold">{stats.upcomingTests}</span>
            <span className="ml-2 text-sm text-gray-500">через 14 дней</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatsPanel;
