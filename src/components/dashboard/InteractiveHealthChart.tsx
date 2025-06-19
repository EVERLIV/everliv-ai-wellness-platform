
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Info, Calendar, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  const [selectedPoint, setSelectedPoint] = useState<HealthDataPoint | null>(null);
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  if (!data || data.length === 0) {
    return (
      <Card className="h-80">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Недостаточно данных для отображения графика</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredData = data.slice(-getDataPointsForRange(timeRange));
  const latestValue = filteredData[filteredData.length - 1];
  const previousValue = filteredData.length > 1 ? filteredData[filteredData.length - 2] : null;
  
  const trend = previousValue ? (latestValue.value > previousValue.value ? 'up' : 
                                latestValue.value < previousValue.value ? 'down' : 'stable') : 'stable';

  function getDataPointsForRange(range: string) {
    switch (range) {
      case '1m': return 4;
      case '3m': return 12;
      case '6m': return 24;
      case '1y': return 48;
      default: return 12;
    }
  }

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'Критично';
      case 'warning': return 'Внимание';
      case 'normal': return 'Норма';
      default: return 'Неизвестно';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />;
      default: return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />;
    }
  };

  const formatTooltipDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: ru });
  };

  return (
    <Card className="h-80 sm:h-96">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm sm:text-base lg:text-lg">{title}</CardTitle>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-xs sm:text-sm font-medium">
                {latestValue?.value} {unit}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 ${getStatusColor(latestValue?.status)}`}>
              {getStatusText(latestValue?.status)}
            </Badge>
          </div>
        </div>

        {/* Мобильно-адаптивные кнопки временных диапазонов */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
          {[
            { key: '1m', label: '1м', fullLabel: '1 месяц' },
            { key: '3m', label: '3м', fullLabel: '3 месяца' },
            { key: '6m', label: '6м', fullLabel: '6 месяцев' },
            { key: '1y', label: '1г', fullLabel: '1 год' }
          ].map(({ key, label, fullLabel }) => (
            <Button
              key={key}
              variant={timeRange === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(key as typeof timeRange)}
              className="text-xs px-2 py-1 h-6 sm:h-8 sm:px-3 sm:py-1.5 min-w-0"
            >
              <span className="sm:hidden">{label}</span>
              <span className="hidden sm:inline">{fullLabel}</span>
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0 sm:pt-2 pb-4">
        <div className="h-44 sm:h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} onClick={handlePointClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd.MM', { locale: ru })}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 10 }}
                domain={['dataMin - 5%', 'dataMax + 5%']}
              />
              <Tooltip 
                labelFormatter={formatTooltipDate}
                formatter={(value: number) => [`${value} ${unit}`, parameter]}
                contentStyle={{ 
                  fontSize: '12px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              />
              
              {/* Линии нормальных значений */}
              {latestValue && (
                <>
                  <ReferenceLine y={latestValue.normal_min} stroke="#22c55e" strokeDasharray="2 2" strokeOpacity={0.6} />
                  <ReferenceLine y={latestValue.normal_max} stroke="#22c55e" strokeDasharray="2 2" strokeOpacity={0.6} />
                </>
              )}
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#1d4ed8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {selectedPoint && (
          <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="font-medium">{formatTooltipDate(selectedPoint.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-semibold">
                  {selectedPoint.value} {unit}
                </span>
                <Badge className={`text-xs ${getStatusColor(selectedPoint.status)}`}>
                  {getStatusText(selectedPoint.status)}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Норма: {selectedPoint.normal_min}-{selectedPoint.normal_max} {unit}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveHealthChart;
