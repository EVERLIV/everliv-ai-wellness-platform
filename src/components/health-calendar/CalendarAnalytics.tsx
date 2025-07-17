import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Calendar, Target, Brain, BarChart3 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarAnalyticsProps {
  calendarData: any[] | null;
  currentDate: Date;
  aiInsights: any[] | null;
}

const CalendarAnalytics = ({ calendarData, currentDate, aiInsights }: CalendarAnalyticsProps) => {
  const isMobile = useIsMobile();
  const getCurrentWeekData = () => {
    if (!calendarData) return [];
    
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.map(day => {
      const dayData = calendarData.find(d => isSameDay(new Date(d.date), day));
      return {
        date: day,
        data: dayData || null
      };
    });
  };

  const getWeeklyAverages = () => {
    const weekData = getCurrentWeekData();
    const validDays = weekData.filter(d => d.data !== null);
    
    if (validDays.length === 0) return null;
    
    const averages = {
      steps: 0,
      sleep_hours: 0,
      mood_level: 0,
      stress_level: 0,
      water_intake: 0,
      exercise_minutes: 0,
      healthScore: 0
    };
    
    validDays.forEach(day => {
      const data = day.data;
      averages.steps += data.steps || 0;
      averages.sleep_hours += data.sleep_hours || 0;
      averages.mood_level += data.mood_level || 0;
      averages.stress_level += data.stress_level || 0;
      averages.water_intake += data.water_intake || 0;
      averages.exercise_minutes += data.exercise_minutes || 0;
      averages.healthScore += data.healthScore || 0;
    });
    
    Object.keys(averages).forEach(key => {
      averages[key as keyof typeof averages] = Math.round(averages[key as keyof typeof averages] / validDays.length);
    });
    
    return averages;
  };

  const getMonthlyTrends = () => {
    if (!calendarData || calendarData.length === 0) return [];
    
    // Группируем данные по неделям
    const weeks = [];
    const sortedData = [...calendarData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 0; i < sortedData.length; i += 7) {
      const weekData = sortedData.slice(i, i + 7);
      if (weekData.length > 0) {
        const weekAvg = weekData.reduce((sum, day) => sum + (day.healthScore || 0), 0) / weekData.length;
        weeks.push({
          week: Math.floor(i / 7) + 1,
          avgScore: Math.round(weekAvg),
          days: weekData.length
        });
      }
    }
    
    return weeks;
  };

  const getGoalProgress = () => {
    const weekData = getCurrentWeekData();
    const goals = [
      { 
        name: 'Шаги', 
        target: 10000, 
        current: weekData.reduce((sum, d) => sum + (d.data?.steps || 0), 0) / 7,
        unit: ''
      },
      { 
        name: 'Сон', 
        target: 8, 
        current: weekData.reduce((sum, d) => sum + (d.data?.sleep_hours || 0), 0) / 7,
        unit: 'ч'
      },
      { 
        name: 'Активность', 
        target: 30, 
        current: weekData.reduce((sum, d) => sum + (d.data?.exercise_minutes || 0), 0) / 7,
        unit: 'мин'
      },
      { 
        name: 'Настроение', 
        target: 8, 
        current: weekData.reduce((sum, d) => sum + (d.data?.mood_level || 0), 0) / 7,
        unit: '/10'
      }
    ];
    
    return goals.map(goal => ({
      ...goal,
      progress: Math.round((goal.current / goal.target) * 100),
      current: Math.round(goal.current)
    }));
  };

  const weeklyAverages = getWeeklyAverages();
  const monthlyTrends = getMonthlyTrends();
  const goalProgress = getGoalProgress();

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Недельная сводка
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weeklyAverages ? (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
              <div className="text-center">
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-blue-600`}>
                  {weeklyAverages.steps.toLocaleString()}
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {isMobile ? 'Шаги' : 'Шаги/день'}
                </div>
              </div>
              <div className="text-center">
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-purple-600`}>
                  {weeklyAverages.sleep_hours}ч
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {isMobile ? 'Сон' : 'Сон/день'}
                </div>
              </div>
              <div className="text-center">
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>
                  {weeklyAverages.exercise_minutes}мин
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {isMobile ? 'Спорт' : 'Активность/день'}
                </div>
              </div>
              <div className="text-center">
                <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-pink-600`}>
                  {weeklyAverages.mood_level}/10
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  Настроение
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Недостаточно данных для анализа</p>
          )}
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Прогресс целей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {goal.current}{goal.unit} / {goal.target}{goal.unit}
                    </span>
                    <Badge 
                      variant={goal.progress >= 100 ? "default" : "outline"}
                      className={goal.progress >= 100 ? "bg-green-500" : ""}
                    >
                      {goal.progress}%
                    </Badge>
                  </div>
                </div>
                <Progress value={Math.min(goal.progress, 100)} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Месячные тренды
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyTrends.map((week, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">Неделя {week.week}</span>
                <div className="flex items-center space-x-2">
                  <Progress value={week.avgScore} className="w-20 h-2" />
                  <span className="text-sm text-muted-foreground">{week.avgScore}/100</span>
                  {index > 0 && (
                    <div className="flex items-center">
                      {week.avgScore > monthlyTrends[index - 1].avgScore ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {aiInsights && aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              ИИ Анализ паттернов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge variant="outline" className="mt-1">
                    {insight.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{insight.message}</p>
                    {insight.confidence && (
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          Уверенность: {insight.confidence}%
                        </span>
                        <Progress value={insight.confidence} className="w-16 h-1" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarAnalytics;