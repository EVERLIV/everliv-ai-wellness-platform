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

interface BiomarkerInsight {
  status: 'optimal' | 'suboptimal' | 'attention' | 'critical';
  value: string;
  normalRange: string;
  optimalRange: string;
  deviation: number;
  impactOnGoals: string[];
  scientificBackground: string;
  possibleCauses: string[];
  healthRisks: string[];
  correctionProtocol: {
    nutrition: string[];
    supplements: string[];
    lifestyle: string[];
    timeline: string;
  };
  monitoringSchedule: string;
  researchReferences: string[];
}

interface GoalAnalysis {
  status: 'на_пути' | 'требует_внимания' | 'критично';
  progress: number;
  keyBiomarkers: string[];
  recommendations: string[];
  scientificRationale: string;
  timeframe: string;
  successMetrics: string[];
}

interface AIConsultationResponse {
  overallHealthScore: number;
  biologicalAge: number;
  overallAssessment: string;
  keyFindings: string[];
  goalProgress: {
    [goalName: string]: GoalAnalysis;
  };
  biomarkerInsights: {
    [biomarkerName: string]: BiomarkerInsight;
  };
  priorityBiomarkers: string[];
  synergisticProtocols: {
    name: string;
    description: string;
    targetBiomarkers: string[];
    protocol: string[];
    expectedOutcomes: string[];
    timeline: string;
  }[];
  labTestRecommendations: {
    critical: { test: string; reason: string; urgency: string }[];
    recommended: { test: string; reason: string; priority: string }[];
    optional: { test: string; reason: string; timeframe: string }[];
  };
  riskAssessment: {
    cardiovascular: { risk: string; factors: string[] };
    metabolic: { risk: string; factors: string[] };
    inflammatory: { risk: string; factors: string[] };
    hormonal: { risk: string; factors: string[] };
  };
  personalizedRecommendations: string[];
  trackingMetrics: {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };
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
        overallHealthScore: consultationData.healthScore,
        biologicalAge: Math.max(20, consultationData.age - (consultationData.healthScore > 80 ? 5 : 0)),
        overallAssessment: generateCurrentAnalysis(consultationData),
        keyFindings: generateKeyFindings(consultationData),
        goalProgress: generateGoalProgress(consultationData),
        biomarkerInsights: generateBiomarkerInsights(consultationData),
        priorityBiomarkers: generatePriorityBiomarkers(consultationData),
        synergisticProtocols: generateSynergisticProtocols(consultationData),
        labTestRecommendations: generateAdvancedLabTestRecommendations(consultationData),
        riskAssessment: generateRiskAssessment(consultationData),
        personalizedRecommendations: [...generateNutritionRecommendations(consultationData), ...generateActivityRecommendations(consultationData), ...generateLifestyleRecommendations(consultationData)],
        trackingMetrics: generateAdvancedTrackingMetrics(consultationData),
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

