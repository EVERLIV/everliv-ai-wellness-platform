import React, { useState } from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestTube, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Info,
  Minus,
  Plus
} from "lucide-react";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import BiomarkerTrendChart from "@/components/analysis-details/BiomarkerTrendChart";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BiomarkerData {
  name: string;
  latestValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  lastUpdated: string;
  analysisCount: number;
  trend: 'up' | 'down' | 'stable';
  description?: string;
}

// Описания биомаркеров
const BIOMARKER_DESCRIPTIONS: { [key: string]: string } = {
  'Эритроциты': 'Красные кровяные тельца, переносят кислород от легких к тканям организма',
  'Гемоглобин': 'Белок в эритроцитах, который связывает и переносит кислород',
  'Лейкоциты': 'Белые кровяные тельца, основные клетки иммунной системы',
  'Тромбоциты': 'Клетки крови, отвечающие за свертываемость и остановку кровотечений',
  'Глюкоза': 'Основной источник энергии для клеток организма',
  'Холестерин': 'Жироподобное вещество, необходимое для построения клеточных мембран',
  'АЛТ': 'Фермент печени, показатель функции печени',
  'АСТ': 'Фермент, показатель состояния печени и сердечной мышцы',
  'Креатинин': 'Продукт обмена веществ в мышцах, показатель функции почек',
  'Мочевина': 'Конечный продукт белкового обмена, показатель функции почек',
};

const MyBiomarkers = () => {
  const { analysisHistory, loadingHistory } = useLabAnalysesData();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);

  // Обрабатываем данные биомаркеров
  const processBiomarkerData = (): BiomarkerData[] => {
    if (!analysisHistory || !Array.isArray(analysisHistory)) return [];

    const biomarkerMap = new Map<string, {
      values: Array<{ value: string; date: string }>;
      normalRange: string;
      status: 'normal' | 'high' | 'low';
    }>();

    // Собираем все данные биомаркеров
    analysisHistory.forEach(analysis => {
      if (analysis.results?.markers) {
        analysis.results.markers.forEach((marker: any) => {
          const name = marker.name;
          if (!biomarkerMap.has(name)) {
            biomarkerMap.set(name, {
              values: [],
              normalRange: marker.normal_range || marker.normalRange || 'Не указан',
              status: marker.status || 'normal'
            });
          }
          
          biomarkerMap.get(name)!.values.push({
            value: marker.value,
            date: analysis.created_at
          });
        });
      }
    });

    // Преобразуем в массив с вычислением трендов
    return Array.from(biomarkerMap.entries()).map(([name, data]) => {
      const sortedValues = data.values.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const latestValue = sortedValues[sortedValues.length - 1];
      const trend = sortedValues.length > 1 ? 
        calculateTrend(sortedValues) : 'stable';

      return {
        name,
        latestValue: latestValue.value,
        normalRange: data.normalRange,
        status: data.status,
        lastUpdated: latestValue.date,
        analysisCount: sortedValues.length,
        trend,
        description: BIOMARKER_DESCRIPTIONS[name]
      };
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  const calculateTrend = (values: Array<{ value: string; date: string }>): 'up' | 'down' | 'stable' => {
    if (values.length < 2) return 'stable';
    
    const first = parseFloat(values[0].value);
    const last = parseFloat(values[values.length - 1].value);
    
    if (isNaN(first) || isNaN(last)) return 'stable';
    
    const change = ((last - first) / first) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'up' : 'down';
  };

  const biomarkers = processBiomarkerData();

  // Фильтрация биомаркеров
  const filteredBiomarkers = biomarkers.filter(biomarker => {
    const matchesSearch = biomarker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || biomarker.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: biomarkers.length,
    normal: biomarkers.filter(b => b.status === 'normal').length,
    high: biomarkers.filter(b => b.status === 'high').length,
    low: biomarkers.filter(b => b.status === 'low').length
  };

  if (loadingHistory) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-16">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500">Загрузка биомаркеров...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="pt-16 flex-1">
        {/* Заголовок страницы */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TestTube className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Мои биомаркеры</h1>
                <p className="text-blue-100 mt-1">
                  Отслеживайте динамику ваших показателей здоровья
                </p>
              </div>
            </div>
            
            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">{biomarkers.length}</div>
                <div className="text-blue-100 text-sm">Биомаркеров</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-300">{statusCounts.normal}</div>
                <div className="text-blue-100 text-sm">В норме</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-300">{statusCounts.high}</div>
                <div className="text-blue-100 text-sm">Выше нормы</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-300">{statusCounts.low}</div>
                <div className="text-blue-100 text-sm">Ниже нормы</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {biomarkers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <TestTube className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Нет данных о биомаркерах
                </h3>
                <p className="text-gray-500 mb-6">
                  Добавьте анализы крови, чтобы начать отслеживать динамику ваших биомаркеров
                </p>
                <Button onClick={() => window.location.href = '/lab-analyses'}>
                  Добавить анализы
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Поиск и фильтры */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Поиск биомаркеров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-4 md:w-auto">
                      <TabsTrigger value="all" className="text-xs">
                        Все ({statusCounts.all})
                      </TabsTrigger>
                      <TabsTrigger value="normal" className="text-xs">
                        Норма ({statusCounts.normal})
                      </TabsTrigger>
                      <TabsTrigger value="high" className="text-xs">
                        Выше ({statusCounts.high})
                      </TabsTrigger>
                      <TabsTrigger value="low" className="text-xs">
                        Ниже ({statusCounts.low})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Список биомаркеров */}
              <div className="space-y-4">
                {filteredBiomarkers.map((biomarker) => (
                  <Card key={biomarker.name} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            biomarker.status === 'normal' ? 'bg-green-100' :
                            biomarker.status === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            <TestTube className={`h-5 w-5 ${
                              biomarker.status === 'normal' ? 'text-green-600' :
                              biomarker.status === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{biomarker.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={
                                biomarker.status === 'normal' ? 'default' :
                                biomarker.status === 'high' ? 'destructive' : 'secondary'
                              }>
                                {biomarker.status === 'normal' ? 'Норма' :
                                 biomarker.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                {biomarker.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                                {biomarker.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                                {biomarker.trend === 'stable' && <Minus className="h-4 w-4 text-gray-600" />}
                                <Calendar className="h-4 w-4" />
                                {format(new Date(biomarker.lastUpdated), 'dd MMM yyyy', { locale: ru })}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedBiomarker(
                            expandedBiomarker === biomarker.name ? null : biomarker.name
                          )}
                        >
                          {expandedBiomarker === biomarker.name ? (
                            <Minus className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Текущее значение</div>
                          <div className="font-semibold">{biomarker.latestValue}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Норма</div>
                          <div className="font-medium text-gray-700">{biomarker.normalRange}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Анализов</div>
                          <div className="font-medium text-gray-700">{biomarker.analysisCount}</div>
                        </div>
                      </div>

                      {/* Раскрывающаяся секция */}
                      {expandedBiomarker === biomarker.name && (
                        <div className="border-t pt-4 space-y-4">
                          {/* Описание биомаркера */}
                          {biomarker.description && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h4 className="font-medium text-blue-900 mb-1">
                                    За что отвечает {biomarker.name}
                                  </h4>
                                  <p className="text-sm text-blue-800">{biomarker.description}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* График динамики */}
                          <div>
                            <BiomarkerTrendChart biomarkerName={biomarker.name} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBiomarkers.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Биомаркеры не найдены
                    </h3>
                    <p className="text-gray-500">
                      Попробуйте изменить параметры поиска или фильтры
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default MyBiomarkers;