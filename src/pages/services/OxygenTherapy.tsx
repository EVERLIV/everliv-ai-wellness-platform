
import React from 'react';
import { Heart, Activity, Thermometer, Brain } from 'lucide-react';
import ServicePageLayout from '@/components/services/ServicePageLayout';

const OxygenTherapy = () => {
  const hero = {
    title: 'Кислородная терапия',
    subtitle: 'Ускорение восстановления и улучшение клеточного здоровья',
    description: 'Кислородная терапия – это метод, использующий повышенную концентрацию кислорода для улучшения функционирования клеток и тканей. Наши протоколы разработаны для достижения максимального терапевтического эффекта и безопасного применения.'
  };

  const benefits = [
    {
      title: 'Ускорение восстановления',
      description: 'Повышенное снабжение тканей кислородом ускоряет заживление и восстановление после физических нагрузок',
      icon: <Activity className="h-8 w-8" />
    },
    {
      title: 'Улучшение клеточного здоровья',
      description: 'Оптимизация митохондриальной функции и энергетического обмена на клеточном уровне',
      icon: <Heart className="h-8 w-8" />
    },
    {
      title: 'Гипербарическая оксигенация',
      description: 'Специализированная терапия с использованием 100% кислорода под повышенным давлением',
      icon: <Thermometer className="h-8 w-8" />
    },
    {
      title: 'Противовоспалительное действие',
      description: 'Снижение воспалительных процессов и окислительного стресса в организме',
      icon: <Brain className="h-8 w-8" />
    }
  ];

  // Placeholder content that would be expanded in a full implementation
  const scientificBackground = (
    <div>
      <p className="mb-4">
        Кислородная терапия основана на повышении парциального давления кислорода в тканях, что влияет на множество биохимических процессов в организме. Современные исследования показывают её эффективность при различных состояниях.
      </p>
      <p>
        Детальное научное обоснование методов кислородной терапии будет представлено в полной версии страницы.
      </p>
    </div>
  );

  const protocols = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Протоколы кислородной терапии будут представлены в полной версии страницы.</p>
    </div>
  );

  const casesStudies = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Примеры результатов применения кислородной терапии будут представлены в полной версии страницы.</p>
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

export default OxygenTherapy;