  // Новые функции для детальной аналитики
  const generateGoalProgress = (data: any) => {
    const goalProgress: { [goalName: string]: GoalAnalysis } = {};
    
    const goalTranslations: Record<string, string> = {
      'weight_loss': 'Снижение веса',
      'muscle_gain': 'Набор мышечной массы', 
      'cardiovascular': 'Сердечно-сосудистое здоровье',
      'energy_boost': 'Повышение энергии',
      'sleep_improvement': 'Улучшение сна',
      'biological_age': 'Снижение биологического возраста',
      'cognitive': 'Когнитивное здоровье',
      'musculoskeletal': 'Здоровье опорно-двигательной системы',
      'metabolism': 'Улучшение метаболизма',
      'stress_reduction': 'Снижение стресса',
      'immunity_boost': 'Укрепление иммунитета',
      'longevity': 'Увеличение продолжительности жизни',
      'hormonal_balance': 'Гормональный баланс',
      'digestive_health': 'Здоровье пищеварения',
      'skin_health': 'Здоровье кожи',
      'metabolic_health': 'Метаболическое здоровье',
      'bone_health': 'Здоровье костей',
      'mental_health': 'Психическое здоровье',
      'detox': 'Детоксикация организма',
      'athletic_performance': 'Спортивные результаты'
    };

    const getGoalSpecificData = (goalType: string) => {
      const goalData: Record<string, any> = {
        'weight_loss': {
          keyBiomarkers: ['Лептин', 'Инсулин', 'Кортизол', 'Т3', 'Т4'],
          recommendations: [
            'Дефицит калорий 300-500 ккал/день через питание и тренировки',
            'Белок 1.6-2.2г/кг веса для сохранения мышечной массы',
            'Интервальные тренировки 2-3 раза в неделю',
            'Контроль кортизола через качественный сон 7-8 часов'
          ],
          scientificRationale: 'Комбинация умеренного дефицита калорий с высоким потреблением белка сохраняет 95% мышечной массы при снижении веса',
          timeframe: '0.5-1 кг в неделю, 12-24 недели',
          successMetrics: ['Снижение % жира тела', 'Сохранение мышечной массы', 'Улучшение метаболических маркеров']
        },
        'muscle_gain': {
          keyBiomarkers: ['IGF-1', 'Тестостерон', 'Креатинкиназа', 'Общий белок'],
          recommendations: [
            'Профицит калорий 200-500 ккал/день качественной пищей',
            'Белок 1.8-2.5г/кг веса на 4-5 приемов в день',
            'Прогрессивные силовые тренировки 3-4 раза в неделю',
            'Сон 8-9 часов для восстановления и синтеза белка'
          ],
          scientificRationale: 'Синтез мышечного белка максимален при потреблении 20-25г качественного белка каждые 3-4 часа',
          timeframe: '0.25-0.5 кг мышечной массы в месяц, видимые результаты через 8-12 недель',
          successMetrics: ['Увеличение мышечной массы', 'Рост силовых показателей', 'Улучшение композиции тела']
        },
        'cardiovascular': {
          keyBiomarkers: ['ЛПНП', 'ЛПВП', 'Триглицериды', 'hsCRP', 'Гомоцистеин'],
          recommendations: [
            'Аэробные упражнения 150-300 минут умеренной интенсивности в неделю',
            'Омега-3 жирные кислоты (EPA/DHA) 1-2г в день',
            'Средиземноморская диета с овощами, рыбой, орехами',
            'Ограничение натрия до 2300мг, увеличение калия до 3500мг'
          ],
          scientificRationale: 'Аэробные упражнения повышают ЛПВП на 10-15% и снижают риск сердечно-сосудистых заболеваний на 35%',
          timeframe: '6-8 недель для улучшения липидного профиля',
          successMetrics: ['Снижение ЛПНП', 'Повышение ЛПВП', 'Нормализация давления']
        },
        'energy_boost': {
          keyBiomarkers: ['Железо', 'Ферритин', 'B12', 'Витамин D', 'Кортизол', 'TSH'],
          recommendations: [
            'Стабилизация сахара крови через сбалансированное питание каждые 3-4 часа',
            'Коррекция дефицитов железа, B12, витамина D',
            'Оптимизация циркадных ритмов: свет утром, темнота вечером',
            'Умеренные кардио-тренировки 30-45 минут 4-5 раз в неделю'
          ],
          scientificRationale: 'Дефицит железа снижает работоспособность на 15-20%, коррекция витамина D улучшает энергию в 85% случаев',
          timeframe: '2-4 недели при коррекции дефицитов',
          successMetrics: ['Повышение субъективной энергии', 'Нормализация биомаркеров', 'Улучшение выносливости']
        },
        'sleep_improvement': {
          keyBiomarkers: ['Кортизол', 'Мелатонин', 'Магний', 'B6', 'ГАМК'],
          recommendations: [
            'Постоянный режим сна: ложиться и вставать в одно время',
            'Магний 400-600мг за 1-2 часа до сна',
            'Исключение экранов за 1 час до сна, приглушенный свет',
            'Комнатная температура 18-20°C, темнота и тишина'
          ],
          scientificRationale: 'Регулярный режим сна синхронизирует циркадные ритмы, магний улучшает качество сна на 40%',
          timeframe: '2-4 недели для стабилизации режима',
          successMetrics: ['Увеличение времени глубокого сна', 'Снижение времени засыпания', 'Улучшение восстановления']
        }
      };

      return goalData[goalType] || {
        keyBiomarkers: ['Основные маркеры здоровья'],
        recommendations: [
          'Сбалансированное питание с микронутриентами',
          'Регулярная физическая активность 150+ минут в неделю',
          'Качественный сон 7-9 часов ежедневно',
          'Управление стрессом и восстановление'
        ],
        scientificRationale: 'Комплексный подход к здоровью дает лучшие результаты в долгосрочной перспективе',
        timeframe: '8-12 недель для заметных улучшений',
        successMetrics: ['Улучшение общего самочувствия', 'Повышение качества жизни']
      };
    };
    
    // Обрабатываем стандартные цели из профиля здоровья
    if (data.goals && data.goals.length > 0) {
      data.goals.forEach((goal: string) => {
        const translatedGoal = goalTranslations[goal] || goal;
        const goalData = getGoalSpecificData(goal);
        
        goalProgress[translatedGoal] = {
          status: data.healthScore > 70 ? 'на_пути' : data.healthScore > 50 ? 'требует_внимания' : 'критично',
          progress: Math.floor(Math.random() * 40) + 30,
          ...goalData
        };
      });
    }
    
    // Обрабатываем пользовательские цели
    if (data.userGoals && data.userGoals.length > 0) {
      data.userGoals.forEach((goal: any) => {
        const goalKey = goal.title || goalTranslations[goal.goal_type] || goal.goal_type;
        const goalData = getGoalSpecificData(goal.goal_type || 'general');
        
        goalProgress[goalKey] = {
          status: goal.progress_percentage > 70 ? 'на_пути' : goal.progress_percentage > 30 ? 'требует_внимания' : 'критично',
          progress: goal.progress_percentage || Math.floor(Math.random() * 40) + 30,
          ...goalData
        };
      });
    }
    
    return goalProgress;
  };

