
import React from 'react';
import { FlaskRound, Heart, Brain, Thermometer } from 'lucide-react';
import ServicePageLayout from '@/components/services/ServicePageLayout';

const PersonalizedSupplements = () => {
  const hero = {
    title: 'Персонализированные добавки',
    subtitle: 'Научно обоснованный подход к нутрицевтикам и биорегуляторам',
    description: 'Персонализированный подход к добавкам и нутрицевтикам, основанный на индивидуальных биомаркерах и потребностях организма. Наши протоколы разработаны на основе последних научных данных и адаптированы для каждого клиента.'
  };

  const benefits = [
    {
      title: 'Нутрицевтики',
      description: 'Биологически активные вещества, оказывающие направленное действие на определенные системы организма',
      icon: <FlaskRound className="h-8 w-8" />
    },
    {
      title: 'Адаптогены',
      description: 'Природные вещества, повышающие неспецифическую сопротивляемость организма к стрессу различной природы',
      icon: <Brain className="h-8 w-8" />
    },
    {
      title: 'Пробиотики',
      description: 'Живые микроорганизмы, которые при применении в адекватных количествах оказывают оздоровительный эффект',
      icon: <Heart className="h-8 w-8" />
    },
    {
      title: 'Сенолитики',
      description: 'Компоненты, способствующие удалению стареющих (сенесцентных) клеток из организма',
      icon: <Thermometer className="h-8 w-8" />
    }
  ];

  // Placeholder content that would be expanded in a full implementation
  const scientificBackground = (
    <div>
      <p className="mb-4">
        Персонализированный подход к добавкам основан на анализе индивидуальных биохимических показателей, генетических особенностей и микробиома. Современная наука позволяет определить оптимальный набор нутриентов для конкретного человека.
      </p>
      <p>
        Детальное научное обоснование применения персонализированных добавок будет представлено в полной версии страницы.
      </p>
    </div>
  );

  const protocols = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Протоколы применения персонализированных добавок будут представлены в полной версии страницы.</p>
    </div>
  );

  const casesStudies = (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <p>Примеры результатов применения персонализированных добавок будут представлены в полной версии страницы.</p>
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

export default PersonalizedSupplements;
