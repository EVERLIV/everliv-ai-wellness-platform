
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { Calendar, TrendingUp, ZoomIn, Info } from 'lucide-react';

interface HealthDataPoint {
  date: string;
  value: number;
  normal_min: number;
  normal_max: number;
  status: 'normal' | 'warning' | 'critical';
}

interface InteractiveHealthChartProps {
  title: string;
  data: HealthDataPoint[];
  unit: string;
  parameter: string;
}

const InteractiveHealthChart: React.FC<InteractiveHealthChartProps> = ({
  title,
  data,
  unit,
  parameter
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedPoint, setSelectedPoint] = useState<HealthDataPoint | null>(null);
  const [showNormalRange, setShowNormalRange] = useState(true);

  // Фильтрация данных по периоду
  const filteredData = useMemo(() => {
    const now = new Date();
    const periodDays = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  }, [data, period]);

  // Определение тренда
  const trend = useMemo(() => {
    if (filteredData.length < 2) return 'stable';
    const first = filteredData[0].value;
    const last = filteredData[filteredData.length - 1].value;
    const change = ((last - first) / first) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'improving' : 'declining';
  }, [filteredData]);

  const getTrendColor = (trendType: string) => {
    switch (trendType) {
      case 'improving': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trendType: string) => {
    switch (trendType) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      default: return '➡️';
    }
  };

  const handlePointClick = (data: any) => {
    if (data && data.activePayload) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{new Date(label).toLocaleDateString('ru-RU')}</p>
          <p className="text-blue-600">
            Значение: {payload[0].value} {unit}
          </p>
          <p className="text-sm text-gray-600">
            Норма: {data.normal_min} - {data.normal_max} {unit}
          </p>
          <Badge className={`mt-2 ${
            data.status === 'normal' ? 'bg-green-100 text-green-800' :
            data.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data.status === 'normal' ? 'Норма' :
             data.status === 'warning' ? 'Внимание' : 'Критично'}
          </Badge>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {title}
          </CardTitle>
          <Badge className={getTrendColor(trend)}>
            {getTrendIcon(trend)} 
            {trend === 'improving' ? 'Улучшение' : 
             trend === 'declining' ? 'Ухудшение' : 'Стабильно'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Период:</span>
          </div>
          <div className="flex gap-1">
            {(['week', 'month', 'year'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
                className="text-xs"
              >
                {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNormalRange(!showNormalRange)}
            className="ml-auto text-xs"
          >
            <ZoomIn className="h-3 w-3 mr-1" />
            {showNormalRange ? 'Скрыть норму' : 'Показать норму'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              onClick={handlePointClick}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { 
                  day: '2-digit', 
                  month: '2-digit' 
                })}
                fontSize={12}
              />
              <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Область нормальных значений */}
              {showNormalRange && (
                <>
                  <ReferenceLine 
                    y={filteredData[0]?.normal_min} 
                    stroke="#22c55e" 
                    strokeDasharray="2 2" 
                    opacity={0.7}
                  />
                  <ReferenceLine 
                    y={filteredData[0]?.normal_max} 
                    stroke="#22c55e" 
                    strokeDasharray="2 2" 
                    opacity={0.7}
                  />
                </>
              )}
              
              {/* Основная линия данных */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                dot={{ 
                  fill: '#3b82f6', 
                  strokeWidth: 2, 
                  r: 4,
                  cursor: 'pointer'
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: '#3b82f6',
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Детальная информация о выбранной точке */}
        {selectedPoint && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-900">
                Детали за {new Date(selectedPoint.date).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Значение:</span>
                <span className="ml-2 font-semibold">{selectedPoint.value} {unit}</span>
              </div>
              <div>
                <span className="text-gray-600">Статус:</span>
                <Badge className={`ml-2 text-xs ${
                  selectedPoint.status === 'normal' ? 'bg-green-100 text-green-800' :
                  selectedPoint.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedPoint.status === 'normal' ? 'Норма' :
                   selectedPoint.status === 'warning' ? 'Внимание' : 'Критично'}
                </Badge>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Нормальный диапазон: {selectedPoint.normal_min} - {selectedPoint.normal_max} {unit}
            </div>
          </div>
        )}

        {/* Сводная статистика */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {filteredData.length > 0 ? Math.round(filteredData[filteredData.length - 1].value) : '—'}
            </div>
            <div className="text-xs text-gray-600">Последнее значение</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {filteredData.length > 0 ? 
                Math.round(filteredData.reduce((sum, p) => sum + p.value, 0) / filteredData.length) : '—'}
            </div>
            <div className="text-xs text-gray-600">Среднее значение</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {filteredData.filter(p => p.status === 'normal').length}
            </div>
            <div className="text-xs text-gray-600">Дней в норме</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveHealthChart;
