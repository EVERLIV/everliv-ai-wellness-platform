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

const BiomarkerDetailDialog: React.FC<BiomarkerDetailDialogProps> = ({
  isOpen,
  onClose,
  biomarker,
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<BiomarkerHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '1year' | '6mon' | '3mon' | '1mon'>('all');

  useEffect(() => {
    if (biomarker && isOpen) {
      fetchBiomarkerHistory();
    }
  }, [biomarker, isOpen]);

  const fetchBiomarkerHistory = async () => {
    if (!biomarker || !user) return;

    setLoadingHistory(true);
    try {
      const { data: analyses } = await supabase
        .from('medical_analyses')
        .select('id, created_at, results')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (analyses) {
        const biomarkerHistory: BiomarkerHistory[] = [];
        
        analyses.forEach(analysis => {
          if (analysis.results?.markers) {
            const marker = analysis.results.markers.find((m: any) => m.name === biomarker.name);
            if (marker) {
              biomarkerHistory.push({
                value: marker.value,
                date: analysis.created_at,
                analysisId: analysis.id
              });
            }
          }
        });

        setHistory(biomarkerHistory);
      }
    } catch (error) {
      console.error('Error fetching biomarker history:', error);
    } finally {
      setLoadingHistory(false);
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
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue;
    const padding = range * 0.1;
    const adjustedMax = maxValue + padding;
    const adjustedMin = Math.max(0, minValue - padding);

    return (
      <div className="relative h-48 mt-4">
        <div className="absolute inset-0 flex items-end justify-between">
          {chartData.map((data, index) => {
            const height = range > 0 ? ((data.value - adjustedMin) / (adjustedMax - adjustedMin)) * 100 : 50;
            const isLatest = index === chartData.length - 1;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 max-w-12">
                <div 
                  className={`w-6 rounded-t-sm mb-1 ${
                    biomarker?.status === 'high' ? 'bg-red-500' : 
                    biomarker?.status === 'low' ? 'bg-orange-500' : 
                    'bg-green-500'
                  }`}
                  style={{ height: `${height}%` }}
                />
                {isLatest && (
                  <div className="text-xs font-semibold text-center mb-1">
                    {data.value.toFixed(1)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground text-center leading-none">
                  {data.date}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Горизонтальные линии сетки */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 25, 50, 75, 100].map(percent => (
            <div 
              key={percent}
              className="absolute w-full border-t border-dotted border-muted-foreground/20"
              style={{ bottom: `${percent}%` }}
            />
          ))}
        </div>
        
        {/* Значения на оси Y */}
        <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-muted-foreground">
          <div>{adjustedMax.toFixed(0)}</div>
          <div>{((adjustedMax + adjustedMin) / 2).toFixed(0)}</div>
          <div>{adjustedMin.toFixed(0)}</div>
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
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {biomarker.name.toLowerCase().replace(/\s+/g, '-')}
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
                {trendPercentage > 0 ? 'Increased' : 'Decreased'} on {Math.abs(trendPercentage).toFixed(0)}%
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
            <span className="text-3xl font-bold">{biomarker.latestValue}</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Референсные значения */}
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2">
            Reference values for user
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
              { key: 'all', label: 'All' },
              { key: '1year', label: '1 year' },
              { key: '6mon', label: '6 mon' },
              { key: '3mon', label: '3 mon' },
              { key: '1mon', label: '1 mon' }
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
          <h3 className="text-sm font-medium mb-2">Commentary on the analysis</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {getBiomarkerInfo(biomarker.name) || 'Дополнительная информация об этом биомаркере будет доступна позже.'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerDetailDialog;