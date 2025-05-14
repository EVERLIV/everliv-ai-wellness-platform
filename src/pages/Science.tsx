
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MicroscopeIcon, BookOpen, TestTube, Brain, FileBarChart, GraduationCap } from 'lucide-react';

// Создаем компонент с нужной иконкой
const MicroscopeIcon = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
      <path d="M9 14h2"></path>
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
    </svg>
  );
};

const Science = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Научный подход EVERLIV</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Наши протоколы и рекомендации основаны на последних научных исследованиях
              и разработках в области медицины, долголетия и оптимизации здоровья.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Доказательная медицина в основе</h2>
                <p className="text-gray-700 mb-6">
                  Мы отбираем только те методы и протоколы, которые имеют научное обоснование и 
                  доказанную эффективность в рецензируемых исследованиях. Наша команда постоянно 
                  анализирует новейшие публикации в авторитетных научных журналах.
                </p>
                <p className="text-gray-700">
                  Каждая рекомендация проходит многоэтапную проверку экспертами и 
                  сопровождается ссылками на исследования, чтобы вы могли быть уверены 
                  в надежности полученной информации.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800" 
                  alt="Научные исследования" 
                  className="rounded-lg shadow-xl w-full" 
                />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-10 text-center">Наши научные основы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <MicroscopeIcon className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Фундаментальные исследования</h3>
                    <p className="text-gray-600">
                      Молекулярные механизмы старения, клеточные пути и биохимические процессы, 
                      лежащие в основе здоровья и долголетия.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <BookOpen className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Метаанализы и обзоры</h3>
                    <p className="text-gray-600">
                      Систематический анализ десятков и сотен исследований для выявления 
                      наиболее эффективных методов и подходов.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Brain className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Нейробиология здоровья</h3>
                    <p className="text-gray-600">
                      Влияние образа жизни и факторов окружающей среды на работу мозга 
                      и нервной системы в целом.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <TestTube className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Клинические исследования</h3>
                    <p className="text-gray-600">
                      Результаты клинических испытаний, подтверждающие безопасность и 
                      эффективность наших рекомендаций и протоколов.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FileBarChart className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Биомаркеры и диагностика</h3>
                    <p className="text-gray-600">
                      Современные методы оценки состояния здоровья и биологического возраста, 
                      позволяющие персонализировать подход.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <GraduationCap className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Образовательные программы</h3>
                    <p className="text-gray-600">
                      Постоянное обучение наших специалистов и создание образовательных 
                      материалов, основанных на последних научных данных.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Научные партнерства</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Исследовательские институты</h3>
                <p className="text-gray-700">
                  Мы сотрудничаем с ведущими научно-исследовательскими институтами для доступа 
                  к инновационным методам диагностики и оценки здоровья.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Медицинские университеты</h3>
                <p className="text-gray-700">
                  Наши эксперты регулярно обмениваются опытом с профессорами и исследователями 
                  из ведущих медицинских университетов России и мира.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Лаборатории и диагностические центры</h3>
                <p className="text-gray-700">
                  Партнерство с современными лабораториями позволяет нам предлагать клиентам 
                  точную диагностику и интерпретацию результатов на высоком уровне.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Наша научная миссия</h2>
            <p className="text-xl text-gray-700 mb-8">
              Сделать последние достижения науки о здоровье и долголетии доступными для каждого, 
              представляя сложную информацию в понятном формате и помогая внедрить 
              научно обоснованные протоколы в повседневную жизнь.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Science;
