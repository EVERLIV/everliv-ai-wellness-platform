import React from 'react';
import { toast } from 'sonner';
import { Trophy, Star, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'target' | 'zap';
  points: number;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_analysis',
    title: 'Первый шаг к здоровью',
    description: 'Вы заполнили свой первый биомаркер',
    icon: 'star',
    points: 10,
    color: 'blue'
  },
  {
    id: 'basic_complete',
    title: 'Базовый анализ',
    description: 'Заполнено 8 основных биомаркеров',
    icon: 'target',
    points: 50,
    color: 'green'
  },
  {
    id: 'extended_complete',
    title: 'Продвинутый уровень',
    description: 'Заполнено 16 биомаркеров',
    icon: 'zap',
    points: 100,
    color: 'orange'
  },
  {
    id: 'comprehensive_complete',
    title: 'Мастер биомаркеров',
    description: 'Полный анализ - 24 биомаркера',
    icon: 'trophy',
    points: 200,
    color: 'purple'
  },
  {
    id: 'perfect_category',
    title: 'Идеальная категория',
    description: 'Все показатели в одной категории в норме',
    icon: 'star',
    points: 75,
    color: 'green'
  }
];

const getIcon = (iconType: Achievement['icon']) => {
  switch (iconType) {
    case 'trophy':
      return Trophy;
    case 'star':
      return Star;
    case 'target':
      return Target;
    case 'zap':
      return Zap;
    default:
      return Star;
  }
};

const getColorClasses = (color: string) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100'
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export const showAchievementToast = (achievementId: string) => {
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return;

  const Icon = getIcon(achievement.icon);
  const colorClasses = getColorClasses(achievement.color);

  toast.custom((t) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              +{achievement.points} очков
            </span>
          </div>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
      </div>
    </div>
  ), {
    duration: 4000,
    position: 'top-right'
  });
};

export const checkAchievements = (filledCount: number, biomarkers: any[]) => {
  // Check for completion milestones
  if (filledCount === 1) {
    showAchievementToast('first_analysis');
  }
  if (filledCount === 8) {
    showAchievementToast('basic_complete');
  }
  if (filledCount === 16) {
    showAchievementToast('extended_complete');
  }
  if (filledCount === 24) {
    showAchievementToast('comprehensive_complete');
  }

  // Check for perfect category
  const categories = ['cardiovascular', 'metabolic', 'hormonal', 'inflammatory', 'oxidative_stress', 'kidney_function', 'liver_function'];
  
  categories.forEach(category => {
    const categoryBiomarkers = biomarkers.filter(b => b.category === category && b.status === 'filled');
    const perfectMarkers = categoryBiomarkers.filter(b => {
      if (!b.value || !b.normal_range) return false;
      const { min, max } = b.normal_range;
      return b.value >= min && b.value <= max;
    });
    
    if (categoryBiomarkers.length >= 3 && perfectMarkers.length === categoryBiomarkers.length) {
      showAchievementToast('perfect_category');
    }
  });
};