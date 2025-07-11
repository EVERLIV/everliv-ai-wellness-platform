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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="pt-16 flex-1">
        {/* Заголовок страницы */}
        <div className="bg-card border-b">
          <div className="analytics-container">
            <div className="mobile-flex-header py-4 sm:py-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                  className="mobile-touch-target hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Назад к панели</span>
                  <span className="sm:hidden">Назад</span>
                </Button>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <TestTube className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="mobile-heading-primary">
                      Мои биомаркеры
                    </h1>
                    <p className="mobile-text-small text-muted-foreground hidden sm:block">
                      Отслеживайте динамику ваших показателей здоровья
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/lab-analyses')}
                className="mobile-button gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                <span className="sm:hidden">Добавить</span>
                <span className="hidden sm:inline">Добавить анализ</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="analytics-container mobile-section-spacing">
          {biomarkers.length === 0 ? (
            <Card className="mobile-card text-center">
              <CardContent className="mobile-card-content">
                <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <TestTube className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mobile-heading-secondary mb-2">
                  Нет данных о биомаркерах
                </h3>
                <p className="mobile-text-body text-muted-foreground mb-4">
                  Добавьте анализы крови, чтобы начать отслеживать динамику ваших биомаркеров
                </p>
                <Button 
                  onClick={() => window.location.href = '/lab-analyses'}
                  className="mobile-button"
                >
                  Добавить анализы
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Поиск и фильтры */}
              <Card className="mobile-card mb-4">
                <CardContent className="content-padding-internal">
                  {/* Поиск */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Поиск биомаркеров..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 mobile-touch-target"
                    />
                  </div>
                  
                  {/* Компактные табы */}
                  <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted p-1 rounded-lg h-auto">
                      <TabsTrigger 
                        value="all" 
                        className={`flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium ${
                          isMobile ? 'flex-col gap-0.5' : 'gap-1'
                        } data-[state=active]:bg-background`}
                      >
                        <span>Все</span>
                        <span className="mobile-badge-sm bg-muted-foreground text-background">
                          {statusCounts.all}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="normal" 
                        className={`flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium ${
                          isMobile ? 'flex-col gap-0.5' : 'gap-1'
                        } data-[state=active]:bg-background`}
                      >
                        <span>Норма</span>
                        <span className="mobile-badge-sm bg-green-500 text-white">
                          {statusCounts.normal}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="high" 
                        className={`flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium ${
                          isMobile ? 'flex-col gap-0.5' : 'gap-1'
                        } data-[state=active]:bg-background`}
                      >
                        <span>Выше</span>
                        <span className="mobile-badge-sm bg-red-500 text-white">
                          {statusCounts.high}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="low" 
                        className={`flex items-center justify-center gap-1 px-2 py-2 text-xs font-medium ${
                          isMobile ? 'flex-col gap-0.5' : 'gap-1'
                        } data-[state=active]:bg-background`}
                      >
                        <span>Ниже</span>
                        <span className="mobile-badge-sm bg-yellow-500 text-white">
                          {statusCounts.low}
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Список биомаркеров */}
              <div className="space-y-3">
                {filteredBiomarkers.map((biomarker) => (
                  <Card key={biomarker.name} className="mobile-card overflow-hidden">
                    <CardHeader className="mobile-card-header">
                      <div className="mobile-flex-header">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${
                            biomarker.status === 'normal' 
                              ? 'bg-green-100 border border-green-200' :
                            biomarker.status === 'high' 
                              ? 'bg-red-100 border border-red-200'
                              : 'bg-yellow-100 border border-yellow-200'
                          }`}>
                            <TestTube className={`h-4 w-4 ${
                              biomarker.status === 'normal' ? 'text-green-600' :
                              biomarker.status === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="mobile-text-body font-semibold truncate">{biomarker.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge 
                                variant={
                                  biomarker.status === 'normal' ? 'default' :
                                  biomarker.status === 'high' ? 'destructive' : 'secondary'
                                }
                                className="mobile-badge-sm"
                              >
                                {biomarker.status === 'normal' ? 'Норма' :
                                 biomarker.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
                              </Badge>
                              <div className="flex items-center gap-1 mobile-text-small text-muted-foreground">
                                {biomarker.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                                {biomarker.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                                {biomarker.trend === 'stable' && <Minus className="h-3 w-3 text-muted-foreground" />}
                                <Calendar className="h-3 w-3" />
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
                          className="mobile-touch-target hover:bg-muted flex-shrink-0"
                        >
                          {expandedBiomarker === biomarker.name ? (
                            <Minus className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="mobile-card-content">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="mobile-text-small text-muted-foreground mb-1">Текущее значение</div>
                          <div className="mobile-text-body font-semibold truncate">{biomarker.latestValue}</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="mobile-text-small text-muted-foreground mb-1">Норма</div>
                          <div className="mobile-text-small font-medium truncate">{biomarker.normalRange}</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="mobile-text-small text-muted-foreground mb-1">Анализов</div>
                          <div className="mobile-text-small font-medium">{biomarker.analysisCount}</div>
                        </div>
                      </div>

                      {/* Раскрывающаяся секция */}
                      {expandedBiomarker === biomarker.name && (
                        <div className="border-t pt-4 space-y-3">
                          {/* Описание биомаркера */}
                          {biomarker.description && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <div className="flex items-start gap-2">
                                <div className="p-1 bg-blue-100 rounded">
                                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="mobile-text-small font-medium text-blue-900 mb-1">
                                    За что отвечает {biomarker.name}
                                  </h4>
                                  <p className="mobile-text-small text-blue-800 leading-relaxed">{biomarker.description}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* График динамики */}
                          <div className="bg-card p-3 rounded-lg border">
                            <BiomarkerTrendChart biomarkerName={biomarker.name} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredBiomarkers.length === 0 && (
                <Card className="mobile-card text-center">
                  <CardContent className="mobile-card-content">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-4">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mobile-heading-secondary mb-2">
                      Биомаркеры не найдены
                    </h3>
                    <p className="mobile-text-body text-muted-foreground">
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