
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TechnologySection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-everliv-800">Наша технология</h2>
          <p className="text-lg text-gray-600">
            В основе EVERLIV лежит запатентованная технология искусственного интеллекта, обученная на миллионах медицинских данных и научных исследований для создания точных персонализированных рекомендаций.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Многофакторный анализ</CardTitle>
              <CardDescription>Комплексный подход к данным</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Наш ИИ анализирует сотни показателей здоровья, создавая полную картину вашего организма, выявляя скрытые взаимосвязи и тренды.</p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Обучение на научных данных</CardTitle>
              <CardDescription>Доказательная медицина</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Алгоритмы EVERLIV обучены на данных тысяч научных исследований и клинических испытаний, обеспечивая научно обоснованные рекомендации.</p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Персонализация</CardTitle>
              <CardDescription>Индивидуальный подход</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Платформа создаёт уникальный профиль здоровья для каждого пользователя, учитывая генетику, образ жизни, питание и множество других факторов.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
