
import { TestRecommendation } from '@/types/detailedRecommendations';

export const generateTestRecommendations = (): TestRecommendation[] => {
  const tests: TestRecommendation[] = [];

  // Базовые анализы
  tests.push({
    id: 'general-blood',
    testName: 'Общий анализ крови',
    priority: 'medium',
    frequency: 'Раз в год',
    reason: 'Базовая оценка состояния здоровья',
    preparation: ['Сдавать натощак', 'Исключить алкоголь за 24 часа'],
    expectedCost: '500-800₽',
    whereToGet: 'Любая лаборатория',
    whatItChecks: ['Гемоглобин', 'Лейкоциты', 'Тромбоциты', 'СОЭ']
  });

  tests.push({
    id: 'biochemistry',
    testName: 'Биохимический анализ крови',
    priority: 'high',
    frequency: 'Раз в год',
    reason: 'Оценка функции органов',
    preparation: ['Строго натощак 12 часов', 'Исключить физические нагрузки'],
    expectedCost: '1500-3000₽',
    whereToGet: 'Лаборатории (Инвитро, Гемотест)',
    whatItChecks: ['Глюкоза', 'Холестерин', 'Печеночные пробы', 'Почечные показатели']
  });

  return tests;
};