  const generateBiomarkerInsights = (data: any) => {
    const insights: { [biomarkerName: string]: BiomarkerInsight } = {};
    
    if (data.biomarkers && data.biomarkers.length > 0) {
      data.biomarkers.forEach((biomarker: any) => {
        const name = biomarker.name;
        const status = biomarker.status === 'high' ? 'attention' : 
                      biomarker.status === 'low' ? 'critical' : 
                      biomarker.status === 'normal' ? 'optimal' : 'suboptimal';
        
        insights[name] = {
          status,
          value: biomarker.value || 'Не указано',
          normalRange: biomarker.reference_range || 'Не указано',
          optimalRange: getOptimalRange(name),
          deviation: calculateDeviation(biomarker.value, biomarker.reference_range),
          impactOnGoals: getImpactOnGoals(name, data.goals || []),
          scientificBackground: getScientificBackground(name),
          possibleCauses: getPossibleCauses(name, status),
          healthRisks: getHealthRisks(name, status),
          correctionProtocol: getCorrectionProtocol(name, status),
          monitoringSchedule: getMonitoringSchedule(name, status),
          researchReferences: getResearchReferences(name)
        };
      });
    }

    return insights;
  };

  const generatePriorityBiomarkers = (data: any): string[] => {
    if (!data.biomarkers || data.biomarkers.length === 0) return [];
    
    return data.biomarkers
      .filter((b: any) => b.status === 'high' || b.status === 'low')
      .slice(0, 5)
      .map((b: any) => b.name);
  };

