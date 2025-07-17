
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
    <div className="space-y-3">
      {/* Weekly Summary */}
      <Card className="shadow-none border-gray-200/80 rounded-none">
        <CardHeader className="pb-1 px-2 py-1">
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Недельная сводка
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 py-1 pt-0">
          {weeklyAverages ? (
            <div className={`grid gap-1 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              <div className="text-center p-1 bg-gray-50 border border-gray-200/50">
                <div className="text-sm font-bold text-blue-600">
                  {weeklyAverages.steps.toLocaleString()}
                </div>
                <div className="text-[9px] text-muted-foreground">
                  Шаги
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 border border-gray-200/50">
                <div className="text-sm font-bold text-purple-600">
                  {weeklyAverages.sleep_hours}ч
                </div>
                <div className="text-[9px] text-muted-foreground">
                  Сон
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 border border-gray-200/50">
                <div className="text-sm font-bold text-green-600">
                  {weeklyAverages.exercise_minutes}мин
                </div>
                <div className="text-[9px] text-muted-foreground">
                  Спорт
                </div>
              </div>
              <div className="text-center p-1 bg-gray-50 border border-gray-200/50">
                <div className="text-sm font-bold text-pink-600">
                  {weeklyAverages.mood_level}/10
                </div>
                <div className="text-[9px] text-muted-foreground">
                  Настроение
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-muted-foreground">Недостаточно данных</p>
          )}
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card className="shadow-none border-gray-200/80 rounded-none">
        <CardHeader className="pb-1 px-2 py-1">
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <Target className="h-3 w-3" />
            Прогресс целей
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 py-1 pt-0">
          <div className="space-y-1">
            {goalProgress.map((goal, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium">{goal.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[9px] text-muted-foreground">
                      {goal.current}{goal.unit} / {goal.target}{goal.unit}
                    </span>
                    <Badge 
                      variant={goal.progress >= 100 ? "default" : "outline"}
                      className={`text-[8px] px-1 py-0 h-auto rounded-none ${goal.progress >= 100 ? "bg-green-500" : ""}`}
                    >
                      {goal.progress}%
                    </Badge>
                  </div>
                </div>
                <Progress value={Math.min(goal.progress, 100)} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card className="shadow-none border-gray-200/80 rounded-none">
        <CardHeader className="pb-1 px-2 py-1">
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            Месячные тренды
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 py-1 pt-0">
          <div className="space-y-1">
            {monthlyTrends.map((week, index) => (
              <div key={index} className="flex items-center justify-between p-1 bg-gray-50 border border-gray-200/50">
                <span className="text-[10px] font-medium">Неделя {week.week}</span>
                <div className="flex items-center space-x-1">
                  <Progress value={week.avgScore} className="w-12 h-1" />
                  <span className="text-[9px] text-muted-foreground">{week.avgScore}/100</span>
                  {index > 0 && (
                    <div className="flex items-center">
                      {week.avgScore > monthlyTrends[index - 1].avgScore ? (
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5 text-red-500" />
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
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-xs font-medium flex items-center gap-1">
              <Brain className="h-3 w-3" />
              ИИ Анализ паттернов
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="space-y-1">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-1 p-1 bg-gray-50 border border-gray-200/50">
                  <Badge variant="outline" className="mt-0.5 text-[8px] px-1 py-0 h-auto rounded-none">
                    {insight.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-[9px]">{insight.message}</p>
                    {insight.confidence && (
                      <div className="mt-0.5 flex items-center space-x-1">
                        <span className="text-[8px] text-muted-foreground">
                          {insight.confidence}%
                        </span>
                        <Progress value={insight.confidence} className="w-8 h-0.5" />
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