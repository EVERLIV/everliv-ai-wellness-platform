
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { CreateHealthRecommendationInput, LONGEVITY_GOALS } from '@/types/healthRecommendations';

interface RecommendationFormProps {
  onSubmit: (data: CreateHealthRecommendationInput) => Promise<boolean>;
  onCancel: () => void;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateHealthRecommendationInput>({
    title: '',
    description: '',
    type: 'custom',
    category: 'fitness',
    priority: 'medium',
    status: 'active',
    longevity_goals: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPresets, setShowPresets] = useState(true);

  const handlePresetSelect = (presetKey: string) => {
    const preset = LONGEVITY_GOALS[presetKey as keyof typeof LONGEVITY_GOALS];
    if (preset) {
      setFormData({
        ...formData,
        title: preset.title,
        description: preset.description,
        type: preset.type,
        category: preset.category,
        longevity_goals: [preset.type],
      });
      setShowPresets(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        title: '',
        description: '',
        type: 'custom',
        category: 'fitness',
        priority: 'medium',
        status: 'active',
        longevity_goals: [],
      });
    }
    setIsSubmitting(false);
  };

  const addLongevityGoal = (goal: string) => {
    if (!formData.longevity_goals?.includes(goal)) {
      setFormData({
        ...formData,
        longevity_goals: [...(formData.longevity_goals || []), goal]
      });
    }
  };

  const removeLongevityGoal = (goal: string) => {
    setFormData({
      ...formData,
      longevity_goals: formData.longevity_goals?.filter(g => g !== goal) || []
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создание новой рекомендации</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {showPresets && (
          <div>
            <h3 className="font-semibold mb-3">Выберите цель долголетия:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(LONGEVITY_GOALS).map(([key, goal]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handlePresetSelect(key)}
                >
                  <div>
                    <div className="font-medium">{goal.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{goal.description.slice(0, 80)}...</div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => setShowPresets(false)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать собственную рекомендацию
              </Button>
            </div>
          </div>
        )}

        {!showPresets && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Название рекомендации</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Увеличить физическую активность"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание рекомендации..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Категория</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">Фитнес</SelectItem>
                    <SelectItem value="nutrition">Питание</SelectItem>
                    <SelectItem value="sleep">Сон</SelectItem>
                    <SelectItem value="mental">Ментальное здоровье</SelectItem>
                    <SelectItem value="longevity">Долголетие</SelectItem>
                    <SelectItem value="cardiovascular">Сердечно-сосудистая система</SelectItem>
                    <SelectItem value="cognitive">Когнитивные функции</SelectItem>
                    <SelectItem value="musculoskeletal">Костно-мышечная система</SelectItem>
                    <SelectItem value="metabolism">Метаболизм</SelectItem>
                    <SelectItem value="immunity">Иммунитет</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Приоритет</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="critical">Критический</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Связанные цели долголетия</Label>
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.longevity_goals?.map((goal) => {
                    const goalInfo = Object.values(LONGEVITY_GOALS).find(g => g.type === goal);
                    return (
                      <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                        {goalInfo?.title || goal}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeLongevityGoal(goal)}
                        />
                      </Badge>
                    );
                  })}
                </div>
                <Select onValueChange={addLongevityGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Добавить цель долголетия" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LONGEVITY_GOALS).map(([key, goal]) => (
                      <SelectItem 
                        key={key} 
                        value={goal.type}
                        disabled={formData.longevity_goals?.includes(goal.type)}
                      >
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
                {isSubmitting ? 'Создание...' : 'Создать рекомендацию'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setShowPresets(true)}
              >
                Вернуться к целям
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationForm;
