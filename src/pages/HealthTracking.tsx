
import React from 'react';
import Header from '@/components/Header';
import DynamicHealthScore from '@/components/health-tracking/DynamicHealthScore';
import HealthRecommendationsManager from '@/components/health-recommendations/HealthRecommendationsManager';
import MinimalFooter from '@/components/MinimalFooter';
import { AuthGuard } from '@/components/security/AuthGuard';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { EnhancedSecureApiWrapper } from '@/components/security/EnhancedSecureApiWrapper';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useSecureHealthMetrics } from '@/hooks/useSecureHealthMetrics';
import { EnhancedInputSanitizer } from '@/utils/enhancedInputSanitizer';
import { Moon, Heart, Droplets } from 'lucide-react';
import { useState } from 'react';

interface FormData {
  steps: number;
  exercise_minutes: number;
  activity_level: number;
  sleep_hours: number;
  sleep_quality: number;
  stress_level: number;
  mood_level: number;
  water_intake: number;
  nutrition_quality: number;
  cigarettes_count: number;
  alcohol_units: number;
  notes: string;
}

const SecureHealthTrackingForm: React.FC = () => {
  const { todayMetrics, saveMetrics, isLoading } = useSecureHealthMetrics();
  const [formData, setFormData] = useState<FormData>({
    steps: todayMetrics?.steps || 0,
    exercise_minutes: todayMetrics?.exercise_minutes || 0,
    activity_level: todayMetrics?.activity_level || 5,
    sleep_hours: todayMetrics?.sleep_hours || 8,
    sleep_quality: todayMetrics?.sleep_quality || 5,
    stress_level: todayMetrics?.stress_level || 5,
    mood_level: todayMetrics?.mood_level || 5,
    water_intake: todayMetrics?.water_intake || 8,
    nutrition_quality: todayMetrics?.nutrition_quality || 5,
    cigarettes_count: todayMetrics?.cigarettes_count || 0,
    alcohol_units: todayMetrics?.alcohol_units || 0,
    notes: todayMetrics?.notes || ''
  });

  // Security: Enhanced input validation with bounds checking
  const handleNumericChange = (field: keyof FormData, value: string, min: number, max: number) => {
    try {
      const numValue = parseFloat(value) || 0;
      const validatedValue = EnhancedInputSanitizer.validateHealthMetricSecure(numValue, field);
      setFormData(prev => ({ ...prev, [field]: validatedValue }));
    } catch (error) {
      console.warn('Invalid health metric input:', field, value);
    }
  };

  const handleSliderChange = (field: keyof FormData, values: number[]) => {
    try {
      const validatedValue = EnhancedInputSanitizer.validateHealthMetricSecure(values[0], field);
      setFormData(prev => ({ ...prev, [field]: validatedValue }));
    } catch (error) {
      console.warn('Invalid slider input:', field, values);
    }
  };

  const handleNotesChange = (value: string) => {
    const sanitizedNotes = EnhancedInputSanitizer.sanitizeTextSecure(value, 500);
    setFormData(prev => ({ ...prev, notes: sanitizedNotes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMetrics(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Ежедневные метрики здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Physical Activity Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Физическая активность
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="steps">Шаги</Label>
                <Input
                  id="steps"
                  type="number"
                  min="0"
                  max="50000"
                  value={formData.steps}
                  onChange={(e) => handleNumericChange('steps', e.target.value, 0, 50000)}
                />
              </div>
              <div>
                <Label htmlFor="exercise_minutes">Упражнения (минуты)</Label>
                <Input
                  id="exercise_minutes"
                  type="number"
                  min="0"
                  max="720"
                  value={formData.exercise_minutes}
                  onChange={(e) => handleNumericChange('exercise_minutes', e.target.value, 0, 720)}
                />
              </div>
            </div>
            <div>
              <Label>Уровень активности: {formData.activity_level}</Label>
              <Slider
                value={[formData.activity_level]}
                onValueChange={(values) => handleSliderChange('activity_level', values)}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Sleep Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Сон
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sleep_hours">Часы сна</Label>
                <Input
                  id="sleep_hours"
                  type="number"
                  min="0"
                  max="16"
                  step="0.5"
                  value={formData.sleep_hours}
                  onChange={(e) => handleNumericChange('sleep_hours', e.target.value, 0, 16)}
                />
              </div>
              <div>
                <Label>Качество сна: {formData.sleep_quality}</Label>
                <Slider
                  value={[formData.sleep_quality]}
                  onValueChange={(values) => handleSliderChange('sleep_quality', values)}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Mental Health Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Психическое здоровье
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Уровень стресса: {formData.stress_level}</Label>
                <Slider
                  value={[formData.stress_level]}
                  onValueChange={(values) => handleSliderChange('stress_level', values)}
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
                  onValueChange={(values) => handleSliderChange('mood_level', values)}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Nutrition Section */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Питание и вода
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="water_intake">Вода (стаканов)</Label>
                <Input
                  id="water_intake"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.water_intake}
                  onChange={(e) => handleNumericChange('water_intake', e.target.value, 0, 20)}
                />
              </div>
              <div>
                <Label>Качество питания: {formData.nutrition_quality}</Label>
                <Slider
                  value={[formData.nutrition_quality]}
                  onValueChange={(values) => handleSliderChange('nutrition_quality', values)}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Habits Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Вредные привычки</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cigarettes_count">Сигареты</Label>
                <Input
                  id="cigarettes_count"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.cigarettes_count}
                  onChange={(e) => handleNumericChange('cigarettes_count', e.target.value, 0, 100)}
                />
              </div>
              <div>
                <Label htmlFor="alcohol_units">Алкоголь (единицы)</Label>
                <Input
                  id="alcohol_units"
                  type="number"
                  min="0"
                  max="20"
                  value={formData.alcohol_units}
                  onChange={(e) => handleNumericChange('alcohol_units', e.target.value, 0, 20)}
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Дополнительные заметки о вашем дне..."
              maxLength={500}
              className="mt-1"
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.notes.length}/500 символов
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Сохранение...' : 'Сохранить метрики'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const HealthTracking = () => {
  return (
    <SecurityProvider>
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Header />
          <div className="pt-16 flex-grow">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  Трекинг здоровья
                </h1>
                <p className="text-gray-600">
                  Отслеживайте свое здоровье каждый день и достигайте поставленных целей
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Основная колонка с формой трекинга */}
                <div className="lg:col-span-2 space-y-8">
                  <EnhancedSecureApiWrapper
                    requireAuth={true}
                    rateLimit={{
                      key: 'health_tracking',
                      maxRequests: 10,
                      windowMs: 60000
                    }}
                  >
                    <SecureHealthTrackingForm />
                  </EnhancedSecureApiWrapper>
                  <HealthRecommendationsManager />
                </div>

                {/* Боковая панель с динамическим баллом и прогрессом */}
                <div className="lg:col-span-1">
                  <DynamicHealthScore />
                </div>
              </div>
            </div>
          </div>
          <MinimalFooter />
        </div>
      </AuthGuard>
    </SecurityProvider>
  );
};

export default HealthTracking;
