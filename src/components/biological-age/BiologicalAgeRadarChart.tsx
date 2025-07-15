import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Biomarker } from '@/types/biologicalAge';

interface BiologicalAgeRadarChartProps {
  biomarkers: Biomarker[];
  title?: string;
}

const BiologicalAgeRadarChart: React.FC<BiologicalAgeRadarChartProps> = ({
  biomarkers,
  title = "Профиль здоровья по категориям"
}) => {
  // Calculate category scores
  const getCategoryScore = (category: string) => {
    const categoryBiomarkers = biomarkers.filter(b => 
      b.category === category && b.status === 'filled'
    );
    
    if (categoryBiomarkers.length === 0) return 0;
    
    const scores = categoryBiomarkers.map(biomarker => {
      if (!biomarker.value || !biomarker.normal_range) return 50;
      
      const { min, max, optimal } = biomarker.normal_range;
      const value = biomarker.value;
      
      // Calculate score based on how close to optimal
      if (optimal) {
        const deviation = Math.abs(value - optimal) / optimal;
        if (deviation <= 0.1) return 100;
        if (deviation <= 0.2) return 85;
        if (deviation <= 0.3) return 70;
        return 50;
      }
      
      // Fallback to normal range scoring
      if (value >= min && value <= max) return 80;
      const range = max - min;
      const distanceFromRange = Math.min(
        Math.abs(value - min),
        Math.abs(value - max)
      );
      
      return Math.max(20, 80 - (distanceFromRange / range) * 60);
    });
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const categories = [
    { 
      id: 'cardiovascular', 
      name: 'Сердечно-сосудистая система',
      shortName: 'ССС',
      color: '#ef4444'
    },
    { 
      id: 'metabolic', 
      name: 'Метаболизм',
      shortName: 'Метаболизм',
      color: '#f97316'
    },
    { 
      id: 'hormonal', 
      name: 'Гормональная система',
      shortName: 'Гормоны',
      color: '#eab308'
    },
    { 
      id: 'inflammatory', 
      name: 'Воспаление',
      shortName: 'Воспаление',
      color: '#22c55e'
    },
    { 
      id: 'oxidative_stress', 
      name: 'Антиоксиданты',
      shortName: 'Антиоксиданты',
      color: '#3b82f6'
    },
    { 
      id: 'kidney_function', 
      name: 'Почки',
      shortName: 'Почки',
      color: '#8b5cf6'
    },
    { 
      id: 'liver_function', 
      name: 'Печень',
      shortName: 'Печень',
      color: '#ec4899'
    },
    { 
      id: 'telomeres_epigenetics', 
      name: 'Клеточное старение',
      shortName: 'Клетки',
      color: '#06b6d4'
    }
  ];

  const categoryData = categories.map(category => ({
    ...category,
    score: getCategoryScore(category.id),
    filledCount: biomarkers.filter(b => 
      b.category === category.id && b.status === 'filled'
    ).length,
    totalCount: biomarkers.filter(b => b.category === category.id).length
  }));

  // Компактный SVG radar chart
  const center = 80;
  const maxRadius = 70;
  const angleStep = (2 * Math.PI) / categories.length;

  const getPoint = (index: number, score: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (score / 100) * maxRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  const getAxisPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + maxRadius * Math.cos(angle);
    const y = center + maxRadius * Math.sin(angle);
    return { x, y };
  };

  const getLabelPoint = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const x = center + (maxRadius + 15) * Math.cos(angle);
    const y = center + (maxRadius + 15) * Math.sin(angle);
    return { x, y };
  };

  // Create polygon path
  const pathData = categoryData
    .map((category, index) => {
      const point = getPoint(index, category.score);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .join(' ') + ' Z';

  const overallScore = Math.round(
    categoryData.reduce((sum, cat) => sum + cat.score, 0) / categoryData.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="border border-gray-200 bg-white p-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-900">{title}</h4>
        <Badge className={`text-xs ${getScoreBadgeColor(overallScore)}`}>
          {overallScore}/100
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Компактная радарная диаграмма */}
        <div className="flex justify-center">
          <svg width="160" height="160" className="overflow-visible">
            {/* Grid circles */}
            {[20, 40, 60, 80, 100].map(radius => (
              <circle
                key={radius}
                cx={center}
                cy={center}
                r={(radius / 100) * maxRadius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Axis lines */}
            {categories.map((_, index) => {
              const point = getAxisPoint(index);
              return (
                <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={point.x}
                  y2={point.y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Data polygon */}
            <path
              d={pathData}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />

            {/* Data points */}
            {categoryData.map((category, index) => {
              const point = getPoint(index, category.score);
              return (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={category.color}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}

            {/* Компактные лейблы */}
            {categoryData.map((category, index) => {
              const point = getLabelPoint(index);
              return (
                <text
                  key={index}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs fill-gray-700"
                >
                  {category.shortName}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Компактный список категорий */}
        <div className="space-y-1">
          {categoryData.map((category) => (
            <div key={category.id} className="flex items-center justify-between py-1 px-2 bg-gray-50">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <p className="text-xs font-medium">{category.name}</p>
                  <p className="text-xs text-gray-600">
                    {category.filledCount}/{category.totalCount} показателей
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${getScoreColor(category.score)}`}>
                  {category.score}
                </p>
                <p className="text-xs text-gray-600">баллов</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeRadarChart;