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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Header />
      <div className="pt-16 flex-1">
        {/* Заголовок страницы */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 border-b border-emerald-100/50 backdrop-blur-sm">
          <div className="analytics-container analytics-content-spacing">
            <div className="mobile-flex-header">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size={isMobile ? "sm" : "default"}
                  onClick={() => navigate("/dashboard")}
                  className="mobile-button-sm hover:bg-emerald-100/80 backdrop-blur-sm border-0 transition-all duration-300"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к панели</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-200 via-emerald-100 to-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50 border border-emerald-200/50">
                    <TestTube className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-700" />
                  </div>
                  <div>
                    <h1 className="mobile-heading-primary bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                      Мои биомаркеры
                    </h1>
                    <p className="mobile-text-body text-emerald-700/80 hidden sm:block">
                      Отслеживайте динамику ваших показателей здоровья
                    </p>
                  </div>
                </div>
              </div>

              <div className="mobile-flex-actions">
                <Button 
                  onClick={() => navigate('/lab-analyses')}
                  className="mobile-button gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-200/50 border-0 transition-all duration-300 hover:scale-105"
                  size={isMobile ? "sm" : "default"}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sm:hidden">Добавить</span>
                  <span className="hidden sm:inline">Добавить анализ</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-container mobile-section-spacing">
          {biomarkers.length === 0 ? (
            <Card className="mobile-card text-center shadow-lg shadow-slate-200/50 border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50">
              <CardContent className="mobile-card-content space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <TestTube className="h-10 w-10 text-emerald-600" />
                </div>
                <div className="space-y-3">
                  <h3 className="mobile-heading-secondary text-slate-800">
                    Нет данных о биомаркерах
                  </h3>
                  <p className="mobile-text-body text-slate-600 max-w-md mx-auto">
                    Добавьте анализы крови, чтобы начать отслеживать динамику ваших биомаркеров
                  </p>
                </div>
                <Button 
                  onClick={() => window.location.href = '/lab-analyses'}
                  className="mobile-button bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-200/50 border-0 transition-all duration-300 hover:scale-105"
                >
                  Добавить анализы
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Поиск и фильтры */}
              <div className="mobile-card bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 border-slate-200/50 mb-6">
                <div className="mobile-content-spacing">
                  {/* Поиск */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 h-5 w-5" />
                    <Input
                      placeholder="Поиск биомаркеров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-emerald-200/50 focus:border-emerald-400 focus:ring-emerald-400/20 rounded-xl transition-all duration-300"
                    />
                  </div>
                  
                  {/* Улучшенные табы с числами */}
                  <div className="w-full">
                    <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-xl border border-slate-200/50">
                        <TabsTrigger 
                          value="all" 
                          className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isMobile ? 'text-xs flex-col gap-1' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/50 data-[state=active]:border data-[state=active]:border-slate-200/50 rounded-lg`}
                        >
                          <span>Все</span>
                          <span className="mobile-badge bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-sm">
                            {statusCounts.all}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="normal" 
                          className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isMobile ? 'text-xs flex-col gap-1' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/50 data-[state=active]:border data-[state=active]:border-slate-200/50 rounded-lg`}
                        >
                          <span>Норма</span>
                          <span className="mobile-badge bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm">
                            {statusCounts.normal}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="high" 
                          className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isMobile ? 'text-xs flex-col gap-1' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/50 data-[state=active]:border data-[state=active]:border-slate-200/50 rounded-lg`}
                        >
                          <span>Выше</span>
                          <span className="mobile-badge bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
                            {statusCounts.high}
                          </span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="low" 
                          className={`relative flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                            isMobile ? 'text-xs flex-col gap-1' : 'text-sm gap-2'
                          } data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:shadow-slate-200/50 data-[state=active]:border data-[state=active]:border-slate-200/50 rounded-lg`}
                        >
                          <span>Ниже</span>
                          <span className="mobile-badge bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                            {statusCounts.low}
                          </span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Список биомаркеров */}
              <div className="mobile-content-spacing">
                {filteredBiomarkers.map((biomarker) => (
                  <Card key={biomarker.name} className="mobile-card bg-gradient-to-br from-white to-slate-50/30 shadow-lg shadow-slate-200/50 border-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/30 hover:scale-[1.02]">
                    <CardHeader className="mobile-card-header">
                      <div className="mobile-flex-header">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`p-3 rounded-2xl shadow-lg border transition-all duration-300 ${
                            biomarker.status === 'normal' 
                              ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-200/50 shadow-emerald-200/50' :
                            biomarker.status === 'high' 
                              ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-200/50 shadow-red-200/50'
                              : 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-200/50 shadow-amber-200/50'
                          }`}>
                            <TestTube className={`h-6 w-6 ${
                              biomarker.status === 'normal' ? 'text-emerald-700' :
                              biomarker.status === 'high' ? 'text-red-700' : 'text-amber-700'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="mobile-heading-secondary truncate">{biomarker.name}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge 
                                variant={
                                  biomarker.status === 'normal' ? 'default' :
                                  biomarker.status === 'high' ? 'destructive' : 'secondary'
                                }
                                className={`mobile-badge-sm shadow-sm ${
                                  biomarker.status === 'normal' 
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' :
                                  biomarker.status === 'high' 
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                                } text-white border-0`}
                              >
                                {biomarker.status === 'normal' ? 'Норма' :
                                 biomarker.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
                              </Badge>
                              <div className="flex items-center gap-1.5 mobile-text-small text-slate-600">
                                {biomarker.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                                {biomarker.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                                {biomarker.trend === 'stable' && <Minus className="h-4 w-4 text-slate-500" />}
                                <Calendar className="h-4 w-4" />
                                <span className="truncate">
                                  {format(new Date(biomarker.lastUpdated), 'dd MMM yyyy', { locale: ru })}
                                </span>
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
                          className="mobile-touch-target hover:bg-slate-100/80 backdrop-blur-sm border-0 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0"
                        >
                          {expandedBiomarker === biomarker.name ? (
                            <Minus className="h-5 w-5 text-slate-600" />
                          ) : (
                            <Plus className="h-5 w-5 text-slate-600" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="mobile-card-content">
                      <div className="analytics-grid gap-4 mb-6">
                        <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                          <div className="mobile-text-small text-slate-600 mb-1">Текущее значение</div>
                          <div className="mobile-heading-secondary text-slate-800 font-bold truncate">{biomarker.latestValue}</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                          <div className="mobile-text-small text-slate-600 mb-1">Норма</div>
                          <div className="mobile-text-body font-semibold text-slate-700 truncate">{biomarker.normalRange}</div>
                        </div>
                        <div className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-200/50 shadow-sm">
                          <div className="mobile-text-small text-slate-600 mb-1">Анализов</div>
                          <div className="mobile-text-body font-semibold text-slate-700">{biomarker.analysisCount}</div>
                        </div>
                      </div>

                      {/* Раскрывающаяся секция */}
                      {expandedBiomarker === biomarker.name && (
                        <div className="border-t border-slate-200/50 pt-6 mobile-content-spacing">
                          {/* Описание биомаркера */}
                          {biomarker.description && (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 rounded-xl border border-blue-200/50 shadow-sm">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-200/50 rounded-lg">
                                  <Info className="h-5 w-5 text-blue-700 flex-shrink-0" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="mobile-text-body font-semibold text-blue-900 mb-2">
                                    За что отвечает {biomarker.name}
                                  </h4>
                                  <p className="mobile-text-small text-blue-800 leading-relaxed">{biomarker.description}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* График динамики */}
                          <div className="bg-gradient-to-br from-white to-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200/50 shadow-sm">
                            <BiomarkerTrendChart biomarkerName={biomarker.name} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBiomarkers.length === 0 && (
                <Card className="mobile-card text-center bg-gradient-to-br from-white to-slate-50/50 shadow-lg shadow-slate-200/50 border-slate-200/50">
                  <CardContent className="mobile-card-content space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                      <Filter className="h-10 w-10 text-slate-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="mobile-heading-secondary text-slate-800">
                        Биомаркеры не найдены
                      </h3>
                      <p className="mobile-text-body text-slate-600 max-w-md mx-auto">
                        Попробуйте изменить параметры поиска или фильтры
                      </p>
                    </div>
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