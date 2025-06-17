
import { getTimeAgo, parseTimeAgo } from './timeUtils';

export const generateRecentActivities = (analyses: any[], chats: any[]) => {
  const recentActivities: Array<{
    title: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
  }> = [];

  // Добавляем анализы
  analyses.slice(0, 3).forEach(analysis => {
    const timeAgo = getTimeAgo(analysis.created_at);
    recentActivities.push({
      title: `Анализ крови загружен`,
      time: timeAgo,
      icon: 'FileText',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    });
  });

  // Добавляем чаты
  chats.slice(0, 2).forEach(chat => {
    const timeAgo = getTimeAgo(chat.created_at);
    recentActivities.push({
      title: 'Консультация с ИИ-доктором',
      time: timeAgo,
      icon: 'MessageSquare',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50'
    });
  });

  // Сортируем по времени
  recentActivities.sort((a, b) => {
    const timeA = parseTimeAgo(a.time);
    const timeB = parseTimeAgo(b.time);
    return timeA - timeB;
  });

  return recentActivities.slice(0, 4);
};

export const checkRecentActivity = (analyses: any[]): boolean => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return analyses.some(analysis => 
    new Date(analysis.created_at) > weekAgo
  );
};
