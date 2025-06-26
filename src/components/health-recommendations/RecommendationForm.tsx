
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles } from 'lucide-react';
import { RECOMMENDATION_PRESETS, CreateHealthRecommendationInput } from '@/types/healthRecommendations';

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
    status: 'active'
  });
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresetSelect = (presetKey: string) => {
    const preset = RECOMMENDATION_PRESETS[presetKey as keyof typeof RECOMMENDATION_PRESETS];
    if (preset) {
      setFormData({
        ...formData,
        title: preset.title,
        description: preset.description,
        type: preset.type,
        category: preset.category,
      });
      setSelectedPreset(presetKey);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          title: '',
          description: '',
          type: 'custom',
          category: 'fitness',
          priority: 'medium',
          status: 'active'
        });
        setSelectedPreset(null);
      }
    } catch (error) {
      console.error('Ошибка при создании рекомендации:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPresetsByCategory = () => {
    const categories = {
      'Основные': ['steps', 'exercise', 'nutrition', 'sleep', 'stress', 'water'],
      'Долголетие': ['biological_age', 'cardiovascular', 'cognitive', 'musculoskeletal', 'metabolism', 'immunity']
    };

    return Object.entries(categories).map(([categoryName, presets]) => ({
      category: categoryName,
      presets: presets.map(key => ({
        key,
        ...RECOMMENDATION_PRESETS[key as keyof typeof RECOMMENDATION_PRESETS]
      }))
    }));
  };

  return (
    <div className="space-y-6">
      {/* Быстрый выбор */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Готовые шаблоны
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getPresetsByCategory().map(({ category, presets }) => (
              <div key={category}>
                <h4 className="font-medium text-sm text-gray-700 mb-2">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {presets.map(({ key, title, description }) => (
                    <div
                      key={key}
                      onClick={() => handlePresetSelect(key)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-blue-50 ${
                        selectedPreset === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-gray-900">{title}</h5>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
                        </div>
                        {selectedPreset === key && (
                          <Badge className="ml-2">Выбрано</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Форма создания */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Создать рекомендацию</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Введите заголовок рекомендации"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробно опишите рекомендацию"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
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
                <Label htmlFor="priority">Приоритет</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
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

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Создание...' : 'Создать рекомендацию'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationForm;
