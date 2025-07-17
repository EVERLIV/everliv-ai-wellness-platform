import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import HealthCalendarView from '@/components/health-calendar/HealthCalendarView';
import CalendarAnalytics from '@/components/health-calendar/CalendarAnalytics';
import CalendarReminders from '@/components/health-calendar/CalendarReminders';
import { useHealthCalendar } from '@/hooks/useHealthCalendar';
import { useIsMobile } from '@/hooks/use-mobile';

const HealthCalendar = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'analytics' | 'reminders'>('calendar');
  
  const { 
    calendarData, 
    isLoading, 
    aiInsights, 
    generateInsights, 
    isGeneratingInsights 
  } = useHealthCalendar(currentDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getHealthScore = () => {
    if (!calendarData || calendarData.length === 0) return 0;
    const totalScore = calendarData.reduce((sum, day) => sum + (day.healthScore || 0), 0);
    return Math.round(totalScore / calendarData.length);
  };

  const getCriticalDays = () => {
    if (!calendarData) return 0;
    return calendarData.filter(day => day.healthScore && day.healthScore < 40).length;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className={`${isMobile ? 'text-center' : ''}`}>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground`}>
              Календарь здоровья
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
              Отслеживайте показатели здоровья и получайте ИИ-рекомендации
            </p>
          </div>
          
          {/* Mobile View Mode Selector */}
          {isMobile ? (
            <div className="flex rounded-lg bg-muted p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="flex-1 h-9"
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'analytics' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('analytics')}
                className="flex-1 h-9"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'reminders' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('reminders')}
                className="flex-1 h-9"
              >
                <AlertCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* Desktop View Mode Selector */
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-primary/10' : ''}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Календарь
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('analytics')}
                className={viewMode === 'analytics' ? 'bg-primary/10' : ''}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Аналитика
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode('reminders')}
                className={viewMode === 'reminders' ? 'bg-primary/10' : ''}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Напоминания
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний показатель</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getHealthScore()}</div>
              <p className="text-xs text-muted-foreground">из 100 за месяц</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Критические дни</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{getCriticalDays()}</div>
              <p className="text-xs text-muted-foreground">требуют внимания</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ИИ Инсайты</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateInsights}
                disabled={isGeneratingInsights}
                className="h-8 w-8 p-0"
              >
                <Brain className={`h-4 w-4 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aiInsights?.length || 0}</div>
              <p className="text-xs text-muted-foreground">новых рекомендаций</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Navigation */}
        <Card>
          <CardHeader>
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'items-center justify-between'}`}>
              <CardTitle className={`${isMobile ? 'text-center text-base' : 'text-lg'} capitalize`}>
                {formatMonth(currentDate)}
              </CardTitle>
              <div className={`flex items-center ${isMobile ? 'justify-center' : ''} space-x-2`}>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => navigateMonth('prev')}
                  className={isMobile ? 'h-9 px-3' : ''}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Назад</span>}
                </Button>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => setCurrentDate(new Date())}
                  className={isMobile ? 'h-9 px-3' : ''}
                >
                  Сегодня
                </Button>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={() => navigateMonth('next')}
                  className={isMobile ? 'h-9 px-3' : ''}
                >
                  <ChevronRight className="h-4 w-4" />
                  {!isMobile && <span className="ml-1">Вперед</span>}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'calendar' && (
              <HealthCalendarView
                currentDate={currentDate}
                calendarData={calendarData}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                isLoading={isLoading}
              />
            )}
            {viewMode === 'analytics' && (
              <CalendarAnalytics
                calendarData={calendarData}
                currentDate={currentDate}
                aiInsights={aiInsights}
              />
            )}
            {viewMode === 'reminders' && (
              <CalendarReminders
                currentDate={currentDate}
              />
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        {aiInsights && aiInsights.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                ИИ Рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Badge variant="outline" className="mt-1">
                      {insight.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default HealthCalendar;