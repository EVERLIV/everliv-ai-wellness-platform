// Универсальные переводы для целей здоровья
export const GOAL_TRANSLATIONS = {
  // Заголовки и названия секций
  'Health Goals': 'Цели здоровья',
  'health goals': 'цели здоровья', 
  'Goals': 'Цели',
  'goals': 'цели',
  'Your Goals': 'Ваши цели',
  'your goals': 'ваши цели',
  'Health Goal': 'Цель здоровья',
  'health goal': 'цель здоровья',
  'Goal': 'Цель',
  'goal': 'цель',
  
  // Конкретные цели здоровья
  'cognitive': 'Улучшение когнитивных функций',
  'cardiovascular': 'Здоровье сердечно-сосудистой системы',
  'weight_loss': 'Снижение веса',
  'muscle_gain': 'Набор мышечной массы',
  'energy_boost': 'Повышение энергии',
  'sleep_improvement': 'Улучшение сна',
  'stress_reduction': 'Снижение стресса',
  'immunity_boost': 'Укрепление иммунитета',
  'longevity': 'Увеличение продолжительности жизни',
  'hormonal_balance': 'Гормональный баланс',
  'digestive_health': 'Здоровье пищеварения',
  'skin_health': 'Здоровье кожи',
  'biological_age': 'Улучшение биологического возраста',
  'metabolic_health': 'Метаболическое здоровье',
  'bone_health': 'Здоровье костей',
  'mental_health': 'Психическое здоровье',
  'detox': 'Детоксикация организма',
  'athletic_performance': 'Спортивные результаты',
  'musculoskeletal': 'Здоровье опорно-двигательного аппарата',
  'metabolism': 'Улучшение метаболизма',

  // Действия
  'Add Goal': 'Добавить цель',
  'add goal': 'добавить цель',
  'Create Goal': 'Создать цель',
  'create goal': 'создать цель',
  'Edit Goal': 'Изменить цель',
  'edit goal': 'изменить цель',
  'Delete Goal': 'Удалить цель',
  'delete goal': 'удалить цель',
  'Set Goal': 'Установить цель',
  'set goal': 'установить цель',

  // Сообщения
  'No goals set': 'Цели не установлены',
  'no goals set': 'цели не установлены',
  'Goal added successfully': 'Цель успешно добавлена',
  'Goal updated successfully': 'Цель успешно обновлена',
  'Goal deleted successfully': 'Цель успешно удалена',
};

// Функция для автоматического перевода любого текста, связанного с целями
export const translateGoalText = (text: string): string => {
  if (!text) return text;
  
  // Проверяем прямое соответствие
  if (GOAL_TRANSLATIONS[text as keyof typeof GOAL_TRANSLATIONS]) {
    return GOAL_TRANSLATIONS[text as keyof typeof GOAL_TRANSLATIONS];
  }
  
  // Проверяем частичное соответствие (для случаев, когда текст содержит цель)
  for (const [english, russian] of Object.entries(GOAL_TRANSLATIONS)) {
    if (text.toLowerCase().includes(english.toLowerCase())) {
      return text.replace(new RegExp(english, 'gi'), russian);
    }
  }
  
  return text;
};

// Функция для перевода массива целей
export const translateGoalsArray = (goals: string[]): string[] => {
  return goals.map(goal => translateGoalText(goal));
};

// Функция для перевода конкретной цели здоровья
export const translateHealthGoal = (goal: string): string => {
  return GOAL_TRANSLATIONS[goal as keyof typeof GOAL_TRANSLATIONS] || goal;
};