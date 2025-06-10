
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Info, AlertTriangle, Target, Calendar } from "lucide-react";

interface BiomarkerDetailsProps {
  biomarker?: {
    id: string;
    name: string;
    value: number;
    unit: string;
    status: string;
    trend: string;
    referenceRange: string;
    lastMeasured: string;
  };
  recommendations: any[];
  riskFactors: any[];
  supplements: any[];
}

const BiomarkerDetails: React.FC<BiomarkerDetailsProps> = ({
  biomarker,
  recommendations,
  riskFactors,
  supplements
}) => {
  // Демо-данные для графика трендов
  const trendData = [
    { date: '01.12', value: 5.8 },
    { date: '15.12', value: 5.5 },
    { date: '01.01', value: 5.2 },
    { date: '15.01', value: 5.2 },
  ];

  const chartConfig = {
    value: {
      label: "Значение",
      color: "hsl(var(--chart-1))",
    },
  };

  if (!biomarker) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Info className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Выберите биомаркер для просмотра детальной информации</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'risk':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Основная информация о биомаркере */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            {biomarker.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {biomarker.value}
                </span>
                <span className="text-lg text-gray-500">
                  {biomarker.unit}
                </span>
              </div>
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(biomarker.status)}`}>
                <span className="text-sm font-medium">
                  {biomarker.status === 'optimal' ? 'Оптимально' :
                   biomarker.status === 'good' ? 'Хорошо' :
                   biomarker.status === 'attention' ? 'Требует внимания' : 'Высокий риск'}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Референсные значения:</span>
                  <span className="font-medium">{biomarker.referenceRange} {biomarker.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Последнее измерение:</span>
                  <span className="font-medium">
                    {new Date(biomarker.lastMeasured).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Динамика изменений</h4>
              <ChartContainer config={chartConfig} className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--color-value)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-value)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Связанные рекомендации */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Связанные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <span className="text-xs text-purple-600 font-medium mt-2 inline-block">
                      {rec.category}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ml-3 ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {rec.priority === 'high' ? 'Высокий' :
                     rec.priority === 'medium' ? 'Средний' : 'Низкий'} приоритет
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Интерпретация результатов */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Интерпретация результатов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">Что означает этот показатель?</h4>
              <p className="text-sm text-blue-800">
                {biomarker.name} является важным биомаркером, который помогает оценить 
                различные аспекты вашего здоровья. Ваше текущее значение {biomarker.value} {biomarker.unit} 
                {biomarker.status === 'optimal' ? ' находится в оптимальном диапазоне.' :
                 biomarker.status === 'attention' ? ' требует внимания и коррекции.' :
                 ' указывает на необходимость медицинского вмешательства.'}
              </p>
            </div>

            {biomarker.status !== 'optimal' && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <h4 className="font-medium text-orange-900 mb-2">Рекомендуемые действия</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Обратитесь к врачу для консультации</li>
                  <li>• Следуйте персональным рекомендациям</li>
                  <li>• Повторите анализ через рекомендованный период</li>
                  <li>• Ведите мониторинг показателей</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiomarkerDetails;
