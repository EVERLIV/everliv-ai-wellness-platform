import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  currentAnalysis: string;
  goalsAssessment: string;
  biomarkerAnalysis: string;
  biomarkerRecommendations: string[];
  labTestRecommendations: string[];
  keyFindings: string[];
  nutritionRecommendations: string[];
  activityRecommendations: string[];
  lifestyleRecommendations: string[];
  actionPlan: string[];
  trackingMetrics: string[];
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
        biomarkers: [], // Будем загружать реальные биомаркеры
        goals: healthProfile.healthGoals || [],
        userGoals: [], // Будем загружать пользовательские цели
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

      // Загружаем реальные биомаркеры пользователя
      try {
        console.log('🔍 Loading biomarkers for user:', user.id);
        const { data: analyses } = await supabase
          .from('medical_analyses')
          .select('id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        console.log('📊 Found analyses:', analyses?.length || 0);

        if (analyses && analyses.length > 0) {
          const analysisIds = analyses.map(a => a.id);
          const { data: biomarkers } = await supabase
            .from('biomarkers')
            .select('*')
            .in('analysis_id', analysisIds)
            .order('created_at', { ascending: false });
          
          console.log('🧪 Found biomarkers:', biomarkers?.length || 0);
          consultationData.biomarkers = biomarkers || [];
        }
      } catch (error) {
        console.error('Error loading biomarkers:', error);
      }

      // Загружаем пользовательские цели
      try {
        console.log('🎯 Loading user goals for user:', user.id);
        const { data: userGoals } = await supabase
          .from('user_health_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
        
        console.log('📝 Found user goals:', userGoals?.length || 0);
        consultationData.userGoals = userGoals || [];
      } catch (error) {
        console.error('Error loading user goals:', error);
      }

      // Создаем персонализированную консультацию на основе данных
      const mockConsultation: AIConsultationResponse = {
        currentAnalysis: generateCurrentAnalysis(consultationData),
        goalsAssessment: generateGoalsAssessment(consultationData),
        biomarkerAnalysis: generateBiomarkerAnalysis(consultationData),
        biomarkerRecommendations: generateBiomarkerRecommendations(consultationData),
        labTestRecommendations: generateLabTestRecommendations(consultationData),
        keyFindings: generateKeyFindings(consultationData),
        nutritionRecommendations: generateNutritionRecommendations(consultationData),
        activityRecommendations: generateActivityRecommendations(consultationData),
        lifestyleRecommendations: generateLifestyleRecommendations(consultationData),
        actionPlan: generateActionPlan(consultationData),
        trackingMetrics: generateTrackingMetrics(consultationData)
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
    const allGoals: string[] = [];
    
    // Добавляем стандартные цели
    if (data.goals && data.goals.length > 0) {
      allGoals.push(...data.goals);
    }
    
    // Добавляем пользовательские цели
    if (data.userGoals && data.userGoals.length > 0) {
      const userGoalTitles = data.userGoals.map((goal: any) => goal.title || goal.goal_type);
      allGoals.push(...userGoalTitles);
    }
    
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
    
    // Обрабатываем все цели пользователя
    const translatedGoals = allGoals.map((goal: string) => goalTranslations[goal] || goal);
    
    // Показываем количество пользовательских и стандартных целеей
    const standardGoalsCount = data.goals ? data.goals.length : 0;
    const userGoalsCount = data.userGoals ? data.userGoals.length : 0;
    
    let goalInfo = '';
    if (userGoalsCount > 0 && standardGoalsCount > 0) {
      goalInfo = ` (${standardGoalsCount} стандартных + ${userGoalsCount} персональных)`;
    } else if (userGoalsCount > 0) {
      goalInfo = ` (${userGoalsCount} персональных)`;
    }
    
    if (translatedGoals.length === 1) {
      return `Ваша цель: ${translatedGoals[0]}${goalInfo}. Это реалистичная цель, которую можно достичь за 3-6 месяцев при правильном подходе.`;
    } else {
      const primaryGoals = translatedGoals.slice(0, 3).join(', ');
      const additionalCount = Math.max(0, translatedGoals.length - 3);
      return `Ваши цели${goalInfo}: ${primaryGoals}${additionalCount > 0 ? ` и еще ${additionalCount}` : ''}. Комплексный подход к достижению этих целей повысит эффективность результата.`;
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

  const generateActionPlan = (data: any): string[] => {
    return [
      'Неделя 1-2: Установите режим сна и начните отслеживать питание',
      'Неделя 3-4: Добавьте регулярные тренировки, внедрите практики управления стрессом',
      'Неделя 5-6: Оптимизируйте рацион согласно рекомендациям, увеличьте интенсивность тренировок',
      'Контрольная точка через 6 недель: оценка прогресса и корректировка плана'
    ];
  };

  // Генерация анализа биомаркеров
  const generateBiomarkerAnalysis = (data: any): string => {
    if (!data.biomarkers || !Array.isArray(data.biomarkers) || data.biomarkers.length === 0) {
      return 'Биомаркеры не загружены. Рекомендуется сдать базовые лабораторные анализы для получения полной картины здоровья.';
    }

    const criticalBiomarkers = data.biomarkers.filter((b: any) => 
      b.status === 'critical' || b.status === 'high' || b.status === 'low'
    );
    
    const normalBiomarkers = data.biomarkers.filter((b: any) => b.status === 'normal');

    if (criticalBiomarkers.length === 0) {
      return `Анализ ${data.biomarkers.length} биомаркеров показывает хорошие результаты. Все основные показатели в пределах нормы.`;
    }

    return `Из ${data.biomarkers.length} проанализированных биомаркеров выявлено ${criticalBiomarkers.length} показателей, требующих внимания: ${criticalBiomarkers.map((b: any) => b.name).slice(0, 3).join(', ')}${criticalBiomarkers.length > 3 ? ' и др.' : ''}. ${normalBiomarkers.length} показателей в норме.`;
  };

  // Генерация рекомендаций по биомаркерам
  const generateBiomarkerRecommendations = (data: any): string[] => {
    if (!data.biomarkers || data.biomarkers.length === 0) {
      return ['Загрузите результаты анализов для получения персональных рекомендаций'];
    }

    const recommendations: string[] = [];
    
    data.biomarkers.forEach((biomarker: any) => {
      if (biomarker.status === 'high') {
        switch (biomarker.name.toLowerCase()) {
          case 'холестерин общий':
          case 'лпнп':
            recommendations.push(`${biomarker.name} повышен (${biomarker.value}): ограничьте насыщенные жиры, увеличьте омега-3, добавьте физические нагрузки`);
            break;
          case 'глюкоза':
            recommendations.push(`${biomarker.name} повышена (${biomarker.value}): исключите быстрые углеводы, контролируйте порции, увеличьте активность`);
            break;
          case 'гемоглобин':
            recommendations.push(`${biomarker.name} повышен (${biomarker.value}): увеличьте потребление воды, проконсультируйтесь с врачом`);
            break;
          default:
            recommendations.push(`${biomarker.name} повышен (${biomarker.value}): требуется консультация специалиста`);
        }
      } else if (biomarker.status === 'low') {
        switch (biomarker.name.toLowerCase()) {
          case 'гемоглобин':
            recommendations.push(`${biomarker.name} понижен (${biomarker.value}): увеличьте железосодержащие продукты, добавьте витамин C`);
            break;
          case 'витамин d':
            recommendations.push(`${biomarker.name} понижен (${biomarker.value}): больше солнца, добавки витамина D3 2000-4000 МЕ`);
            break;
          case 'b12':
            recommendations.push(`${biomarker.name} понижен (${biomarker.value}): добавьте мясо, рыбу, молочные продукты или B12 добавки`);
            break;
          default:
            recommendations.push(`${biomarker.name} понижен (${biomarker.value}): требуется коррекция питания и возможны добавки`);
        }
      }
    });

    return recommendations.length > 0 ? recommendations : ['Все биомаркеры в пределах нормы - продолжайте поддерживать здоровый образ жизни'];
  };

  // Генерация рекомендаций по лабораторным тестам
  const generateLabTestRecommendations = (data: any): string[] => {
    const recommendations: string[] = [];
    
    // Базовые анализы
    if (!data.biomarkers || data.biomarkers.length < 10) {
      recommendations.push('Общий анализ крови (гемоглобин, эритроциты, лейкоциты, тромбоциты)');
      recommendations.push('Биохимический анализ (глюкоза, холестерин, печеночные ферменты)');
    }
    
    // На основе возраста
    if (data.age > 40) {
      recommendations.push('ПСА (для мужчин) / Гормональная панель (для женщин)');
      recommendations.push('Кальций и фосфор (здоровье костей)');
    }
    
    // Объединяем стандартные и пользовательские цели
    const allGoals = [...(data.goals || [])];
    if (data.userGoals) {
      allGoals.push(...data.userGoals.map((g: any) => g.goal_type || g.title?.toLowerCase()));
    }
    
    // На основе целей
    if (allGoals.includes('cardiovascular') || allGoals.some(g => g?.includes('сердце') || g?.includes('давление'))) {
      recommendations.push('Липидный профиль (ЛПВП, ЛПНП, триглицериды)');
      recommendations.push('Гомоцистеин, C-реактивный белок');
    }
    
    if (allGoals.includes('metabolism') || allGoals.includes('weight_loss') || 
        allGoals.some(g => g?.includes('вес') || g?.includes('метаболизм'))) {
      recommendations.push('Инсулин, HbA1c (гликированный гемоглобин)');
      recommendations.push('Тиреотропный гормон (ТТГ), T3, T4');
    }
    
    if (allGoals.includes('energy_boost') || data.stressLevel > 6 || 
        allGoals.some(g => g?.includes('энергия') || g?.includes('усталость'))) {
      recommendations.push('Кортизол, Витамин D, B12, железо');
      recommendations.push('Ферритин, фолиевая кислота');
    }
    
    if (allGoals.some(g => g?.includes('мышцы') || g?.includes('спорт'))) {
      recommendations.push('Креатинкиназа, лактатдегидрогеназа');
      recommendations.push('Тестостерон (общий и свободный)');
    }
    
    // На основе симптомов
    if (data.sleepHours < 7) {
      recommendations.push('Мелатонин, магний в сыворотке');
    }
    
    return recommendations.length > 0 ? recommendations : ['Регулярный общий анализ крови и биохимия (раз в 6 месяцев)'];
  };

  const generateTrackingMetrics = (data: any): string[] => {
    return [
      'Вес (еженедельно по утрам)',
      'Качество сна (ежедневно по шкале 1-10)',
      'Уровень энергии (ежедневно)',
      'Количество тренировок (еженедельно)',
      'Потребление воды (ежедневно)',
      'Уровень стресса (еженедельно)'
    ];
  };

  useEffect(() => {
    generateConsultation();
  }, [analytics, healthProfile]);

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600">Анализирую ваши данные...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={generateConsultation} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (!consultation) {
    return null;
  }

  return (
    <div className="space-y-4">
            {/* Анализ текущего состояния */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h3 className="font-semibold text-gray-900">Анализ текущего состояния</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {consultation.currentAnalysis}
              </p>
            </div>

            <Separator />

            {/* Оценка целей */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h3 className="font-semibold text-gray-900">Оценка целей</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {consultation.goalsAssessment}
              </p>
            </div>

            <Separator />

            {/* Ключевые находки */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <h3 className="font-semibold text-gray-900">Ключевые находки</h3>
              </div>
              <div className="space-y-2">
                {consultation.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Анализ биомаркеров */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧪</span>
                <h3 className="font-semibold text-gray-900">Анализ биомаркеров</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {consultation.biomarkerAnalysis}
              </p>
            </div>

            <Separator />

            {/* Рекомендации по биомаркерам */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💊</span>
                <h3 className="font-semibold text-gray-900">Коррекция биомаркеров</h3>
              </div>
              <div className="space-y-2">
                {consultation.biomarkerRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Рекомендации по лабораторным тестам */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔬</span>
                <h3 className="font-semibold text-gray-900">Рекомендуемые анализы</h3>
              </div>
              <div className="space-y-2">
                {consultation.labTestRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Рекомендации по питанию */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🍎</span>
                <h3 className="font-semibold text-gray-900">Рекомендации по питанию</h3>
              </div>
              <div className="space-y-2">
                {consultation.nutritionRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Рекомендации по активности */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💪</span>
                <h3 className="font-semibold text-gray-900">Рекомендации по активности</h3>
              </div>
              <div className="space-y-2">
                {consultation.activityRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Образ жизни */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌙</span>
                <h3 className="font-semibold text-gray-900">Образ жизни</h3>
              </div>
              <div className="space-y-2">
                {consultation.lifestyleRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* План действий */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h3 className="font-semibold text-gray-900">План действий на 4-6 недель</h3>
              </div>
              <div className="space-y-2">
                {consultation.actionPlan.map((step, index) => (
                   <div key={index} className="flex items-start gap-3 p-3 bg-gray-50">
                     <Badge variant="outline" className="flex-shrink-0">
                       {index + 1}
                     </Badge>
                     <p className="text-sm text-gray-700">{step}</p>
                   </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Метрики для отслеживания */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📈</span>
                <h3 className="font-semibold text-gray-900">Метрики для отслеживания</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {consultation.trackingMetrics.map((metric, index) => (
                   <div key={index} className="flex items-center gap-2 p-2 bg-blue-50">
                     <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0" />
                     <p className="text-sm text-gray-700">{metric}</p>
                   </div>
                ))}
              </div>
            </div>
    </div>
  );
};

export default PersonalAIConsultant;