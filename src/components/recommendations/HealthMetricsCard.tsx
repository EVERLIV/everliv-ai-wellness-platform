import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Heart, Activity, Moon, Droplets } from 'lucide-react';

interface HealthMetricsCardProps {
  healthProfile: any;
  analytics: any;
}

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({ healthProfile, analytics }) => {
  if (!healthProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Профиль здоровья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Данные не загружены
          </p>
        </CardContent>
      </Card>
    );
  }

  const bmi = healthProfile.weight && healthProfile.height 
    ? (healthProfile.weight / Math.pow(healthProfile.height / 100, 2)).toFixed(1)
    : null;

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Недостаток веса', color: 'text-warning' };
    if (bmi < 25) return { text: 'Норма', color: 'text-success' };
    if (bmi < 30) return { text: 'Избыток веса', color: 'text-warning' };
    return { text: 'Ожирение', color: 'text-destructive' };
  };

  const getStressLevel = (level: number) => {
    if (level <= 3) return { text: 'Низкий', color: 'text-success' };
    if (level <= 6) return { text: 'Умеренный', color: 'text-warning' };
    return { text: 'Высокий', color: 'text-destructive' };
  };

  const metrics = [
    {
      icon: User,
      label: 'Возраст',
      value: `${healthProfile.age} лет`,
      subValue: healthProfile.gender === 'male' ? 'Мужчина' : 'Женщина'
    },
    {
      icon: Heart,
      label: 'ИМТ',
      value: bmi || 'Н/Д',
      subValue: bmi ? getBMIStatus(parseFloat(bmi)).text : '',
      valueColor: bmi ? getBMIStatus(parseFloat(bmi)).color : ''
    },
    {
      icon: Activity,
      label: 'Активность',
      value: `${healthProfile.exerciseFrequency || 0}/нед`,
      subValue: healthProfile.exerciseFrequency >= 3 ? 'Активный' : 'Низкая активность',
      valueColor: healthProfile.exerciseFrequency >= 3 ? 'text-success' : 'text-warning'
    },
    {
      icon: Moon,
      label: 'Сон',
      value: `${healthProfile.sleepHours || 0}ч`,
      subValue: healthProfile.sleepHours >= 7 ? 'Норма' : 'Недостаток',
      valueColor: healthProfile.sleepHours >= 7 ? 'text-success' : 'text-warning'
    },
    {
      icon: Droplets,
      label: 'Стресс',
      value: `${healthProfile.stressLevel || 0}/10`,
      subValue: getStressLevel(healthProfile.stressLevel || 0).text,
      valueColor: getStressLevel(healthProfile.stressLevel || 0).color
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Профиль здоровья
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-content-xs">
        {/* Health Score */}
        {analytics?.healthScore && (
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary">{analytics.healthScore}%</div>
            <div className="text-sm text-muted-foreground">Индекс здоровья</div>
          </div>
        )}

        {/* Metrics */}
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-surface rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <metric.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <span className={`text-sm font-medium ${metric.valueColor || 'text-foreground'}`}>
                    {metric.value}
                  </span>
                </div>
                {metric.subValue && (
                  <div className={`text-xs ${metric.valueColor || 'text-muted-foreground'}`}>
                    {metric.subValue}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Health Goals */}
        {healthProfile.healthGoals && healthProfile.healthGoals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Цели здоровья</h4>
            <div className="space-y-1">
              {healthProfile.healthGoals.slice(0, 3).map((goal: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-accent/5 rounded">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs text-foreground">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;