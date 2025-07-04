
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Minus, Calendar, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BiomarkerTrendChartProps {
  biomarkerName: string;
  normalRange?: { min: number; max: number; unit?: string };
}

interface TrendData {
  date: string;
  value: number;
  formattedDate: string;
  shortDate: string;
  status: 'normal' | 'low' | 'high';
}

// Нормальные диапазоны для основных биомаркеров
const NORMAL_RANGES: { [key: string]: { min: number; max: number; unit: string } } = {
  'Эритроциты': { min: 4.0, max: 5.4, unit: '×10¹²/л' },
  'Гемоглобин': { min: 120, max: 160, unit: 'г/л' },
  'Лейкоциты': { min: 4.0, max: 9.0, unit: '×10⁹/л' },
  'Тромбоциты': { min: 150, max: 400, unit: '×10⁹/л' },
  'Глюкоза': { min: 3.3, max: 5.5, unit: 'ммоль/л' },
  'Холестерин': { min: 3.0, max: 5.2, unit: 'ммоль/л' },
  'АЛТ': { min: 10, max: 40, unit: 'Ед/л' },
  'АСТ': { min: 10, max: 40, unit: 'Ед/л' },
  'Креатинин': { min: 60, max: 115, unit: 'мкмоль/л' },
  'Мочевина': { min: 2.5, max: 8.3, unit: 'ммоль/л' },
  'Билирубин общий': { min: 5, max: 21, unit: 'мкмоль/л' }
};

const BiomarkerTrendChart: React.FC<BiomarkerTrendChartProps> = ({ biomarkerName, normalRange }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Получаем нормальный диапазон из пропсов или константы
  const currentNormalRange = normalRange || NORMAL_RANGES[biomarkerName];

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
            const date = new Date(biomarker.created_at);
            
            // Определяем статус относительно нормы
            let status: 'normal' | 'low' | 'high' = 'normal';
            if (currentNormalRange) {
              if (numericValue < currentNormalRange.min) status = 'low';
              else if (numericValue > currentNormalRange.max) status = 'high';
            }
            
            return {
              date: biomarker.created_at,
              value: isNaN(numericValue) ? 0 : numericValue,
              formattedDate: format(date, 'dd MMM yyyy', { locale: ru }),
              shortDate: format(date, isMobile ? 'dd.MM' : 'dd MMM', { locale: ru }),
              status
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Динамика показателя</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Загрузка данных...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (trendData.length < 2) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Динамика показателя</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-8">
            <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">Недостаточно данных для отображения тренда</p>
            <p className="text-xs mt-2">Добавьте еще несколько анализов для отслеживания динамики</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Вычисляем тренд
  const firstValue = trendData[0]?.value;
  const lastValue = trendData[trendData.length - 1]?.value;
  const trendDirection = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'stable';
  const trendPercentage = firstValue ? Math.abs(((lastValue - firstValue) / firstValue) * 100) : 0;

  // Расширяем диапазон Y-оси для лучшего отображения
  const minValue = Math.min(...trendData.map(d => d.value));
  const maxValue = Math.max(...trendData.map(d => d.value));
  const padding = (maxValue - minValue) * 0.2;
  const yAxisDomain = [Math.max(0, minValue - padding), maxValue + padding];

  // Кастомный тултип
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <p className="font-medium text-sm">{data.formattedDate}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Значение:</span>
              <span className="font-semibold">{payload[0].value} {currentNormalRange?.unit}</span>
            </div>
            {currentNormalRange && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Норма:</span>
                <span className="text-xs text-gray-500">
                  {currentNormalRange.min} - {currentNormalRange.max} {currentNormalRange.unit}
                </span>
              </div>
            )}
            <Badge 
              variant={data.status === 'normal' ? 'default' : data.status === 'high' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {data.status === 'normal' ? 'Норма' : data.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
            </Badge>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base font-semibold">Динамика показателя</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {trendDirection === 'up' && (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">+{trendPercentage.toFixed(1)}%</span>
              </div>
            )}
            {trendDirection === 'down' && (
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-xs font-medium">-{trendPercentage.toFixed(1)}%</span>
              </div>
            )}
            {trendDirection === 'stable' && (
              <div className="flex items-center gap-1 text-gray-600">
                <Minus className="h-4 w-4" />
                <span className="text-xs font-medium">Стабильно</span>
              </div>
            )}
          </div>
        </div>
        {currentNormalRange && (
          <div className="mt-2 text-xs text-gray-600">
            Норма: {currentNormalRange.min} - {currentNormalRange.max} {currentNormalRange.unit}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className={`${isMobile ? 'h-80' : 'h-96'} p-4`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={trendData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              
              {/* Область нормальных значений */}
              {currentNormalRange && (
                <ReferenceArea
                  y1={currentNormalRange.min}
                  y2={currentNormalRange.max}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.1}
                  stroke="hsl(var(--primary))"
                  strokeOpacity={0.3}
                  strokeDasharray="2 2"
                />
              )}
              
              <XAxis 
                dataKey="shortDate"
                tick={{ 
                  fontSize: isMobile ? 10 : 12,
                  fill: 'hsl(var(--foreground))'
                }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                interval={isMobile ? 'preserveStartEnd' : 0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              
              <YAxis 
                domain={yAxisDomain}
                tick={{ 
                  fontSize: isMobile ? 10 : 12,
                  fill: 'hsl(var(--foreground))'
                }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                width={isMobile ? 40 : 60}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const colors = {
                    normal: 'hsl(var(--primary))',
                    high: 'hsl(var(--destructive))',
                    low: 'hsl(var(--warning))'
                  };
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isMobile ? 4 : 5}
                      fill={colors[payload.status as keyof typeof colors]}
                      stroke="white"
                      strokeWidth={2}
                      className="drop-shadow-sm"
                    />
                  );
                }}
                activeDot={{ 
                  r: isMobile ? 6 : 8, 
                  stroke: 'hsl(var(--primary))',
                  strokeWidth: 2,
                  fill: 'white',
                  className: 'drop-shadow-md'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Легенда для мобильных устройств */}
        {isMobile && currentNormalRange && (
          <div className="px-4 pb-4 border-t border-border">
            <div className="flex items-center justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary opacity-20"></div>
                <span className="text-muted-foreground">Норма</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Ваши значения</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiomarkerTrendChart;
