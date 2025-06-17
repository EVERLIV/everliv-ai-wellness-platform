
import { supabase } from "@/integrations/supabase/client";

export interface EnhancedHealthProfile {
  // Basic profile data
  age: number;
  gender: string;
  height: number;
  weight: number;
  
  // Lifestyle factors
  smokingStatus: string;
  physicalActivity: string;
  alcoholConsumption: string;
  sleepHours: number;
  stressLevel: number;
  exerciseFrequency: number;
  waterIntake: number;
  
  // Medical data
  medicalConditions: string[];
  familyHistory: string[];
  allergies: string[];
  medications: string[];
  
  // Additional health factors
  bloodPressure?: { systolic: number; diastolic: number };
  restingHeartRate?: number;
  mentalHealthScore?: number;
}

export interface LabResultAnalysis {
  criticalMarkers: { name: string; value: number; impact: number }[];
  metabolicMarkers: { name: string; value: number; impact: number }[];
  inflammatoryMarkers: { name: string; value: number; impact: number }[];
  overallLabScore: number;
}

export interface EnhancedHealthScore {
  totalScore: number;
  breakdown: {
    baseScore: number;
    ageAdjustment: number;
    lifestyleScore: number;
    medicalConditionsImpact: number;
    familyHistoryImpact: number;
    labResultsScore: number;
    mentalHealthScore: number;
  };
  riskLevel: 'низкий' | 'средний' | 'высокий' | 'критический';
  riskFactors: string[];
  protectiveFactors: string[];
  recommendations: {
    priority: 'высокий' | 'средний' | 'низкий';
    category: string;
    action: string;
    timeframe: string;
    impact: number;
  }[];
}

export class EnhancedHealthAnalyzer {
  private medicalConditionsWeights: Record<string, number> = {
    'диабет': -12,
    'гипертония': -10,
    'астма': -8,
    'сердечно-сосудистые заболевания': -15,
    'онкология': -20,
    'ожирение': -10,
    'депрессия': -8,
    'тревожность': -6,
    'артрит': -5,
    'остеопороз': -6,
    'гипотиреоз': -4,
    'гипертиреоз': -6
  };

  private familyHistoryWeights: Record<string, number> = {
    'сердечно-сосудистые заболевания': -8,
    'диабет': -6,
    'онкология': -10,
    'гипертония': -5,
    'инсульт': -8,
    'инфаркт': -8,
    'деменция': -6,
    'остеопороз': -3
  };

  private labMarkerWeights: Record<string, { optimal: number; weight: number }> = {
    'глюкоза': { optimal: 5.5, weight: 15 },
    'холестерин общий': { optimal: 5.0, weight: 12 },
    'лпнп': { optimal: 3.0, weight: 10 },
    'лпвп': { optimal: 1.3, weight: 8 },
    'триглицериды': { optimal: 1.7, weight: 8 },
    'креатинин': { optimal: 80, weight: 10 },
    'мочевина': { optimal: 6.0, weight: 6 },
    'алт': { optimal: 40, weight: 8 },
    'аст': { optimal: 40, weight: 8 },
    'соэ': { optimal: 15, weight: 6 },
    'с-реактивный белок': { optimal: 3.0, weight: 8 },
    'гемоглобин': { optimal: 140, weight: 10 }
  };

