import React from 'react';
import { NewCard, NewCardHeader, NewCardTitle, NewCardContent } from '@/components/ui/new-card';
import { NewButton } from '@/components/ui/new-button';
import { Heart, Activity, Brain, Moon, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import dashboardImage from '@/assets/dashboard-design-example.jpg';

const DashboardDesignExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Дизайн дашборда здоровья
          </h1>
          <p className="text-foreground-medium">
            Пример современного интерфейса с использованием новой дизайн-системы
          </p>
        </div>

        {/* Показ сгенерированного изображения */}
        <div className="mb-8">
          <NewCard variant="elevated" className="overflow-hidden">
            <NewCardContent className="p-0">
              <img 
                src={dashboardImage} 
                alt="Дизайн дашборда здоровья" 
                className="w-full h-auto rounded-xl"
              />
            </NewCardContent>
          </NewCard>
        </div>

        {/* Живой пример с реальными компонентами */}
        <div className="grid grid-cols-12 gap-6">
          {/* Приветствие и иллюстрация */}
          <div className="col-span-4">
            <NewCard variant="glass" className="h-full">
              <NewCardContent>
                <div className="text-center py-8">
                  <div className="w-24 h-24 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Привет, Пользователь!
                  </h2>
                  <p className="text-foreground-medium mb-6">
                    Время для рутинной проверки здоровья сегодня!
                  </p>
                  <NewButton variant="primary" size="lg" fullWidth>
                    Начать проверку
                  </NewButton>
                </div>
              </NewCardContent>
            </NewCard>
          </div>

          {/* Fitness Tracker */}
          <div className="col-span-3">
            <NewCard variant="elevated" hover="lift">
              <NewCardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <NewCardTitle className="text-lg">Fitness Tracker</NewCardTitle>
                </div>
              </NewCardHeader>
              <NewCardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">18,751</div>
                  <div className="text-sm text-foreground-medium">Steps Taken</div>
                </div>
              </NewCardContent>
            </NewCard>
          </div>

          {/* Health Metrics */}
          <div className="col-span-5">
            <div className="grid grid-cols-3 gap-3 h-full">
              {/* Heart Rate */}
              <NewCard variant="glass" className="gradient-primary text-white">
                <NewCardContent className="text-center py-4">
                  <div className="text-2xl font-bold mb-1">65</div>
                  <div className="text-xs opacity-90">BPM</div>
                  <div className="text-xs opacity-75">Heart Rate</div>
                </NewCardContent>
              </NewCard>

              {/* Blood Pressure */}
              <NewCard variant="glass" className="bg-error text-white">
                <NewCardContent className="text-center py-4">
                  <div className="text-2xl font-bold mb-1">120</div>
                  <div className="text-xs opacity-90">mmHg</div>
                  <div className="text-xs opacity-75">Blood Pressure</div>
                </NewCardContent>
              </NewCard>

              {/* Wellness Score */}
              <NewCard variant="glass" className="bg-secondary text-white">
                <NewCardContent className="text-center py-4">
                  <div className="text-2xl font-bold mb-1">87</div>
                  <div className="text-xs opacity-90">%</div>
                  <div className="text-xs opacity-75">Wellness</div>
                </NewCardContent>
              </NewCard>
            </div>
          </div>

          {/* Heart Rate Chart */}
          <div className="col-span-6">
            <NewCard variant="elevated" hover="lift">
              <NewCardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-error" />
                    <NewCardTitle>Heart Rate</NewCardTitle>
                  </div>
                  <div className="text-sm text-success bg-success-light px-2 py-1 rounded-lg">
                    NORMAL
                  </div>
                </div>
              </NewCardHeader>
              <NewCardContent>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-foreground">95</span>
                  <span className="text-foreground-medium">BPM</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[60, 85, 90, 75, 95, 88, 70, 82, 95, 78].map((value, index) => (
                    <div
                      key={index}
                      className="bg-primary rounded-sm flex-1"
                      style={{ height: `${(value / 100) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-foreground-light mt-2">
                  <span>1 Day</span>
                  <span>1 Week</span>
                  <span>1 Month</span>
                  <span>1 Year</span>
                  <span>All</span>
                </div>
              </NewCardContent>
            </NewCard>
          </div>

          {/* AI Chatbot */}
          <div className="col-span-3">
            <NewCard variant="glass" hover="lift">
              <NewCardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  <NewCardTitle className="text-sm">Wellness AI Chatbot</NewCardTitle>
                </div>
              </NewCardHeader>
              <NewCardContent>
                <div className="space-y-3">
                  <div className="bg-surface-elevated rounded-lg p-3">
                    <p className="text-xs text-foreground-medium">
                      Готов помочь мониторить ваше питание
                    </p>
                  </div>
                  <div className="bg-primary-ultra-light rounded-lg p-3">
                    <p className="text-xs text-primary">
                      Установлю план питания на сегодня
                    </p>
                  </div>
                </div>
                <NewButton variant="primary" size="sm" fullWidth className="mt-4">
                  <MessageSquare className="w-4 h-4" />
                  Ответить
                </NewButton>
              </NewCardContent>
            </NewCard>
          </div>

          {/* Sleep Schedule */}
          <div className="col-span-3">
            <NewCard variant="elevated" hover="lift">
              <NewCardHeader>
                <div className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-secondary" />
                  <NewCardTitle className="text-sm">Sleep Schedule</NewCardTitle>
                </div>
              </NewCardHeader>
              <NewCardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">23:15</div>
                  <div className="text-xs text-foreground-medium mb-4">
                    on 25m from now
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-4 bg-primary rounded-full"></div>
                    <NewButton variant="primary" size="sm">
                      <Plus className="w-4 h-4" />
                      See All
                    </NewButton>
                  </div>
                </div>
              </NewCardContent>
            </NewCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDesignExample;