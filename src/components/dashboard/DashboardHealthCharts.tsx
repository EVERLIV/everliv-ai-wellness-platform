
import React from 'react';
import InteractiveHealthChart from './InteractiveHealthChart';
import { useLabAnalysesData } from '@/hooks/useLabAnalysesData';

const DashboardHealthCharts: React.FC = () => {
  const { analysisHistory, loadingHistory } = useLabAnalysesData();

  // Преобразуем данные анализов в формат для графиков
  const generateChartData = (parameterName: string) => {
    return analysisHistory
      .filter(analysis => analysis.results?.markers?.some((m: any) => m.name === parameterName))
      .map(analysis => {
        const marker = analysis.results.markers.find((m: any) => m.name === parameterName);
        const value = parseFloat(marker.value);
        
        // Примерные нормальные значения (в реальном приложении должны браться из базы данных)
        const normalRanges: { [key: string]: { min: number; max: number } } = {
          'Гемоглобин': { min: 120, max: 160 },
          'Лейкоциты': { min: 4.0, max: 9.0 },
          'Эритроциты': { min: 4.0, max: 5.5 },
          'Тромбоциты': { min: 150, max: 400 },
          'Глюкоза': { min: 3.3, max: 5.5 }
        };
        
        const normalRange = normalRanges[parameterName] || { min: 0, max: 100 };
        const status = value < normalRange.min ? 'critical' : 
                      value > normalRange.max ? 'warning' : 'normal';
        
        return {
          date: analysis.created_at,
          value: value,
          normal_min: normalRange.min,
          normal_max: normalRange.max,
          status: status as 'normal' | 'warning' | 'critical'
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loadingHistory) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Определяем основные показатели для отображения
  const mainParameters = ['Гемоглобин', 'Лейкоциты', 'Глюкоза', 'Тромбоциты'];
  const availableParameters = mainParameters.filter(param => 
    analysisHistory.some(analysis => 
      analysis.results?.markers?.some((m: any) => m.name === param)
    )
  );

  if (availableParameters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Нет данных для отображения графиков</p>
        <p className="text-sm mt-2">Добавьте анализы крови для просмотра интерактивных графиков</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {availableParameters.map(parameter => {
        const chartData = generateChartData(parameter);
        const units: { [key: string]: string } = {
          'Гемоглобин': 'г/л',
          'Лейкоциты': '×10⁹/л',
          'Эритроциты': '×10¹²/л',
          'Тромбоциты': '×10⁹/л',
          'Глюкоза': 'ммоль/л'
        };
        
        return (
          <InteractiveHealthChart
            key={parameter}
            title={parameter}
            data={chartData}
            unit={units[parameter] || ''}
            parameter={parameter}
          />
        );
      })}
    </div>
  );
};

export default DashboardHealthCharts;
