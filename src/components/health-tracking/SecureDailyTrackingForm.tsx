
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useDailyHealthMetrics } from '@/hooks/useDailyHealthMetrics';
import { Activity, Moon, Heart, Droplets } from 'lucide-react';
import { InputSanitizer } from '@/utils/inputSanitizer';
import { SecureApiWrapper } from '@/components/security/SecureApiWrapper';

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

const SecureDailyTrackingForm: React.FC = () => {
  const { todayMetrics, saveMetrics, isLoading } = useDailyHealthMetrics();
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

  // Security: Input validation with bounds checking
  const validateNumericInput = (value: number, min: number, max: number): number => {
    const sanitized = Math.max(min, Math.min(max, Math.round(value)));
    return isNaN(sanitized) ? min : sanitized;
  };

  const handleNumericChange = (field: keyof FormData, value: string, min: number, max: number) => {
    const numValue = parseFloat(value) || 0;
    const validatedValue = validateNumericInput(numValue, min, max);
    setFormData(prev => ({ ...prev, [field]: validatedValue }));
  };

  const handleSliderChange = (field: keyof FormData, values: number[]) => {
    setFormData(prev => ({ ...prev, [field]: values[0] }));
  };

  const handleNotesChange = (value: string) => {
    // Security: Sanitize text input
    const sanitizedNotes = InputSanitizer.sanitizeText(value);
    const truncatedNotes = sanitizedNotes.slice(0, 500); // Limit length
    setFormData(prev => ({ ...prev, notes: truncatedNotes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security: Final validation before submission
    const sanitizedData = {
      steps: validateNumericInput(formData.steps, 0, 100000),
      exercise_minutes: validateNumericInput(formData.exercise_minutes, 0, 1440),
      activity_level: validateNumericInput(formData.activity_level, 1, 10),
      sleep_hours: validateNumericInput(formData.sleep_hours, 0, 24),
      sleep_quality: validateNumericInput(formData.sleep_quality, 1, 10),
      stress_level: validateNumericInput(formData.stress_level, 1, 10),
      mood_level: validateNumericInput(formData.mood_level, 1, 10),
      water_intake: validateNumericInput(formData.water_intake, 0, 50),
      nutrition_quality: validateNumericInput(formData.nutrition_quality, 1, 10),
      cigarettes_count: validateNumericInput(formData.cigarettes_count, 0, 200),
      alcohol_units: validateNumericInput(formData.alcohol_units, 0, 50),
      notes: InputSanitizer.sanitizeText(formData.notes)
    };

    await saveMetrics(sanitizedData);
  };

  return (
    <SecureApiWrapper requireAuth={true}>
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
                    max="100000"
                    value={formData.steps}
                    onChange={(e) => handleNumericChange('steps', e.target.value, 0, 100000)}
                  />
                </div>
                <div>
                  <Label htmlFor="exercise_minutes">Упражнения (минуты)</Label>
                  <Input
                    id="exercise_minutes"
                    type="number"
                    min="0"
                    max="1440"
                    value={formData.exercise_minutes}
                    onChange={(e) => handleNumericChange('exercise_minutes', e.target.value, 0, 1440)}
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
                    max="24"
                    step="0.5"
                    value={formData.sleep_hours}
                    onChange={(e) => handleNumericChange('sleep_hours', e.target.value, 0, 24)}
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
                    max="50"
                    step="0.5"
                    value={formData.water_intake}
                    onChange={(e) => handleNumericChange('water_intake', e.target.value, 0, 50)}
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
                    max="200"
                    value={formData.cigarettes_count}
                    onChange={(e) => handleNumericChange('cigarettes_count', e.target.value, 0, 200)}
                  />
                </div>
                <div>
                  <Label htmlFor="alcohol_units">Алкоголь (единицы)</Label>
                  <Input
                    id="alcohol_units"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.alcohol_units}
                    onChange={(e) => handleNumericChange('alcohol_units', e.target.value, 0, 50)}
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
    </SecureApiWrapper>
  );
};

export default SecureDailyTrackingForm;
