
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const useHistoricalFoodData = (days: number) => {
  const [data, setData] = useState<DayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days + 1);

        const { data: entries, error } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('entry_date', startDate.toISOString().split('T')[0])
          .lte('entry_date', endDate.toISOString().split('T')[0])
          .order('entry_date', { ascending: true });

        if (error) throw error;

        // Группируем данные по дням
        const groupedData: { [key: string]: DayData } = {};
        
        // Инициализируем все дни
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - days + 1 + i);
          const dateString = date.toISOString().split('T')[0];
          
          groupedData[dateString] = {
            date: date.toLocaleDateString('ru-RU', { 
              day: 'numeric', 
              month: 'short' 
            }),
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
          };
        }

        // Суммируем данные по дням
        entries?.forEach(entry => {
          if (groupedData[entry.entry_date]) {
            groupedData[entry.entry_date].calories += entry.calories;
            groupedData[entry.entry_date].protein += Number(entry.protein);
            groupedData[entry.entry_date].carbs += Number(entry.carbs);
            groupedData[entry.entry_date].fat += Number(entry.fat);
          }
        });

        setData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching historical food data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [days]);

  return { data, isLoading };
};
