import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';

const BreathingPractices = () => {
  const breathingProtocols = [
    {
      title: "Диафрагмальное дыхание",
      description: "Улучшает насыщение крови кислородом и снижает стресс.",
      duration: "5-10 минут",
      difficulty: "Легко",
      benefits: ["Снижение стресса", "Улучшение сна", "Увеличение энергии"]
    },
    {
      title: "Дыхание по Бутейко",
      description: "Нормализует дыхание и улучшает общее состояние здоровья.",
      duration: "15-20 минут",
      difficulty: "Средне",
      benefits: ["Улучшение дыхания", "Снижение тревожности", "Укрепление иммунитета"]
    },
    {
      title: "Квадратное дыхание",
      description: "Помогает сбалансировать нервную систему и улучшить концентрацию.",
      duration: "5-10 минут",
      difficulty: "Легко",
      benefits: ["Улучшение концентрации", "Снижение стресса", "Улучшение настроения"]
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

  return (
    <ServicePageLayout
      title="Дыхательные практики"
      description="Специализированные дыхательные техники для улучшения здоровья и производительности"
      imageSrc="/placeholder.svg"
    >
      {/* Content inside ServicePageLayout */}
      <div className="grid gap-10 py-8">
        {/* Protocol cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {breathingProtocols.map((protocol, index) => (
            <ProtocolCard
              key={index}
              title={protocol.title}
              description={protocol.description}
              duration={protocol.duration}
              difficulty={protocol.difficulty}
              benefits={protocol.benefits}
              category="breathing"
            />
          ))}
        </div>
        
        {/* Scientific explanation section */}
        <ScientificExplanation
          category="Научные исследования дыхательных практик"
          researchData={scientificResearch}
        />
        
        {/* FAQ section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Часто задаваемые вопросы</h2>
          <div className="space-y-2">
            {faqData.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ServicePageLayout>
  );
};

export default BreathingPractices;
