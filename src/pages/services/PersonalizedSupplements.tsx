import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';

const PersonalizedSupplements = () => {
  const supplementProtocols = [
    {
      title: "Оптимизация витамина D",
      description: "Протокол приема витамина D для поддержания иммунитета и здоровья костей",
      duration: "Ежедневно",
      difficulty: "Легко",
      benefits: ["Укрепление иммунитета", "Поддержка костной ткани", "Улучшение настроения"]
    },
    {
      title: "Магний для сна и релаксации",
      description: "Протокол приема магния перед сном для улучшения качества сна и снижения стресса",
      duration: "Перед сном",
      difficulty: "Легко",
      benefits: ["Улучшение сна", "Снижение стресса", "Поддержка нервной системы"]
    },
    {
      title: "Омега-3 для здоровья сердца и мозга",
      description: "Протокол приема Омега-3 жирных кислот для поддержания здоровья сердца и когнитивных функций",
      duration: "Ежедневно",
      difficulty: "Легко",
      benefits: ["Поддержка сердечно-сосудистой системы", "Улучшение когнитивных функций", "Снижение воспаления"]
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

  const faqData = [
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

  return (
    <ServicePageLayout
      title="Персонализированные добавки"
      description="Индивидуально подобранные добавки на основе ваших биологических данных"
      imageSrc="/placeholder.svg"
    >
      {/* Content inside ServicePageLayout */}
      <div className="grid gap-10 py-8">
        {/* Protocol cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {supplementProtocols.map((protocol, index) => (
            <ProtocolCard
              key={index}
              title={protocol.title}
              description={protocol.description}
              duration={protocol.duration}
              difficulty={protocol.difficulty}
              benefits={protocol.benefits}
              category="supplements"
            />
          ))}
        </div>
        
        {/* Scientific explanation section */}
        <ScientificExplanation
          category="Научные исследования персонализированных добавок"
          researchData={scientificResearch}
        />
        
        {/* FAQ section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Часто задаваемые вопросы</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ServicePageLayout>
  );
};

export default PersonalizedSupplements;
