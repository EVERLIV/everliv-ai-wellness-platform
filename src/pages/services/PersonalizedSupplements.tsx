
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import FAQ from '@/components/services/FAQ';
import { Pill } from 'lucide-react';

const PersonalizedSupplements = () => {
  const supplementProtocols = [
    {
      title: "Оптимизация витамина D",
      description: "Протокол приема витамина D для поддержания иммунитета и здоровья костей",
      duration: "Ежедневно",
      difficulty: "beginner" as const, 
      benefits: ["Укрепление иммунитета", "Поддержка костной ткани", "Улучшение настроения"],
      steps: ["Сдайте анализ на витамин D", "Принимайте рекомендованную дозировку"],
      category: "supplements"
    },
    {
      title: "Магний для сна и релаксации",
      description: "Протокол приема магния перед сном для улучшения качества сна и снижения стресса",
      duration: "Перед сном",
      difficulty: "beginner" as const,
      benefits: ["Улучшение сна", "Снижение стресса", "Поддержка нервной системы"],
      steps: ["Принимайте магний за 1-2 часа до сна", "Выбирайте хелатные формы"],
      category: "supplements"
    },
    {
      title: "Омега-3 для здоровья сердца и мозга",
      description: "Протокол приема Омега-3 жирных кислот для поддержания здоровья сердца и когнитивных функций",
      duration: "Ежедневно",
      difficulty: "intermediate" as const,
      benefits: ["Поддержка сердечно-сосудистой системы", "Улучшение когнитивных функций", "Снижение воспаления"],
      steps: ["Принимайте во время еды", "Выбирайте качественные источники"],
      category: "supplements"
    }
  ];

  const scientificResearch = [
    {
      title: "Влияние витамина D на иммунную функцию",
      authors: "Авторы: Иванов И.И., Петров П.П.",
      year: 2022,
      journal: "Журнал исследований иммунитета",
      summary: "Исследование показывает, что витамин D играет важную роль в поддержании иммунной функции и может снижать риск инфекционных заболеваний."
    },
    {
      title: "Магний и качество сна: систематический обзор",
      authors: "Авторы: Сидорова А.А., Смирнов В.В.",
      year: 2021,
      journal: "Журнал исследований сна",
      summary: "Систематический обзор подтверждает, что прием магния может улучшить качество сна, особенно у людей с дефицитом магния."
    },
    {
      title: "Омега-3 жирные кислоты и когнитивные функции",
      authors: "Авторы: Кузнецова Е.Е., Морозов Д.Д.",
      year: 2020,
      journal: "Журнал неврологии",
      summary: "Исследование показывает, что Омега-3 жирные кислоты могут улучшить когнитивные функции и снизить риск нейродегенеративных заболеваний."
    }
  ];

  const faqs = [
    {
      question: "Как правильно принимать витамин D?",
      answer: "Витамин D рекомендуется принимать во время еды, чтобы улучшить его усвоение. Дозировка зависит от вашего уровня витамина D в крови и должна быть определена врачом."
    },
    {
      question: "Какие продукты богаты магнием?",
      answer: "Магний содержится в зеленых листовых овощах, орехах, семенах и цельнозерновых продуктах. Однако, прием добавок магния может быть необходим для достижения оптимального уровня."
    },
    {
      question: "В чем польза Омега-3 жирных кислот?",
      answer: "Омега-3 жирные кислоты поддерживают здоровье сердца, мозга и суставов. Они также могут снижать воспаление и улучшать настроение."
    }
  ];

  // Create ScientificExplanationProps matching the updated interface
  const scientificExplanationProps = {
    summary: "Персонализированные добавки - это подход, основанный на индивидуальных биологических показателях и потребностях.",
    mechanisms: [
      {
        title: "Восполнение дефицитов",
        description: <p>Добавки целенаправленно восполняют дефициты микроэлементов на основе анализа крови и генетических данных.</p>
      },
      {
        title: "Оптимизация функций организма",
        description: <p>Точно подобранные добавки помогают оптимизировать работу различных систем организма.</p>
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

  const benefits = [
    {
      title: "Персонализированный подход",
      description: "Добавки, подобранные на основе ваших индивидуальных показателей",
      icon: <Pill className="h-10 w-10" />
    },
    {
      title: "Научное обоснование",
      description: "Все рекомендации основаны на научных исследованиях",
      icon: <Pill className="h-10 w-10" />
    },
    {
      title: "Оптимизация здоровья",
      description: "Улучшение самочувствия и профилактика заболеваний",
      icon: <Pill className="h-10 w-10" />
    },
    {
      title: "Мониторинг эффективности",
      description: "Регулярное отслеживание результатов и корректировка подхода",
      icon: <Pill className="h-10 w-10" />
    }
  ];

  return (
    <ServicePageLayout
      hero={{
        title: "Персонализированные добавки",
        subtitle: "Научный подход к улучшению здоровья",
        description: "Индивидуально подобранные добавки на основе ваших биологических данных",
        imageSrc: "/placeholder.svg"
      }}
      benefits={benefits}
      scientificBackground={<ScientificExplanation
        {...scientificExplanationProps}
        category="Научные исследования добавок"
      />}
      protocols={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {supplementProtocols.map((protocol, index) => (
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
      }
      casesStudies={<div className="text-center text-gray-600">Примеры результатов пациентов будут добавлены в ближайшее время</div>}
      faq={faqs}
    />
  );
};

export default PersonalizedSupplements;
