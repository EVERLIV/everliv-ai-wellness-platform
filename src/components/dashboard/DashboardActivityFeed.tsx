
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingDown, RefreshCw, Apple, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivityFeed } from "@/hooks/useActivityFeed";

const DashboardActivityFeed = () => {
  const { activities, isLoading, fetchActivities } = useActivityFeed();

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return FileText;
      case 'MessageSquare':
        return MessageSquare;
      case 'Apple':
        return Apple;
      case 'User':
        return User;
      default:
        return MessageSquare;
    }
  };

  const handleRefresh = () => {
    fetchActivities();
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
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Загружаем данные...</p>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 mb-2">Пока нет активности</p>
            <p className="text-xs text-gray-400 mb-4">
              Начните использовать EVERLIV: загрузите анализы, заполните дневник питания или обновите профиль здоровья
            </p>
            <Button 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
            >
              {isLoading ? 'Обновление...' : 'Обновить данные'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = getIconComponent(activity.icon);
              return (
                <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`h-4 w-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
            
            {activities.length > 0 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-400">
                  Показаны последние {activities.length} действий
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
