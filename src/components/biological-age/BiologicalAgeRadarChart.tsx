import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Biomarker } from '@/types/biologicalAge';
import { Heart, Activity, Zap, Shield, Droplets, Brain, Pill, Dna } from 'lucide-react';

interface BiologicalAgeRadarChartProps {
  biomarkers: Biomarker[];
  title?: string;
}

const BiologicalAgeRadarChart: React.FC<BiologicalAgeRadarChartProps> = ({
  biomarkers,
  title = "Профиль здоровья по категориям"
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate category scores
  const getCategoryScore = (category: string) => {
    const categoryBiomarkers = biomarkers.filter(b => 
      b.category === category && b.status === 'filled'
    );
    
    if (categoryBiomarkers.length === 0) return 0;
    
    const scores = categoryBiomarkers.map(biomarker => {
      if (!biomarker.value || !biomarker.normal_range) return 50;
      
      const { min, max, optimal } = biomarker.normal_range;
      const value = biomarker.value;
      
      // Calculate score based on how close to optimal
      if (optimal) {
        const deviation = Math.abs(value - optimal) / optimal;
        if (deviation <= 0.1) return 100;
        if (deviation <= 0.2) return 85;
        if (deviation <= 0.3) return 70;
        return 50;
      }
      
      // Fallback to normal range scoring
      if (value >= min && value <= max) return 80;
      const range = max - min;
      const distanceFromRange = Math.min(
        Math.abs(value - min),
        Math.abs(value - max)
      );
      
      return Math.max(20, 80 - (distanceFromRange / range) * 60);
    });
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getHealthStatus = (score: number) => {
    if (score === 0) return { status: 'Нет данных', color: 'text-gray-500', bgColor: 'bg-gray-100', description: 'Добавьте анализы для оценки' };
    if (score >= 85) return { status: 'Отлично', color: 'text-emerald-600', bgColor: 'bg-emerald-100', description: 'Все показатели в норме' };
    if (score >= 70) return { status: 'Хорошо', color: 'text-green-600', bgColor: 'bg-green-100', description: 'Большинство показателей в норме' };
    if (score >= 50) return { status: 'Внимание', color: 'text-yellow-600', bgColor: 'bg-yellow-100', description: 'Есть отклонения от нормы' };
    return { status: 'Критично', color: 'text-red-600', bgColor: 'bg-red-100', description: 'Требуется консультация врача' };
  };

  const getRecommendation = (categoryId: string, score: number) => {
    if (score === 0) return 'Добавьте анализы для получения рекомендаций';
    
    const recommendations = {
      cardiovascular: score >= 70 ? 'Поддерживайте активный образ жизни' : 'Увеличьте кардио нагрузки и следите за питанием',
      metabolic: score >= 70 ? 'Продолжайте сбалансированное питание' : 'Пересмотрите рацион и контролируйте вес',
      hormonal: score >= 70 ? 'Соблюдайте режим сна и отдыха' : 'Обратитесь к эндокринологу для консультации',
      inflammatory: score >= 70 ? 'Избегайте стрессов и воспалительных продуктов' : 'Включите в рацион омега-3 и антиоксиданты',
      oxidative_stress: score >= 70 ? 'Поддерживайте антиоксидантную защиту' : 'Добавьте витамины С, Е и селен',
      kidney_function: score >= 70 ? 'Поддерживайте водный баланс' : 'Ограничьте соль и белки, пейте больше воды',
      liver_function: score >= 70 ? 'Избегайте алкоголя и жирной пищи' : 'Исключите алкоголь, добавьте гепатопротекторы',
      telomeres_epigenetics: score >= 70 ? 'Продолжайте здоровый образ жизни' : 'Увеличьте физическую активность и качество сна'
    };
    
    return recommendations[categoryId as keyof typeof recommendations] || 'Консультируйтесь с врачом';
  };

  const categories = [
    { 
      id: 'cardiovascular', 
      name: 'Сердечно-сосудистая система',
      icon: Heart,
      color: 'hsl(var(--destructive))'
    },
    { 
      id: 'metabolic', 
      name: 'Метаболизм',
      icon: Activity,
      color: 'hsl(var(--chart-1))'
    },
    { 
      id: 'hormonal', 
      name: 'Гормональная система',
      icon: Zap,
      color: 'hsl(var(--chart-2))'
    },
    { 
      id: 'inflammatory', 
      name: 'Воспалительные маркеры',
      icon: Shield,
      color: 'hsl(var(--chart-3))'
    },
    { 
      id: 'oxidative_stress', 
      name: 'Антиоксидантная защита',
      icon: Droplets,
      color: 'hsl(var(--chart-4))'
    },
    { 
      id: 'kidney_function', 
      name: 'Функция почек',
      icon: Brain,
      color: 'hsl(var(--chart-5))'
    },
    { 
      id: 'liver_function', 
      name: 'Функция печени',
      icon: Pill,
      color: 'hsl(var(--primary))'
    },
    { 
      id: 'telomeres_epigenetics', 
      name: 'Клеточное здоровье',
      icon: Dna,
      color: 'hsl(var(--secondary))'
    }
  ];

  const categoryData = categories.map(category => {
    const score = getCategoryScore(category.id);
    const filledCount = biomarkers.filter(b => 
      b.category === category.id && b.status === 'filled'
    ).length;
    const totalCount = biomarkers.filter(b => b.category === category.id).length;
    
    return {
      ...category,
      score,
      filledCount,
      totalCount,
      healthStatus: getHealthStatus(score),
      recommendation: getRecommendation(category.id, score),
      completeness: totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0
    };
  });

  const overallHealth = () => {
    const validScores = categoryData.filter(cat => cat.score > 0);
    if (validScores.length === 0) return getHealthStatus(0);
    
    const avgScore = validScores.reduce((sum, cat) => sum + cat.score, 0) / validScores.length;
    return getHealthStatus(Math.round(avgScore));
  };

  const totalFilledBiomarkers = biomarkers.filter(b => b.status === 'filled').length;
  const totalBiomarkers = biomarkers.length;
  const overallCompleteness = totalBiomarkers > 0 ? Math.round((totalFilledBiomarkers / totalBiomarkers) * 100) : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Header with overall health status */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${overallHealth().bgColor}`}>
            <div className={`w-3 h-3 rounded-full ${overallHealth().color.replace('text-', 'bg-')}`} />
            <span className={`font-medium ${overallHealth().color}`}>
              {overallHealth().status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {overallHealth().description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Заполнено: {totalFilledBiomarkers} из {totalBiomarkers} показателей ({overallCompleteness}%)
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryData.map((category) => (
            <div
              key={category.id}
              className="border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md"
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${category.healthStatus.bgColor}`}>
                  <category.icon className={`h-4 w-4 ${category.healthStatus.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{category.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold ${category.healthStatus.color}`}>
                      {category.healthStatus.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({category.filledCount}/{category.totalCount})
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={category.completeness} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {category.healthStatus.description}
                </p>
                
                {selectedCategory === category.id && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-xs font-medium mb-1">Рекомендация:</p>
                    <p className="text-xs text-muted-foreground">
                      {category.recommendation}
                    </p>
                    {category.completeness < 100 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Для более точной оценки добавьте недостающие анализы
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary recommendations */}
        {overallCompleteness < 50 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              Недостаточно данных для полной оценки
            </p>
            <p className="text-xs text-yellow-700">
              Добавьте больше анализов для получения детального профиля здоровья и персонализированных рекомендаций
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BiologicalAgeRadarChart;