
import { Activity, Heart, Clock, Brain, Target } from 'lucide-react';
import { CategoryColors } from './types';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'exercise': return Activity;
    case 'nutrition': return Heart;
    case 'sleep': return Clock;
    case 'stress': return Brain;
    default: return Target;
  }
};

export const getCategoryColors = (category: string): CategoryColors => {
  switch (category) {
    case 'exercise': 
      return {
        bg: 'from-purple-50 to-indigo-50',
        border: 'border-purple-100',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      };
    case 'nutrition':
      return {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-100',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    case 'sleep':
      return {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-100',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
    case 'stress':
      return {
        bg: 'from-amber-50 to-orange-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      };
    default:
      return {
        bg: 'from-gray-50 to-slate-50',
        border: 'border-gray-100',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600'
      };
  }
};
