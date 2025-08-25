import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  Apple, 
  Dumbbell, 
  Moon, 
  ClipboardList,
  TrendingUp,
  RefreshCw,
  Loader2,
  TestTube,
  Activity,
  Heart
} from 'lucide-react';
import { CachedAnalytics } from '@/types/analytics';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalAIConsultantProps {
  analytics: CachedAnalytics;
  healthProfile: any;
}

interface AIConsultationResponse {
  overallHealthScore: number;
  biologicalAge: number;
  overallAssessment: string;
  keyFindings: string[];
  personalizedRecommendations: string[];
  disclaimers: string[];
}

const PersonalAIConsultant: React.FC<PersonalAIConsultantProps> = ({
  analytics,
  healthProfile
}) => {
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<AIConsultationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateConsultation = async () => {
    if (!analytics || !healthProfile || !user) {
      setError('Недостаточно данных для консультации');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Подготавливаем данные для анализа
      const consultationData = {
        healthScore: analytics.healthScore,
        riskLevel: analytics.riskLevel,
        goals: healthProfile.healthGoals || [],
        age: healthProfile.age,
        gender: healthProfile.gender,
        weight: healthProfile.weight,
        height: healthProfile.height,
        exerciseFrequency: healthProfile.exerciseFrequency,
        sleepHours: healthProfile.sleepHours,
        stressLevel: healthProfile.stressLevel,
        medicalConditions: healthProfile.medicalConditions || [],
        allergies: healthProfile.allergies || [],
        lastUpdated: analytics.lastUpdated
      };

      // Создаем персонализированную консультацию на основе данных
      const mockConsultation: AIConsultationResponse = {
        overallHealthScore: consultationData.healthScore,
        biologicalAge: Math.max(20, consultationData.age - (consultationData.healthScore > 80 ? 5 : 0)),
        overallAssessment: generateCurrentAnalysis(consultationData),
        keyFindings: generateKeyFindings(consultationData),
        personalizedRecommendations: [
          ...generateNutritionRecommendations(consultationData), 
          ...generateActivityRecommendations(consultationData), 
          ...generateLifestyleRecommendations(consultationData)
        ],
        disclaimers: [
          'ВАЖНЫЙ ДИСКЛЕЙМЕР: Данная информация носит исключительно информационный характер и не является медицинской консультацией.',
          'ОБЯЗАТЕЛЬНО обратитесь к квалифицированному врачу для интерпретации результатов анализов и составления плана лечения.',
          'Все рекомендации основаны на научных исследованиях, но требуют индивидуальной оценки специалиста.',
          'При критических отклонениях биомаркеров немедленно обратитесь к врачу.',
          'Регулярно контролируйте показатели и корректируйте план вместе с медицинским специалистом.'
        ]
      };

      setConsultation(mockConsultation);
    } catch (err) {
      setError('Ошибка при генерации консультации');
      console.error('Consultation generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Вспомогательные функции для генерации рекомендаций
  const generateCurrentAnalysis = (data: any): string => {
    const bmi = data.weight / Math.pow(data.height / 100, 2);
    const bmiStatus = bmi < 18.5 ? 'недостаточный вес' : 
                     bmi < 25 ? 'нормальный вес' : 
                     bmi < 30 ? 'избыточный вес' : 'ожирение';
    
    return `Ваш текущий показатель здоровья составляет ${data.healthScore}/100 (${data.riskLevel}). ИМТ: ${bmi.toFixed(1)} (${bmiStatus}). Средний сон: ${data.sleepHours}ч, активность: ${data.exerciseFrequency} раз/неделю, уровень стресса: ${data.stressLevel}/10.`;
  };

  const generateGoalsAssessment = (data: any): string => {
    const allGoals: string[] = data.goals || [];
    
    if (allGoals.length === 0) {
      return 'Рекомендуется определить конкретные цели для более эффективного планирования.';
    }
    
    const goalTranslations: Record<string, string> = {
      'weight_loss': 'снижение веса',
      'muscle_gain': 'набор мышечной массы',
      'cardiovascular': 'улучшение сердечно-сосудистого здоровья',
      'energy_boost': 'повышение энергии',
      'sleep_improvement': 'улучшение сна',
      'biological_age': 'биологический возраст',
      'cognitive': 'когнитивное здоровье',
      'musculoskeletal': 'опорно-двигательная система',
      'metabolism': 'метаболизм',
      'stress_reduction': 'снижение стресса',
      'immunity_boost': 'укрепление иммунитета',
      'longevity': 'увеличение продолжительности жизни',
      'hormonal_balance': 'гормональный баланс',
      'digestive_health': 'здоровье пищеварения',
      'skin_health': 'здоровье кожи',
      'metabolic_health': 'метаболическое здоровье',
      'bone_health': 'здоровье костей',
      'mental_health': 'психическое здоровье',
      'detox': 'детоксикация организма',
      'athletic_performance': 'спортивные результаты'
    };
    
    const translatedGoals = allGoals.map((goal: string) => goalTranslations[goal] || goal);
    
    if (translatedGoals.length === 1) {
      return `Ваша цель: ${translatedGoals[0]}. Это реалистичная цель, которую можно достичь за 3-6 месяцев при правильном подходе.`;
    } else {
      const primaryGoals = translatedGoals.slice(0, 3).join(', ');
      const additionalCount = Math.max(0, translatedGoals.length - 3);
      return `Ваши цели: ${primaryGoals}${additionalCount > 0 ? ` и еще ${additionalCount}` : ''}. Комплексный подход к достижению этих целей повысит эффективность результата.`;
    }
  };

  const generateKeyFindings = (data: any): string[] => {
    const findings: string[] = [];
    
    if (data.healthScore < 60) {
      findings.push('Показатель здоровья ниже среднего - требуется комплексный подход к улучшению');
    }
    
    if (data.sleepHours < 7) {
      findings.push('Недостаток сна может негативно влиять на восстановление и обмен веществ');
    }
    
    if (data.exerciseFrequency < 3) {
      findings.push('Низкая физическая активность - рекомендуется увеличить до 3-4 раз в неделю');
    }
    
    if (data.stressLevel > 7) {
      findings.push('Высокий уровень стресса требует внимания и активных мер по снижению');
    }
    
    return findings.length > 0 ? findings : ['Показатели в пределах нормы, продолжайте поддерживать здоровый образ жизни'];
  };

  const generateNutritionRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    const bmi = data.weight / Math.pow(data.height / 100, 2);
    
    if (bmi > 25) {
      recommendations.push('Создайте дефицит калорий 300-500 ккал/день для здорового снижения веса');
      recommendations.push('Увеличьте потребление белка до 1.6-2.2г на кг веса для сохранения мышечной массы');
    } else if (bmi < 18.5) {
      recommendations.push('Увеличьте калорийность рациона на 300-500 ккал/день');
      recommendations.push('Употребляйте 2-2.5г белка на кг веса для набора мышечной массы');
    } else {
      recommendations.push('Поддерживайте сбалансированный рацион с достаточным количеством белка');
    }
    
    recommendations.push('Включите в рацион: листовые овощи, жирную рыбу, орехи, ягоды');
    recommendations.push('Исключите: обработанные продукты, избыток сахара, трансжиры');
    
    return recommendations;
  };

  const generateActivityRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    
    if (data.exerciseFrequency < 3) {
      recommendations.push('Начните с 3 тренировок в неделю по 45-60 минут');
      recommendations.push('Комбинируйте кардио (2 раза) и силовые тренировки (2 раза)');
    } else {
      recommendations.push('Продолжайте регулярные тренировки, постепенно увеличивая интенсивность');
    }
    
    recommendations.push('Ходьба: 8000-10000 шагов ежедневно');
    recommendations.push('Силовые тренировки: 2-3 раза в неделю, все группы мышц');
    recommendations.push('Кардио: 150 минут умеренной интенсивности в неделю');
    
    return recommendations;
  };

  const generateLifestyleRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    
    if (data.sleepHours < 7) {
      recommendations.push(`Увеличьте продолжительность сна до 7-9 часов (сейчас: ${data.sleepHours}ч)`);
      recommendations.push('Создайте режим: ложитесь и вставайте в одно время');
    }
    
    if (data.stressLevel > 6) {
      recommendations.push('Практикуйте медитацию или дыхательные упражнения 10-15 минут ежедневно');
      recommendations.push('Рассмотрите техники управления стрессом: йога, прогулки на природе');
    }
    
    recommendations.push('Пейте 2-2.5 литра воды в день');
    recommendations.push('Ограничьте экранное время за 1 час до сна');
    
    return recommendations;
  };

  useEffect(() => {
    if (analytics && healthProfile && !consultation) {
      generateConsultation();
    }
  }, [analytics, healthProfile]);

  return (
    <div className="space-y-content">
      {consultation ? (
        <>
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-content">
            <div className="p-content-xs bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-content-xs">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-primary">Общий балл здоровья</h3>
              </div>
              <div className="text-2xl font-bold text-primary mb-2">
                {consultation.overallHealthScore}/100
              </div>
              <p className="text-sm text-secondary-foreground">
                Биологический возраст: {consultation.biologicalAge} лет
              </p>
            </div>

            <div className="p-content-xs bg-success/5 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2 mb-content-xs">
                <Target className="h-5 w-5 text-success" />
                <h3 className="font-semibold text-success">Анализ целей</h3>
              </div>
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {generateGoalsAssessment({ 
                  goals: healthProfile?.healthGoals || []
                })}
              </p>
            </div>
          </div>

          {/* Общая оценка состояния */}
          <div className="p-content-xs bg-surface border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-content-xs">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Общая оценка состояния</h3>
            </div>
            <p className="text-secondary-foreground leading-relaxed">
              {consultation.overallAssessment}
            </p>
          </div>

          {/* Ключевые находки */}
          {consultation.keyFindings && consultation.keyFindings.length > 0 && (
            <div className="p-content-xs bg-surface border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-content-xs">
                <ClipboardList className="h-5 w-5 text-warning" />
                <h3 className="font-semibold text-primary">Ключевые находки</h3>
              </div>
              <ul className="space-y-2">
                {consultation.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm p-2 bg-warning/5 rounded-md">
                    <div className="w-1.5 h-1.5 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-secondary-foreground">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Персональные рекомендации */}
          {consultation.personalizedRecommendations && consultation.personalizedRecommendations.length > 0 && (
            <div className="space-y-content-xs">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <h3 className="font-semibold text-primary">Персональные рекомендации</h3>
              </div>
              <div className="space-y-2">
                {consultation.personalizedRecommendations.slice(0, 8).map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-content-xs bg-success/5 border border-success/20 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-secondary-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Дисклеймер */}
          <div className="p-content-xs bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-warning mb-2">Важные замечания</h3>
                <div className="space-y-2">
                  {consultation.disclaimers.map((disclaimer, index) => (
                    <p key={index} className="text-sm text-secondary-foreground leading-relaxed">
                      {disclaimer}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 space-y-content">
          <div className="flex flex-col items-center space-y-3">
            <Brain className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-primary">
              ИИ-консультация готова к запуску
            </h3>
          </div>
          <p className="text-secondary-foreground max-w-md mx-auto">
            Получите персональный анализ здоровья на основе ваших данных и биомаркеров
          </p>
          <Button 
            onClick={generateConsultation}
            disabled={isGenerating}
            size="lg"
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Анализируем...
              </>
            ) : (
              'Начать консультацию'
            )}
          </Button>
          {error && (
            <p className="text-destructive text-sm mt-4">{error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalAIConsultant;