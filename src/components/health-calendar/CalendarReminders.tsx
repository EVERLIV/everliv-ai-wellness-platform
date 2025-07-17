import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Bell, Plus, Trash2, Clock, Heart, Activity, Moon, Droplets } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarRemindersProps {
  currentDate: Date;
}

const CalendarReminders = ({ currentDate }: CalendarRemindersProps) => {
  const isMobile = useIsMobile();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Принять витамины',
      description: 'Ежедневный прием витамина D',
      time: '09:00',
      type: 'medication',
      isActive: true,
      frequency: 'daily'
    },
    {
      id: 2,
      title: 'Проверить давление',
      description: 'Еженедельная проверка артериального давления',
      time: '18:00',
      type: 'health_check',
      isActive: true,
      frequency: 'weekly'
    },
    {
      id: 3,
      title: 'Тренировка',
      description: 'Кардио тренировка 30 минут',
      time: '07:00',
      type: 'exercise',
      isActive: false,
      frequency: 'daily'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    type: 'health_check',
    frequency: 'daily'
  });

  const reminderTypes = [
    { value: 'medication', label: 'Лекарства', icon: Heart, color: 'bg-red-500' },
    { value: 'health_check', label: 'Проверка здоровья', icon: Activity, color: 'bg-blue-500' },
    { value: 'exercise', label: 'Тренировка', icon: Activity, color: 'bg-green-500' },
    { value: 'hydration', label: 'Питье воды', icon: Droplets, color: 'bg-cyan-500' },
    { value: 'sleep', label: 'Сон', icon: Moon, color: 'bg-purple-500' },
    { value: 'other', label: 'Другое', icon: Bell, color: 'bg-gray-500' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Ежедневно' },
    { value: 'weekly', label: 'Еженедельно' },
    { value: 'monthly', label: 'Ежемесячно' }
  ];

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.time) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        isActive: true
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        time: '',
        type: 'health_check',
        frequency: 'daily'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleToggleReminder = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const getReminderTypeInfo = (type: string) => {
    return reminderTypes.find(t => t.value === type) || reminderTypes[0];
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    
    return reminders
      .filter(r => r.isActive)
      .map(r => ({
        ...r,
        nextTime: `${today} ${r.time}`
      }))
      .sort((a, b) => new Date(a.nextTime).getTime() - new Date(b.nextTime).getTime());
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="space-y-6">
      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Ближайшие напоминания
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map((reminder) => {
                const typeInfo = getReminderTypeInfo(reminder.type);
                const Icon = typeInfo.icon;
                
                return (
                  <div key={reminder.id} className={`flex items-center space-x-3 ${isMobile ? 'p-2' : 'p-3'} bg-muted/50 rounded-lg`}>
                    <div className={`p-2 rounded-full ${typeInfo.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{reminder.title}</h4>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                        {isMobile ? reminder.title : reminder.description}
                      </p>
                      <div className={`flex items-center space-x-2 ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{reminder.time}</span>
                        {!isMobile && (
                          <Badge variant="outline" className="text-xs">
                            {frequencies.find(f => f.value === reminder.frequency)?.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
                      <Switch
                        checked={reminder.isActive}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                        className={isMobile ? 'scale-75' : ''}
                      />
                      {!isMobile && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Нет активных напоминаний
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Reminder Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Новое напоминание</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="Название напоминания"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  placeholder="Описание напоминания"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Время</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Тип</Label>
                  <Select value={newReminder.type} onValueChange={(value) => setNewReminder({...newReminder, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="frequency">Частота</Label>
                <Select value={newReminder.frequency} onValueChange={(value) => setNewReminder({...newReminder, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddReminder}>
                  Добавить напоминание
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Рекомендации ИИ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Оптимальное время для тренировки</p>
                <p className="text-xs text-muted-foreground">
                  Основываясь на ваших данных, лучшее время для тренировки - 7:00-8:00 утра
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Напоминание о воде</p>
                <p className="text-xs text-muted-foreground">
                  Рекомендуется добавить напоминание о питье воды каждые 2 часа
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Режим сна</p>
                <p className="text-xs text-muted-foreground">
                  Установите напоминание о сне в 22:00 для лучшего восстановления
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarReminders;