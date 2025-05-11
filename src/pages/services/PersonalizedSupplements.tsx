
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { CheckCircle } from 'lucide-react';
import ProtocolCard from '@/components/services/ProtocolCard';
import ScientificExplanation from '@/components/services/ScientificExplanation';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PersonalizedSupplements = () => {
  const benefits = [
    "Индивидуально подобранные дозировки",
    "Учет генетических особенностей",
    "Компенсация дефицитов, выявленных анализами",
    "Повышение энергии и жизненного тонуса",
    "Поддержка иммунитета",
    "Замедление процессов старения",
    "Улучшение когнитивных функций"
  ];

  const supplements = [
    {
      name: "Витамин D3",
      description: "Важен для иммунитета, костной ткани и гормонального баланса",
      testing: "25-OH-витамин D"
    },
    {
      name: "Омега-3 ПНЖК",
      description: "Противовоспалительное действие, поддержка сердечно-сосудистой системы и мозга",
      testing: "Омега-3 индекс"
    },
    {
      name: "Магний",
      description: "Необходим для нервной системы, энергетического обмена и мышечной функции",
      testing: "Эритроцитарный магний"
    },
    {
      name: "Коэнзим Q10",
      description: "Поддерживает митохондрии и энергетический обмен",
      testing: "Уровень Q10 в плазме"
    },
    {
      name: "NAD+ и прекурсоры",
      description: "Ключевые молекулы для клеточной энергетики и долголетия",
      testing: "NAD+/NADH соотношение"
    },
    {
      name: "Пробиотики",
      description: "Поддержка кишечной микрофлоры и иммунитета",
      testing: "Микробиом кишечника"
    }
  ];

  const research = [
    {
      title: "Персонализированный подход к нутрицевтической поддержке на основе генетического профиля и биомаркеров",
      authors: "Мюллер Л., Джонсон К., и др.",
      year: 2022,
      journal: "Journal of Personalized Medicine",
      summary: "Исследование показало, что персонализированный подход к назначению добавок на основе генетических полиморфизмов и биохимических маркеров на 65% эффективнее стандартных протоколов."
    },
    {
      title: "Митохондриальные нутриенты в профилактике возрастных заболеваний",
      authors: "Ахмад С., Петерсон Р., и др.",
      year: 2021,
      journal: "Aging and Metabolism",
      summary: "Комбинация митохондриально-активных нутриентов (коэнзим Q10, PQQ, L-карнитин, ресвератрол) значительно улучшает биоэнергетические показатели и снижает окислительный стресс у людей старше 60 лет."
    },
    {
      title: "Роль микронутриентов в эпигенетической регуляции",
      authors: "Чен Т., Смит Р., и др.",
      year: 2020,
      journal: "Nutrition Reviews",
      summary: "Определенные комбинации витаминов группы B, холина и полифенолов способны позитивно влиять на эпигенетическое программирование, что подтверждает важность персонализированного подбора добавок."
    }
  ];

  return (
    <ServicePageLayout
      title="Персонализированные добавки"
      description="Индивидуально подобранные протоколы нутрицевтической поддержки на основе генетики и биохимических анализов"
      imageSrc="/placeholder.svg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Преимущества персонализированного подхода</h2>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ключевые компоненты</h2>
          <div className="space-y-4">
            {supplements.map((supplement, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold">{supplement.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{supplement.description}</p>
                <p className="text-xs text-blue-600 mt-2">Рекомендуемый тест: {supplement.testing}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Персонализированные протоколы</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ProtocolCard
          title="Базовая поддержка"
          description="Фундаментальный протокол для коррекции основных дефицитов и поддержания здоровья"
          difficulty="beginner"
          duration="3 месяца"
          category="добавки"
          steps={[
            "Комплексное тестирование микронутриентов",
            "Анализ витамина D, магния, железа, B12",
            "Подбор индивидуальных дозировок",
            "Постепенное введение добавок",
            "Контрольное тестирование через 3 месяца"
          ]}
          benefits={[
            "Коррекция базовых дефицитов",
            "Улучшение энергетического обмена",
            "Поддержка иммунитета",
            "Улучшение самочувствия"
          ]}
        />

        <ProtocolCard
          title="Митохондриальная поддержка"
          description="Комплексный протокол для оптимизации клеточной энергетики и функции митохондрий"
          difficulty="intermediate"
          duration="4 месяца"
          category="добавки"
          steps={[
            "Расширенное тестирование митохондриальных маркеров",
            "Поэтапное введение добавок для митохондрий",
            "Коэнзим Q10, PQQ, L-карнитин, НАД+ прекурсоры",
            "Контроль АТФ и лактата",
            "Коррекция протокола через 2 месяца"
          ]}
          benefits={[
            "Повышение клеточной энергии",
            "Улучшение переносимости физических нагрузок",
            "Поддержка когнитивных функций",
            "Замедление процессов старения"
          ]}
          warnings={[
            "Требует предварительного тестирования",
            "Возможны индивидуальные реакции на компоненты"
          ]}
        />

        <ProtocolCard
          title="Геропротекторный протокол"
          description="Передовой протокол с использованием нутриентов и соединений для замедления старения"
          difficulty="advanced"
          duration="6 месяцев"
          category="добавки"
          steps={[
            "Комплексная диагностика биомаркеров старения",
            "Генетическое тестирование",
            "Индивидуальный подбор геропротекторов",
            "Циклический прием ключевых компонентов",
            "Регулярный мониторинг биомаркеров",
            "Коррекция протокола каждые 2 месяца"
          ]}
          benefits={[
            "Воздействие на ключевые механизмы старения",
            "Улучшение биомаркеров возраста",
            "Поддержка работы всех систем организма",
            "Профилактика возрастных заболеваний"
          ]}
          warnings={[
            "Только под наблюдением специалиста",
            "Требует комплексной диагностики",
            "Индивидуальный подбор компонентов обязателен"
          ]}
        />
      </div>

      <ScientificExplanation
        title="Научное обоснование"
        description="Современные исследования подтверждают эффективность персонализированного подхода к нутрицевтической поддержке"
        research={research}
      />

      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-3">Начните свой персонализированный протокол</h3>
        <p className="text-gray-700 mb-4">
          Наши специалисты помогут вам разработать индивидуальный план нутрицевтической поддержки на основе ваших анализов, генетики и целей.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link to="/dashboard/subscription">Записаться на консультацию</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/my-protocols">Изучить все протоколы</Link>
          </Button>
        </div>
      </div>
    </ServicePageLayout>
  );
};

export default PersonalizedSupplements;
