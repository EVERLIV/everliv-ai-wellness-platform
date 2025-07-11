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

interface DailyMetric {
  id: string;
  date: string;
  steps?: number;
  exercise_minutes?: number;
  weight?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  mood_level?: number;
  water_intake?: number;
  notes?: string;
}

interface DynamicHealthMetricsProps {
  metrics: DailyMetric[];
  isLoading: boolean;
  onMetricsUpdate: () => void;
}

interface MetricFormData {
  date: Date;
  steps?: number;
  exercise_minutes?: number;
  weight?: number;
  sleep_hours?: number;
  sleep_quality?: number;
  stress_level?: number;
  mood_level?: number;
  water_intake?: number;
  notes?: string;
}

type MetricKey = 'weight' | 'steps' | 'sleep_hours' | 'exercise_minutes';

const DynamicHealthMetrics: React.FC<DynamicHealthMetricsProps> = ({
  metrics,
  isLoading,
  onMetricsUpdate
}) => {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('weight');
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
          weight: formData.weight,
          sleep_hours: formData.sleep_hours,
          sleep_quality: formData.sleep_quality,
          stress_level: formData.stress_level,
          mood_level: formData.mood_level,
          water_intake: formData.water_intake,
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
      key: 'weight' as MetricKey,
      title: 'Вес',
      icon: Weight,
      unit: 'кг',
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
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
    }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопкой добавления */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Динамические показатели</h2>
          <p className="text-gray-600">Отслеживайте изменения ваших показателей здоровья</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Добавить показатели
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const latestValue = getLatestValue(card.key);
          const change = getMetricChange(card.key);
          const Icon = card.icon;

          return (
            <Card 
              key={card.key}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedMetric === card.key && `ring-2 ring-${card.color}-500`,
                card.borderColor
              )}
              onClick={() => setSelectedMetric(card.key)}
            >
              <CardContent className={cn("p-4", card.bgColor)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    {latestValue !== undefined ? (
                      <div className="flex items-baseline gap-2">
                        <p className={cn("text-2xl font-bold", card.textColor)}>
                          {card.key === 'steps' ? latestValue.toLocaleString() : latestValue}
                        </p>
                        <span className="text-xs text-gray-500">{card.unit}</span>
                      </div>
                    ) : (
                      <p className="text-lg text-gray-400">Нет данных</p>
                    )}
                    {change && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        parseFloat(change) > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        <TrendingUp className="h-3 w-3" />
                        {parseFloat(change) > 0 ? '+' : ''}{change}%
                      </div>
                    )}
                  </div>
                  <Icon className={cn("h-8 w-8", card.textColor)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* График выбранного показателя */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            График: {metricCards.find(c => c.key === selectedMetric)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const chartData = getChartData(selectedMetric);
            const selectedCard = metricCards.find(c => c.key === selectedMetric);
            
            if (chartData.length === 0) {
              return (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>Нет данных для отображения</p>
                  </div>
                </div>
              );
            }

            return (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    labelFormatter={(value) => `Дата: ${value}`}
                    formatter={(value) => [value, selectedCard?.unit]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#4f46e5" }}
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
          <CardHeader>
            <CardTitle>Последние записи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Дата</th>
                    <th className="text-left p-2">Вес</th>
                    <th className="text-left p-2">Шаги</th>
                    <th className="text-left p-2">Сон</th>
                    <th className="text-left p-2">Тренировки</th>
                    <th className="text-left p-2">Заметки</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.slice(0, 10).map((metric) => (
                    <tr key={metric.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {format(new Date(metric.date), 'dd.MM.yyyy', { locale: ru })}
                      </td>
                      <td className="p-2">{metric.weight ? `${metric.weight} кг` : '—'}</td>
                      <td className="p-2">{metric.steps ? metric.steps.toLocaleString() : '—'}</td>
                      <td className="p-2">{metric.sleep_hours ? `${metric.sleep_hours} ч` : '—'}</td>
                      <td className="p-2">{metric.exercise_minutes ? `${metric.exercise_minutes} мин` : '—'}</td>
                      <td className="p-2">{metric.notes || '—'}</td>
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