
import React from 'react';
import { Brain, Activity, Heart, Thermometer } from 'lucide-react';
import ServicePageLayout from '@/components/services/ServicePageLayout';

const BreathingPractices = () => {
  const hero = {
    title: 'Дыхательные практики',
    subtitle: 'Снижение стресса и улучшение когнитивных функций',
    description: 'Дыхательные техники – один из самых доступных и эффективных инструментов улучшения физического и ментального здоровья. Наши методики основаны на древних практиках и подтверждены современными научными исследованиями.'
  };

  const benefits = [
    {
      title: 'Снижение уровня стресса',
      description: 'Осознанное дыхание активирует парасимпатическую нервную систему, снижая уровень стрессовых гормонов',
      icon: <Brain className="h-8 w-8" />
    },
    {
      title: 'Улучшение когнитивных функций',
      description: 'Правильное дыхание улучшает кровоснабжение мозга, повышая концентрацию и ясность мышления',
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: 'Нормализация кислотно-щелочного баланса',
      description: 'Определенные дыхательные техники помогают оптимизировать pH крови и тканей',
      icon: <Thermometer className="h-8 w-8" />
    },
    {
      title: 'Повышение энергетического потенциала',
      description: 'Дыхательные практики улучшают оксигенацию тканей и энергетический обмен в клетках',
      icon: <Heart className="h-8 w-8" />
    }
  ];

  // Placeholder content that would be expanded in a full implementation
  const scientificBackground = (
    <div>
      <p className="mb-4">
        Дыхательные практики воздействуют на организм через несколько ключевых механизмов, включая регуляцию вегетативной нервной системы, оптимизацию газообмена и влияние на воспалительные процессы.
      </p>
      <p>
        Детальное научное обоснование дыхательных методик будет представлено в полной версии страницы.
      </p>
    </div>
  );

  const protocols = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Протоколы дыхательных практик будут представлены в полной версии страницы.</p>
    </div>
  );

  const casesStudies = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Примеры результатов применения дыхательных методик будут представлены в полной версии страницы.</p>
    </div>
  );

  return (
    <ServicePageLayout
      hero={hero}
      benefits={benefits}
      scientificBackground={scientificBackground}
      protocols={protocols}
      casesStudies={casesStudies}
    />
  );
};

export default BreathingPractices;
