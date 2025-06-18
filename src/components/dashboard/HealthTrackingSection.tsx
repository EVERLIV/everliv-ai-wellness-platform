
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Trophy,
  Calendar,
  Zap,
  Shield
} from "lucide-react";

interface VitalMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'optimal' | 'good' | 'attention' | 'risk';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  history: Array<{ date: string; value: number }>;
}

interface HealthTask {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'stress' | 'checkup';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  points: number;
  estimatedTime: string;
}

const HealthTrackingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("vitals");

  // Моковые данные для демонстрации
  const vitalMetrics: VitalMetric[] = [
    {
      id: "cholesterol",
      name: "Холестерин общий",
      value: 4.2,
      unit: "ммоль/л",
      normalRange: "3.0-5.2",
      status: "good",
      trend: "down",
      trendValue: -0.3,
      lastUpdated: "2024-06-15",
      history: [
        { date: "2024-03", value: 4.8 },
        { date: "2024-04", value: 4.5 },
        { date: "2024-05", value: 4.3 },
        { date: "2024-06", value: 4.2 }
      ]
    },
    {
      id: "hemoglobin",
      name: "Гемоглобин",
      value: 145,
      unit: "г/л",
      normalRange: "130-160",
      status: "optimal",
      trend: "stable",
      trendValue: 0,
      lastUpdated: "2024-06-15",
      history: [
        { date: "2024-03", value: 142 },
        { date: "2024-04", value: 144 },
        { date: "2024-05", value: 145 },
        { date: "2024-06", value: 145 }
      ]
    },
    {
      id: "glucose",
      name: "Глюкоза крови",
      value: 5.8,
      unit: "ммоль/л",
      normalRange: "3.9-6.1",
      status: "attention",
      trend: "up",
      trendValue: 0.2,
      lastUpdated: "2024-06-15",
      history: [
        { date: "2024-03", value: 5.4 },
        { date: "2024-04", value: 5.6 },
        { date: "2024-05", value: 5.7 },
        { date: "2024-06", value: 5.8 }
      ]
    },
    {
      id: "pressure",
      name: "Артериальное давление",
      value: 125,
      unit: "мм рт.ст.",
      normalRange: "90-140",
      status: "good",
      trend: "stable",
      trendValue: 0,
      lastUpdated: "2024-06-18",
      history: [
        { date: "2024-03", value: 128 },
        { date: "2024-04", value: 126 },
        { date: "2024-05", value: 125 },
        { date: "2024-06", value: 125 }
      ]
    }
  ];

  const healthTasks: HealthTask[] = [
    {
      id: "1",
      title: "Увеличить потребление клетчатки",
      description: "Добавьте 5г клетчатки в день для улучшения пищеварения и контроля глюкозы",
      category: "nutrition",
      priority: "high",
      dueDate: "2024-06-25",
      completed: false,
      points: 20,
      estimatedTime: "30 мин"
    },
    {
      id: "2",
      title: "Кардиотренировка 3 раза в неделю",
      description: "30 минут умеренной кардионагрузки для улучшения работы сердца",
      category: "exercise",
      priority: "high",
      dueDate: "2024-06-30",
      completed: false,
      points: 25,
      estimatedTime: "90 мин/неделя"
    },
    {
      id: "3",
      title: "Контроль уровня стресса",
      description: "Практика медитации или дыхательных упражнений 10 минут в день",
      category: "stress",
      priority: "medium",
      dueDate: "2024-06-22",
      completed: true,
      points: 15,
      estimatedTime: "10 мин/день"
    },
    {
      id: "4",
      title: "Запланировать визит к кардиологу",
      description: "Плановая консультация для контроля состояния сердечно-сосудистой системы",
      category: "checkup",
      priority: "medium",
      dueDate: "2024-07-15",
      completed: false,
      points: 30,
      estimatedTime: "1 час"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <Zap className="h-4 w-4" />;
      case 'exercise': return <Activity className="h-4 w-4" />;
      case 'sleep': return <Clock className="h-4 w-4" />;
      case 'stress': return <Shield className="h-4 w-4" />;
      case 'checkup': return <Calendar className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const completedTasks = healthTasks.filter(task => task.completed).length;
  const totalPoints = healthTasks.filter(task => task.completed).reduce((sum, task) => sum + task.points, 0);
  const healthScore = Math.min(100, Math.round((totalPoints / 90) * 100));

  return (
    <div className="space-y-6">
      {/* Общий балл здоровья */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            Ваш балл здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-blue-600">{healthScore}/100</div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Выполнено задач</div>
              <div className="text-lg font-semibold">{completedTasks}/{healthTasks.length}</div>
            </div>
          </div>
          <Progress value={healthScore} className="h-3 mb-2" />
          <p className="text-sm text-gray-600">
            Набрано {totalPoints} очков из возможных 90. Продолжайте выполнять рекомендации!
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="vitals">Жизненные показатели</TabsTrigger>
          <TabsTrigger value="tasks">Задачи здоровья</TabsTrigger>
        </TabsList>

        {/* Жизненные показатели */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vitalMetrics.map((metric) => (
              <Card key={metric.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === 'optimal' ? 'Отлично' : 
                       metric.status === 'good' ? 'Хорошо' : 
                       metric.status === 'attention' ? 'Внимание' : 'Риск'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                      </div>
                      <div className="text-sm text-gray-600">Норма: {metric.normalRange}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-red-600' : 
                        metric.trend === 'down' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {metric.trendValue > 0 ? '+' : ''}{metric.trendValue}
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-32 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metric.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          fontSize={12}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Последнее обновление: {new Date(metric.lastUpdated).toLocaleDateString('ru-RU')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Задачи здоровья */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Персональные рекомендации</h3>
              {healthTasks.map((task) => (
                <Card key={task.id} className={`border-l-4 ${
                  task.completed ? 'border-l-green-500 bg-green-50/30' : 
                  task.priority === 'high' ? 'border-l-red-500' : 
                  task.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(task.category)}
                        <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Высокий' : 
                           task.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </Badge>
                        {task.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>До: {new Date(task.dueDate).toLocaleDateString('ru-RU')}</span>
                        <span>⏱️ {task.estimatedTime}</span>
                        <span>🏆 {task.points} очков</span>
                      </div>
                      {!task.completed && (
                        <Button size="sm" variant="outline">
                          Отметить выполненным
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Сайдбар с прогрессом */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Прогресс по категориям</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['nutrition', 'exercise', 'stress', 'checkup'].map((category) => {
                      const categoryTasks = healthTasks.filter(task => task.category === category);
                      const completedCount = categoryTasks.filter(task => task.completed).length;
                      const progress = categoryTasks.length > 0 ? (completedCount / categoryTasks.length) * 100 : 0;
                      
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category)}
                              <span className="font-medium">
                                {category === 'nutrition' ? 'Питание' :
                                 category === 'exercise' ? 'Активность' :
                                 category === 'stress' ? 'Стресс' : 'Обследования'}
                              </span>
                            </div>
                            <span className="text-gray-600">{completedCount}/{categoryTasks.length}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Достижения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Первые шаги</div>
                        <div className="text-xs text-gray-600">Выполните первую задачу</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg opacity-50">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Здоровое сердце</div>
                        <div className="text-xs text-gray-600">5 кардиотренировок</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthTrackingSection;
