
import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useProtocolData } from '@/hooks/useProtocolData';

type ProtocolStep = {
  day: number;
  title: string;
  description: string;
  completed: boolean;
};

export const ProtocolProgress = () => {
  const { id } = useParams();
  const { protocol, protocolDay, setProtocolDay, isLoading } = useProtocolData(id);
  
  if (isLoading) return <div className="py-6">Loading protocol progress...</div>;
  if (!protocol) return <div className="py-6">Protocol not found</div>;
  
  // Calculate steps based on protocol duration
  const durationDays = parseInt(protocol.duration.split(' ')[0]);
  const milestones = [
    { day: 1, title: "Начало протокола", description: "Знакомство с программой" },
    { day: Math.floor(durationDays * 0.25), title: "Первая четверть", description: "Адаптация к протоколу" },
    { day: Math.floor(durationDays * 0.5), title: "Середина протокола", description: "Оценка промежуточных результатов" },
    { day: Math.floor(durationDays * 0.75), title: "Третья четверть", description: "Закрепление результатов" },
    { day: durationDays, title: "Завершение базового протокола", description: "Анализ результатов и планирование дальнейших шагов" }
  ];

  // Map the milestones to steps with completion status
  const protocolSteps: ProtocolStep[] = milestones.map(milestone => ({
    ...milestone,
    completed: protocolDay >= milestone.day
  }));

  // Find where the current day falls
  const currentStepIndex = protocolSteps.findIndex(step => !step.completed);

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Clock size={20} className="mr-2 text-blue-600" />
        Прогресс протокола
      </h2>
      
      <div className="relative">
        <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
        
        {protocolSteps.map((step, index) => (
          <div key={index} className="mb-6 relative pl-10">
            <div 
              className={`w-6 h-6 rounded-full absolute left-0 flex items-center justify-center 
                ${step.completed ? 'bg-green-100 text-green-600' : 
                  index === currentStepIndex ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
            >
              {step.completed ? (
                <CheckCircle size={16} />
              ) : index === currentStepIndex ? (
                <Clock size={16} />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${index === currentStepIndex ? 'text-blue-600' : ''}`}>
                День {step.day}: {step.title}
              </span>
              <span className="text-xs text-gray-500">{step.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Текущий день протокола (1-{durationDays})
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max={durationDays}
            value={protocolDay}
            onChange={(e) => setProtocolDay(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-3 w-6 text-blue-700 font-semibold">{protocolDay}</span>
        </div>
      </div>
    </div>
  );
};
