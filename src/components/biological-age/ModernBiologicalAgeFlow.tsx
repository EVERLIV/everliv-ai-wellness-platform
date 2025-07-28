import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Biomarker } from '@/types/biologicalAge';
import { HealthProfileData } from '@/types/healthProfile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Droplet, 
  Shield, 
  Pill, 
  Dna,
  TrendingUp,
  Target,
  CheckCircle,
  Plus
} from 'lucide-react';

interface BiomarkerNodeData {
  biomarker: Biomarker;
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

interface CategoryNodeData {
  category: string;
  biomarkers: Biomarker[];
  progress: { filled: number; total: number; percentage: number };
  info: any;
}

interface FlowProps {
  biomarkers: Biomarker[];
  onValueChange: (biomarkerId: string, value: number) => void;
  healthProfile: HealthProfileData;
}

// Компонент для отображения биомаркера
const BiomarkerNode: React.FC<{ data: BiomarkerNodeData }> = ({ data }) => {
  const { biomarker, onValueChange, healthProfile } = data;
  
  const getValueStatus = (value: number, range: any) => {
    if (!range) return { status: 'Неизвестно', color: 'bg-gray-100 text-gray-600' };
    
    const { min, max } = range;
    if (value >= min && value <= max) {
      return { status: 'В норме', color: 'bg-green-100 text-green-700' };
    } else if (value > max) {
      return { status: 'Выше нормы', color: 'bg-red-100 text-red-700' };
    } else {
      return { status: 'Ниже нормы', color: 'bg-blue-100 text-blue-700' };
    }
  };

  const status = biomarker.value ? getValueStatus(biomarker.value, biomarker.normal_range) : null;

  return (
    <Card className="w-64 p-3 shadow-lg border-l-4 border-l-primary">
      <Handle type="target" position={Position.Top} className="!w-2 !h-2" />
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${biomarker.importance === 'high' ? 'bg-red-500' : biomarker.importance === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <h4 className="font-medium text-sm truncate">{biomarker.name}</h4>
        </div>
        
        {biomarker.value ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">{biomarker.value} {biomarker.unit}</span>
              {status && (
                <Badge className={`text-xs ${status.color}`}>
                  {status.status}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Норма: {biomarker.normal_range?.min}-{biomarker.normal_range?.max} {biomarker.unit}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Plus className="h-4 w-4" />
            <span className="text-xs">Добавить значение</span>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2" />
    </Card>
  );
};

// Компонент для отображения категории
const CategoryNode: React.FC<{ data: CategoryNodeData }> = ({ data }) => {
  const { category, biomarkers, progress, info } = data;
  const IconComponent = info.icon;

  return (
    <Card className="w-80 p-4 shadow-xl border-l-4" style={{ borderLeftColor: info.color }}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3" />
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${info.bgColor}`}>
            <IconComponent className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{info.title}</h3>
            <p className="text-sm text-muted-foreground">{info.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">
            Заполнено: {progress.filled}/{progress.total}
          </div>
          <div className="w-24">
            <Progress value={progress.percentage} className="h-2" />
          </div>
        </div>
        
        {progress.filled > 0 && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Данные введены</span>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3" />
    </Card>
  );
};

const nodeTypes = {
  biomarker: BiomarkerNode,
  category: CategoryNode,
};

const ModernBiologicalAgeFlow: React.FC<FlowProps> = ({ 
  biomarkers, 
  onValueChange, 
  healthProfile 
}) => {
  const getCategoryInfo = (category: string) => {
    const info = {
      'cardiovascular': {
        title: 'Сердечно-сосудистая система',
        icon: Heart,
        color: '#ef4444',
        bgColor: 'bg-red-50',
        description: 'Показатели работы сердца и сосудов',
        priority: 1
      },
      'metabolic': {
        title: 'Метаболические маркеры',
        icon: Activity,
        color: '#3b82f6',
        bgColor: 'bg-blue-50',
        description: 'Обмен веществ и энергетический баланс',
        priority: 2
      },
      'inflammatory': {
        title: 'Воспалительные маркеры',
        icon: AlertTriangle,
        color: '#f97316',
        bgColor: 'bg-orange-50',
        description: 'Воспалительные процессы в организме',
        priority: 3
      },
      'hormonal': {
        title: 'Гормональная система',
        icon: Zap,
        color: '#8b5cf6',
        bgColor: 'bg-purple-50',
        description: 'Гормональный баланс организма',
        priority: 4
      },
      'kidney_function': {
        title: 'Почечная функция',
        icon: Droplet,
        color: '#10b981',
        bgColor: 'bg-green-50',
        description: 'Работа почек и выделительной системы',
        priority: 5
      },
      'liver_function': {
        title: 'Печеночная функция',
        icon: Pill,
        color: '#14b8a6',
        bgColor: 'bg-teal-50',
        description: 'Функция печени и детоксикация',
        priority: 6
      },
      'oxidative_stress': {
        title: 'Окислительный стресс',
        icon: Shield,
        color: '#eab308',
        bgColor: 'bg-yellow-50',
        description: 'Защита от свободных радикалов',
        priority: 7
      },
      'telomeres_epigenetics': {
        title: 'Теломеры и эпигенетика',
        icon: Dna,
        color: '#ec4899',
        bgColor: 'bg-pink-50',
        description: 'Генетические маркеры старения',
        priority: 8
      }
    };
    return info[category as keyof typeof info] || {
      title: category,
      icon: Activity,
      color: '#6b7280',
      bgColor: 'bg-gray-50',
      description: '',
      priority: 9
    };
  };

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const categorizedBiomarkers = biomarkers.reduce((acc, biomarker) => {
      if (!acc[biomarker.category]) {
        acc[biomarker.category] = [];
      }
      acc[biomarker.category].push(biomarker);
      return acc;
    }, {} as Record<string, Biomarker[]>);

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let yPosition = 0;
    const categorySpacing = 300;
    const biomarkerSpacing = 120;

    // Сортируем категории по приоритету
    const sortedCategories = Object.entries(categorizedBiomarkers).sort(([a], [b]) => {
      const infoA = getCategoryInfo(a);
      const infoB = getCategoryInfo(b);
      return infoA.priority - infoB.priority;
    });

    sortedCategories.forEach(([category, categoryBiomarkers], categoryIndex) => {
      const categoryInfo = getCategoryInfo(category);
      const progress = {
        filled: categoryBiomarkers.filter(b => b.value !== undefined && b.value !== null).length,
        total: categoryBiomarkers.length,
        percentage: 0
      };
      progress.percentage = progress.total > 0 ? (progress.filled / progress.total) * 100 : 0;

      // Добавляем узел категории
      const categoryNodeId = `category-${category}`;
      nodes.push({
        id: categoryNodeId,
        type: 'category',
        position: { x: 100, y: yPosition },
        data: {
          category,
          biomarkers: categoryBiomarkers,
          progress,
          info: categoryInfo
        }
      });

      yPosition += 150; // Расстояние до биомаркеров

      // Добавляем узлы биомаркеров
      categoryBiomarkers.forEach((biomarker, index) => {
        const biomarkerNodeId = `biomarker-${biomarker.id}`;
        const xOffset = (index % 3) * 280 + 200; // 3 биомаркера в ряд
        const yOffset = Math.floor(index / 3) * biomarkerSpacing;

        nodes.push({
          id: biomarkerNodeId,
          type: 'biomarker',
          position: { x: xOffset, y: yPosition + yOffset },
          data: {
            biomarker,
            onValueChange,
            healthProfile
          }
        });

        // Добавляем связь от категории к биомаркеру
        edges.push({
          id: `edge-${categoryNodeId}-${biomarkerNodeId}`,
          source: categoryNodeId,
          target: biomarkerNodeId,
          type: 'smoothstep',
          style: { stroke: categoryInfo.color, strokeWidth: 2 },
          animated: biomarker.value !== undefined && biomarker.value !== null
        });
      });

      // Увеличиваем позицию для следующей категории
      const maxRows = Math.ceil(categoryBiomarkers.length / 3);
      yPosition += maxRows * biomarkerSpacing + categorySpacing;
    });

    return { nodes, edges };
  }, [biomarkers, onValueChange, healthProfile]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-screen w-full border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gradient-to-br from-slate-50 to-slate-100"
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background color="#e2e8f0" size={2} />
        <Controls position="top-right" className="bg-white shadow-lg" />
        <MiniMap 
          position="bottom-right" 
          className="bg-white shadow-lg"
          nodeStrokeWidth={3}
          nodeColor={(node: any) => {
            if (node.type === 'category' && node.data?.category) {
              const categoryInfo = getCategoryInfo(node.data.category as string);
              return categoryInfo.color;
            }
            return '#6b7280';
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default ModernBiologicalAgeFlow;