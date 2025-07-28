
import React from 'react';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { getBiomarkerImpact } from '@/services/ai/biomarker-impact-analysis';
import BiomarkerCard from './BiomarkerCard';
import { 
  Heart, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Droplet, 
  Shield, 
  Pill, 
  Dna,
  Info,
  TrendingUp,
  Target,
  CheckCircle,
  BarChart3,
  CircleCheck
} from 'lucide-react';

interface BiomarkerCategoriesProps {
  biomarkers: Biomarker[];
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

const BiomarkerCategories: React.FC<BiomarkerCategoriesProps> = ({
  biomarkers,
  onValueChange,
  healthProfile
}) => {
  const getCategoryInfo = (category: string) => {
    const info = {
      'cardiovascular': {
        title: 'Сердечно-сосудистая система',
        icon: Heart,
        color: 'border-l-red-500',
        bgColor: 'bg-red-50',
        description: 'Показатели работы сердца и сосудов',
        priority: 1,
        impact: 'high'
      },
      'metabolic': {
        title: 'Метаболические маркеры',
        icon: Activity,
        color: 'border-l-blue-500',
        bgColor: 'bg-blue-50',
        description: 'Обмен веществ и энергетический баланс',
        priority: 2,
        impact: 'high'
      },
      'inflammatory': {
        title: 'Воспалительные маркеры',
        icon: AlertTriangle,
        color: 'border-l-orange-500',
        bgColor: 'bg-orange-50',
        description: 'Воспалительные процессы в организме',
        priority: 3,
        impact: 'medium'
      },
      'hormonal': {
        title: 'Гормональная система',
        icon: Zap,
        color: 'border-l-purple-500',
        bgColor: 'bg-purple-50',
        description: 'Гормональный баланс организма',
        priority: 4,
        impact: 'medium'
      },
      'kidney_function': {
        title: 'Почечная функция',
        icon: Droplet,
        color: 'border-l-green-500',
        bgColor: 'bg-green-50',
        description: 'Работа почек и выделительной системы',
        priority: 5,
        impact: 'medium'
      },
      'liver_function': {
        title: 'Печеночная функция',
        icon: Pill,
        color: 'border-l-teal-500',
        bgColor: 'bg-teal-50',
        description: 'Функция печени и детоксикация',
        priority: 6,
        impact: 'medium'
      },
      'oxidative_stress': {
        title: 'Окислительный стресс',
        icon: Shield,
        color: 'border-l-yellow-500',
        bgColor: 'bg-yellow-50',
        description: 'Защита от свободных радикалов',
        priority: 7,
        impact: 'low'
      },
      'telomeres_epigenetics': {
        title: 'Теломеры и эпигенетика',
        icon: Dna,
        color: 'border-l-pink-500',
        bgColor: 'bg-pink-50',
        description: 'Генетические маркеры старения',
        priority: 8,
        impact: 'low'
      }
    };
    return info[category as keyof typeof info] || {
      title: category,
      icon: Activity,
      color: 'border-l-gray-400',
      bgColor: 'bg-gray-50',
      description: '',
      priority: 9,
      impact: 'low' as const
    };
  };

  const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  const getTotalFilledCount = () => {
    return biomarkers.filter(b => b.value !== undefined && b.value !== null).length;
  };

  const getCategoryProgress = (categoryBiomarkers: Biomarker[]) => {
    const filled = categoryBiomarkers.filter(b => b.value !== undefined && b.value !== null).length;
    const total = categoryBiomarkers.length;
    return { filled, total, percentage: total > 0 ? (filled / total) * 100 : 0 };
  };

  const getOverallAccuracy = () => {
    const totalFilled = getTotalFilledCount();
    const totalBiomarkers = biomarkers.length;
    if (totalFilled === 0) return 0;
    if (totalFilled <= 5) return 25;
    if (totalFilled <= 10) return 50;
    if (totalFilled <= 15) return 75;
    return 90;
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return { text: 'Высокое влияние', color: 'bg-red-100 text-red-700 border-red-200' };
      case 'medium':
        return { text: 'Среднее влияние', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'low':
        return { text: 'Низкое влияние', color: 'bg-green-100 text-green-700 border-green-200' };
      default:
        return { text: 'Базовое влияние', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  // Сортируем категории по приоритету
  const sortedCategories = Object.entries(categorizedBiomarkers).sort(([a], [b]) => {
    const infoA = getCategoryInfo(a);
    const infoB = getCategoryInfo(b);
    return infoA.priority - infoB.priority;
  });

  return (
    <div className="space-y-4">
      {/* Информационный заголовок */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h2 className="bio-text-base font-semibold text-gray-900">
              Профиль здоровья по категориям
            </h2>
            <p className="bio-text-small text-gray-700">
              Введите результаты анализов для точного расчета биологического возраста. 
              Чем больше показателей заполнено, тем выше точность расчета.
            </p>
            <div className="flex items-center gap-4 bio-text-caption text-gray-600">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Заполнено: {getTotalFilledCount()} из {biomarkers.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Точность: {getOverallAccuracy()}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="space-y-3">
        {sortedCategories.map(([category, categoryBiomarkers]) => {
          const categoryInfo = getCategoryInfo(category);
          const progress = getCategoryProgress(categoryBiomarkers);
          const impactBadge = getImpactBadge(categoryInfo.impact);
          const IconComponent = categoryInfo.icon;

          return (
            <div key={category} className={`border border-gray-200 bg-white border-l-4 ${categoryInfo.color} rounded-r-lg overflow-hidden`}>
              {/* Заголовок категории с прогрессом */}
              <div className={`p-3 border-b border-gray-200 ${categoryInfo.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="bio-text-small font-medium text-gray-900">
                        {categoryInfo.title}
                      </h3>
                      <p className="bio-text-caption text-gray-600">
                        {categoryInfo.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full border bio-text-caption font-medium ${impactBadge.color}`}>
                      {impactBadge.text}
                    </span>
                    <div className="text-right">
                      <div className="bio-text-caption font-medium text-gray-900">
                        {progress.filled}/{progress.total}
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Биомаркеры */}
              <div className="p-3">
                {progress.filled > 0 && (
                  <div className="mb-3 flex items-center gap-2 bio-text-caption text-green-600">
                    <CircleCheck className="h-4 w-4" />
                    <span>Заполнено {progress.filled} из {progress.total} показателей</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryBiomarkers.map(biomarker => (
                    <BiomarkerCard
                      key={biomarker.id}
                      biomarker={biomarker}
                      onValueChange={onValueChange}
                      healthProfile={healthProfile}
                      showAddButton={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Мотивационный блок */}
      {getTotalFilledCount() > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="bio-text-small font-medium text-green-900 mb-1">
                Отличная работа! 
              </h4>
              <p className="bio-text-caption text-green-700">
                Вы заполнили {getTotalFilledCount()} показателей. 
                {getTotalFilledCount() < 10 
                  ? " Добавьте еще несколько анализов для повышения точности расчета." 
                  : " У вас достаточно данных для точного расчета биологического возраста!"
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Расшифровка цветовых индикаторов */}
      {getTotalFilledCount() > 0 && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="bio-text-small font-medium mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Обозначения
          </h4>
          <div className="bio-text-caption space-y-2">
            {/* Влияние на биологический возраст */}
            <div>
              <div className="bio-text-caption font-medium mb-1">Влияние на биологический возраст:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Высокое влияние</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Среднее влияние</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Низкое влияние</span>
                </div>
              </div>
            </div>
            
            {/* Статус показателей */}
            <div>
              <div className="bio-text-caption font-medium mb-1">Фон карточки - статус показателя:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-green-50 border border-green-200 rounded"></div>
                  <span>В норме</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-50 border border-red-200 rounded"></div>
                  <span>Выше нормы</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                  <span>Ниже нормы</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomarkerCategories;
