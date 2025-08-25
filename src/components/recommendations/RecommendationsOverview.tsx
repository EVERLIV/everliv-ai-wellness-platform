import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Utensils, TestTube } from 'lucide-react';

interface RecommendationsOverviewProps {
  recommendations: any;
}

const RecommendationsOverview: React.FC<RecommendationsOverviewProps> = ({ recommendations }) => {
  if (!recommendations) {
    return (
      <div className="bg-surface rounded-lg p-content border-0">
        <div className="pb-content-xs border-b border-border/50">
          <h3 className="text-lg font-semibold text-primary">Обзор рекомендаций</h3>
        </div>
        <div className="pt-content-xs">
          <p className="text-muted-foreground text-center py-4">
            Загрузите данные для получения персонализированных рекомендаций
          </p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'Образ жизни',
      icon: Heart,
      count: recommendations.lifestyle?.length || 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      items: recommendations.lifestyle?.slice(0, 2) || []
    },
    {
      title: 'Физическая активность',
      icon: Activity,
      count: recommendations.lifestyle?.filter(l => l.category === 'exercise')?.length || 0,
      color: 'text-success',
      bgColor: 'bg-success/10',
      items: recommendations.lifestyle?.filter(l => l.category === 'exercise')?.slice(0, 2) || []
    },
    {
      title: 'Питание',
      icon: Utensils,
      count: recommendations.foods?.length || 0,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      items: recommendations.foods?.slice(0, 2) || []
    },
    {
      title: 'Анализы',
      icon: TestTube,
      count: recommendations.labTests?.length || 0,
      color: 'text-info',
      bgColor: 'bg-info/10',
      items: recommendations.labTests?.slice(0, 2) || []
    }
  ];

  return (
    <div className="bg-surface rounded-lg p-content border-0">
      <div className="pb-content-xs border-b border-border/50">
        <h3 className="text-lg font-semibold text-primary">Обзор рекомендаций</h3>
      </div>
      <div className="pt-content-xs space-y-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sections.map((section, index) => (
            <div key={index} className={`p-3 rounded-lg ${section.bgColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <section.icon className={`h-4 w-4 ${section.color}`} />
                <span className="text-sm font-medium text-foreground">{section.title}</span>
              </div>
              <div className={`text-lg font-bold ${section.color}`}>
                {section.count}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-content-xs">
          <h3 className="font-medium text-primary">Ключевые рекомендации</h3>
          <div className="space-y-2">
            {sections.map((section) => 
              section.items.map((item, index) => (
                <div key={`${section.title}-${index}`} className="p-3 bg-surface rounded-lg">
                  <div className="flex items-start gap-2">
                    <section.icon className={`h-4 w-4 ${section.color} flex-shrink-0 mt-0.5`} />
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-medium text-primary">
                        {item.name || item.advice || item.reason || 'Рекомендация'}
                      </h4>
                      <p className="text-xs text-secondary-foreground">
                        {item.reason || item.goal || item.benefit || item.description || 'Подробности рекомендации'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {sections.every(s => s.items.length === 0) && (
              <div className="text-center p-4 text-muted-foreground">
                Рекомендации будут сгенерированы после анализа ваших данных
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsOverview;