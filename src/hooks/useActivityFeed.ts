
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  type: 'analysis' | 'nutrition' | 'profile' | 'chat';
}

export const useActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Получаем последние анализы
      const { data: analyses } = await supabase
        .from('medical_analyses')
        .select('id, created_at, analysis_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Получаем последние записи о питании
      const { data: foodEntries } = await supabase
        .from('food_entries')
        .select('id, created_at, food_name, meal_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Получаем последние чаты
      const { data: chats } = await supabase
        .from('ai_doctor_chats')
        .select('id, created_at, title')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      // Получаем информацию об обновлении профиля
      const { data: profileUpdates } = await supabase
        .from('health_profiles')
        .select('updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const allActivities: ActivityItem[] = [];

      // Добавляем анализы
      analyses?.forEach(analysis => {
        allActivities.push({
          id: analysis.id,
          title: `Анализ ${analysis.analysis_type === 'blood' ? 'крови' : 'медицинский'} загружен`,
          time: formatTimeAgo(analysis.created_at),
          icon: 'FileText',
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-50',
          type: 'analysis'
        });
      });

      // Добавляем записи о питании
      foodEntries?.forEach(entry => {
        const mealTypeMap = {
          breakfast: 'завтрак',
          lunch: 'обед', 
          dinner: 'ужин',
          snack: 'перекус'
        };
        
        allActivities.push({
          id: entry.id,
          title: `Добавлен ${mealTypeMap[entry.meal_type as keyof typeof mealTypeMap]}: ${entry.food_name}`,
          time: formatTimeAgo(entry.created_at),
          icon: 'Apple',
          iconColor: 'text-green-500',
          iconBg: 'bg-green-50',
          type: 'nutrition'
        });
      });

      // Добавляем чаты
      chats?.forEach(chat => {
        allActivities.push({
          id: chat.id,
          title: `Консультация: ${chat.title}`,
          time: formatTimeAgo(chat.created_at),
          icon: 'MessageSquare',
          iconColor: 'text-purple-500',
          iconBg: 'bg-purple-50',
          type: 'chat'
        });
      });

      // Добавляем обновления профиля
      profileUpdates?.forEach(profile => {
        allActivities.push({
          id: 'profile-update',
          title: 'Профиль здоровья обновлен',
          time: formatTimeAgo(profile.updated_at),
          icon: 'User',
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-50',
          type: 'profile'
        });
      });

      // Сортируем по времени и берем последние 8
      allActivities.sort((a, b) => {
        const timeA = parseTimeForSort(a.time);
        const timeB = parseTimeForSort(b.time);
        return timeA - timeB;
      });

      setActivities(allActivities.slice(0, 8));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return diffMins <= 1 ? 'только что' : `${diffMins} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const parseTimeForSort = (timeStr: string): number => {
    if (timeStr === 'только что') return 0;
    
    const match = timeStr.match(/(\d+)\s*(мин|ч|дн)\s*назад/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      
      switch (unit) {
        case 'мин': return value;
        case 'ч': return value * 60;
        case 'дн': return value * 60 * 24;
        default: return 9999;
      }
    }
    
    return 9999;
  };

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  // Подписываемся на обновления в реальном времени с уникальными именами каналов
  useEffect(() => {
    if (!user) return;

    const channels: any[] = [];

    try {
      // Подписка на анализы
      const analysesChannel = supabase
        .channel(`activity_analyses_${user.id}`) // Убираем Date.now()
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'medical_analyses', filter: `user_id=eq.${user.id}` },
          () => fetchActivities()
        )
        .subscribe();

      // Подписка на записи о питании  
      const foodChannel = supabase
        .channel(`activity_food_${user.id}`) // Убираем Date.now()
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'food_entries', filter: `user_id=eq.${user.id}` },
          () => fetchActivities()
        )
        .subscribe();

      // Подписка на чаты
      const chatsChannel = supabase
        .channel(`activity_chats_${user.id}`) // Убираем Date.now()
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'ai_doctor_chats', filter: `user_id=eq.${user.id}` },
          () => fetchActivities()
        )
        .subscribe();

      // Подписка на профиль
      const profileChannel = supabase
        .channel(`activity_profile_${user.id}`) // Убираем Date.now()
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'health_profiles', filter: `user_id=eq.${user.id}` },
          () => fetchActivities()
        )
        .subscribe();

      channels.push(analysesChannel, foodChannel, chatsChannel, profileChannel);
    } catch (error) {
      console.error('Error setting up realtime subscriptions:', error);
    }

    return () => {
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      });
    };
  }, [user]);

  return {
    activities,
    isLoading,
    fetchActivities
  };
};
