
import React from 'react';
import { FileText, Activity, TestTube, Pill } from 'lucide-react';
import ServicePageLayout from '@/components/services/ServicePageLayout';

const BloodAnalysisServicePage = () => {
  // Service benefits
  const benefits = [
    {
      title: "Детальный анализ",
      description: "Подробный разбор каждого показателя крови и сравнение с оптимальными значениями",
      icon: <FileText className="h-10 w-10" />
    },
    {
      title: "Персонализированные рекомендации",
      description: "Индивидуальные советы по улучшению показателей на основе ваших данных",
      icon: <Activity className="h-10 w-10" />
    },
    {
      title: "Выявление рисков",
      description: "Раннее обнаружение потенциальных рисков здоровья на основе биомаркеров",
      icon: <TestTube className="h-10 w-10" />
    },
    {
      title: "Рекомендации по добавкам",
      description: "Подбор витаминов и нутриентов для оптимизации показателей крови",
      icon: <Pill className="h-10 w-10" />
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Как работает анализ крови с использованием AI?",
      answer: (
        <p>
          Наш алгоритм анализирует результаты вашего анализа крови, сравнивает показатели с оптимальными
          значениями и выдает персонализированные рекомендации. Вы можете загрузить фото результатов или
          ввести данные вручную.
        </p>
      )
    },
    {
      question: "Насколько точны рекомендации?",
      answer: (
        <p>
          Наш AI обучен на тысячах научных исследований и клинических данных. Однако рекомендации носят
          информационный характер и не заменяют консультацию с врачом, особенно при серьезных отклонениях
          показателей.
        </p>
      )
    },
    {
      question: "Какие анализы крови поддерживаются?",
      answer: (
        <p>
          Система поддерживает большинство стандартных анализов крови, включая общий анализ крови,
          биохимию крови, гормональные панели, маркеры воспаления, липидный профиль и многие другие
          показатели.
        </p>
      )
    },
    {
      question: "Как часто рекомендуется сдавать анализы?",
      answer: (
        <p>
          Для оптимального отслеживания здоровья рекомендуется сдавать общий анализ крови каждые 3-6 месяцев,
          а биохимию крови — каждые 6-12 месяцев. При наличии хронических заболеваний или специфических
          задач частота может быть скорректирована.
        </p>
      )
    }
  ];

  return (
    <ServicePageLayout
      hero={{
        title: "Анализ крови с искусственным интеллектом",
        subtitle: "Расшифровка анализов и персонализированные рекомендации",
        description: "Загрузите результаты ваших анализов крови и получите детальную расшифровку с рекомендациями, основанными на последних научных исследованиях",
        imageSrc: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80"
      }}
      benefits={benefits}
      scientificBackground={
        <div className="space-y-4">
          <p>
            Анализ крови — один из наиболее информативных способов оценить состояние здоровья человека. Биомаркеры крови
            могут указывать на состояние различных систем организма, выявлять воспаление, дефициты питательных веществ
            и другие отклонения задолго до появления симптомов.
          </p>
          <p>
            Наш подход использует передовые технологии машинного обучения для анализа сотен биомаркеров и их взаимосвязей.
            Алгоритм обучен на базе данных, включающей результаты миллионов анализов и тысячи научных исследований.
          </p>
          <p>
            Для каждого показателя система определяет не только стандартный референсный интервал, но и оптимальный
            диапазон, ассоциированный с долголетием и минимальным риском возрастных заболеваний согласно последним
            научным данным.
          </p>
        </div>
      }
      protocols={
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-xl font-medium mb-4">Протокол анализа данных</h3>
            <ol className="space-y-2">
              <li className="flex items-start">
                <span className="bg-evergreen-100 text-evergreen-700 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                <span>Загрузите фото результатов анализа или введите данные вручную в систему</span>
              </li>
              <li className="flex items-start">
                <span className="bg-evergreen-100 text-evergreen-700 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <span>Получите детальную расшифровку каждого показателя с комментариями</span>
              </li>
              <li className="flex items-start">
                <span className="bg-evergreen-100 text-evergreen-700 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                <span>Изучите персонализированные рекомендации по оптимизации показателей</span>
              </li>
              <li className="flex items-start">
                <span className="bg-evergreen-100 text-evergreen-700 rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                <span>Внедрите изменения в образ жизни и регулярно отслеживайте динамику</span>
              </li>
            </ol>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <h3 className="text-xl font-medium mb-4">Оптимизация биомаркеров</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-evergreen-500 mr-2 text-lg">•</span>
                <div>
                  <span className="font-medium">Гемоглобин:</span> Оптимизация через питание, богатое железом, витамином C и витаминами группы B
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-evergreen-500 mr-2 text-lg">•</span>
                <div>
                  <span className="font-medium">Витамин D:</span> Регулярное пребывание на солнце, добавки витамина D3 с K2
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-evergreen-500 mr-2 text-lg">•</span>
                <div>
                  <span className="font-medium">С-реактивный белок:</span> Противовоспалительная диета, полифенолы, омега-3
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-evergreen-500 mr-2 text-lg">•</span>
                <div>
                  <span className="font-medium">Глюкоза:</span> Ограничение простых углеводов, интервальное голодание, физическая активность
                </div>
              </li>
            </ul>
          </div>
        </div>
      }
      casesStudies={
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="font-medium text-lg mb-2">Алексей, 42 года</h3>
            <p className="text-gray-700 mb-4">
              Обнаружил повышенные маркеры воспаления и низкий уровень витамина D. После 3 месяцев следования 
              рекомендациям, включая добавки и изменения в диете, показатели пришли в норму, а энергия и 
              работоспособность значительно улучшились.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Ключевые улучшения:</span>
              <span className="ml-2">С-реактивный белок ↓60%, Витамин D ↑150%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="font-medium text-lg mb-2">Мария, 38 лет</h3>
            <p className="text-gray-700 mb-4">
              Страдала от хронической усталости. Анализ выявил дефицит железа и B12. После 2 месяцев 
              корректировки питания и приема добавок уровень энергии восстановился, а симптомы усталости исчезли.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Ключевые улучшения:</span>
              <span className="ml-2">Ферритин ↑80%, B12 ↑120%, Гемоглобин ↑15%</span>
            </div>
          </div>
        </div>
      }
      visualElement={
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src="https://images.unsplash.com/photo-1576671415814-8f0f4d439c65?auto=format&fit=crop&q=80" 
              alt="Анализ крови с AI" 
              className="object-cover rounded-lg"
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Пример интерфейса анализа и расшифровки показателей крови в нашей системе
          </p>
        </div>
      }
      faq={faqItems}
    />
  );
};

export default BloodAnalysisServicePage;