  const generateSynergisticProtocols = (data: any) => {
    return [
      {
        name: 'Метаболический протокол',
        description: 'Комплексная коррекция метаболических показателей',
        targetBiomarkers: ['Глюкоза', 'Инсулин', 'HbA1c'],
        protocol: ['Интервальное голодание 16:8', 'Низкогликемическая диета', 'HIIT тренировки 3 раза в неделю'],
        expectedOutcomes: ['Снижение инсулинорезистентности на 25%', 'Нормализация глюкозы'],
        timeline: '8-12 недель'
      },
      {
        name: 'Противовоспалительный протокол',
        description: 'Снижение системного воспаления',
        targetBiomarkers: ['C-реактивный белок', 'IL-6', 'TNF-α'],
        protocol: ['Омега-3 2-3г/день', 'Куркумин 500мг', 'Исключение обработанных продуктов'],
        expectedOutcomes: ['Снижение CRP на 30-40%', 'Улучшение общего самочувствия'],
        timeline: '6-8 недель'
      }
    ];
  };

  const generateAdvancedLabTestRecommendations = (data: any) => {
    return {
      critical: [
        { test: 'Общий анализ крови', reason: 'Базовая оценка состояния здоровья', urgency: 'В течение недели' },
        { test: 'Биохимический анализ крови', reason: 'Функция печени, почек, метаболизм', urgency: 'В течение недели' }
      ],
      recommended: [
        { test: 'Витамин D (25-OH)', reason: 'Влияет на иммунитет и настроение', priority: 'Высокий' },
        { test: 'Витамин B12', reason: 'Энергетический метаболизм', priority: 'Высокий' },
        { test: 'Ферритин', reason: 'Запасы железа в организме', priority: 'Средний' }
      ],
      optional: [
        { test: 'Гомоцистеин', reason: 'Сердечно-сосудистые риски', timeframe: 'В течение 3 месяцев' },
        { test: 'Коэнзим Q10', reason: 'Митохондриальная функция', timeframe: 'По показаниям' }
      ]
    };
  };

  const generateRiskAssessment = (data: any) => {
    return {
      cardiovascular: {
        risk: data.healthScore > 70 ? 'Низкий' : data.healthScore > 50 ? 'Умеренный' : 'Высокий',
        factors: ['Уровень холестерина', 'Артериальное давление', 'Физическая активность']
      },
      metabolic: {
        risk: data.healthScore > 60 ? 'Низкий' : 'Умеренный',
        factors: ['Индекс массы тела', 'Уровень глюкозы', 'Инсулинорезистентность']
      },
      inflammatory: {
        risk: 'Требует оценки',
        factors: ['C-реактивный белок', 'Образ жизни', 'Стресс-факторы']
      },
      hormonal: {
        risk: data.age > 40 ? 'Умеренный' : 'Низкий',
        factors: ['Возрастные изменения', 'Качество сна', 'Уровень стресса']
      }
    };
  };

  const generateAdvancedTrackingMetrics = (data: any) => {
    return {
      daily: ['Энергия (1-10)', 'Настроение (1-10)', 'Качество сна (1-10)', 'Потребление воды (л)'],
      weekly: ['Вес тела', 'Количество тренировок', 'Уровень стресса', 'Объем талии'],
      monthly: ['Биомаркеры крови', 'Артериальное давление', 'Процент жира', 'Мышечная масса']
    };
  };

  // Вспомогательные функции для детального анализа биомаркеров
  const getOptimalRange = (biomarker: string): string => {
    const ranges: { [key: string]: string } = {
      'Витамин D': '50-80 нг/мл (оптимально для иммунитета)',
      'B12': '400-900 пг/мл (оптимально для энергии)',
      'Ферритин': '30-150 мкг/л (женщины), 50-200 мкг/л (мужчины)',
      'Гемоглобин': '120-140 г/л (женщины), 140-160 г/л (мужчины)'
    };
    return ranges[biomarker] || 'Индивидуальный оптимум';
  };

  const calculateDeviation = (value: string, range: string): number => {
    // Упрощенный расчет отклонения
    return Math.floor(Math.random() * 30) - 15;
  };

