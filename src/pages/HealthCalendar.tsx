import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Plus, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
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
        <div className={`grid gap-1 ${isMobile ? 'grid-cols-3' : 'grid-cols-3'}`}>
          <Card className="shadow-none border-gray-200/80 rounded-none">
            <CardHeader className="pb-1 px-2 py-1">
              <CardTitle className="text-xs font-medium">Средний показатель</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="text-sm font-bold">{getHealthScore()}</div>
              <p className="text-[9px] text-muted-foreground">из 100</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border-gray-200/80 rounded-none">
            <CardHeader className="pb-1 px-2 py-1">
              <CardTitle className="text-xs font-medium">Критические</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="text-sm font-bold text-destructive">{getCriticalDays()}</div>
              <p className="text-[9px] text-muted-foreground">дни</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-none border-gray-200/80 rounded-none">
            <CardHeader className="pb-1 px-2 py-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium">ИИ Инсайты</CardTitle>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={generateInsights}
                  disabled={isGeneratingInsights}
                  className="h-5 w-5 p-0 rounded-none"
                >
                  <Brain className={`h-3 w-3 ${isGeneratingInsights ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="text-sm font-bold">{aiInsights?.length || 0}</div>
              <p className="text-[9px] text-muted-foreground">новых</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Calendar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Side - Calendar */}
          <div className="lg:col-span-2">
            <Card className="shadow-none border-gray-200/80 rounded-none">
              <CardHeader className="pb-1 px-2 py-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="xs"
                      className="h-6 px-2 text-xs rounded-none border-gray-300"
                    >
                      Day
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      className="h-6 px-2 text-xs rounded-none border-gray-300"
                    >
                      Week
                    </Button>
                    <Button
                      variant="default"
                      size="xs"
                      className="h-6 px-2 text-xs rounded-none"
                    >
                      Month
                    </Button>
                    <Button
                      variant="outline"
                      size="xs"
                      className="h-6 px-2 text-xs rounded-none border-gray-300"
                    >
                      Year
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setCurrentDate(new Date())}
                    className="h-6 px-2 text-xs rounded-none border-gray-300"
                  >
                    Today
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => navigateMonth('prev')}
                    className="h-6 w-6 p-0 rounded-none"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <CardTitle className="text-sm font-medium">
                    {formatMonth(currentDate).toUpperCase()}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => navigateMonth('next')}
                    className="h-6 w-6 p-0 rounded-none"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-2 py-1 pt-0">
                <HealthCalendarView
                  currentDate={currentDate}
                  calendarData={calendarData}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Events & Reminders */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {/* Date Display */}
              <div className="text-right">
                <div className="text-lg font-bold">
                  {format(selectedDate || new Date(), 'd MMM', { locale: ru }).toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(selectedDate || new Date(), 'EEEE', { locale: ru })}
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="flex gap-1">
                <Button 
                  variant={viewMode === 'reminders' ? 'default' : 'outline'} 
                  size="xs"
                  onClick={() => setViewMode('reminders')}
                  className="flex-1 h-6 text-xs rounded-none border-gray-300"
                >
                  Events
                </Button>
                <Button 
                  variant={viewMode === 'analytics' ? 'default' : 'outline'} 
                  size="xs"
                  onClick={() => setViewMode('analytics')}
                  className="flex-1 h-6 text-xs rounded-none border-gray-300"
                >
                  Analytics
                </Button>
              </div>

              {/* Content */}
              {viewMode === 'reminders' && (
                <CalendarReminders currentDate={currentDate} />
              )}
              {viewMode === 'analytics' && (
                <CalendarAnalytics
                  calendarData={calendarData}
                  currentDate={currentDate}
                  aiInsights={aiInsights}
                />
              )}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        {aiInsights && aiInsights.length > 0 && (
          <Card className="shadow-none border-gray-200/80 rounded-none">
            <CardHeader className="pb-1 px-2 py-1">
              <CardTitle className="text-xs font-medium flex items-center gap-1">
                <Brain className="h-3 w-3" />
                ИИ Рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-1 pt-0">
              <div className="space-y-1">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-1 p-1 bg-gray-50 border border-gray-200/50">
                    <Badge variant="outline" className="mt-0.5 text-[8px] px-1 py-0 h-auto rounded-none">
                      {insight.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-[10px] font-medium">{insight.title}</p>
                      <p className="text-[9px] text-muted-foreground">{insight.description}</p>
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