
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Heart, Activity, Brain } from 'lucide-react';

const BiologicalAgePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Тест на биологический возраст</h1>
          <p className="text-lg text-gray-700 mb-8">
            Определите свой биологический возраст на основе комплексной оценки показателей здоровья
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Что такое биологический возраст?</h2>
                  <p className="text-gray-700">
                    Биологический возраст — это мера того, насколько хорошо или плохо работает ваше тело по сравнению с вашим хронологическим возрастом. Он является индикатором вашего общего состояния здоровья и помогает понять, как быстро происходит старение вашего организма.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => {
                    // В будущем здесь будет переход к опроснику
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setResults(true);
                    }, 2000);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Загрузка...' : 'Пройти тест'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {results && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Ваши результаты</h2>
                <p className="text-center text-gray-700 mb-6">
                  Эта функциональность будет доступна в следующем обновлении.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Card className="flex-1">
                    <CardContent className="p-4 flex flex-col items-center">
                      <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-lg font-semibold">Хронологический возраст</div>
                      <div className="text-3xl font-bold mt-2">35 лет</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="flex-1">
                    <CardContent className="p-4 flex flex-col items-center">
                      <Clock className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-lg font-semibold">Биологический возраст</div>
                      <div className="text-3xl font-bold mt-2">30 лет</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Heart className="h-6 w-6 text-red-500" />
                      <div>
                        <div className="text-gray-600 text-sm">Сердечно-сосудистая система</div>
                        <div className="font-semibold">Отлично (29 лет)</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Activity className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="text-gray-600 text-sm">Метаболическая система</div>
                        <div className="font-semibold">Хорошо (32 года)</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-500" />
                      <div>
                        <div className="text-gray-600 text-sm">Когнитивная функция</div>
                        <div className="font-semibold">Очень хорошо (31 год)</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BiologicalAgePage;
