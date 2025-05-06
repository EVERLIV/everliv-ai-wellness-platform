
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Brain, UserCheck } from "lucide-react";

const TechnologySection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary font-heading">Наша технология</h2>
          <p className="text-lg text-gray-600">
            В основе EVERLIV лежит запатентованная технология искусственного интеллекта, обученная на миллионах медицинских данных и научных исследований для создания точных персонализированных рекомендаций.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-shadow border-gray-200 rounded-xl">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold font-heading">Многофакторный анализ</CardTitle>
              <CardDescription>Комплексный подход к данным</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Наш ИИ анализирует сотни показателей здоровья, создавая полную картину вашего организма, выявляя скрытые взаимосвязи и тренды.</p>
            </CardContent>
          </Card>

          <Card className="card-shadow border-gray-200 rounded-xl">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold font-heading">Обучение на научных данных</CardTitle>
              <CardDescription>Доказательная медицина</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Алгоритмы EVERLIV обучены на данных тысяч научных исследований и клинических испытаний, обеспечивая научно обоснованные рекомендации.</p>
            </CardContent>
          </Card>

          <Card className="card-shadow border-gray-200 rounded-xl">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold font-heading">Персонализация</CardTitle>
              <CardDescription>Индивидуальный подход</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Платформа создаёт уникальный профиль здоровья для каждого пользователя, учитывая генетику, образ жизни, питание и множество других факторов.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
