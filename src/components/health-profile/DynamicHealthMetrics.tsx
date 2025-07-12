import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Plus, 
  Activity, 
  Weight, 
  Moon, 
  Droplets, 
  Heart, 
  Zap,
  Calendar as CalendarIcon,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { format, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DailyHealthMetrics } from "@/hooks/useDailyHealthMetrics";


interface DynamicHealthMetricsProps {
  metrics: DailyHealthMetrics[];
  isLoading: boolean;
  onMetricsUpdate: () => void;
}

interface MetricFormData {
  date: Date;
  steps?: number;
  exercise_minutes?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  mood_level?: number;
  water_intake?: number;
  weight?: number;
  notes?: string;
}

type MetricKey = 'steps' | 'sleep_hours' | 'exercise_minutes' | 'weight';

const DynamicHealthMetrics: React.FC<DynamicHealthMetricsProps> = ({
  metrics,
  isLoading,
  onMetricsUpdate
}) => {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('steps');
  const [formData, setFormData] = useState<MetricFormData>({
    date: new Date()
  });

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('daily_health_metrics')
        .upsert({
          user_id: user.id,
          date: format(formData.date, 'yyyy-MM-dd'),
          steps: formData.steps,
          exercise_minutes: formData.exercise_minutes,
          sleep_hours: formData.sleep_hours,
          sleep_quality: formData.sleep_quality,
          stress_level: formData.stress_level,
          mood_level: formData.mood_level,
          water_intake: formData.water_intake,
          weight: formData.weight,
          notes: formData.notes
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });

      if (error) throw error;

      toast.success('Показатели сохранены');
      setIsAddDialogOpen(false);
      setFormData({ date: new Date() });
      onMetricsUpdate();
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast.error('Ошибка при сохранении показателей');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChartData = (metricKey: MetricKey) => {
    return metrics
      .filter(m => m[metricKey] !== null && m[metricKey] !== undefined)
      .slice(0, 14)
      .reverse()
      .map(metric => ({
        date: format(new Date(metric.date), 'dd.MM', { locale: ru }),
        value: metric[metricKey] as number,
        fullDate: metric.date
      }));
  };

  const getLatestValue = (metricKey: MetricKey) => {
    const latestMetric = metrics.find(m => m[metricKey] !== null && m[metricKey] !== undefined);
    return latestMetric?.[metricKey];
  };

  const getMetricChange = (metricKey: MetricKey) => {
    const relevantMetrics = metrics.filter(m => m[metricKey] !== null && m[metricKey] !== undefined);
    if (relevantMetrics.length < 2) return null;
    
    const latest = relevantMetrics[0][metricKey] as number;
    const previous = relevantMetrics[1][metricKey] as number;
    
    return ((latest - previous) / previous * 100).toFixed(1);
  };

  const metricCards = [
    {
      key: 'steps' as MetricKey,
      title: 'Шаги',
      icon: Activity,
      unit: 'шагов',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      key: 'sleep_hours' as MetricKey,
      title: 'Сон',
      icon: Moon,
      unit: 'часов',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    },
    {
      key: 'exercise_minutes' as MetricKey,
      title: 'Тренировки',
      icon: Zap,
      unit: 'мин',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      key: 'weight' as MetricKey,
      title: 'Вес',
      icon: Weight,
      unit: 'кг',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Заголовок с кнопкой добавления */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Динамические показатели</h2>
          <p className="text-xs text-gray-600">Отслеживайте изменения ваших показателей здоровья</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1 text-xs h-7">
              <Plus className="h-3 w-3" />
              Добавить
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Добавить показатели здоровья</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Выбор даты */}
              <div className="space-y-2">
                <Label>Дата</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "dd MMMM yyyy", { locale: ru }) : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                      disabled={(date) => date > new Date() || date < subDays(new Date(), 365)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Поля ввода показателей */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Шаги</Label>
                  <Input
                    type="number"
                    value={formData.steps || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      steps: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Часы сна</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.sleep_hours || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      sleep_hours: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    placeholder="7.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Минуты тренировок</Label>
                  <Input
                    type="number"
                    value={formData.exercise_minutes || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      exercise_minutes: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Качество сна (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.sleep_quality || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      sleep_quality: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Уровень стресса (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.stress_level || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      stress_level: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Настроение (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.mood_level || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      mood_level: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="7"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Потребление воды (л)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.water_intake || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      water_intake: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    placeholder="2.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Вес (кг)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      weight: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    placeholder="70.5"
                  />
                </div>
              </div>

              {/* Заметки */}
              <div className="space-y-2">
                <Label>Заметки</Label>
                <Input
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notes: e.target.value || undefined 
                  }))}
                  placeholder="Дополнительные заметки о дне..."
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Карточки с показателями */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {metricCards.map((card) => {
          const latestValue = getLatestValue(card.key);
          const change = getMetricChange(card.key);
          const Icon = card.icon;

          return (
            <Card 
              key={card.key}
              className={cn(
                "cursor-pointer transition-all hover:bg-gray-50",
                selectedMetric === card.key && "bg-gray-100"
              )}
              onClick={() => setSelectedMetric(card.key)}
            >
              <CardContent className="p-2">
                <div className="flex items-center space-x-2">
                  <Icon className={cn("h-3 w-3 flex-shrink-0", card.textColor)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">{card.title}</p>
                    {latestValue !== undefined ? (
                      <div className="flex items-baseline justify-between">
                        <p className={cn("text-xs font-bold truncate", card.textColor)}>
                          {card.key === 'steps' ? latestValue.toLocaleString() : latestValue}{card.unit && <span className="text-xs text-gray-500 ml-1">{card.unit}</span>}
                        </p>
                        {change && (
                          <span className={cn(
                            "text-xs ml-1",
                            parseFloat(change) > 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {parseFloat(change) > 0 ? '+' : ''}{change}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">Нет данных</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* График выбранного показателя */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            График: {metricCards.find(c => c.key === selectedMetric)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {(() => {
            const chartData = getChartData(selectedMetric);
            const selectedCard = metricCards.find(c => c.key === selectedMetric);
            
            if (chartData.length === 0) {
              return (
                <div className="h-32 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs">Нет данных для отображения</p>
                  </div>
                </div>
              );
            }

            return (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
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
                    labelFormatter={(value) => `Дата: ${value}`}
                    formatter={(value) => [value, selectedCard?.unit]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, fill: "#4f46e5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            );
          })()}
        </CardContent>
      </Card>

      {/* Таблица последних записей */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Последние записи</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1 text-xs">Дата</th>
                    <th className="text-left p-1 text-xs">Шаги</th>
                    <th className="text-left p-1 text-xs">Сон</th>
                    <th className="text-left p-1 text-xs">Трен.</th>
                    <th className="text-left p-1 text-xs">Вес</th>
                    <th className="text-left p-1 text-xs">Заметки</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.slice(0, 5).map((metric) => (
                    <tr key={metric.id} className="border-b hover:bg-gray-50">
                      <td className="p-1 text-xs">
                        {format(new Date(metric.date), 'dd.MM', { locale: ru })}
                      </td>
                      <td className="p-1 text-xs">{metric.steps ? metric.steps.toLocaleString() : '—'}</td>
                      <td className="p-1 text-xs">{metric.sleep_hours ? `${metric.sleep_hours}ч` : '—'}</td>
                      <td className="p-1 text-xs">{metric.exercise_minutes ? `${metric.exercise_minutes}м` : '—'}</td>
                      <td className="p-1 text-xs">{metric.weight ? `${metric.weight}кг` : '—'}</td>
                      <td className="p-1 text-xs truncate max-w-20">{metric.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicHealthMetrics;