
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCachedAnalytics } from "@/hooks/useCachedAnalytics";

const DashboardActivityFeed = () => {
  const { analytics, isLoading, isGenerating, generateAnalytics } = useCachedAnalytics();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return FileText;
      case 'MessageSquare':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const handleRefresh = () => {
    generateAnalytics();
  };

  const handleGenerateAnalytics = () => {
    generateAnalytics();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-500" />
            Последняя активность
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !analytics || analytics.recentActivities.length === 0 ? (
          <div className="text-center py-4">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 mb-2">Пока нет активности</p>
            <p className="text-xs text-gray-400 mb-4">Начните использовать EVERLIV для отслеживания активности</p>
            <Button 
              size="sm" 
              onClick={handleGenerateAnalytics} 
              disabled={isGenerating}
            >
              {isGenerating ? 'Обновление...' : 'Обновить данные'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.recentActivities.map((activity, index) => {
              const IconComponent = getIconComponent(activity.icon);
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