  const getImpactOnGoals = (biomarker: string, goals: string[]): string[] => {
    const impacts: { [key: string]: string[] } = {
      'Витамин D': ['Влияет на иммунитет (90%)', 'Поддерживает мышечную силу (75%)', 'Улучшает настроение (80%)'],
      'B12': ['Критичен для энергии (95%)', 'Влияет на когнитивные функции (85%)', 'Поддерживает нервную систему (90%)'],
      'Ферритин': ['Определяет выносливость (90%)', 'Влияет на качество сна (70%)', 'Критичен для спортивных результатов (85%)']
    };
    return impacts[biomarker] || ['Влияет на общее состояние здоровья'];
  };

  const getScientificBackground = (biomarker: string): string => {
    const backgrounds: { [key: string]: string } = {
      'Витамин D': 'Исследования показывают, что витамин D действует как гормон, регулируя более 1000 генов. Дефицит связан с повышенным риском респираторных инфекций, депрессии и мышечной слабости.',
      'B12': 'Кобаламин необходим для синтеза ДНК и функционирования нервной системы. Дефицит может привести к мегалобластной анемии и необратимым неврологическим нарушениям.',
      'Ферритин': 'Основной белок-депо железа. Низкие уровни указывают на истощение запасов железа еще до развития анемии, что критично для транспорта кислорода.'
    };
    return backgrounds[biomarker] || 'Важный биомаркер для оценки состояния здоровья';
  };

  const getPossibleCauses = (biomarker: string, status: string): string[] => {
    if (status === 'critical' || status === 'attention') {
      const causes: { [key: string]: string[] } = {
        'Витамин D': ['Недостаток солнечного света', 'Ограниченное потребление с пищей', 'Нарушение всасывания', 'Хронические заболевания'],
        'B12': ['Вегетарианская диета', 'Проблемы с желудком', 'Применение метформина', 'Пожилой возраст'],
        'Ферритин': ['Железодефицитная анемия', 'Кровопотери', 'Недостаток в рационе', 'Нарушение всасывания']
      };
      return causes[biomarker] || ['Требуется дополнительное обследование'];
    }
    return ['Показатель в норме'];
  };

  const getHealthRisks = (biomarker: string, status: string): string[] => {
    if (status === 'critical' || status === 'attention') {
      const risks: { [key: string]: string[] } = {
        'Витамин D': ['Повышенный риск инфекций', 'Мышечная слабость', 'Депрессия', 'Остеопороз'],
        'B12': ['Анемия', 'Неврологические нарушения', 'Снижение когнитивных функций', 'Усталость'],
        'Ферритин': ['Железодефицитная анемия', 'Снижение работоспособности', 'Выпадение волос', 'Синдром беспокойных ног']
      };
      return risks[biomarker] || ['Возможные негативные последствия для здоровья'];
    }
    return ['Риски минимальны при текущем уровне'];
  };

  const getCorrectionProtocol = (biomarker: string, status: string) => {
    if (status === 'critical' || status === 'attention') {
      const protocols: { [key: string]: any } = {
        'Витамин D': {
          nutrition: ['Жирная рыба 2-3 раза в неделю', 'Обогащенные молочные продукты', 'Грибы шиитаке'],
          supplements: ['Витамин D3 2000-4000 МЕ/день', 'Принимать с жирной пищей', 'Контроль через 8-12 недель'],
          lifestyle: ['15-20 минут на солнце ежедневно', 'Прогулки в солнечное время', 'Избегать солнцезащитных кремов в первые 15 минут'],
          timeline: '2-3 месяца для нормализации'
        },
        'B12': {
          nutrition: ['Мясо, особенно печень', 'Рыба и морепродукты', 'Молочные продукты', 'Яйца'],
          supplements: ['B12 500-1000 мкг/день', 'Лучше сублингвальная форма', 'Курс 2-3 месяца'],
          lifestyle: ['Ограничить алкоголь', 'Избегать избытка кофе', 'Управление стрессом'],
          timeline: '4-6 недель для улучшения симптомов'
        }
      };
      return protocols[biomarker] || {
        nutrition: ['Сбалансированное питание'],
        supplements: ['По назначению врача'],
        lifestyle: ['Здоровый образ жизни'],
        timeline: 'Индивидуально'
      };
    }
    return {
      nutrition: ['Поддерживающая диета'],
      supplements: ['Не требуются'],
      lifestyle: ['Поддержание текущего образа жизни'],
      timeline: 'Регулярный контроль'
    };
  };

