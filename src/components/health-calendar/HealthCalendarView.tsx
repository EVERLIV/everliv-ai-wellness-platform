import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarDayDetail } from './CalendarDayDetail';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HealthCalendarViewProps {
  currentDate: Date;
  calendarData: any[] | null;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  isLoading: boolean;
}

const HealthCalendarView = ({
  currentDate,
  calendarData,
  selectedDate,
  onDateSelect,
  isLoading
}: HealthCalendarViewProps) => {
  const isMobile = useIsMobile();
  const [showDetail, setShowDetail] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayData = (date: Date) => {
    if (!calendarData) return null;
    return calendarData.find(day => 
      isSameDay(new Date(day.date), date)
    );
  };

  const getHealthScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-400';
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getHealthScoreIcon = (score: number | null) => {
    if (score === null) return <Minus className="h-3 w-3" />;
    if (score >= 60) return <TrendingUp className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    setShowDetail(true);
  };

  const formatTooltipContent = (dayData: any) => {
    if (!dayData) return 'Нет данных';
    
    const metrics = [];
    if (dayData.steps) metrics.push(`Шаги: ${dayData.steps}`);
    if (dayData.sleep_hours) metrics.push(`Сон: ${dayData.sleep_hours}ч`);
    if (dayData.mood_level) metrics.push(`Настроение: ${dayData.mood_level}/10`);
    if (dayData.healthScore) metrics.push(`Общий балл: ${dayData.healthScore}/100`);
    
    return metrics.length > 0 ? metrics.join('\n') : 'Нет данных';
  };

  const weekDays = isMobile 
    ? ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'] // Сокращенные названия для мобильных
    : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {weekDays.map(day => (
            <div key={day} className={`p-1 text-center text-[10px] font-medium text-muted-foreground`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {days.map(day => {
            const dayData = getDayData(day);
            const healthScore = dayData?.healthScore;
            const hasData = dayData !== null;
            
            return (
              <Tooltip key={day.toISOString()}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      `${isMobile ? 'h-10' : 'h-12'} w-full p-0.5 relative border border-transparent hover:border-primary/20 transition-all`,
                      isToday(day) && `ring-1 ring-primary ring-offset-1`,
                      selectedDate && isSameDay(selectedDate, day) && "border-primary",
                      !isSameMonth(day, currentDate) && "opacity-50",
                      getHealthScoreColor(healthScore)
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex flex-col items-center justify-between h-full w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] font-medium leading-none">
                          {format(day, 'd')}
                        </span>
                        {hasData && !isMobile && (
                          <div className="flex items-center">
                            {getHealthScoreIcon(healthScore)}
                          </div>
                        )}
                      </div>
                      
                      {healthScore && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            `text-[9px] px-0.5 py-0 h-2.5 border-0 leading-none`,
                            getHealthScoreColor(healthScore)
                          )}
                        >
                          {Math.round(healthScore)}
                        </Badge>
                      )}
                      
                      {/* Activity indicators - только точки для компактности */}
                      {!isMobile && hasData && (
                        <div className="flex space-x-0.5">
                          {dayData?.steps && dayData.steps > 8000 && (
                            <div className="w-0.5 h-0.5 bg-green-500"></div>
                          )}
                          {dayData?.sleep_hours && dayData.sleep_hours >= 7 && (
                            <div className="w-0.5 h-0.5 bg-blue-500"></div>
                          )}
                          {dayData?.mood_level && dayData.mood_level >= 7 && (
                            <div className="w-0.5 h-0.5 bg-yellow-500"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="whitespace-pre-line text-xs">
                  {formatTooltipContent(dayData)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Day detail modal */}
        {showDetail && selectedDate && (
          <CalendarDayDetail
            date={selectedDate}
            dayData={getDayData(selectedDate)}
            onClose={() => {
              setShowDetail(false);
              onDateSelect(null);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default HealthCalendarView;