  calculateEnhancedHealthScore(
    profile: EnhancedHealthProfile,
    labResults?: any[]
  ): EnhancedHealthScore {
    let baseScore = 85; // Более оптимистичный базовый балл
    
    const breakdown = {
      baseScore: 85,
      ageAdjustment: 0,
      lifestyleScore: 0,
      medicalConditionsImpact: 0,
      familyHistoryImpact: 0,
      labResultsScore: 0,
      mentalHealthScore: 0
    };

    const riskFactors: string[] = [];
    const protectiveFactors: string[] = [];
    const recommendations: any[] = [];

    // 1. Возрастные корректировки
    const ageAdjustment = this.calculateAgeAdjustment(profile.age);
    breakdown.ageAdjustment = ageAdjustment;
    baseScore += ageAdjustment;

    // 2. Оценка образа жизни
    const lifestyleAnalysis = this.analyzeLifestyle(profile);
    breakdown.lifestyleScore = lifestyleAnalysis.score;
    baseScore += lifestyleAnalysis.score;
    riskFactors.push(...lifestyleAnalysis.risks);
    protectiveFactors.push(...lifestyleAnalysis.protective);
    recommendations.push(...lifestyleAnalysis.recommendations);

    // 3. Медицинские состояния
    const medicalImpact = this.analyzeMedicalConditions(profile.medicalConditions);
    breakdown.medicalConditionsImpact = medicalImpact.score;
    baseScore += medicalImpact.score;
    riskFactors.push(...medicalImpact.risks);
    recommendations.push(...medicalImpact.recommendations);

    // 4. Семейная история
    const familyImpact = this.analyzeFamilyHistory(profile.familyHistory || []);
    breakdown.familyHistoryImpact = familyImpact.score;
    baseScore += familyImpact.score;
    riskFactors.push(...familyImpact.risks);
    recommendations.push(...familyImpact.recommendations);

    // 5. Анализ лабораторных результатов
    if (labResults && labResults.length > 0) {
      const labAnalysis = this.analyzeLabResults(labResults);
      breakdown.labResultsScore = labAnalysis.overallLabScore;
      baseScore += labAnalysis.overallLabScore;
      recommendations.push(...this.generateLabRecommendations(labAnalysis));
    }

    // 6. Ментальное здоровье
    const mentalScore = this.analyzeMentalHealth(profile);
    breakdown.mentalHealthScore = mentalScore.score;
    baseScore += mentalScore.score;
    riskFactors.push(...mentalScore.risks);
    protectiveFactors.push(...mentalScore.protective);

    // Ограничиваем финальный балл
    const finalScore = Math.max(20, Math.min(100, baseScore));

    // Определяем уровень риска
    const riskLevel = this.determineRiskLevel(finalScore, riskFactors.length);

    // Сортируем рекомендации по приоритету
    recommendations.sort((a, b) => b.impact - a.impact);

    return {
      totalScore: finalScore,
      breakdown,
      riskLevel,
      riskFactors: [...new Set(riskFactors)], // Убираем дубликаты
      protectiveFactors: [...new Set(protectiveFactors)],
      recommendations: recommendations.slice(0, 8) // Топ-8 рекомендаций
    };
  }

  private calculateAgeAdjustment(age: number): number {
    if (age < 25) return 5; // Молодость - преимущество
    if (age < 35) return 2;
    if (age < 45) return 0;
    if (age < 55) return -3;
    if (age < 65) return -6;
    if (age < 75) return -10;
    return -15;
  }

