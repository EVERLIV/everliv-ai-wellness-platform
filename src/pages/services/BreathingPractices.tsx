
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import FAQ from '@/components/services/FAQ';
import { Wind } from 'lucide-react';

const BreathingPractices = () => {
  const breathingProtocols = [
    {
      title: "Диафрагмальное дыхание",
      description: "Улучшает насыщение крови кислородом и снижает стресс.",
      duration: "5-10 минут",
      difficulty: "beginner" as const,
      benefits: ["Снижение стресса", "Улучшение сна", "Увеличение энергии"],
      steps: ["Сядьте или лягте в удобное положение", "Вдыхайте через нос, выдыхайте через рот"],
      category: "breathing"
    },
    {
      title: "Дыхание по Бутейко",
      description: "Нормализует дыхание и улучшает общее состояние здоровья.",
      duration: "15-20 минут",
      difficulty: "intermediate" as const,
      benefits: ["Улучшение дыхания", "Снижение тревожности", "Укрепление иммунитета"],
      steps: ["Сядьте в удобное положение", "Следуйте инструкциям по технике Бутейко"],
      category: "breathing"
    },
    {
      title: "Квадратное дыхание",
      description: "Помогает сбалансировать нервную систему и улучшить концентрацию.",
      duration: "5-10 минут",
      difficulty: "beginner" as const,
      benefits: ["Улучшение концентрации", "Снижение стресса", "Улучшение настроения"],
      steps: ["Вдох на 4 счета", "Задержка на 4 счета", "Выдох на 4 счета", "Задержка на 4 счета"],
      category: "breathing"
    }
  ];

  const scientificResearch = [
    {
      title: "Влияние дыхательных практик на уровень стресса",
      authors: "Иванов И.И., Петров П.П.",
      year: 2022,
      journal: "Журнал неврологии",
      summary: "Исследование показало значительное снижение уровня кортизола у участников, регулярно выполняющих дыхательные упражнения."
    },
    {
      title: "Дыхательные практики и сердечно-сосудистая система",
      authors: "Сидорова А.К., Смирнов В.И.",
      year: 2021,
      journal: "Кардиологический вестник",
      summary: "Регулярные дыхательные упражнения способствуют снижению артериального давления и улучшению вариабельности сердечного ритма."
    }
  ];

  const faqData = [
    {
      question: "Как часто нужно выполнять дыхательные практики?",
      answer: "Рекомендуется выполнять дыхательные практики ежедневно для достижения наилучших результатов."
    },
    {
      question: "Какие противопоказания к дыхательным практикам?",
      answer: "Противопоказания включают серьезные сердечно-сосудистые заболевания, острые респираторные инфекции и психические расстройства."
    }
  ];

  // Create ScientificExplanationProps matching the updated interface
  const scientificExplanationProps = {
    summary: "Дыхательные практики - это методы управления дыханием, которые помогают улучшить физическое и психическое здоровье.",
    mechanisms: [
      {
        title: "Регуляция нервной системы",
        description: <p>Дыхательные техники воздействуют на баланс симпатической и парасимпатической нервных систем.</p>
      },
      {
        title: "Улучшение газообмена",
        description: <p>Правильное дыхание улучшает эффективность доставки кислорода к тканям и выведение углекислого газа.</p>
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
      title: "Снижение стресса",
      description: "Снижение уровня кортизола и улучшение психоэмоционального состояния",
      icon: <Wind className="h-10 w-10" />
    },
    {
      title: "Улучшение сна",
      description: "Нормализация сна и улучшение качества отдыха",
      icon: <Wind className="h-10 w-10" />
    },
    {
      title: "Повышение энергии",
      description: "Увеличение жизненной энергии и работоспособности",
      icon: <Wind className="h-10 w-10" />
    },
    {
      title: "Улучшение пищеварения",
      description: "Нормализация работы пищеварительной системы",
      icon: <Wind className="h-10 w-10" />
    }
  ];

  return (
    <ServicePageLayout
      hero={{
        title: "Дыхательные практики",
        subtitle: "Путь к осознанному дыханию",
        description: "Специализированные дыхательные техники для улучшения здоровья и повышения качества жизни",
        imageSrc: "/placeholder.svg"
      }}
      benefits={benefits}
      scientificBackground={<ScientificExplanation
        {...scientificExplanationProps}
        category="Научные исследования дыхательных практик"
      />}
      protocols={
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {breathingProtocols.map((protocol, index) => (
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
      faq={faqData}
    />
  );
};

export default BreathingPractices;
