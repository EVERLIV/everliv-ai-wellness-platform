
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Target } from 'lucide-react';
import { CreateHealthRecommendationInput, RECOMMENDATION_PRESETS } from '@/types/healthRecommendations';

interface RecommendationFormProps {
  onSubmit: (data: CreateHealthRecommendationInput) => Promise<boolean>;
  onCancel: () => void;
}

const RecommendationForm: React.FC<RecommendationFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [formData, setFormData] = useState<CreateHealthRecommendationInput>({
    title: '',
    description: '',
    type: 'custom',
    category: 'fitness',
    priority: 'medium',
    status: 'active'
  });

  const handlePresetSelect = (presetKey: string) => {
    if (presetKey === 'custom') {
      setSelectedPreset('custom');
      setFormData({
        title: '',
        description: '',
        type: 'custom',
        category: 'fitness',
        priority: 'medium',
        status: 'active'
      });
    } else {
      const preset = RECOMMENDATION_PRESETS[presetKey as keyof typeof RECOMMENDATION_PRESETS];
      setSelectedPreset(presetKey);
      setFormData({
        ...preset,
        priority: 'medium',
        status: 'active'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Выбор типа рекомендации */}
      <div>
        <Label className="text-base font-medium mb-3 block">Выберите тип рекомендации</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(RECOMMENDATION_PRESETS).map(([key, preset]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover:bg-gray-50 ${
                selectedPreset === key ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handlePresetSelect(key)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-sm">{preset.title}</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {preset.description}
                </p>
              </CardContent>
            </Card>
          ))}
          <Card 
            className={`cursor-pointer transition-all hover:bg-gray-50 ${
              selectedPreset === 'custom' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handlePresetSelect('custom')}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-sm">Своя рекомендация</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Создать собственную рекомендацию
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Поля формы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Название рекомендации</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Например: Улучшить качество сна"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value: 'fitness' | 'nutrition' | 'sleep' | 'mental' | 'longevity') => 
              setFormData({...formData, category: value})
            }
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание рекомендации</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Подробное описание того, что нужно делать..."
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="priority">Приоритет</Label>
        <Select 
          value={formData.priority} 
          onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => 
            setFormData({...formData, priority: value})
          }
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

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          <Check className="h-4 w-4 mr-2" />
          Создать рекомендацию
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default RecommendationForm;
