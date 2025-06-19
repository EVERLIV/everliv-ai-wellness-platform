
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BiomarkerTrendChartProps {
  biomarkerName: string;
}

interface TrendData {
  date: string;
  value: number;
  formattedDate: string;
}

const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ biomarkerName }) => {
  const { user } = useAuth();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      if (!user) return;

      try {
        const { data: biomarkers, error } = await supabase
          .from('biomarkers')
          .select(`
            value,
            created_at,
            medical_analyses!inner(
              user_id,
              created_at,
              analysis_type
            )
          `)
          .eq('name', biomarkerName)
          .eq('medical_analyses.user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching trend data:', error);
          return;
        }

        const processedData: TrendData[] = biomarkers
          .filter(b => b.created_at && b.value)
          .map(biomarker => {
            const numericValue = parseFloat(biomarker.value.toString());
            return {
              date: biomarker.created_at,
              value: isNaN(numericValue) ? 0 : numericValue,
              formattedDate: format(new Date(biomarker.created_at), 'dd MMM yyyy', { locale: ru })
            };
          });

        setTrendData(processedData);
      } catch (error) {
        console.error('Error processing trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [biomarkerName, user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Динамика показателя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trendData.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Динамика показателя</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Недостаточно данных для отображения тренда</p>
            <p className="text-xs mt-1">Добавьте еще несколько анализов для отслеживания динамики</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Динамика показателя</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="formattedDate" 
                fontSize={10}
                interval="preserveStartEnd"
              />
              <YAxis fontSize={10} />
              <Tooltip
                labelFormatter={(value) => `Дата: ${value}`}
                formatter={(value: number) => [value, 'Значение']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiomarkerTrendChart;
