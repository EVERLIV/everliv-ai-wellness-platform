import React from 'react';
import { Brain, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AIHealthConsultantProps {
  healthProfile: any;
  analytics: any;
  recommendations: any;
  isLoading: boolean;
}

const AIHealthConsultant: React.FC<AIHealthConsultantProps> = ({ 
  healthProfile, 
  analytics, 
  recommendations, 
  isLoading 
}) => {
  const generateHealthSummary = () => {
    if (!healthProfile || !analytics) return null;

    const age = healthProfile.age || 25;
    const bmi = healthProfile.weight && healthProfile.height 
      ? (healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1)
      : null;
    const healthScore = analytics.healthScore || 75;
    const riskLevel = analytics.riskLevel || 'medium';

    return {
      age,
      bmi,
      healthScore,
      riskLevel,
      summary: `На основе анализа ваших данных (возраст ${age} лет, ИМТ ${bmi}, индекс здоровья ${healthScore}%), я вижу ${riskLevel === 'low' ? 'хорошие показатели' : riskLevel === 'high' ? 'области, требующие внимания' : 'смешанные результаты'}.`
    };
  };

  const getPriorityRecommendations = () => {
    if (!recommendations) return [];
    
    const priorities = [];
    
    // Анализ биомаркеров
    if (recommendations.labTests?.length > 0) {
      const highPriorityTests = recommendations.labTests.filter(test => test.priority === 'high');
      if (highPriorityTests.length > 0) {
        priorities.push({
          type: 'critical',
          title: 'Срочные анализы',
          description: `Рекомендую сдать ${highPriorityTests[0].name} в ближайшее время.`,
          action: highPriorityTests[0].reason
        });
      }
    }

    // Образ жизни
    if (healthProfile?.stressLevel > 7) {
      priorities.push({
        type: 'warning',
        title: 'Управление стрессом',
        description: 'Высокий уровень стресса может негативно влиять на ваше здоровье.',
        action: 'Рекомендую техники релаксации и медитацию.'
      });
    }

    if (healthProfile?.sleepHours < 7) {
      priorities.push({
        type: 'warning',
        title: 'Качество сна',
        description: 'Недостаток сна влияет на восстановление и иммунитет.',
        action: 'Старайтесь спать не менее 7-8 часов в сутки.'
      });
    }

    // Добавки
    if (recommendations.supplements?.length > 0) {
      priorities.push({
        type: 'info',
        title: 'Рекомендуемые добавки',
        description: `Выявлен потенциальный дефицит. Рассмотрите прием ${recommendations.supplements[0].name}.`,
        action: recommendations.supplements[0].benefit
      });
    }

    return priorities.slice(0, 3);
  };

  const summary = generateHealthSummary();
  const priorities = getPriorityRecommendations();

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-content border-0">
        <div className="pb-content-xs border-b border-border/50">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">ИИ-Консультант анализирует...</h3>
          </div>
        </div>
        <div className="pt-content-xs">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="text-sm text-muted-foreground">Анализирую ваши данные о здоровье...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-content border-0">
      <div className="pb-content-xs border-b border-border/50">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">ИИ-Консультант по здоровью</h3>
        </div>
      </div>
      <div className="pt-content-xs space-y-content">
        {/* Дисклеймер */}
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-warning">Важное уведомление</p>
              <p className="text-xs text-secondary-foreground">
                Я — ваш ИИ-ассистент по здоровью. Мои рекомендации основаны на анализе предоставленных данных и не являются диагнозом или заменой консультации с врачом. Перед применением любых рекомендаций проконсультируйтесь со своим лечащим врачом.
              </p>
            </div>
          </div>
        </div>

        {/* Краткое резюме */}
        {summary && (
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Краткое резюме состояния здоровья</h3>
            <p className="text-sm text-secondary-foreground">{summary.summary}</p>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <div className="text-lg font-semibold text-primary">{summary.healthScore}%</div>
                <div className="text-xs text-muted-foreground">Индекс здоровья</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">{summary.bmi}</div>
                <div className="text-xs text-muted-foreground">ИМТ</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${
                summary.riskLevel === 'low' ? 'bg-success/10 text-success' :
                summary.riskLevel === 'high' ? 'bg-destructive/10 text-destructive' :
                'bg-warning/10 text-warning'
              }`}>
                <div className="text-lg font-semibold capitalize">{
                  summary.riskLevel === 'low' ? 'Низкий' :
                  summary.riskLevel === 'high' ? 'Высокий' : 'Средний'
                }</div>
                <div className="text-xs opacity-70">Риск</div>
              </div>
            </div>
          </div>
        )}

        {/* Приоритетные направления */}
        {priorities.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Приоритетные направления для работы</h3>
            <div className="space-y-3">
              {priorities.map((priority, index) => (
                <div key={index} className="space-y-2 p-3 rounded-lg bg-surface">
                  <div className="flex items-start gap-2">
                    {priority.type === 'critical' && <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />}
                    {priority.type === 'warning' && <Clock className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />}
                    {priority.type === 'info' && <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />}
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-medium text-primary">{priority.title}</h4>
                      <p className="text-xs text-secondary-foreground">{priority.description}</p>
                      <p className="text-xs text-muted-foreground italic">{priority.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* План дальнейших действий */}
        <div className="space-y-2">
          <h3 className="font-medium text-primary">План дальнейших действий</h3>
          <div className="space-y-2 text-sm text-secondary-foreground">
            <p>• Рекомендую повторно проанализировать показатели через 3 месяца</p>
            <p>• Обязательно проконсультируйтесь с врачом для постановки диагноза и назначения лечения</p>
            <p>• Следите за динамикой ключевых биомаркеров еженедельно</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHealthConsultant;