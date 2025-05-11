
import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, LineChart, AlertCircle, User, Activity, FileText } from 'lucide-react';
import { ProtocolChart } from '@/components/protocol/ProtocolChart';

const ProtocolTrackingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [day, setDay] = useState(32); // Пример: 32-й день протокола
  const [energyLevel, setEnergyLevel] = useState(7);
  const [supplements, setSupplements] = useState({
    coq10: { taken: false, name: "Коэнзим Q10", dose: "200 мг" },
    carnitine: { taken: false, name: "L-карнитин", dose: "1,5 г" },
    ala: { taken: false, name: "Альфа-липоевая кислота", dose: "600 мг" },
    nr: { taken: true, name: "Никотинамид рибозид", dose: "500 мг" },
    resveratrol: { taken: false, name: "Ресвератрол", dose: "150 мг" }
  });

  const toggleSupplement = (key: string) => {
    setSupplements(prev => ({
      ...prev,
      [key]: { ...prev[key as keyof typeof prev], taken: !prev[key as keyof typeof prev].taken }
    }));
  };

  const markAllTaken = () => {
    const updatedSupplements = Object.keys(supplements).reduce((acc, key) => {
      acc[key as keyof typeof supplements] = { 
        ...supplements[key as keyof typeof supplements], 
        taken: true 
      };
      return acc;
    }, {} as typeof supplements);
    
    setSupplements(updatedSupplements);
  };

  // Данные для графика энергии
  const energyData = [
    { day: 'Пн', level: 5 },
    { day: 'Вт', level: 6 },
    { day: 'Ср', level: 6 },
    { day: 'Чт', level: 7 },
    { day: 'Пт', level: 7 },
    { day: 'Сб', level: 8 },
    { day: 'Вс', level: 7 },
  ];

  const protocolSteps = [
    { day: 1, completed: true, title: "Начало протокола", description: "Базовые компоненты: Q10, L-карнитин, АЛК" },
    { day: 14, completed: true, title: "Расширение протокола", description: "Добавление никотинамид рибозида и ресвератрола" },
    { day: 32, completed: false, title: "Текущий день", description: "Продолжение приема всех компонентов" },
    { day: 90, completed: false, title: "Контрольные анализы", description: "Оценка эффективности и коррекция дозировок" },
    { day: 180, completed: false, title: "Завершение базового протокола", description: "Анализ результатов и планирование дальнейших шагов" }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Шапка */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-700">Протокол митохондриальной поддержки</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 rounded-full px-3 py-1 text-sm flex items-center">
              <Clock size={16} className="mr-1 text-blue-600" />
              <span>День {day} из 180</span>
            </div>
            <div className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center">
              <Activity size={16} className="mr-1 text-green-600" />
              <span>Энергия: {energyLevel}/10</span>
            </div>
          </div>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex space-x-1">
          <button 
            className={`px-4 py-3 flex items-center text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            <Activity size={18} className="mr-2" />
            Обзор
          </button>
          <button 
            className={`px-4 py-3 flex items-center text-sm font-medium ${activeTab === 'supplements' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('supplements')}
          >
            <Calendar size={18} className="mr-2" />
            Добавки
          </button>
          <button 
            className={`px-4 py-3 flex items-center text-sm font-medium ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            <LineChart size={18} className="mr-2" />
            Аналитика
          </button>
          <button 
            className={`px-4 py-3 flex items-center text-sm font-medium ${activeTab === 'tests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tests')}
          >
            <FileText size={18} className="mr-2" />
            Анализы
          </button>
        </div>
      </nav>

      {/* Основное содержимое */}
      <main className="container mx-auto p-4">
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Прогресс по протоколу */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                Прогресс протокола
              </h2>
              
              <div className="relative">
                <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
                
                {protocolSteps.map((step, index) => (
                  <div key={index} className="mb-6 relative pl-10">
                    <div className={`w-6 h-6 rounded-full absolute left-0 flex items-center justify-center ${step.completed ? 'bg-green-100 text-green-600' : step.day === day ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      {step.completed ? (
                        <CheckCircle size={16} />
                      ) : step.day === day ? (
                        <Clock size={16} />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${step.day === day ? 'text-blue-600' : ''}`}>
                        День {step.day}: {step.title}
                      </span>
                      <span className="text-xs text-gray-500">{step.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Сегодняшние добавки */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-blue-600" />
                Добавки на сегодня
              </h2>
              
              <div className="space-y-3">
                {Object.entries(supplements).map(([key, supplement]) => (
                  <div 
                    key={key}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${supplement.taken ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}
                    onClick={() => toggleSupplement(key)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${supplement.taken ? 'bg-green-500 text-white' : 'bg-white border border-gray-300'}`}>
                        {supplement.taken && <CheckCircle size={14} />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{supplement.name}</div>
                        <div className="text-xs text-gray-500">{supplement.dose}</div>
                      </div>
                    </div>
                    <div className="text-xs">
                      {supplement.taken ? (
                        <span className="text-green-600">Принято</span>
                      ) : (
                        <span className="text-gray-400">До завтрака</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex">
                <button 
                  className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm w-full"
                  onClick={markAllTaken}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Отметить все как принятые
                </button>
              </div>
            </div>

            {/* Самочувствие */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-blue-600" />
                Самочувствие сегодня
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Уровень энергии (0-10)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 w-6 text-blue-700 font-semibold">{energyLevel}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Низкая</span>
                  <span>Средняя</span>
                  <span>Высокая</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заметки о самочувствии
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                  rows={3}
                  placeholder="Опишите ваше самочувствие, побочные эффекты или другие наблюдения..."
                ></textarea>
              </div>

              <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Сохранить наблюдения
              </button>
            </div>

            {/* Ближайшие события */}
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle size={20} className="mr-2 text-blue-600" />
                Ближайшие события
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Пора сдать контрольные анализы</p>
                    <p className="text-xs text-gray-500">Через 58 дней (день 90)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Закончится L-карнитин</p>
                    <p className="text-xs text-gray-500">Через 12 дней</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Консультация с врачом</p>
                    <p className="text-xs text-gray-500">Через 28 дней</p>
                  </div>
                </div>
              </div>
              
              <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm mt-4">
                Посмотреть все события
              </button>
            </div>
          </div>
        )}

        {activeTab === 'supplements' && (
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Календарь приема добавок</h2>
            <div className="h-64">
              <ProtocolChart 
                data={[
                  { date: '1 мая', 'Коэнзим Q10': 1, 'L-карнитин': 1, 'АЛК': 1 },
                  { date: '2 мая', 'Коэнзим Q10': 1, 'L-карнитин': 1, 'АЛК': 1 },
                  { date: '3 мая', 'Коэнзим Q10': 1, 'L-карнитин': 1, 'АЛК': 1 },
                  { date: '4 мая', 'Коэнзим Q10': 0, 'L-карнитин': 1, 'АЛК': 1 },
                  { date: '5 мая', 'Коэнзим Q10': 1, 'L-карнитин': 0, 'АЛК': 1 },
                  { date: '6 мая', 'Коэнзим Q10': 1, 'L-карнитин': 1, 'АЛК': 1 },
                  { date: '7 мая', 'Коэнзим Q10': 1, 'L-карнитин': 1, 'АЛК': 1 }
                ]} 
                xAxisKey="date" 
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Аналитика прогресса</h2>
            <div className="h-64">
              <ProtocolChart 
                data={[
                  { day: 'День 1', 'Энергия': 3, 'Сон': 5 },
                  { day: 'День 7', 'Энергия': 4, 'Сон': 6 },
                  { day: 'День 14', 'Энергия': 5, 'Сон': 7 },
                  { day: 'День 21', 'Энергия': 6, 'Сон': 7 },
                  { day: 'День 28', 'Энергия': 7, 'Сон': 8 },
                  { day: 'День 32', 'Энергия': 7, 'Сон': 8 }
                ]} 
                xAxisKey="day" 
              />
            </div>
          </div>
        )}
        
        {activeTab === 'tests' && (
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Результаты анализов</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Исходные анализы</h3>
                    <p className="text-xs text-gray-500">Загружено: 01.04.2025</p>
                  </div>
                  <button className="text-blue-600 text-sm hover:underline">Посмотреть</button>
                </div>
              </div>
              
              <div className="p-4 border border-dashed border-gray-300 rounded-lg flex justify-center items-center">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Загрузите контрольные анализы (день 90)</p>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100">
                    Загрузить файл
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProtocolTrackingDashboard;
