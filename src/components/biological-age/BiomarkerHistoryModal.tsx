import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { useBiomarkerHistory } from '@/hooks/useBiomarkerHistory';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { getValueStatus } from '@/utils/normalRangeCalculator';

interface BiomarkerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkerId: string;
  biomarkerName: string;
  unit: string;
  normalRange?: { min: number; max: number; optimal?: number };
}

const BiomarkerHistoryModal: React.FC<BiomarkerHistoryModalProps> = ({
  isOpen,
  onClose,
  biomarkerId,
  biomarkerName,
  unit,
  normalRange
}) => {
  const { getBiomarkerHistory } = useBiomarkerHistory();
  const history = getBiomarkerHistory(biomarkerId);
  const [showChart, setShowChart] = React.useState(false);

  // Подготовка данных для графика
  const chartData = history.map((entry, index) => ({
    index: history.length - index,
    value: entry.value,
    date: format(new Date(entry.created_at), 'dd.MM', { locale: ru }),
    fullDate: format(new Date(entry.created_at), 'dd MMM yyyy', { locale: ru })
  })).reverse();

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (Math.abs(diff) < 0.01) return { icon: null, color: 'text-gray-500', text: '=' };
    if (diff > 0) return { 
      icon: <TrendingUp className="h-3 w-3" />, 
      color: 'text-red-500', 
      text: `+${diff.toFixed(2)}` 
    };
    return { 
      icon: <TrendingDown className="h-3 w-3" />, 
      color: 'text-green-500', 
      text: diff.toFixed(2) 
    };
  };

  // Функция для получения статуса значения
  const getValueStatusBadge = (value: number) => {
    if (!normalRange) return { text: 'Данные', color: 'text-muted-foreground' };
    
    const status = getValueStatus(value, normalRange);
    switch (status.status) {
      case 'optimal':
        return { text: 'Норма', color: 'text-green-600' };
      case 'normal':
        return { text: 'Норма', color: 'text-green-600' };
      case 'high':
        return { text: 'Повышен', color: 'text-red-600' };
      case 'low':
        return { text: 'Понижен', color: 'text-blue-600' };
      default:
        return { text: 'Данные', color: 'text-muted-foreground' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader className="pb-2">
          <DialogTitle className="bio-text-small flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            {biomarkerName}
          </DialogTitle>
          <DialogDescription className="bio-text-caption text-muted-foreground">
            История изменений показателя
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="bio-text-small text-muted-foreground">Нет данных</p>
              <p className="bio-text-caption text-muted-foreground mt-1">
                Начните вводить значения для отслеживания
              </p>
            </div>
          ) : (
            <>
              {/* Переключатель вида */}
              <div className="flex gap-1 p-1 bg-muted rounded-md">
                <button
                  onClick={() => setShowChart(false)}
                  className={`flex-1 bio-text-caption px-2 py-1 rounded transition-colors ${
                    !showChart 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Список
                </button>
                <button
                  onClick={() => setShowChart(true)}
                  className={`flex-1 bio-text-caption px-2 py-1 rounded transition-colors flex items-center justify-center gap-1 ${
                    showChart 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BarChart3 className="h-3 w-3" />
                  График
                </button>
              </div>

              {showChart ? (
                /* График */
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          fontSize: '12px', 
                          padding: '8px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: 'hsl(var(--popover))',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                        formatter={(value: any) => [`${value} ${unit}`, 'Значение']}
                        labelFormatter={(label) => {
                          const dataPoint = chartData.find(d => d.date === label);
                          return dataPoint?.fullDate || label;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                /* Список записей */
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.slice(0, 5).map((entry, index) => {
                    const previous = history[index + 1];
                    const trend = previous ? getTrend(entry.value, previous.value) : null;
                    const valueStatus = getValueStatusBadge(entry.value);

                    return (
                      <div 
                        key={entry.id}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="bio-text-small font-medium">
                              {entry.value} {unit}
                            </div>
                            <div className="bio-text-caption text-muted-foreground">
                              {format(new Date(entry.created_at), 'dd MMM', { locale: ru })}
                            </div>
                          </div>
                          {trend && (
                            <div className={`flex items-center gap-1 ${trend.color}`}>
                              {trend.icon}
                              <span className="bio-text-caption font-medium">{trend.text}</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className={`text-[8px] px-0.5 py-0 h-4 ${valueStatus.color}`}>
                          {valueStatus.text}
                        </Badge>
                      </div>
                    );
                  })}
                  {history.length > 5 && (
                    <div className="text-center py-1">
                      <span className="bio-text-caption text-muted-foreground">
                        и еще {history.length - 5} записей
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Статистика */}
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="bio-text-small font-medium text-foreground">{history.length}</div>
                    <div className="bio-text-small text-muted-foreground">записей</div>
                  </div>
                  <div>
                    <div className="bio-text-small font-medium text-foreground">
                      {Math.max(...history.map(h => h.value))} {unit}
                    </div>
                    <div className="bio-text-small text-muted-foreground">макс</div>
                  </div>
                  <div>
                    <div className="bio-text-small font-medium text-foreground">
                      {Math.min(...history.map(h => h.value))} {unit}
                    </div>
                    <div className="bio-text-small text-muted-foreground">мин</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerHistoryModal;