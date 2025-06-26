
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Droplets, 
  Shield, 
  Brain,
  Zap,
  Apple,
  Clock
} from "lucide-react";

interface EducationItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  normalRange: string;
  functions: string[];
  factors: {
    increase: string[];
    decrease: string[];
  };
  tips: string[];
}

const educationData: { [key: string]: EducationItem[] } = {
  basic: [
    {
      icon: <Heart className="h-5 w-5 text-red-500" />,
      title: "Гемоглобин",
      description: "Белок в красных кровяных клетках, который переносит кислород от легких к тканям организма.",
      normalRange: "Мужчины: 130-170 г/л, Женщины: 120-150 г/л",
      functions: [
        "Транспорт кислорода к органам и тканям",
        "Участие в транспорте углекислого газа",
        "Поддержание кислотно-щелочного баланса"
      ],
      factors: {
        increase: ["Обезвоживание", "Курение", "Высокогорье", "Заболевания легких"],
        decrease: ["Железодефицитная анемия", "Кровотечения", "Заболевания почек", "Недостаток витамина B12"]
      },
      tips: [
        "Ешьте продукты, богатые железом (мясо, рыба, бобовые)",
        "Сочетайте железо с витамином C для лучшего усвоения",
        "Избегайте употребления чая и кофе с железосодержащими продуктами"
      ]
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      title: "Лейкоциты",
      description: "Белые кровяные клетки, основные защитники организма от инфекций и чужеродных веществ.",
      normalRange: "4.0-9.0×10⁹/л",
      functions: [
        "Защита от бактериальных и вирусных инфекций",
        "Участие в иммунных реакциях",
        "Удаление поврежденных клеток"
      ],
      factors: {
        increase: ["Инфекции", "Стресс", "Курение", "Некоторые лекарства"],
        decrease: ["Вирусные инфекции", "Аутоиммунные заболевания", "Химиотерапия", "Недостаток витаминов"]
      },
      tips: [
        "Поддерживайте здоровый образ жизни",
        "Достаточно спите (7-9 часов)",
        "Управляйте стрессом",
        "Регулярно мойте руки"
      ]
    }
  ],
  biochemistry: [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Глюкоза",
      description: "Основной источник энергии для клеток организма, особенно важна для работы мозга.",
      normalRange: "3.3-5.5 ммоль/л (натощак)",
      functions: [
        "Основной источник энергии для клеток",
        "Критически важна для функции мозга",
        "Регулируется инсулином и другими гормонами"
      ],
      factors: {
        increase: ["Диабет", "Стресс", "Некоторые лекарства", "Нарушения питания"],
        decrease: ["Передозировка инсулина", "Длительное голодание", "Заболевания печени", "Физические нагрузки"]
      },
      tips: [
        "Ограничьте простые углеводы",
        "Ешьте регулярно, небольшими порциями",
        "Включайте физическую активность",
        "Контролируйте вес"
      ]
    },
    {
      icon: <Shield className="h-5 w-5 text-green-500" />,
      title: "Общий белок",
      description: "Совокупность всех белков в плазме крови, важных для иммунитета и транспорта веществ.",
      normalRange: "65-85 г/л",
      functions: [
        "Поддержание онкотического давления",
        "Транспорт гормонов и лекарств",
        "Участие в иммунных реакциях",
        "Свертывание крови"
      ],
      factors: {
        increase: ["Обезвоживание", "Хронические инфекции", "Аутоиммунные заболевания"],
        decrease: ["Недостаток белка в питании", "Заболевания печени", "Болезни почек", "Кровотечения"]
      },
      tips: [
        "Включайте достаточно белка в рацион",
        "Ешьте разнообразные источники белка",
        "Поддерживайте водный баланс",
        "Регулярно проверяйте функцию печени и почек"
      ]
    }
  ],
  hormones: [
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "ТТГ (Тиреотропный гормон)",
      description: "Гормон гипофиза, регулирующий работу щитовидной железы и обмен веществ.",
      normalRange: "0.4-4.0 мЕд/л",
      functions: [
        "Регуляция выработки гормонов щитовидной железы",
        "Контроль метаболизма",
        "Влияние на рост и развитие"
      ],
      factors: {
        increase: ["Гипотиреоз", "Стресс", "Некоторые лекарства", "Аутоиммунные заболевания"],
        decrease: ["Гипертиреоз", "Прием гормонов щитовидной железы", "Заболевания гипофиза"]
      },
      tips: [
        "Избегайте дефицита йода",
        "Ограничьте потребление сои",
        "Управляйте стрессом",
        "Регулярно проверяйте щитовидную железу"
      ]
    }
  ],
  vitamins: [
    {
      icon: <Apple className="h-5 w-5 text-orange-500" />,
      title: "Витамин D",
      description: "Жирорастворимый витамин, критически важный для здоровья костей и иммунной системы.",
      normalRange: "30-100 нг/мл",
      functions: [
        "Усвоение кальция и фосфора",
        "Поддержка иммунной системы",
        "Регуляция клеточного роста",
        "Поддержание здоровья костей"
      ],
      factors: {
        increase: ["Прием добавок", "Солнечное облучение", "Жирная рыба"],
        decrease: ["Недостаток солнца", "Неправильное питание", "Заболевания кишечника", "Возраст"]
      },
      tips: [
        "Проводите время на солнце (15-20 минут в день)",
        "Ешьте жирную рыбу 2-3 раза в неделю",
        "Рассмотрите прием добавок зимой",
        "Включайте обогащенные продукты"
      ]
    }
  ]
};

const BloodAnalysisEducation = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Понимание анализов крови</h2>
        <p className="text-muted-foreground">
          Изучите, что означают различные показатели и как поддерживать их в норме
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Общий анализ</TabsTrigger>
          <TabsTrigger value="biochemistry">Биохимия</TabsTrigger>
          <TabsTrigger value="hormones">Гормоны</TabsTrigger>
          <TabsTrigger value="vitamins">Витамины</TabsTrigger>
        </TabsList>

        {Object.entries(educationData).map(([category, items]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {items.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit">
                      Норма: {item.normalRange}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        Функции в организме:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {item.functions.map((func, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {func}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">
                          Факторы повышения:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {item.factors.increase.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-amber-600">
                          Факторы понижения:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {item.factors.decrease.map((factor, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1 text-green-600">
                        <Clock className="h-4 w-4" />
                        Советы по поддержанию нормы:
                      </h4>
                      <ul className="text-sm space-y-1">
                        {item.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BloodAnalysisEducation;
