
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ArrowRight, BookText, LineChart, User, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import MinimalFooter from '@/components/MinimalFooter';
import AuthGuard from '@/components/security/AuthGuard';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.user_metadata?.first_name || 'Пользователь';
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);
  
  const handleContinue = () => {
    navigate('/dashboard');
  };
  
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-center mb-4">
                Добро пожаловать, {firstName}!
              </h1>
              
              <p className="text-gray-600 text-center mb-8 text-lg">
                Спасибо за регистрацию в EVERLIV. Мы рады, что вы с нами на пути к оптимальному здоровью и долголетию.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookText className="h-5 w-5 text-everliv-600" /> Что такое EVERLIV
                  </h3>
                  <p className="text-gray-600">
                    EVERLIV — это платформа на базе искусственного интеллекта, которая помогает вам достичь оптимального здоровья через персонализированные рекомендации.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-everliv-600" /> Научный подход
                  </h3>
                  <p className="text-gray-600">
                    Все рекомендации основаны на новейших научных исследованиях и адаптированы под ваши индивидуальные данные.
                  </p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Что дальше?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                      <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-medium">1</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Заполните свой профиль</h4>
                      <p className="text-gray-600 text-sm">Чем больше мы знаем о вас, тем более персонализированные рекомендации сможем предложить.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                      <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-medium">2</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Пройдите базовую оценку здоровья</h4>
                      <p className="text-gray-600 text-sm">Ответьте на несколько вопросов, чтобы мы могли создать базовый профиль вашего здоровья.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-0.5">
                      <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm font-medium">3</div>
                    </div>
                    <div>
                      <h4 className="font-medium">Исследуйте персонализированные протоколы</h4>
                      <p className="text-gray-600 text-sm">Начните следовать рекомендованным протоколам для достижения ваших целей по здоровью.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Button 
                  onClick={handleContinue} 
                  className="bg-everliv-600 hover:bg-everliv-700 flex items-center gap-2 px-6 py-2"
                  size="lg"
                >
                  Перейти в личный кабинет <ArrowRight className="h-5 w-5" />
                </Button>
                
                <p className="text-sm text-gray-500 mt-4">
                  У вас есть вопросы? Свяжитесь с нашей <a href="/help" className="text-everliv-600 hover:underline">службой поддержки</a>.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 text-center">Основные функции платформы</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="bg-indigo-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Персонализированный подход</h3>
                  <p className="text-gray-600 text-sm">Рекомендации, адаптированные к вашим уникальным потребностям</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-emerald-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Отслеживание прогресса</h3>
                  <p className="text-gray-600 text-sm">Наблюдайте за изменениями своего здоровья в реальном времени</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="bg-amber-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                    <BookText className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Образовательный контент</h3>
                  <p className="text-gray-600 text-sm">Доступ к научно обоснованным материалам о здоровье</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <MinimalFooter />
      </div>
    </AuthGuard>
  );
};

export default Welcome;
