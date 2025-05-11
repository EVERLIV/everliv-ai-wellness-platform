
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';

const ComprehensiveAnalysisPage = () => {
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
          <h1 className="text-3xl font-bold mb-2">Комплексный AI анализ здоровья</h1>
          <p className="text-lg text-gray-700 mb-8">
            Получите всесторонний анализ вашего здоровья на основе всех имеющихся данных с использованием искусственного интеллекта
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Необходимые данные для анализа</h2>
              <p className="text-gray-700 mb-6">
                Для максимально точного анализа рекомендуется предоставить следующую информацию:
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-md">
                  <FileCheck className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Профиль здоровья</h3>
                    <p className="text-sm text-gray-600">Ваш профиль здоровья заполнен</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border border-red-100 rounded-md bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Анализ крови</h3>
                    <p className="text-sm text-gray-600">Необходимо загрузить недавний анализ крови</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/blood-analysis')}>
                      <FilePlus className="h-4 w-4 mr-2" /> Добавить результаты
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border border-red-100 rounded-md bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h3 className="font-medium">Тест биологического возраста</h3>
                    <p className="text-sm text-gray-600">Необходимо пройти тест биологического возраста</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/biological-age')}>
                      <FilePlus className="h-4 w-4 mr-2" /> Пройти тест
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button disabled>
                  <CheckCircle className="h-4 w-4 mr-2" /> Получить комплексный анализ
                </Button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3">
                Необходимо заполнить все требуемые данные
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComprehensiveAnalysisPage;
