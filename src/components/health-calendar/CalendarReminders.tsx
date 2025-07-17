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
    <div className="space-y-2">
      {/* Daily Tasks */}
      <div className="text-[10px] text-muted-foreground mb-1">7:30 AM TO 9:00 AM</div>
      <Card className="shadow-none border-0 rounded-none bg-blue-100">
        <CardContent className="p-2">
          <div className="text-[10px] font-medium text-blue-800">Daily Tasks</div>
          <div className="text-[9px] text-blue-700">Meditate, Exercise</div>
        </CardContent>
      </Card>

      {/* Office Tasks */}
      <div className="text-[10px] text-muted-foreground mb-1">10:00 AM TO 1:00 PM</div>
      <Card className="shadow-none border-0 rounded-none bg-pink-100">
        <CardContent className="p-2">
          <div className="text-[10px] font-medium text-pink-800">Office Tasks</div>
          <div className="text-[9px] text-pink-700">Submit Reports, Check Emails & Attend Meetings</div>
        </CardContent>
      </Card>

      {/* Appointments */}
      <div className="text-[10px] text-muted-foreground mb-1">3:00 PM TO 4:00 PM</div>
      <Card className="shadow-none border-0 rounded-none bg-green-100">
        <CardContent className="p-2">
          <div className="text-[10px] font-medium text-green-800">Appointments</div>
          <div className="text-[9px] text-green-700">Dental Doctor's Appointments</div>
        </CardContent>
      </Card>

      {/* Study & Learning */}
      <div className="text-[10px] text-muted-foreground mb-1">8:00 PM TO 9:00 PM</div>
      <Card className="shadow-none border-0 rounded-none bg-blue-100">
        <CardContent className="p-2">
          <div className="text-[10px] font-medium text-blue-800">Study & Learning</div>
          <div className="text-[9px] text-blue-700">Join Online Advance Excel Webinars</div>
        </CardContent>
      </Card>

      {/* Add Event Button */}
      <Button 
        variant="ghost" 
        className="w-full text-[10px] text-muted-foreground hover:text-primary h-6 rounded-none"
        onClick={() => setShowAddForm(true)}
      >
        + Add Event
      </Button>

      {/* Add Reminder Form */}
      {showAddForm && (
        <Card className="shadow-none border-gray-200/80 rounded-none">
          <CardHeader className="pb-1 px-2 py-1">
            <CardTitle className="text-xs font-medium">Новое напоминание</CardTitle>
          </CardHeader>
          <CardContent className="px-2 py-1 pt-0">
            <div className="space-y-2">
              <div>
                <Label htmlFor="title" className="text-[10px]">Название</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="Название"
                  className="h-6 text-[10px] rounded-none border-gray-300"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <Label htmlFor="time" className="text-[10px]">Время</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="h-6 text-[10px] rounded-none border-gray-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" className="text-[10px]">Тип</Label>
                  <Select value={newReminder.type} onValueChange={(value) => setNewReminder({...newReminder, type: value})}>
                    <SelectTrigger className="h-6 text-[10px] rounded-none border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map(type => (
                        <SelectItem key={type.value} value={type.value} className="text-[10px]">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button onClick={handleAddReminder} size="xs" className="h-6 text-[10px] rounded-none">
                  Добавить
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} size="xs" className="h-6 text-[10px] rounded-none border-gray-300">
                  Отмена
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card className="shadow-none border-gray-200/80 rounded-none">
        <CardHeader className="pb-1 px-2 py-1">
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Рекомендации ИИ
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 py-1 pt-0">
          <div className="space-y-1">
            <div className="flex items-start space-x-1 p-1 bg-blue-50 border border-gray-200/50">
              <AlertCircle className="h-2.5 w-2.5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium">Время тренировки</p>
                <p className="text-[9px] text-muted-foreground">
                  Лучшее время 7:00-8:00 утра
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-1 p-1 bg-green-50 border border-gray-200/50">
              <AlertCircle className="h-2.5 w-2.5 text-green-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium">Напоминание о воде</p>
                <p className="text-[9px] text-muted-foreground">
                  Каждые 2 часа
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-1 p-1 bg-yellow-50 border border-gray-200/50">
              <AlertCircle className="h-2.5 w-2.5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-[10px] font-medium">Режим сна</p>
                <p className="text-[9px] text-muted-foreground">
                  Напоминание в 22:00
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