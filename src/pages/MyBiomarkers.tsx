import React, { useState } from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TestTube, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Plus
} from "lucide-react";
import { useLabAnalysesData } from "@/hooks/useLabAnalysesData";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import BiomarkerDetailDialog from "@/components/biomarkers/BiomarkerDetailDialog";
import { getBiomarkerInfo } from '@/data/expandedBiomarkers';

interface BiomarkerData {
  name: string;
  latestValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  lastUpdated: string;
  analysisCount: number;
  trend: 'up' | 'down' | 'stable';
}

const MyBiomarkers = () => {
  const { analysisHistory, loadingHistory } = useLabAnalysesData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBiomarker, setSelectedBiomarker] = useState<BiomarkerData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

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
        trend
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

  const handleBiomarkerClick = (biomarker: BiomarkerData) => {
    setSelectedBiomarker(biomarker);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedBiomarker(null);
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Компактный заголовок */}
      <div className="pt-16 bg-card border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-semibold">Биомаркеры</h1>
            </div>
            <Button 
              onClick={() => navigate('/lab-analyses')}
              size="sm"
              className="text-xs"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {biomarkers.length === 0 ? (
          <div className="text-center py-8">
            <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium mb-2">Нет данных</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте анализы для отслеживания биомаркеров
            </p>
            <Button size="sm" onClick={() => navigate('/lab-analyses')}>
              Добавить анализы
            </Button>
          </div>
        ) : (
          <>
            {/* Поиск */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            {/* Фильтры */}
            <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
              <TabsList data-tabs="4">
                <TabsTrigger value="all">
                  <span>Все</span>
                  <span className="tab-badge">{statusCounts.all}</span>
                </TabsTrigger>
                <TabsTrigger value="normal">
                  <span>Норма</span>
                  <span className="tab-badge-normal">{statusCounts.normal}</span>
                </TabsTrigger>
                <TabsTrigger value="high">
                  <span>Выше</span>
                  <span className="tab-badge-high">{statusCounts.high}</span>
                </TabsTrigger>
                <TabsTrigger value="low">
                  <span>Ниже</span>
                  <span className="tab-badge-low">{statusCounts.low}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Список биомаркеров */}
            <div className="space-y-2">
              {filteredBiomarkers.map((biomarker) => (
                <Card 
                  key={biomarker.name} 
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBiomarkerClick(biomarker)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Статус индикатор */}
                      <div className={`w-1 h-12 rounded-full ${
                        biomarker.status === 'normal' ? 'bg-green-500' :
                        biomarker.status === 'high' ? 'bg-red-500' : 'bg-orange-500'
                      }`} />
                      
                      {/* Основная информация */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium truncate">{biomarker.name}</h3>
                          <div className="flex items-center gap-1">
                            {biomarker.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                            {biomarker.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(biomarker.lastUpdated), 'dd.MM', { locale: ru })}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">{biomarker.latestValue}</span>
                          <Badge 
                            variant={
                              biomarker.status === 'normal' ? 'default' :
                              biomarker.status === 'high' ? 'destructive' : 'secondary'
                            }
                            className="text-xs h-5"
                          >
                            {biomarker.status === 'normal' ? 'Норма' :
                             biomarker.status === 'high' ? 'Повышен' : 'Понижен'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBiomarkers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Не найдено биомаркеров по заданным критериям
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Диалог детального просмотра биомаркера */}
      <BiomarkerDetailDialog
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        biomarker={selectedBiomarker}
      />
      
      <MinimalFooter />
    </div>
  );
};

export default MyBiomarkers;