
import React, { useState, useEffect } from 'react';
import { LineChart, Activity } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ProtocolChart } from '@/components/protocol/ProtocolChart';
import { useProtocolData } from '@/hooks/useProtocolData';
import { supabase } from '@/integrations/supabase/client';
import { ProtocolWellbeing, ProtocolSupplement } from '@/types/database';

type ChartDataPoint = {
  day: number;
  'Энергия': number;
  'Приём добавок': number;
  date: string;
};

export const AnalyticsView = () => {
  const { id } = useParams();
  const { userId } = useProtocolData(id);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!id || !userId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch wellbeing data
        const { data: wellbeingData, error: wellbeingError } = await supabase
          .from('protocol_wellbeing')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId)
          .order('day', { ascending: true });
        
        if (wellbeingError) throw wellbeingError;
        
        // Fetch supplements data
        const { data: supplementsData, error: supplementsError } = await supabase
          .from('protocol_supplements')
          .select('*')
          .eq('protocol_id', id)
          .eq('user_id', userId);
        
        if (supplementsError) throw supplementsError;
        
        // Process data for chart
        const dataMap = new Map<number, ChartDataPoint>();
        
        // Process wellbeing data
        (wellbeingData as ProtocolWellbeing[]).forEach(record => {
          const date = new Date();
          date.setDate(date.getDate() - (wellbeingData.length - record.day));
          
          dataMap.set(record.day, {
            day: record.day,
            'Энергия': record.energy_level,
            'Приём добавок': 0,
            date: date.toLocaleDateString('ru-RU')
          });
        });
        
        // Process supplements data and calculate completion percentage
        const supplementsByDay = new Map<number, { total: number, taken: number }>();
        
        (supplementsData as ProtocolSupplement[]).forEach(record => {
          if (!supplementsByDay.has(record.day)) {
            supplementsByDay.set(record.day, { total: 0, taken: 0 });
          }
          
          const dayData = supplementsByDay.get(record.day)!;
          dayData.total += 1;
          if (record.taken) {
            dayData.taken += 1;
          }
        });
        
        // Calculate supplements completion percentage and add to chart data
        supplementsByDay.forEach((value, day) => {
          const completion = value.total > 0 ? (value.taken / value.total) * 10 : 0;
          
          if (dataMap.has(day)) {
            const existingData = dataMap.get(day)!;
            existingData['Приём добавок'] = completion;
          } else {
            const date = new Date();
            date.setDate(date.getDate() - 7 + day);
            
            dataMap.set(day, {
              day: day,
              'Энергия': 0,
              'Приём добавок': completion,
              date: date.toLocaleDateString('ru-RU')
            });
          }
        });
        
        // Convert map to array for the chart
        const chartData = Array.from(dataMap.values())
          .sort((a, b) => a.day - b.day);
        
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id, userId]);
  
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Activity size={20} className="mr-2 text-blue-600" />
          Аналитика прогресса
        </h2>
        <div className="py-6 text-center text-gray-500">Загрузка данных аналитики...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Activity size={20} className="mr-2 text-blue-600" />
        Аналитика прогресса
      </h2>
      
      {chartData.length === 0 ? (
        <div className="py-6 text-center text-gray-500">
          Недостаточно данных для аналитики. Отмечайте самочувствие и прием добавок, чтобы увидеть статистику.
        </div>
      ) : (
        <div className="h-64">
          <ProtocolChart 
            data={chartData.map(item => ({
              ...item,
              day: `День ${item.day}`
            }))}
            xAxisKey="day"
          />
        </div>
      )}
    </div>
  );
};
