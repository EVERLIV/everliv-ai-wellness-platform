import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
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
import { getBiomarkerNorm } from '@/data/biomarkerNorms';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateBiomarkerStatus } from '@/utils/biomarkerStatus';

interface BiomarkerData {
  name: string;
  latestValue: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
  lastUpdated: string;
  analysisCount: number;
  trend: 'up' | 'down' | 'stable';
  deviationPercentage?: number;
  unit?: string;
}

const MyBiomarkers = () => {
  const { analysisHistory, loadingHistory } = useLabAnalysesData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBiomarker, setSelectedBiomarker] = useState<BiomarkerData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Загружаем профиль пользователя
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('gender, date_of_birth')
          .eq('id', user.id)
          .single();
        
        setUserProfile(data);
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Обрабатываем данные биомаркеров
  const processBiomarkerData = (): BiomarkerData[] => {
    if (!analysisHistory || !Array.isArray(analysisHistory)) return [];

    const biomarkerMap = new Map<string, {
      values: Array<{ value: string; date: string; unit?: string }>;
      normalRange: string;
      status: 'normal' | 'high' | 'low';
      unit?: string;
    }>();

    // Собираем все данные биомаркеров из results
    analysisHistory.forEach(analysis => {
      if (analysis.results?.markers) {
        analysis.results.markers.forEach((marker: any) => {
          const name = marker.name;
          if (!biomarkerMap.has(name)) {
            // Используем данные из results (более полные)
            const normalRange = marker.referenceRange || marker.reference_range || marker.normal_range || marker.normalRange || 
                               getBiomarkerNorm(name, userProfile?.gender, userProfile?.date_of_birth) || 'Не определена';
            
            // Извлекаем единицу измерения из value или используем отдельное поле unit
            let unit = marker.unit || '';
            let cleanValue = marker.value || '';
            
            // Если единица в самом значении, извлекаем её
            if (typeof cleanValue === 'string' && /[a-zA-Zа-яА-Я%/°^]/.test(cleanValue)) {
              const valueMatch = cleanValue.match(/^([0-9,.\s]+)(.*)$/);
              if (valueMatch) {
                cleanValue = valueMatch[1].trim();
                unit = unit || valueMatch[2].trim();
              }
            }
            
            console.log(`Обработка биомаркера ${name}:`, {
              originalValue: marker.value,
              cleanValue,
              unit,
              normalRange,
              referenceRange: marker.referenceRange
            });
            
            // Вычисляем статус на основе значения и нормы
            const calculatedStatus = calculateBiomarkerStatus(cleanValue, normalRange);
            
            // ВАЖНО: Игнорируем marker.status из исходных данных, используем только вычисленный
            // так как исходные данные могут содержать ошибки
            console.log(`🔍 Статус биомаркера ${name}:`, {
              originalStatus: marker.status,
              calculatedStatus,
              value: cleanValue,
              normalRange,
              shouldUseCalculated: true
            });
            
            biomarkerMap.set(name, {
              values: [],
              normalRange,
              status: calculatedStatus, // Используем только вычисленный статус
              unit
            });
          }
          
          const biomarkerData = biomarkerMap.get(name)!;
          
          // Извлекаем чистое значение без единиц для расчетов
          let cleanValue = marker.value || '';
          if (typeof cleanValue === 'string') {
            const valueMatch = cleanValue.match(/^([0-9,.\s]+)/);
            if (valueMatch) {
              cleanValue = valueMatch[1].trim();
            }
          }
          
          biomarkerData.values.push({
            value: cleanValue,
            date: analysis.created_at,
            unit: biomarkerData.unit
          });
          
          // Обновляем статус для последнего значения - используем только вычисленный
          const latestStatus = calculateBiomarkerStatus(cleanValue, biomarkerData.normalRange);
          biomarkerData.status = latestStatus;
        });
      }
    });

    // Функция для расчета процентного отклонения от нормы
    const calculateDeviationPercentage = (value: string, normalRange: string, status: string): number | undefined => {
      if (status === 'normal' || !normalRange || normalRange === 'Не определена') return undefined;
      
      // Нормализуем значение - заменяем запятую на точку
      const currentValue = parseFloat(value.replace(',', '.'));
      if (isNaN(currentValue)) return undefined;

      // Парсим норму (например, "120-150 г/л" или ">1.0 ммоль/л")
      let minNormal = 0;
      let maxNormal = 0;

      // Обработка различных форматов норм
      if (normalRange.includes('-')) {
        const parts = normalRange.split('-');
        const min = parseFloat(parts[0].trim().replace(',', '.'));
        const max = parseFloat(parts[1].trim().replace(',', '.'));
        if (!isNaN(min) && !isNaN(max)) {
          minNormal = min;
          maxNormal = max;
        }
      } else if (normalRange.startsWith('>')) {
        const min = parseFloat(normalRange.substring(1).replace(',', '.'));
        if (!isNaN(min)) {
          minNormal = min;
          maxNormal = Infinity;
        }
      } else if (normalRange.startsWith('<')) {
        const max = parseFloat(normalRange.substring(1).replace(',', '.'));
        if (!isNaN(max)) {
          minNormal = 0;
          maxNormal = max;
        }
      } else {
        // Попытка извлечь число из строки
        const match = normalRange.match(/(\d+(?:[,.]\d+)?)/);
        if (match) {
          const value = parseFloat(match[1].replace(',', '.'));
          if (!isNaN(value)) {
            minNormal = maxNormal = value;
          }
        }
      }

      let deviation = 0;
      if (status === 'high' && maxNormal !== Infinity && maxNormal > 0) {
        deviation = ((currentValue - maxNormal) / maxNormal) * 100;
      } else if (status === 'low' && minNormal > 0) {
        deviation = ((minNormal - currentValue) / minNormal) * 100;
      }

      return Math.abs(deviation);
    };

    // Преобразуем в массив с вычислением трендов
    return Array.from(biomarkerMap.entries()).map(([name, data]) => {
      const sortedValues = data.values.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const latestValue = sortedValues[sortedValues.length - 1];
      const trend = sortedValues.length > 1 ? 
        calculateTrend(sortedValues) : 'stable';

      // Для отображения используем оригинальное значение с единицами
      const displayValue = latestValue.unit ? 
        `${latestValue.value} ${latestValue.unit}` : 
        latestValue.value;

      const deviationPercentage = calculateDeviationPercentage(
        latestValue.value.replace(',', '.'), // Нормализуем для расчетов
        data.normalRange, 
        data.status
      );

      return {
        name,
        latestValue: displayValue,
        normalRange: data.normalRange,
        status: data.status,
        lastUpdated: latestValue.date,
        analysisCount: sortedValues.length,
        trend,
        deviationPercentage,
        unit: data.unit
      };
    }).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  };

  const calculateTrend = (values: Array<{ value: string; date: string }>): 'up' | 'down' | 'stable' => {
    if (values.length < 2) return 'stable';
    
    // Нормализуем значения - заменяем запятые на точки для парсинга
    const first = parseFloat(values[0].value.replace(',', '.'));
    const last = parseFloat(values[values.length - 1].value.replace(',', '.'));
    
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

  const handleBiomarkerUpdate = () => {
    // Принудительно перезагружаем данные анализов
    window.location.reload();
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
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Компактный заголовок */}
      <div className="bg-card border-b -mx-2 -mt-6 mb-4">
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
              className="h-8 px-3 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Добавить анализы</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
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
              <TabsList className="!grid !w-full !grid-cols-2 sm:!grid-cols-4 !bg-muted !p-1 !rounded-lg !h-auto !min-h-[44px]">
                <TabsTrigger 
                  value="all"
                  className="!flex !items-center !justify-center !px-1 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !flex-col !gap-1 sm:!flex-row sm:!gap-2 !overflow-hidden"
                >
                  <span className="!truncate !max-w-full">Все</span>
                  <span className="tab-badge">{statusCounts.all}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="normal"
                  className="!flex !items-center !justify-center !px-1 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !flex-col !gap-1 sm:!flex-row sm:!gap-2 !overflow-hidden"
                >
                  <span className="!truncate !max-w-full">Норма</span>
                  <span className="tab-badge-normal">{statusCounts.normal}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="high"
                  className="!flex !items-center !justify-center !px-1 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !flex-col !gap-1 sm:!flex-row sm:!gap-2 !overflow-hidden"
                >
                  <span className="!truncate !max-w-full">Выше</span>
                  <span className="tab-badge-high">{statusCounts.high}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="low"
                  className="!flex !items-center !justify-center !px-1 !py-3 !text-xs !font-medium !rounded-md !transition-all !min-h-[36px] !flex-col !gap-1 sm:!flex-row sm:!gap-2 !overflow-hidden"
                >
                  <span className="!truncate !max-w-full">Ниже</span>
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{biomarker.latestValue}</span>
                            {biomarker.deviationPercentage && biomarker.deviationPercentage > 0 && (
                              <span className={`text-xs ${
                                biomarker.status === 'high' ? 'text-red-500' : 'text-orange-500'
                              }`}>
                                {biomarker.status === 'high' ? '+' : '-'}{biomarker.deviationPercentage.toFixed(0)}%
                              </span>
                            )}
                          </div>
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
                        
                        <div className="text-xs text-muted-foreground mt-1">
                          Дата анализа: {format(new Date(biomarker.lastUpdated), 'dd.MM.yyyy HH:mm', { locale: ru })}
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
        onBiomarkerUpdate={handleBiomarkerUpdate}
      />
    </AppLayout>
  );
};

export default MyBiomarkers;