
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles } from "lucide-react";

interface WelcomeCardProps {
  userName: string;
  healthStatus: string;
  getGreeting: () => string;
  currentDate: string;
  currentTime: string;
  getHealthStatusColor: (status: string) => string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  userName,
  healthStatus,
  getGreeting,
  currentDate,
  currentTime,
  getHealthStatusColor
}) => {
  return (
    <Card className="bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/30 border-0 shadow-2xl shadow-blue-100/20 backdrop-blur-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg shadow-blue-200/50 flex-shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getGreeting()}, {userName}!
                </h2>
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{currentDate} • {currentTime}</span>
              </div>
            </div>
          </div>
          <Badge className={`px-4 py-2 text-sm font-medium rounded-full border-0 shadow-lg flex-shrink-0 ${getHealthStatusColor(healthStatus)}`}>
            {healthStatus === 'не определен' ? 'Анализируем данные' : `Риск: ${healthStatus}`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
