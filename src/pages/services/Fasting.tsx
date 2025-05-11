
import React from 'react';
import ServicePageLayout from '@/components/services/ServicePageLayout';
import { CheckCircle } from 'lucide-react';
import ProtocolCard from '@/components/services/ProtocolCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Fasting = () => {
  const benefits = [
    "Активирование процесса аутофагии",
    "Улучшение чувствительности к инсулину",
    "Снижение воспаления в организме",
    "Улучшение когнитивных функций",
    "Повышение продолжительности жизни",
    "Ускорение регенерации клеток",
    "Нормализация веса"
  ];
  
  const fastingProtocol = {
    title: "Начальный протокол 16:8",
    description: "Оптимальный протокол для начинающих практиковать интервальное голодание",
    difficulty: "beginner" as const,
    duration: "14 дней",
    category: "голодание",
    steps: [
      "День 1-3: Постепенно увеличивайте период ночного голодания до 12 часов",
      "День 4-7: Увеличьте период голодания до 14 часов",
      "День 8-14: Достигните целевого периода в 16 часов голодания",
      "Рекомендуемое окно питания: с 12:00 до 20:00",
      "Пейте воду, несладкий чай и кофе в период голодания"
    ],
    benefits: [
      "Мягкое вхождение в практику голодания без стресса",
      "Активация метаболической гибкости",
      "Улучшение чувствительности к инсулину",
      "Снижение воспаления"
    ]
  };

  return (
    <ServicePageLayout
      title="Лечебное голодание"
      description="Научно обоснованные протоколы голодания для оздоровления и регенерации"
      imageSrc="/placeholder.svg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Преимущества голодания</h2>
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
          <h2 className="text-2xl font-semibold mb-4">Важно знать</h2>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
            <h3 className="font-semibold text-orange-800">Противопоказания</h3>
            <p className="text-orange-700 text-sm mt-1">
              Голодание не рекомендуется при беременности, кормлении грудью, нарушениях пищевого поведения, 
              низком весе, сахарном диабете 1 типа и некоторых других заболеваниях. Необходима консультация специалиста.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800">Индивидуальный подход</h3>
            <p className="text-blue-700 text-sm mt-1">
              Протоколы голодания должны быть адаптированы под ваши индивидуальные особенности, 
              цели и состояние здоровья. Мы поможем вам подобрать оптимальный вариант.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="intermittent" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="intermittent">Интервальное голодание</TabsTrigger>
          <TabsTrigger value="extended">Продленное голодание</TabsTrigger>
          <TabsTrigger value="mimicking">Имитация голодания</TabsTrigger>
        </TabsList>
        <TabsContent value="intermittent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">16:8</h3>
                <p className="text-sm text-gray-600 mt-1">
                  16 часов голодания, 8 часов окно для приема пищи. 
                  Наиболее популярная и доступная схема для начинающих.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">18:6</h3>
                <p className="text-sm text-gray-600 mt-1">
                  18 часов голодания, 6 часов окно для приема пищи.
                  Более выраженный эффект, подходит для опытных практикующих.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">20:4 (Протокол "Воин")</h3>
                <p className="text-sm text-gray-600 mt-1">
                  20 часов голодания, 4 часа окно для приема пищи.
                  Максимальная активация аутофагии при ежедневном режиме.
                </p>
              </CardContent>
            </Card>
          </div>
          <ProtocolCard
            title={fastingProtocol.title}
            description={fastingProtocol.description}
            difficulty={fastingProtocol.difficulty}
            duration={fastingProtocol.duration}
            category={fastingProtocol.category}
            steps={fastingProtocol.steps}
            benefits={fastingProtocol.benefits}
          />
        </TabsContent>
        
        <TabsContent value="extended" className="space-y-4">
          <p className="text-gray-700 mb-4">
            Продленное голодание на воде (от 24 до 72 часов) обеспечивает более глубокую активацию процессов аутофагии 
            и метаболической перезагрузки организма. Требует подготовки и должно проводиться под контролем специалиста.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Важно:</strong> Продленное голодание требует правильной подготовки, постепенного выхода и не рекомендуется 
              людям с определенными заболеваниями. Необходима предварительная консультация специалиста.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="mimicking" className="space-y-4">
          <p className="text-gray-700 mb-4">
            Протокол имитации голодания (Fasting Mimicking Diet) разработан профессором Вальтером Лонго. 
            Позволяет получить преимущества голодания, сохраняя при этом минимальное потребление пищи.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold">5-дневный протокол имитации голодания</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Низкокалорийная диета с особым соотношением макронутриентов, активирующая те же механизмы, 
                  что и полное голодание. Проводится 1 раз в 1-3 месяца.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-blue-50 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-3">Начните свой путь к здоровью через голодание</h3>
        <p className="text-gray-700 mb-4">
          Наши специалисты помогут вам подобрать оптимальный протокол голодания с учетом ваших индивидуальных особенностей и целей.
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

export default Fasting;