  private analyzeLifestyle(profile: EnhancedHealthProfile) {
    let score = 0;
    const risks: string[] = [];
    const protective: string[] = [];
    const recommendations: any[] = [];

    // Курение
    if (profile.smokingStatus === 'regular') {
      score -= 20;
      risks.push('Регулярное курение');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Вредные привычки',
        action: 'Полный отказ от курения с медицинской поддержкой',
        timeframe: '3-6 месяцев',
        impact: 20
      });
    } else if (profile.smokingStatus === 'occasional') {
      score -= 10;
      risks.push('Эпизодическое курение');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Вредные привычки',
        action: 'Полный отказ от курения',
        timeframe: '1-3 месяца',
        impact: 10
      });
    } else if (profile.smokingStatus === 'never') {
      protective.push('Некурящий');
    }

    // Физическая активность
    if (profile.physicalActivity === 'sedentary') {
      score -= 15;
      risks.push('Сидячий образ жизни');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Физическая активность',
        action: 'Начать с 150 минут умеренной активности в неделю',
        timeframe: '1-2 месяца',
        impact: 15
      });
    } else if (profile.physicalActivity === 'active') {
      score += 8;
      protective.push('Активный образ жизни');
    } else if (profile.physicalActivity === 'very_active') {
      score += 12;
      protective.push('Очень активный образ жизни');
    }

    // Сон
    if (profile.sleepHours < 6) {
      score -= 12;
      risks.push('Критический недосып');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Сон',
        action: 'Нормализация режима сна до 7-9 часов',
        timeframe: '2-4 недели',
        impact: 12
      });
    } else if (profile.sleepHours < 7) {
      score -= 6;
      risks.push('Недостаток сна');
      recommendations.push({
        priority: 'средний' as const,
        category: 'Сон',
        action: 'Увеличение продолжительности сна',
        timeframe: '2-3 недели',
        impact: 6
      });
    } else if (profile.sleepHours >= 7 && profile.sleepHours <= 9) {
      score += 5;
      protective.push('Здоровый режим сна');
    }

    // Стресс
    if (profile.stressLevel > 8) {
      score -= 12;
      risks.push('Высокий уровень стресса');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Ментальное здоровье',
        action: 'Техники управления стрессом, возможна консультация психолога',
        timeframe: '1-3 месяца',
        impact: 12
      });
    } else if (profile.stressLevel > 6) {
      score -= 6;
      risks.push('Повышенный стресс');
      recommendations.push({
        priority: 'средний' as const,
        category: 'Ментальное здоровье',
        action: 'Медитация, дыхательные практики',
        timeframe: '3-6 недель',
        impact: 6
      });
    }

    // Алкоголь
    if (profile.alcoholConsumption === 'heavy') {
      score -= 15;
      risks.push('Злоупотребление алкоголем');
      recommendations.push({
        priority: 'высокий' as const,
        category: 'Вредные привычки',
        action: 'Значительное сокращение потребления алкоголя',
        timeframe: '1-6 месяцев',
        impact: 15
      });
    } else if (profile.alcoholConsumption === 'moderate') {
      score -= 3;
    } else if (profile.alcoholConsumption === 'none') {
      protective.push('Не употребляет алкоголь');
    }

    return { score, risks, protective, recommendations };
  }

  private analyzeMedicalConditions(conditions: string[]) {
    let score = 0;
    const risks: string[] = [];
    const recommendations: any[] = [];

    conditions.forEach(condition => {
      const normalizedCondition = condition.toLowerCase();
      const weight = this.medicalConditionsWeights[normalizedCondition] || -5;
      score += weight;
      risks.push(`Диагноз: ${condition}`);
      
      // Специфичные рекомендации по заболеваниям
      if (normalizedCondition.includes('диабет')) {
        recommendations.push({
          priority: 'высокий' as const,
          category: 'Медицинский контроль',
          action: 'Регулярный мониторинг глюкозы, консультации эндокринолога',
          timeframe: 'постоянно',
          impact: Math.abs(weight)
        });
      } else if (normalizedCondition.includes('гипертония')) {
        recommendations.push({
          priority: 'высокий' as const,
          category: 'Медицинский контроль',
          action: 'Контроль артериального давления, консультации кардиолога',
          timeframe: 'постоянно',
          impact: Math.abs(weight)
        });
      }
    });

    return { score, risks, recommendations };
  }

  private analyzeFamilyHistory(familyHistory: string[]) {
    let score = 0;
    const risks: string[] = [];
    const recommendations: any[] = [];

    familyHistory.forEach(condition => {
      const normalizedCondition = condition.toLowerCase();
      const weight = this.familyHistoryWeights[normalizedCondition] || -3;
      score += weight;
      risks.push(`Семейная история: ${condition}`);
      
      if (normalizedCondition.includes('онкология')) {
        recommendations.push({
          priority: 'высокий' as const,
          category: 'Профилактика',
          action: 'Регулярные онкоскрининги, консультация генетика',
          timeframe: 'ежегодно',
          impact: Math.abs(weight)
        });
      }
    });

    return { score, risks, recommendations };
  }

  private analyzeLabResults(labResults: any[]): LabResultAnalysis {
    const criticalMarkers: any[] = [];
    const metabolicMarkers: any[] = [];
    const inflammatoryMarkers: any[] = [];
    let totalImpact = 0;

    labResults.forEach(analysis => {
      if (analysis.results?.markers) {
        analysis.results.markers.forEach((marker: any) => {
          const normalizedName = marker.name.toLowerCase();
          const markerConfig = this.labMarkerWeights[normalizedName];
          
          if (markerConfig) {
            const numericValue = parseFloat(marker.value);
            if (!isNaN(numericValue)) {
              const deviation = Math.abs(numericValue - markerConfig.optimal) / markerConfig.optimal;
              const impact = deviation * markerConfig.weight;
              
              const markerData = {
                name: marker.name,
                value: numericValue,
                impact: impact
              };

              // Классификация маркеров
              if (['глюкоза', 'холестерин общий', 'лпнп', 'лпвп', 'триглицериды'].includes(normalizedName)) {
                metabolicMarkers.push(markerData);
              } else if (['соэ', 'с-реактивный белок'].includes(normalizedName)) {
                inflammatoryMarkers.push(markerData);
              } else {
                criticalMarkers.push(markerData);
              }

              totalImpact += impact;
            }
          }
        });
      }
    });

    // Переводим в балльную систему (максимальный негативный импакт -30 баллов)
    const overallLabScore = Math.max(-30, -totalImpact);

    return {
      criticalMarkers,
      metabolicMarkers,
      inflammatoryMarkers,
      overallLabScore
    };
  }

  private generateLabRecommendations(labAnalysis: LabResultAnalysis) {
    const recommendations: any[] = [];

    // Рекомендации по метаболическим маркерам
    if (labAnalysis.metabolicMarkers.length > 0) {
      const avgImpact = labAnalysis.metabolicMarkers.reduce((sum, m) => sum + m.impact, 0) / labAnalysis.metabolicMarkers.length;
      if (avgImpact > 5) {
        recommendations.push({
          priority: 'высокий' as const,
          category: 'Метаболизм',
          action: 'Консультация эндокринолога, корректировка питания',
          timeframe: '1-2 месяца',
          impact: avgImpact
        });
      }
    }

    // Рекомендации по воспалительным маркерам
    if (labAnalysis.inflammatoryMarkers.length > 0) {
      const avgImpact = labAnalysis.inflammatoryMarkers.reduce((sum, m) => sum + m.impact, 0) / labAnalysis.inflammatoryMarkers.length;
      if (avgImpact > 3) {
        recommendations.push({
          priority: 'средний' as const,
          category: 'Воспаление',
          action: 'Противовоспалительная диета, дополнительное обследование',
          timeframe: '2-4 недели',
          impact: avgImpact
        });
      }
    }

    return recommendations;
  }

  private analyzeMentalHealth(profile: EnhancedHealthProfile) {
    let score = 0;
    const risks: string[] = [];
    const protective: string[] = [];

    if (profile.mentalHealthScore) {
      if (profile.mentalHealthScore >= 80) {
        score += 8;
        protective.push('Отличное ментальное здоровье');
      } else if (profile.mentalHealthScore >= 60) {
        score += 3;
      } else if (profile.mentalHealthScore < 40) {
        score -= 10;
        risks.push('Проблемы с ментальным здоровьем');
      }
    }

    return { score, risks, protective };
  }

  private determineRiskLevel(score: number, riskFactorCount: number): 'низкий' | 'средний' | 'высокий' | 'критический' {
    if (score < 40 || riskFactorCount >= 5) return 'критический';
    if (score < 60 || riskFactorCount >= 3) return 'высокий';
    if (score < 75 || riskFactorCount >= 1) return 'средний';
    return 'низкий';
  }
}
