import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Share,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getBiomarkerInfo } from '@/data/expandedBiomarkers';
import { getBiomarkerNorm } from '@/data/biomarkerNorms';
import { getBiomarkerDescription } from '@/data/biomarkerDescriptions';
import BiomarkerEditDialog from './BiomarkerEditDialog';

interface BiomarkerDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  biomarker: {
    name: string;
    latestValue: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low';
    lastUpdated: string;
    analysisCount: number;
    trend: 'up' | 'down' | 'stable';
  } | null;
}

interface BiomarkerHistory {
  value: string;
  date: string;
  analysisId: string;
}

interface AIComment {
  summary: string;
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({
  isOpen,
  onClose,
  biomarker,
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<BiomarkerHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '1year' | '6mon' | '3mon' | '1mon'>('all');
  const [aiComment, setAiComment] = useState<AIComment | null>(null);
  const [loadingAiComment, setLoadingAiComment] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (biomarker && isOpen) {
      fetchBiomarkerHistory();
      fetchAIComment();
    }
  }, [biomarker, isOpen]);

  const fetchBiomarkerHistory = async () => {
    if (!biomarker || !user) return;

    setLoadingHistory(true);
    try {
      // Получаем данные из таблицы biomarkers
      const { data: biomarkers } = await supabase
        .from('biomarkers')
        .select('value, created_at, analysis_id')
        .eq('name', biomarker.name)
        .order('created_at', { ascending: false });

      if (biomarkers) {
        const biomarkerHistory: BiomarkerHistory[] = biomarkers
          .filter(b => b.value && !isNaN(parseFloat(b.value)))
          .map(b => ({
            value: b.value,
            date: b.created_at,
            analysisId: b.analysis_id
          }));

        setHistory(biomarkerHistory);
      }
    } catch (error) {
      console.error('Error fetching biomarker history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchAIComment = async () => {
    if (!biomarker || !user) return;

    setLoadingAiComment(true);
    try {
      const response = await supabase.functions.invoke('generate-biomarker-analysis', {
        body: {
          biomarkerName: biomarker.name,
          currentValue: biomarker.latestValue,
          normalRange: biomarker.normalRange,
          status: biomarker.status,
          trend: biomarker.trend,
          history: history.slice(0, 5) // последние 5 значений
        }
      });

      if (response.data) {
        setAiComment(response.data);
      }
    } catch (error) {
      console.error('Error fetching AI comment:', error);
      // Fallback статический комментарий
      setAiComment({
        summary: `Ваш уровень ${biomarker.name} составляет ${biomarker.latestValue}, что ${
          biomarker.status === 'normal' ? 'находится в пределах нормы' :
          biomarker.status === 'high' ? 'превышает нормальные значения' : 'ниже нормальных значений'
        }.`,
        recommendation: biomarker.status !== 'normal' ? 
          'Рекомендуется консультация с врачом для дальнейшего обследования и корректировки лечения.' :
          'Продолжайте поддерживать здоровый образ жизни для сохранения нормальных показателей.',
        riskLevel: biomarker.status === 'normal' ? 'low' : 
          biomarker.status === 'high' ? 'high' : 'medium'
      });
    } finally {
      setLoadingAiComment(false);
    }
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditSave = async (data: { value: string; date: Date }) => {
    if (!biomarker || !user) return;

    try {
      // Обновляем последний анализ с новыми данными
      const { data: analyses } = await supabase
        .from('medical_analyses')
        .select('id, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (analyses && analyses.length > 0) {
        const latestAnalysis = analyses[0];
        const updatedMarkers = latestAnalysis.results?.markers?.map((marker: any) => 
          marker.name === biomarker.name 
            ? { ...marker, value: data.value }
            : marker
        ) || [];

        await supabase
          .from('medical_analyses')
          .update({
            results: {
              ...latestAnalysis.results,
              markers: updatedMarkers
            },
            created_at: data.date.toISOString()
          })
          .eq('id', latestAnalysis.id);

        alert('Биомаркер успешно обновлен');
        // Перезагружаем данные
        fetchBiomarkerHistory();
      }
    } catch (error) {
      console.error('Ошибка при обновлении биомаркера:', error);
      alert('Произошла ошибка при обновлении биомаркера');
    }
  };

  // Функция для расчета процентного отклонения от нормы
  const calculateDeviationPercentage = () => {
    if (!biomarker || biomarker.status === 'normal') return null;
    
    const currentValue = parseFloat(biomarker.latestValue);
    if (isNaN(currentValue)) return null;

    // Парсим норму (например, "120-150 г/л" или ">1.0 ммоль/л")
    const normalRange = biomarker.normalRange;
    let minNormal = 0;
    let maxNormal = 0;

    // Обработка различных форматов норм
    if (normalRange.includes('-')) {
      const [min, max] = normalRange.split('-').map(s => parseFloat(s.trim()));
      minNormal = min;
      maxNormal = max;
    } else if (normalRange.startsWith('>')) {
      minNormal = parseFloat(normalRange.substring(1));
      maxNormal = Infinity;
    } else if (normalRange.startsWith('<')) {
      minNormal = 0;
      maxNormal = parseFloat(normalRange.substring(1));
    } else {
      // Попытка извлечь число из строки
      const match = normalRange.match(/(\d+(?:\.\d+)?)/);
      if (match) {
        minNormal = maxNormal = parseFloat(match[1]);
      }
    }

    let deviation = 0;
    if (biomarker.status === 'high' && maxNormal !== Infinity) {
      deviation = ((currentValue - maxNormal) / maxNormal) * 100;
    } else if (biomarker.status === 'low' && minNormal > 0) {
      deviation = ((minNormal - currentValue) / minNormal) * 100;
    }

    return Math.abs(deviation);
  };

  const handleDelete = async () => {
    if (!biomarker || !user) return;
    
    const confirmed = window.confirm(`Вы уверены, что хотите удалить все записи о "${biomarker.name}"?`);
    if (!confirmed) return;

    try {
      // Получаем все анализы пользователя
      const { data: analyses } = await supabase
        .from('medical_analyses')
        .select('id, results')
        .eq('user_id', user.id);

      if (analyses) {
        // Обновляем каждый анализ, удаляя из него данный биомаркер
        for (const analysis of analyses) {
          if (analysis.results?.markers) {
            const updatedMarkers = analysis.results.markers.filter(
              (marker: any) => marker.name !== biomarker.name
            );
            
            await supabase
              .from('medical_analyses')
              .update({
                results: {
                  ...analysis.results,
                  markers: updatedMarkers
                }
              })
              .eq('id', analysis.id);
          }
        }
        
        // Также удаляем из таблицы biomarkers
        await supabase
          .from('biomarkers')
          .delete()
          .eq('name', biomarker.name);

        alert('Биомаркер успешно удален');
        onClose();
        // Можно добавить callback для обновления списка
      }
    } catch (error) {
      console.error('Ошибка при удалении биомаркера:', error);
      alert('Произошла ошибка при удалении биомаркера');
    }
  };

  const calculateTrendPercentage = () => {
    if (history.length < 2) return null;
    
    const latest = parseFloat(history[0].value);
    const previous = parseFloat(history[1].value);
    
    if (isNaN(latest) || isNaN(previous)) return null;
    
    const percentage = ((latest - previous) / previous) * 100;
    return percentage;
  };

  const filterHistoryByPeriod = () => {
    if (selectedPeriod === 'all') return history;
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (selectedPeriod) {
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case '6mon':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '3mon':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '1mon':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    return history.filter(record => new Date(record.date) >= cutoffDate);
  };

  const getChartData = () => {
    const filteredHistory = filterHistoryByPeriod();
    return filteredHistory.reverse().map(record => ({
      date: format(new Date(record.date), 'dd MMM', { locale: ru }),
      value: parseFloat(record.value) || 0,
      originalDate: record.date
    }));
  };

  const renderChart = () => {
    const chartData = getChartData();
    if (chartData.length === 0) return null;

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = 0; // Всегда начинаем с 0
    
    const overallMin = 0;
    const overallMax = maxValue * 1.1;
    const range = overallMax - overallMin;

    return (
      <div className="mt-6">
        {/* Заголовок графика */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Динамика показателя</h3>
        </div>

        {/* Контейнер графика */}
        <div className="relative bg-muted/30 rounded-lg p-4 pb-3">
          {/* Ось Y с значениями */}
          <div className="absolute left-0 top-4 bottom-12 w-12 flex flex-col justify-between text-xs text-muted-foreground">
            <div className="text-right pr-2">{overallMax.toFixed(1)}</div>
            <div className="text-right pr-2">{(overallMax / 2).toFixed(1)}</div>
            <div className="text-right pr-2">0</div>
          </div>

          {/* Область графика */}
          <div className="ml-12 relative" style={{ height: '200px' }}>
            {/* Горизонтальные линии сетки */}
            <div className="absolute inset-0">
              {[25, 50, 75].map(percent => (
                <div 
                  key={percent}
                  className="absolute w-full border-t border-dotted border-muted-foreground/20"
                  style={{ bottom: `${percent + 12}%` }}
                />
              ))}
              {/* Базовая линия (0) */}
              <div className="absolute w-full border-t border-muted-foreground/40 bottom-12" />
            </div>
            
            {/* Столбцы данных */}
            <div className="absolute bottom-12 left-0 right-0 flex items-end justify-between px-2" style={{ height: '176px' }}>
              {chartData.map((data, index) => {
                const heightPercent = range > 0 ? (data.value / range) * 100 : 0;
                const normalRange = biomarker?.normalRange || '';
                let minNormal = 0;
                let maxNormal = 0;
                let hasNormalRange = false;
                
                if (normalRange.includes('-')) {
                  const [min, max] = normalRange.split('-').map(s => parseFloat(s.trim()));
                  if (!isNaN(min) && !isNaN(max)) {
                    minNormal = min;
                    maxNormal = max;
                    hasNormalRange = true;
                  }
                }
                
                const isInNormal = hasNormalRange && 
                  data.value >= minNormal && data.value <= maxNormal;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1 max-w-16 group relative h-full">
                    {/* Столбец - привязан к bottom */}
                    <div className="absolute bottom-0 flex justify-center w-full">
                      <div 
                        className={`w-8 rounded-t-sm transition-all duration-300 hover:opacity-80 ${
                          isInNormal ? 'bg-green-500' :
                          hasNormalRange && data.value > maxNormal ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ 
                          height: `${Math.max(heightPercent * 1.68, 4)}px`,
                        }}
                      />
                      
                      {/* Значение над столбцом */}
                      <div className="absolute -top-5 text-xs font-medium bg-background/90 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                        {data.value.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Даты под графиком */}
          <div className="ml-12 flex justify-between px-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 max-w-16 text-center">
                <div className="text-xs text-muted-foreground leading-none">
                  {data.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!biomarker) return null;

  const trendPercentage = calculateTrendPercentage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold text-base">{biomarker.name}</h1>
              <p className="text-xs text-muted-foreground">
                {getBiomarkerDescription(biomarker.name)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share className="h-4 w-4" />
          </Button>
        </div>

        {/* Тренд и дата */}
        {trendPercentage !== null && (
          <div className="px-4 pt-3">
            <div className="flex items-center gap-2">
              {biomarker.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : biomarker.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span className="text-sm text-red-500">
                {trendPercentage > 0 ? 'Увеличение' : 'Снижение'} на {Math.abs(trendPercentage).toFixed(0)}%
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {format(new Date(biomarker.lastUpdated), 'dd MMM yyyy', { locale: ru })}
              </span>
            </div>
          </div>
        )}

        {/* Основное значение */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{biomarker.latestValue}</span>
              {(() => {
                const deviation = calculateDeviationPercentage();
                if (deviation && deviation > 0) {
                  return (
                    <span className={`text-xs ${
                      biomarker.status === 'high' ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      {biomarker.status === 'high' ? '+' : '-'}{deviation.toFixed(0)}%
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Референсные значения */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">
            Референсные значения для пользователя
          </p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              biomarker.status === 'normal' ? 'bg-green-500' :
              biomarker.status === 'high' ? 'bg-red-500' : 'bg-orange-500'
            }`} />
            <span className="text-sm font-medium">
              {biomarker.status === 'normal' ? 'Норма' :
               biomarker.status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
            </span>
            <span className="text-sm ml-auto">{biomarker.normalRange}</span>
          </div>
        </div>

        {/* Вкладки периодов */}
        <div className="px-4 pb-3">
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {[
              { key: 'all', label: 'Все' },
              { key: '1year', label: '1 год' },
              { key: '6mon', label: '6 мес' },
              { key: '3mon', label: '3 мес' },
              { key: '1mon', label: '1 мес' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as any)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  selectedPeriod === period.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* График */}
        <div className="px-4 pb-4">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            renderChart()
          )}
        </div>

        {/* Комментарий к анализу */}
        <div className="p-4 border-t">
          <h3 className="text-sm font-medium mb-2">Комментарий к анализу</h3>
          {loadingAiComment ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs text-muted-foreground">Генерируем анализ...</span>
            </div>
          ) : aiComment ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {aiComment.summary}
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    aiComment.riskLevel === 'low' ? 'bg-green-500' :
                    aiComment.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="text-xs font-medium">
                    Рекомендации
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {aiComment.recommendation}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {getBiomarkerInfo(biomarker.name) || 'Дополнительная информация об этом биомаркере будет доступна позже.'}
            </p>
          )}
        </div>
      </DialogContent>

      {/* Модальное окно редактирования */}
      <BiomarkerEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        biomarker={biomarker}
        onSave={handleEditSave}
      />
    </Dialog>
  );
};

export default BiomarkerDetailDialog;