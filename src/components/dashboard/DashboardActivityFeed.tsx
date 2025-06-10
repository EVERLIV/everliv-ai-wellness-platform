
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, TrendingDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Activity {
  title: string;
  time: string;
  icon: any;
  iconColor: string;
  iconBg: string;
}

const DashboardActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRecentActivities();
    }
  }, [user]);

  const loadRecentActivities = async () => {
    try {
      setIsLoading(true);
      const recentActivities: Activity[] = [];

      // Загружаем последние анализы
      const { data: analyses, error: analysesError } = await supabase
        .from('medical_analyses')
        .select('created_at, analysis_type')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!analysesError && analyses) {
        analyses.forEach(analysis => {
          const timeAgo = getTimeAgo(analysis.created_at);
          recentActivities.push({
            title: `Анализ "${analysis.analysis_type}" загружен`,
            time: timeAgo,
            icon: FileText,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50"
          });
        });
      }

      // Загружаем последние чаты с ИИ-доктором
      const { data: chats, error: chatsError } = await supabase
        .from('ai_doctor_chats')
        .select('created_at, title')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (!chatsError && chats) {
        chats.forEach(chat => {
          const timeAgo = getTimeAgo(chat.created_at);
          recentActivities.push({
            title: `Консультация с ИИ-доктором`,
            time: timeAgo,
            icon: MessageSquare,
            iconColor: "text-green-500",
            iconBg: "bg-green-50"
          });
        });
      }

      // Сортируем по времени и берем последние 4
      recentActivities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setActivities(recentActivities.slice(0, 4));
    } catch (error) {
      console.error('Error loading activities:', error);
      // Показываем демо данные в случае ошибки
      setActivities([
        {
          title: "Добро пожаловать в EVERLIV",
          time: "Сегодня",
          icon: MessageSquare,
          iconColor: "text-blue-500",
          iconBg: "bg-blue-50"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ч назад`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} дн назад`;
    }
  };

  const parseTimeAgo = (timeStr: string): number => {
    if (timeStr.includes('мин')) {
      return parseInt(timeStr);
    } else if (timeStr.includes('ч')) {
      return parseInt(timeStr) * 60;
    } else if (timeStr.includes('дн')) {
      return parseInt(timeStr) * 1440;
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-blue-500" />
          Последняя активность
        </CardTitle>
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
        ) : activities.length > 0 ? (
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
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Пока нет активности</p>
            <p className="text-xs text-gray-400 mt-1">Начните использовать EVERLIV для отслеживания активности</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardActivityFeed;
