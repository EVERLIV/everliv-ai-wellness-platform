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
  Plus,
  ArrowLeft
} from "lucide-react";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import BiomarkerTrendChart from "@/components/analysis-details/BiomarkerTrendChart";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
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

import { getBiomarkerInfo } from '@/data/expandedBiomarkers';

const MyBiomarkers = () => {
  const { analysisHistory, loadingHistory } = useLabAnalysesData();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
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
        description: getBiomarkerInfo(name)
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
        {/* Заголовок страницы в стиле lab-analyses */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-gray-200">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к панели</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                    <TestTube className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      Мои биомаркеры
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                      Отслеживайте динамику ваших показателей здоровья
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button 
                  onClick={() => navigate('/lab-analyses')}
                  className="gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sm:hidden">Добавить</span>
                  <span className="hidden sm:inline">Добавить анализ</span>
                </Button>
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
                <div className="flex flex-col gap-4">
                  {/* Поиск */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Поиск биомаркеров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Улучшенные табы с числами */}
                  <div className="w-full">
                    <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
                      <TabsList className={`grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg`}>
                        <TabsTrigger 
                          value="all" 
                          className={`relative flex items-center justify-center gap-1 px-2 py-2 text-sm font-medium transition-all ${
                            isMobile ? 'text-xs flex-col gap-0.5' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-sm`}
                        >
                          <span>Все</span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-gray-500 text-white rounded-full min-w-[18px] h-[18px]">
                            {statusCounts.all}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="normal" 
                          className={`relative flex items-center justify-center gap-1 px-2 py-2 text-sm font-medium transition-all ${
                            isMobile ? 'text-xs flex-col gap-0.5' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-sm`}
                        >
                          <span>Норма</span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full min-w-[18px] h-[18px]">
                            {statusCounts.normal}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="high" 
                          className={`relative flex items-center justify-center gap-1 px-2 py-2 text-sm font-medium transition-all ${
                            isMobile ? 'text-xs flex-col gap-0.5' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-sm`}
                        >
                          <span>{isMobile ? 'Выше' : 'Выше'}</span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full min-w-[18px] h-[18px]">
                            {statusCounts.high}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="low" 
                          className={`relative flex items-center justify-center gap-1 px-2 py-2 text-sm font-medium transition-all ${
                            isMobile ? 'text-xs flex-col gap-0.5' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-sm`}
                        >
                          <span>{isMobile ? 'Ниже' : 'Ниже'}</span>
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-yellow-500 text-white rounded-full min-w-[18px] h-[18px]">
                            {statusCounts.low}
                          </span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
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