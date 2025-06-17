
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useDailyHealthMetrics } from '@/hooks/useDailyHealthMetrics';
import { Activity, Brain, Droplets, Bed, Heart, Apple } from 'lucide-react';

const DailyTrackingForm: React.FC = () => {
  const { todayMetrics, saveMetrics, isLoading } = useDailyHealthMetrics();
  const [formData, setFormData] = useState({
    steps: 0,
    exercise_minutes: 0,
    activity_level: 5,
    sleep_hours: 8.0,
    sleep_quality: 5,
    stress_level: 5,
    mood_level: 5,
    water_intake: 8.0,
    nutrition_quality: 5,
    cigarettes_count: 0,
    alcohol_units: 0,
    notes: ''
  });

  useEffect(() => {
    if (todayMetrics) {
      setFormData({
        steps: todayMetrics.steps || 0,
        exercise_minutes: todayMetrics.exercise_minutes || 0,
        activity_level: todayMetrics.activity_level || 5,
        sleep_hours: todayMetrics.sleep_hours || 8.0,
        sleep_quality: todayMetrics.sleep_quality || 5,
        stress_level: todayMetrics.stress_level || 5,
        mood_level: todayMetrics.mood_level || 5,
        water_intake: todayMetrics.water_intake || 8.0,
        nutrition_quality: todayMetrics.nutrition_quality || 5,
        cigarettes_count: todayMetrics.cigarettes_count || 0,
        alcohol_units: todayMetrics.alcohol_units || 0,
        notes: todayMetrics.notes || ''
      });
    }
  }, [todayMetrics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMetrics(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Ежедневный трекинг здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Физическая активность */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Физическая активность
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="steps">Шаги</Label>
                <Input
                  id="steps"
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="exercise_minutes">Упражнения (минуты)</Label>
                <Input
                  id="exercise_minutes"
                  type="number"
                  value={formData.exercise_minutes}
                  onChange={(e) => setFormData({...formData, exercise_minutes: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div>
              <Label>Общий уровень активности: {formData.activity_level}</Label>
              <Slider
                value={[formData.activity_level]}
                onValueChange={(value) => setFormData({...formData, activity_level: value[0]})}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Сон */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Сон
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sleep_hours">Часы сна</Label>
                <Input
                  id="sleep_hours"
                  type="number"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({...formData, sleep_hours: parseFloat(e.target.value) || 8.0})}
                />
              </div>
              <div>
                <Label>Качество сна: {formData.sleep_quality}</Label>
                <Slider
                  value={[formData.sleep_quality]}
                  onValueChange={(value) => setFormData({...formData, sleep_quality: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Стресс и настроение */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Стресс и настроение
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Уровень стресса: {formData.stress_level}</Label>
                <Slider
                  value={[formData.stress_level]}
                  onValueChange={(value) => setFormData({...formData, stress_level: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Настроение: {formData.mood_level}</Label>
                <Slider
                  value={[formData.mood_level]}
                  onValueChange={(value) => setFormData({...formData, mood_level: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Питание */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Питание
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="water_intake">Потребление воды (стаканов)</Label>
                <Input
                  id="water_intake"
                  type="number"
                  step="0.5"
                  value={formData.water_intake}
                  onChange={(e) => setFormData({...formData, water_intake: parseFloat(e.target.value) || 8.0})}
                />
              </div>
              <div>
                <Label>Качество питания: {formData.nutrition_quality}</Label>
                <Slider
                  value={[formData.nutrition_quality]}
                  onValueChange={(value) => setFormData({...formData, nutrition_quality: value[0]})}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Вредные привычки */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Вредные привычки
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cigarettes_count">Сигареты</Label>
                <Input
                  id="cigarettes_count"
                  type="number"
                  value={formData.cigarettes_count}
                  onChange={(e) => setFormData({...formData, cigarettes_count: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="alcohol_units">Алкоголь (единицы)</Label>
                <Input
                  id="alcohol_units"
                  type="number"
                  value={formData.alcohol_units}
                  onChange={(e) => setFormData({...formData, alcohol_units: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          {/* Заметки */}
          <div>
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Дополнительные заметки о дне..."
            />
          </div>

          <Button type="submit" className="w-full">
            Сохранить метрики дня
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailyTrackingForm;