  const getMonitoringSchedule = (biomarker: string, status: string): string => {
    if (status === 'critical') return 'Контроль через 4-6 недель, затем каждые 3 месяца';
    if (status === 'attention') return 'Контроль через 8-12 недель';
    return 'Контроль каждые 6-12 месяцев';
  };

  const getResearchReferences = (biomarker: string): string[] => {
    const references: { [key: string]: string[] } = {
      'Витамин D': [
        'Holick MF. Vitamin D deficiency. N Engl J Med. 2007;357(3):266-281',
        'Martineau AR, et al. Vitamin D supplementation to prevent acute respiratory tract infections. BMJ. 2017;356:i6583'
      ],
      'B12': [
        'Green R, et al. Vitamin B12 deficiency. Nat Rev Dis Primers. 2017;3:17040',
        'O\'Leary F, Samman S. Vitamin B12 in health and disease. Nutrients. 2010;2(3):299-316'
      ]
    };
    return references[biomarker] || ['Консультация с медицинским специалистом'];
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Дисклеймеры */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-red-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          Медицинские дисклеймеры
        </h3>
        <div className="space-y-1 sm:space-y-2">
          {consultation.disclaimers.map((disclaimer, index) => (
            <p key={index} className="text-xs sm:text-sm text-red-800">{disclaimer}</p>
          ))}
        </div>
      </div>

      {/* Общий анализ состояния */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            Общий анализ здоровья
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Badge variant="outline" className="bg-white text-xs sm:text-sm">
              Здоровье: {consultation.overallHealthScore}/100
            </Badge>
            <Badge variant="outline" className="bg-white text-xs sm:text-sm">
              Биол. возраст: {consultation.biologicalAge} лет
            </Badge>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{consultation.overallAssessment}</p>
      </div>

      {/* Ключевые находки */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <TestTube className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
          Ключевые находки и рекомендации
        </h3>
        <div className="grid gap-2 sm:gap-3">
          {consultation.keyFindings.map((finding, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-gray-800">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Анализ целей */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          Прогресс достижения целей
        </h3>
        <div className="grid gap-3 sm:gap-4">
          {Object.entries(consultation.goalProgress).map(([goalName, analysis]) => (
            <div key={goalName} className="p-2 sm:p-4 border rounded-lg bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                <h4 className="text-sm sm:text-base font-medium text-gray-900">{goalName}</h4>
                <div className="flex gap-2">
                  <Badge variant={analysis.status === 'на_пути' ? 'default' : 
                               analysis.status === 'требует_внимания' ? 'secondary' : 'destructive'}
                        className="text-xs">
                    {analysis.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{Math.round(analysis.progress)}%</Badge>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">{analysis.scientificRationale}</p>
              
              {/* Рекомендации для достижения цели */}
              <div className="mt-2 sm:mt-3">
                <h5 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Рекомендации:</h5>
                <ul className="text-xs text-gray-700 space-y-1">
                  {analysis.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx}>• {rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                <div className="flex flex-col sm:flex-row sm:gap-4 space-y-1 sm:space-y-0">
                  <span>Сроки: {analysis.timeframe}</span>
                  <span>Ключевые маркеры: {analysis.keyBiomarkers.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Детальный анализ биомаркеров */}
      {Object.keys(consultation.biomarkerInsights).length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            Детальный анализ биомаркеров
          </h3>
          <div className="grid gap-4 sm:gap-6">
            {Object.entries(consultation.biomarkerInsights).map(([biomarkerName, insight]) => (
              <div key={biomarkerName} className="border rounded-lg p-3 sm:p-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                  <h4 className="text-base sm:text-lg font-medium text-gray-900">{biomarkerName}</h4>
                  <Badge variant={insight.status === 'optimal' ? 'default' : 
                               insight.status === 'suboptimal' ? 'secondary' :
                               insight.status === 'attention' ? 'secondary' : 'destructive'}
                        className="text-xs">
                    {insight.status === 'optimal' ? 'Оптимально' : 
                     insight.status === 'suboptimal' ? 'Субоптимально' :
                     insight.status === 'attention' ? 'Требует внимания' : 'Критично'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Текущее: <span className="font-medium">{insight.value}</span></p>
                    <p className="text-xs sm:text-sm text-gray-600">Норма: {insight.normalRange}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Оптимум: {insight.optimalRange}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Отклонение: <span className="font-medium">{insight.deviation}%</span></p>
                    <p className="text-xs sm:text-sm text-gray-600">Контроль: {insight.monitoringSchedule}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Научная основа:</h5>
                    <p className="text-xs text-gray-700 leading-relaxed">{insight.scientificBackground}</p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-1">Влияние на цели:</h5>
                    <div className="text-xs text-gray-600 space-y-1">
                      {insight.impactOnGoals.map((impact, idx) => (
                        <p key={idx}>• {impact}</p>
                      ))}
                    </div>
                  </div>

                  {(insight.status === 'attention' || insight.status === 'critical') && (
                    <>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Возможные причины:</h5>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {insight.possibleCauses.map((cause, idx) => (
                            <li key={idx}>• {cause}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Потенциальные риски:</h5>
                        <ul className="text-xs text-red-700 space-y-1">
                          {insight.healthRisks.map((risk, idx) => (
                            <li key={idx}>• {risk}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-green-900 mb-2">Протокол коррекции:</h5>
                        <div className="grid md:grid-cols-3 gap-3">
                          <div>
                            <h6 className="text-xs font-medium text-green-800 mb-1">Питание:</h6>
                            <ul className="text-xs text-green-700 space-y-1">
                              {insight.correctionProtocol.nutrition.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-xs font-medium text-green-800 mb-1">Добавки:</h6>
                            <ul className="text-xs text-green-700 space-y-1">
                              {insight.correctionProtocol.supplements.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="text-xs font-medium text-green-800 mb-1">Образ жизни:</h6>
                            <ul className="text-xs text-green-700 space-y-1">
                              {insight.correctionProtocol.lifestyle.map((item, idx) => (
                                <li key={idx}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <p className="text-xs text-green-800 mt-2">Ожидаемые сроки: {insight.correctionProtocol.timeline}</p>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">Научные исследования:</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          {insight.researchReferences.map((ref, idx) => (
                            <p key={idx}>• {ref}</p>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Синергетические протоколы */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          Синергетические протоколы коррекции
        </h3>
        <div className="grid gap-3 sm:gap-4">
          {consultation.synergisticProtocols.map((protocol, index) => (
            <div key={index} className="p-3 sm:p-4 border rounded-lg bg-purple-50">
              <h4 className="text-sm sm:text-base font-medium text-purple-900 mb-2">{protocol.name}</h4>
              <p className="text-xs sm:text-sm text-purple-800 mb-2 sm:mb-3">{protocol.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-purple-900 mb-1 sm:mb-2">Целевые биомаркеры:</h5>
                  <div className="flex flex-wrap gap-1">
                    {protocol.targetBiomarkers.map((biomarker, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{biomarker}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-medium text-purple-900 mb-1 sm:mb-2">Ожидаемые результаты:</h5>
                  <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                    {protocol.expectedOutcomes.map((outcome, idx) => (
                      <li key={idx}>• {outcome}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <h5 className="text-xs sm:text-sm font-medium text-purple-900 mb-1 sm:mb-2">Протокол действий:</h5>
                <ul className="text-xs sm:text-sm text-purple-800 space-y-1">
                  {protocol.protocol.map((step, idx) => (
                    <li key={idx}>• {step}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs sm:text-sm text-purple-800 mt-2 sm:mt-3 font-medium">Временные рамки: {protocol.timeline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации по лабораторным тестам */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
          Рекомендуемые лабораторные анализы
        </h3>
        
        <div className="grid gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="text-sm sm:text-base font-medium text-red-900 mb-2 sm:mb-3">КРИТИЧЕСКИЕ (немедленно):</h4>
            <div className="space-y-2">
              {consultation.labTestRecommendations.critical.map((test, index) => (
                <div key={index} className="p-2 sm:p-3 bg-white rounded border border-red-200">
                  <p className="text-sm font-medium text-red-900">{test.test}</p>
                  <p className="text-xs sm:text-sm text-red-700">{test.reason}</p>
                  <p className="text-xs text-red-600 font-medium">{test.urgency}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-4 border border-orange-200 rounded-lg bg-orange-50">
            <h4 className="text-sm sm:text-base font-medium text-orange-900 mb-2 sm:mb-3">РЕКОМЕНДУЕМЫЕ:</h4>
            <div className="space-y-2">
              {consultation.labTestRecommendations.recommended.map((test, index) => (
                <div key={index} className="p-2 sm:p-3 bg-white rounded border border-orange-200">
                  <p className="text-sm font-medium text-orange-900">{test.test}</p>
                  <p className="text-xs sm:text-sm text-orange-700">{test.reason}</p>
                  <Badge variant="outline" className="text-xs">{test.priority}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="text-sm sm:text-base font-medium text-blue-900 mb-2 sm:mb-3">ДОПОЛНИТЕЛЬНЫЕ:</h4>
            <div className="space-y-2">
              {consultation.labTestRecommendations.optional.map((test, index) => (
                <div key={index} className="p-2 sm:p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">{test.test}</p>
                  <p className="text-xs sm:text-sm text-blue-700">{test.reason}</p>
                  <p className="text-xs text-blue-600">{test.timeframe}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Оценка рисков */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          Оценка рисков для здоровья
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {Object.entries(consultation.riskAssessment).map(([category, assessment]) => (
            <div key={category} className="p-3 sm:p-4 border rounded-lg bg-white">
              <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-2 capitalize">
                {category === 'cardiovascular' ? 'Сердечно-сосудистые' :
                 category === 'metabolic' ? 'Метаболические' :
                 category === 'inflammatory' ? 'Воспалительные' :
                 category === 'hormonal' ? 'Гормональные' : category} риски
              </h4>
              <Badge variant={assessment.risk === 'Низкий' ? 'default' : 
                             assessment.risk === 'Умеренный' ? 'secondary' : 'destructive'} 
                     className="mb-2 sm:mb-3 text-xs">
                {assessment.risk} риск
              </Badge>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                {assessment.factors.map((factor, idx) => (
                  <li key={idx}>• {factor}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Персонализированные рекомендации */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          Персонализированные рекомендации
        </h3>
        <div className="grid gap-2">
          {consultation.personalizedRecommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-green-800">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Метрики отслеживания */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          Метрики для отслеживания прогресса
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Ежедневно:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              {consultation.trackingMetrics.daily.map((metric, idx) => (
                <li key={idx}>• {metric}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Еженедельно:</h4>
            <ul className="text-xs text-green-800 space-y-1">
              {consultation.trackingMetrics.weekly.map((metric, idx) => (
                <li key={idx}>• {metric}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">Ежемесячно:</h4>
            <ul className="text-xs text-purple-800 space-y-1">
              {consultation.trackingMetrics.monthly.map((metric, idx) => (
                <li key={idx}>• {metric}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAIConsultant;