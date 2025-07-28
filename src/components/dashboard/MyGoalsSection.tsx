import React from 'react';
import { Target } from 'lucide-react';

interface Goal {
  id: string;
  text: string;
  type: 'manual' | 'selected';
  category?: string;
}

const MyGoalsSection: React.FC = () => {
  // Моковые данные целей для демонстрации
  const goals: Goal[] = [
    {
      id: '1',
      text: 'Снизить вес на 5 кг до лета',
      type: 'manual'
    },
    {
      id: '2', 
      text: 'Пить больше воды каждый день',
      type: 'manual'
    },
    {
      id: '3',
      text: 'Улучшить качество сна',
      type: 'selected',
      category: 'health'
    },
    {
      id: '4',
      text: 'Заниматься спортом 3 раза в неделю',
      type: 'selected',
      category: 'fitness'
    }
  ];

  const manualGoals = goals.filter(goal => goal.type === 'manual');
  const selectedGoals = goals.filter(goal => goal.type === 'selected');

  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/40 rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Target className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Мои цели</h2>
      </div>

      <div className="space-y-4">
        {/* Ручные цели */}
        {manualGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Личные цели</h3>
            <div className="space-y-2">
              {manualGoals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700 leading-relaxed">{goal.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Выбранные цели */}
        {selectedGoals.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Рекомендованные цели</h3>
            <div className="space-y-2">
              {selectedGoals.map((goal) => (
                <div key={goal.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">{goal.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Пустое состояние */}
        {goals.length === 0 && (
          <div className="text-center py-4">
            <Target className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-3">У вас пока нет целей</p>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Добавить первую цель
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGoalsSection;