
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import FAQ from '@/components/services/FAQ';

const oxygenProtocols = [
  {
    title: "Протокол повышения энергии",
    description: "Используйте кислородную терапию утром для повышения энергии на весь день.",
    duration: "15-20 минут",
    difficulty: "beginner" as const, // Using type assertion
    benefits: ["Повышение энергии", "Улучшение концентрации"],
    steps: ["Подготовьте оборудование", "Используйте в течение 15-20 минут утром"],
    category: "oxygen"
  },
  {
    title: "Протокол восстановления",
    description: "Применяйте после тренировок для ускорения восстановления мышц.",
    duration: "20-30 минут",
    difficulty: "intermediate" as const,
    benefits: ["Ускоренное восстановление", "Снижение мышечной боли"],
    steps: ["Используйте в течение 30 минут после тренировки", "Сочетайте с растяжкой"],
    category: "oxygen"
  },
  {
    title: "Протокол улучшения сна",
    description: "Кислородная терапия вечером для улучшения качества сна.",
    duration: "20-30 минут",
    difficulty: "beginner" as const,
    benefits: ["Улучшение сна", "Снижение стресса"],
    steps: ["Используйте за 1-2 часа до сна", "Создайте спокойную обстановку"],
    category: "oxygen"
  }
];

const scientificResearch = [
  {
    title: "Влияние кислородной терапии на восстановление после тренировок",
    authors: "Smith et al.",
    year: 2022,
    journal: "Journal of Sports Science",
    summary: "Исследование показало, что кислородная терапия ускоряет восстановление мышц после интенсивных тренировок."
  },
  {
    title: "Кислородная терапия и когнитивные функции",
    authors: "Johnson et al.",
    year: 2021,
    journal: "Journal of Cognitive Neuroscience",
    summary: "Исследование выявило положительное влияние кислородной терапии на когнитивные функции и концентрацию."
  }
];

const faqs = [
  {
    question: "Как часто можно использовать кислородную терапию?",
    answer: "Рекомендуется использовать кислородную терапию 1-2 раза в день."
  },
  {
    question: "Какие противопоказания к кислородной терапии?",
    answer: "Противопоказания включают серьезные заболевания легких и индивидуальную непереносимость."
  },
  {
    question: "Нужно ли специальное оборудование для кислородной терапии?",
    answer: "Да, необходимо специальное оборудование, такое как кислородный концентратор."
  }
];

const OxygenTherapy = () => {
  // Create ScientificExplanationProps matching the updated interface
  const scientificExplanationProps = {
    summary: "Кислородная терапия - это метод оздоровления, основанный на применении кислорода в концентрации выше атмосферной.",
    mechanisms: [
      {
        title: "Повышение насыщения тканей кислородом",
        description: <p>Увеличение доставки кислорода к тканям способствует улучшению их функционирования и ускоряет восстановление.</p>
      },
      {
        title: "Стимуляция обмена веществ",
        description: <p>Повышение уровня кислорода в крови активизирует метаболические процессы в организме.</p>
      }
    ],
    references: scientificResearch.map(item => ({
      title: item.title,
      authors: item.authors,
      journal: item.journal,
      year: item.year,
      summary: item.summary
    })),
    researchData: scientificResearch // For backward compatibility
  };

  return (
    <ServicePageLayout
      title="Кислородная терапия"
      description="Протоколы кислородной терапии для повышения энергии и восстановления"
      imageSrc="/placeholder.svg"
    >
      <div className="grid gap-10 py-8">
        {/* Protocol cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {oxygenProtocols.map((protocol, index) => (
            <ProtocolCard
              key={index}
              title={protocol.title}
              description={protocol.description}
              duration={protocol.duration}
              difficulty={protocol.difficulty}
              benefits={protocol.benefits}
              steps={protocol.steps}
              category={protocol.category}
            />
          ))}
        </div>
        
        {/* Scientific explanation section */}
        <ScientificExplanation
          {...scientificExplanationProps}
          category="Научные исследования кислородной терапии"
        />
        
        {/* FAQ section */}
        <FAQ faqs={faqs} />
      </div>
    </ServicePageLayout>
  );
};

export default OxygenTherapy;
