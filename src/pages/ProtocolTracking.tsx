
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Calendar, CheckCircle, Clock, LineChart, AlertCircle, 
  User, Activity, FileText, Plus, Save, Upload, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ProtocolChart } from '@/components/protocol/ProtocolChart';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Интерфейсы для типизации
interface Supplement {
  id?: string;
  protocol_id: string;
  supplement_name: string;
  dose: string;
  day: number;
  taken: boolean;
  taken_at?: string | null;
  scheduled_time?: string | null;
}

interface WellbeingRecord {
  id?: string;
  protocol_id: string;
  day: number;
  energy_level: number;
  notes?: string;
}

interface ProtocolEvent {
  id?: string;
  protocol_id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  completed: boolean;
}

interface AnalysisResult {
  id?: string;
  protocol_id: string;
  title: string;
  file_path?: string;
  notes?: string;
  analysis_date: string;
}

interface UserProtocol {
  id: string;
  user_id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  started_at?: string | null;
  status: string;
  completion_percentage: number;
  benefits: string[];
  steps: string[];
  difficulty: string;
}

const ProtocolTracking = () => {
  // Состояния
  const [activeTab, setActiveTab] = useState('overview');
  const [day, setDay] = useState(1);
  const [energyLevel, setEnergyLevel] = useState(7);
  const [notes, setNotes] = useState('');
  const [protocolData, setProtocolData] = useState<UserProtocol | null>(null);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [wellbeingHistory, setWellbeingHistory] = useState<WellbeingRecord[]>([]);
  const [protocolEvents, setProtocolEvents] = useState<ProtocolEvent[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);
  const [isWellbeingSaved, setIsWellbeingSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Состояния для новых событий и анализов
  const [newEvent, setNewEvent] = useState<Omit<ProtocolEvent, 'id'>>({
    protocol_id: '',
    title: '',
    description: '',
    event_type: 'appointment',
    event_date: new Date().toISOString(),
    completed: false
  });
  
  const [newAnalysis, setNewAnalysis] = useState<Omit<AnalysisResult, 'id'>>({
    protocol_id: '',
    title: '',
    notes: '',
    analysis_date: new Date().toISOString()
  });

  // Получаем параметры, утилиты и контексты
  const { id: protocolId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Получение данных протокола
  useEffect(() => {
    const fetchProtocolData = async () => {
      if (!user || !protocolId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Получаем основную информацию о протоколе
        const { data: protocolData, error: protocolError } = await supabase
          .from('user_protocols')
          .select('*')
          .eq('id', protocolId)
          .eq('user_id', user.id)
          .single();

        if (protocolError) throw protocolError;
        setProtocolData(protocolData);

        // Если протокол еще не запущен, устанавливаем день 0
        if (protocolData.started_at) {
          const startDate = new Date(protocolData.started_at);
          const currentDate = new Date();
          const diffTime = currentDate.getTime() - startDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы первый день считался как 1
          setDay(diffDays);
        } else {
          setDay(0);
        }

        // Загружаем добавки для текущего протокола
        const { data: supplementsData, error: supplementsError } = await supabase
          .from('protocol_supplements')
          .select('*')
          .eq('protocol_id', protocolId)
          .eq('user_id', user.id)
          .eq('day', day);

        if (!supplementsError) {
          setSupplements(supplementsData || []);
        } else {
          console.error('Error fetching supplements:', supplementsError);
        }

        // Загружаем историю самочувствия
        const { data: wellbeingData, error: wellbeingError } = await supabase
          .from('protocol_wellbeing')
          .select('*')
          .eq('protocol_id', protocolId)
          .eq('user_id', user.id)
          .order('day', { ascending: false });

        if (!wellbeingError) {
          setWellbeingHistory(wellbeingData || []);
          
          // Устанавливаем текущее самочувствие из последней записи, если она есть
          const todayWellbeing = wellbeingData?.find(record => record.day === day);
          if (todayWellbeing) {
            setEnergyLevel(todayWellbeing.energy_level);
            setNotes(todayWellbeing.notes || '');
            setIsWellbeingSaved(true);
          } else {
            setIsWellbeingSaved(false);
          }
        } else {
          console.error('Error fetching wellbeing:', wellbeingError);
        }

        // Загружаем события протокола
        const { data: eventsData, error: eventsError } = await supabase
          .from('protocol_events')
          .select('*')
          .eq('protocol_id', protocolId)
          .eq('user_id', user.id)
          .order('event_date', { ascending: true });

        if (!eventsError) {
          setProtocolEvents(eventsData || []);
        } else {
          console.error('Error fetching events:', eventsError);
        }

        // Загружаем результаты анализов
        const { data: analysisData, error: analysisError } = await supabase
          .from('protocol_analysis_results')
          .select('*')
          .eq('protocol_id', protocolId)
          .eq('user_id', user.id)
          .order('analysis_date', { ascending: false });

        if (!analysisError) {
          setAnalysisResults(analysisData || []);
        } else {
          console.error('Error fetching analysis results:', analysisError);
        }

      } catch (error: any) {
        console.error('Error fetching protocol data:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные протокола',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProtocolData();
  }, [user, protocolId, day]);

  // Обработчики действий
  const toggleSupplement = async (supplement: Supplement) => {
    try {
      const updatedSupplement = { 
        ...supplement, 
        taken: !supplement.taken,
        taken_at: !supplement.taken ? new Date().toISOString() : null
      };
      
      let { error } = await supabase
        .from('protocol_supplements')
        .update(updatedSupplement)
        .eq('id', supplement.id);
      
      if (error) throw error;
      
      setSupplements(prevSupplements => 
        prevSupplements.map(s => s.id === supplement.id ? updatedSupplement : s)
      );
      
      toast({
        title: updatedSupplement.taken ? "Добавка принята" : "Отметка снята",
        description: `${supplement.supplement_name} ${updatedSupplement.taken ? "отмечена как принятая" : "отмечена как непринятая"}`,
      });
    } catch (error) {
      console.error('Error updating supplement:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус добавки",
        variant: "destructive"
      });
    }
  };

  const markAllSupplementsAsTaken = async () => {
    try {
      // Создаем массив обещаний для параллельного обновления
      const updatePromises = supplements.map(async (supplement) => {
        if (!supplement.taken) {
          const { error } = await supabase
            .from('protocol_supplements')
            .update({ 
              taken: true, 
              taken_at: new Date().toISOString() 
            })
            .eq('id', supplement.id);
          
          if (error) throw error;
        }
      });
      
      await Promise.all(updatePromises);
      
      // Обновляем локальное состояние
      setSupplements(prevSupplements => 
        prevSupplements.map(s => ({ ...s, taken: true, taken_at: s.taken ? s.taken_at : new Date().toISOString() }))
      );
      
      toast({
        title: "Добавки отмечены",
        description: "Все добавки отмечены как принятые",
      });
    } catch (error) {
      console.error('Error marking all supplements as taken:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отметить все добавки",
        variant: "destructive"
      });
    }
  };

  const saveWellbeingRecord = async () => {
    if (!user || !protocolId) return;
    
    try {
      const todayWellbeing = wellbeingHistory.find(record => record.day === day);
      
      if (todayWellbeing) {
        // Обновляем существующую запись
        const { error } = await supabase
          .from('protocol_wellbeing')
          .update({ 
            energy_level: energyLevel, 
            notes 
          })
          .eq('id', todayWellbeing.id);
          
        if (error) throw error;
      } else {
        // Создаем новую запись
        const { error } = await supabase
          .from('protocol_wellbeing')
          .insert({
            user_id: user.id,
            protocol_id: protocolId,
            day,
            energy_level: energyLevel,
            notes
          });
          
        if (error) throw error;
      }
      
      // Обновляем локальные данные
      setWellbeingHistory(prev => {
        const filtered = prev.filter(record => record.day !== day);
        return [{ 
          id: todayWellbeing?.id, 
          protocol_id: protocolId, 
          day, 
          energy_level: energyLevel, 
          notes 
        }, ...filtered];
      });
      
      setIsWellbeingSaved(true);
      
      toast({
        title: "Данные сохранены",
        description: "Ваши наблюдения успешно сохранены",
      });
    } catch (error) {
      console.error('Error saving wellbeing record:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные",
        variant: "destructive"
      });
    }
  };

  const handleAddEvent = async () => {
    if (!user || !protocolId) return;
    
    try {
      const eventData = {
        ...newEvent,
        user_id: user.id,
        protocol_id: protocolId
      };
      
      const { data, error } = await supabase
        .from('protocol_events')
        .insert(eventData)
        .select();
      
      if (error) throw error;
      
      setProtocolEvents(prev => [...prev, data[0]]);
      setIsEventDialogOpen(false);
      setNewEvent({
        protocol_id: protocolId,
        title: '',
        description: '',
        event_type: 'appointment',
        event_date: new Date().toISOString(),
        completed: false
      });
      
      toast({
        title: "Событие добавлено",
        description: "Новое событие протокола успешно добавлено",
      });
    } catch (error) {
      console.error('Error adding event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить событие",
        variant: "destructive"
      });
    }
  };

  const handleToggleEventCompletion = async (event: ProtocolEvent) => {
    try {
      const updatedEvent = { ...event, completed: !event.completed };
      
      const { error } = await supabase
        .from('protocol_events')
        .update({ completed: updatedEvent.completed })
        .eq('id', event.id);
      
      if (error) throw error;
      
      setProtocolEvents(prev => 
        prev.map(e => e.id === event.id ? updatedEvent : e)
      );
      
      toast({
        title: updatedEvent.completed ? "Событие выполнено" : "Событие не выполнено",
        description: `${event.title} отмечено как ${updatedEvent.completed ? "выполненное" : "невыполненное"}`,
      });
    } catch (error) {
      console.error('Error toggling event completion:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус события",
        variant: "destructive"
      });
    }
  };

  const handleAddAnalysis = async () => {
    if (!user || !protocolId || !selectedFile) {
      toast({
        title: "Ошибка",
        description: "Выберите файл для загрузки",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // 1. Загружаем файл в хранилище
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase
        .storage
        .from('analysis_results')
        .upload(fileName, selectedFile);
      
      if (uploadError) throw uploadError;
      
      // 2. Получаем публичную ссылку на файл
      const { data: urlData } = await supabase
        .storage
        .from('analysis_results')
        .getPublicUrl(fileName);
      
      // 3. Сохраняем запись об анализе в базе данных
      const analysisData = {
        ...newAnalysis,
        user_id: user.id,
        protocol_id: protocolId,
        file_path: urlData.publicUrl
      };
      
      const { data, error } = await supabase
        .from('protocol_analysis_results')
        .insert(analysisData)
        .select();
      
      if (error) throw error;
      
      setAnalysisResults(prev => [data[0], ...prev]);
      setIsAnalysisDialogOpen(false);
      setSelectedFile(null);
      setNewAnalysis({
        protocol_id: protocolId,
        title: '',
        notes: '',
        analysis_date: new Date().toISOString()
      });
      
      toast({
        title: "Анализ добавлен",
        description: "Новый результат анализа успешно добавлен",
      });
    } catch (error) {
      console.error('Error adding analysis:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить результат анализа",
        variant: "destructive"
      });
    }
  };

  const getUpcomingEvents = () => {
    return protocolEvents
      .filter(event => !event.completed && new Date(event.event_date) > new Date())
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 3);
  };

  // Функция для расчета времени до события
  const getDaysUntil = (eventDate: string) => {
    const days = differenceInDays(new Date(eventDate), new Date());
    return days;
  };

  // Функции для создания и обновления добавок
  const addSupplementForDay = async (supplement: Omit<Supplement, 'id'>) => {
    if (!user || !protocolId) return;
    
    try {
      const { error } = await supabase
        .from('protocol_supplements')
        .insert({
          ...supplement,
          user_id: user.id,
          protocol_id: protocolId
        });
      
      if (error) throw error;
      
      // Обновляем список добавок, если добавляем на текущий день
      if (supplement.day === day) {
        const { data } = await supabase
          .from('protocol_supplements')
          .select('*')
          .eq('protocol_id', protocolId)
          .eq('user_id', user.id)
          .eq('day', day);
          
        if (data) setSupplements(data);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding supplement:', error);
      return false;
    }
  };

  const getDefaultSupplements = () => {
    // Базовые добавки для протокола на основе категории
    if (!protocolData) return [];
    
    const defaultSupplements = [];
    
    if (protocolData.category === 'oxygen') {
      defaultSupplements.push(
        { name: 'Коэнзим Q10', dose: '200 мг', time: 'Утро' },
        { name: 'L-карнитин', dose: '1,5 г', time: 'До тренировки' },
        { name: 'Альфа-липоевая кислота', dose: '600 мг', time: 'С обедом' }
      );
    } else if (protocolData.category === 'fasting') {
      defaultSupplements.push(
        { name: 'Электролитная смесь', dose: '1 пакет', time: 'Утро' },
        { name: 'Магний', dose: '400 мг', time: 'Вечер' },
        { name: 'BCAA', dose: '5 г', time: 'Окно питания' }
      );
    } else {
      defaultSupplements.push(
        { name: 'Витамин D', dose: '2000 МЕ', time: 'Утро' },
        { name: 'Омега-3', dose: '1 г', time: 'С едой' }
      );
    }
    
    return defaultSupplements;
  };

  // Обработчик для запуска протокола
  const handleStartProtocol = async () => {
    if (!user || !protocolId) return;
    
    try {
      // 1. Обновляем статус протокола
      const startDate = new Date();
      const { error } = await supabase
        .from('user_protocols')
        .update({ 
          status: 'in_progress',
          started_at: startDate.toISOString(),
          completion_percentage: 0
        })
        .eq('id', protocolId);
      
      if (error) throw error;
      
      // 2. Добавляем добавки для первых 7 дней
      const defaultSupplements = getDefaultSupplements();
      
      for (let i = 1; i <= 7; i++) {
        for (const supplement of defaultSupplements) {
          await addSupplementForDay({
            protocol_id: protocolId,
            supplement_name: supplement.name,
            dose: supplement.dose,
            day: i,
            taken: false,
            scheduled_time: supplement.time
          });
        }
      }
      
      // 3. Обновляем локальные данные
      setDay(1);
      setProtocolData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'in_progress',
          started_at: startDate.toISOString(),
          completion_percentage: 0
        };
      });
      
      toast({
        title: "Протокол запущен",
        description: "Вы начали отслеживание протокола. Добавки на первые 7 дней добавлены."
      });
    } catch (error) {
      console.error('Error starting protocol:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось запустить протокол",
        variant: "destructive"
      });
    }
  };

  // Компоненты для разных вкладок
  const renderOverviewTab = () => {
    const upcomingEvents = getUpcomingEvents();
    
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {/* Прогресс протокола */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <Clock size={20} className="mr-2 text-primary" />
                Прогресс протокола
              </h2>
              
              {protocolData?.status === 'not_started' && (
                <Button 
                  onClick={handleStartProtocol} 
                  size="sm"
                >
                  Начать протокол
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Вы еще не начали отслеживание протокола. 
                  Нажмите кнопку "Начать протокол" чтобы запустить отслеживание.
                </p>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  {protocolData && (
                    <>
                      {/* День 1 */}
                      <div className="mb-6 relative pl-10">
                        <div className="w-6 h-6 rounded-full absolute left-0 flex items-center justify-center bg-green-100 text-green-600">
                          <CheckCircle size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            День 1: Начало протокола
                          </span>
                          <span className="text-xs text-gray-500">
                            {protocolData.started_at ? 
                              `Начат ${format(parseISO(protocolData.started_at), 'd MMMM yyyy', {locale: ru})}` : 
                              'Не начат'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Текущий день */}
                      <div className="mb-6 relative pl-10">
                        <div className="w-6 h-6 rounded-full absolute left-0 flex items-center justify-center bg-blue-100 text-blue-600">
                          <Clock size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-blue-600">
                            День {day}: Текущий день
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Контрольная точка */}
                      {upcomingEvents.length > 0 && (
                        <div className="mb-6 relative pl-10">
                          <div className="w-6 h-6 rounded-full absolute left-0 flex items-center justify-center bg-gray-100 text-gray-400">
                            <span className="text-xs">!</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {upcomingEvents[0].title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(parseISO(upcomingEvents[0].event_date), 'd MMMM yyyy', {locale: ru})}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>0%</span>
                    <span>Прогресс: {protocolData?.completion_percentage || 0}%</span>
                    <span>100%</span>
                  </div>
                  <Progress value={protocolData?.completion_percentage || 0} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Добавки на сегодня */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar size={20} className="mr-2 text-primary" />
              Добавки на сегодня
            </h2>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Добавки будут доступны после начала протокола
                </p>
              </div>
            ) : supplements.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  На сегодня нет запланированных добавок
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {supplements.map((supplement) => (
                  <div 
                    key={supplement.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${supplement.taken ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}
                    onClick={() => toggleSupplement(supplement)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${supplement.taken ? 'bg-green-500 text-white' : 'bg-white border border-gray-300'}`}>
                        {supplement.taken && <CheckCircle size={14} />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{supplement.supplement_name}</div>
                        <div className="text-xs text-gray-500">{supplement.dose}</div>
                      </div>
                    </div>
                    <div className="text-xs">
                      {supplement.taken ? (
                        <span className="text-green-600">Принято</span>
                      ) : (
                        <span className="text-gray-400">{supplement.scheduled_time || "В течение дня"}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {supplements.length > 0 && (
            <CardFooter className="pt-0">
              <Button 
                onClick={markAllSupplementsAsTaken} 
                variant="outline" 
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700"
                disabled={supplements.every(s => s.taken)}
              >
                <CheckCircle size={16} className="mr-2" />
                Отметить все как принятые
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Самочувствие сегодня */}
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold flex items-center">
              <User size={20} className="mr-2 text-primary" />
              Самочувствие сегодня
            </h2>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Отслеживание самочувствия будет доступно после начала протокола
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Уровень энергии (0-10)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 w-6 text-primary font-semibold">{energyLevel}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Низкая</span>
                    <span>Средняя</span>
                    <span>Высокая</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заметки о самочувствии
                  </label>
                  <Textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Опишите ваше самочувствие, побочные эффекты или другие наблюдения..."
                  />
                </div>
              </>
            )}
          </CardContent>
          {protocolData?.status !== 'not_started' && (
            <CardFooter className="pt-0">
              <Button 
                onClick={saveWellbeingRecord} 
                variant="default"
                className="w-full"
                disabled={protocolData?.status === 'not_started'}
              >
                <Save size={16} className="mr-2" />
                {isWellbeingSaved ? "Обновить наблюдения" : "Сохранить наблюдения"}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Ближайшие события */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <AlertCircle size={20} className="mr-2 text-primary" />
                Ближайшие события
              </h2>
              <Button 
                onClick={() => setIsEventDialogOpen(true)} 
                size="sm" 
                variant="ghost"
                disabled={protocolData?.status === 'not_started'}
              >
                <Plus size={16} className="mr-1" />
                Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Добавление событий будет доступно после начала протокола
                </p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  У вас нет запланированных событий
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start">
                    <div className="mr-3 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {event.event_type === 'appointment' ? (
                        <User size={18} />
                      ) : event.event_type === 'analysis' ? (
                        <FileText size={18} />
                      ) : (
                        <Calendar size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${event.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
                          onClick={() => handleToggleEventCompletion(event)}
                        >
                          {event.completed && <CheckCircle size={14} />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Через {getDaysUntil(event.event_date)} {getDaysUntil(event.event_date) === 1 ? 'день' : 'дней'}
                        {' '}({format(parseISO(event.event_date), 'd MMMM', {locale: ru})})
                      </p>
                      {event.description && (
                        <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {upcomingEvents.length > 0 && protocolEvents.length > upcomingEvents.length && (
            <CardFooter className="pt-0">
              <Button 
                onClick={() => setActiveTab('events')} 
                variant="ghost"
                className="w-full text-gray-600"
              >
                Посмотреть все события
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    );
  };

  const renderSupplementsTab = () => {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Календарь приема добавок</h2>
          <Tabs defaultValue="calendar">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar">Календарь</TabsTrigger>
              <TabsTrigger value="list">Список</TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="pt-2">
              <div className="space-y-6">
                {/* Здесь будет календарь приема добавок */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="text-center">
                    <p className="text-gray-500">Календарь приема добавок будет доступен в следующем обновлении</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="pt-2">
              <div className="space-y-4">
                {/* Список добавок по дням */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <div className="text-center">
                    <p className="text-gray-500">Список приема добавок будет доступен в следующем обновлении</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  const renderAnalyticsTab = () => {
    // Подготовка данных для графика
    const chartData = wellbeingHistory
      .sort((a, b) => a.day - b.day)
      .map(record => ({
        day: `День ${record.day}`,
        энергия: record.energy_level
      }));

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Уровень энергии</h2>
            
            {wellbeingHistory.length < 3 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  Для отображения графика необходимо минимум 3 записи о самочувствии
                </p>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ProtocolChart data={chartData} xAxisKey="day" />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">История записей о самочувствии</h2>
            
            {wellbeingHistory.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  У вас пока нет записей о самочувствии
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {wellbeingHistory.map((record) => (
                  <div key={record.id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">День {record.day}</h3>
                        <div className="flex items-center mt-1">
                          <div className="mr-2 text-xs text-gray-500">Энергия:</div>
                          <div className="flex space-x-1">
                            {[...Array(10)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-2 h-4 rounded-sm ${i < record.energy_level ? 'bg-blue-500' : 'bg-gray-200'}`}
                              ></div>
                            ))}
                          </div>
                          <div className="ml-2 text-xs font-medium">{record.energy_level}/10</div>
                        </div>
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTestsTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Результаты анализов</h2>
              <Button 
                onClick={() => setIsAnalysisDialogOpen(true)}
                size="sm"
                disabled={protocolData?.status === 'not_started'}
              >
                <Upload size={16} className="mr-1" />
                Загрузить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  Загрузка результатов анализов будет доступна после начала протокола
                </p>
              </div>
            ) : analysisResults.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  У вас пока нет загруженных результатов анализов
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {analysisResults.map((analysis) => (
                  <div key={analysis.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{analysis.title}</h3>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(analysis.analysis_date), 'd MMMM yyyy', {locale: ru})}
                        </p>
                      </div>
                      {analysis.file_path && (
                        <a 
                          href={analysis.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center"
                        >
                          <FileText size={16} className="mr-1" />
                          Просмотр
                        </a>
                      )}
                    </div>
                    {analysis.notes && (
                      <p className="text-sm text-gray-600 mt-2">{analysis.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEventsTab = () => {
    // Группировка событий по статусу
    const completedEvents = protocolEvents.filter(event => event.completed);
    const upcomingEvents = protocolEvents.filter(event => !event.completed)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Предстоящие события</h2>
              <Button 
                onClick={() => setIsEventDialogOpen(true)}
                size="sm"
                disabled={protocolData?.status === 'not_started'}
              >
                <Plus size={16} className="mr-1" />
                Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {protocolData?.status === 'not_started' ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  События будут доступны после начала протокола
                </p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-500">
                  У вас нет предстоящих событий
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start p-3 border border-gray-100 rounded-lg">
                    <div className="mr-3 mt-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {event.event_type === 'appointment' ? (
                        <User size={20} />
                      ) : event.event_type === 'analysis' ? (
                        <FileText size={20} />
                      ) : (
                        <Calendar size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-xs text-gray-500">
                            {format(parseISO(event.event_date), 'd MMMM yyyy', {locale: ru})}
                          </p>
                        </div>
                        <div 
                          className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${event.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
                          onClick={() => handleToggleEventCompletion(event)}
                        >
                          {event.completed && <CheckCircle size={14} />}
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {completedEvents.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-lg font-semibold">Выполненные события</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedEvents.map((event) => (
                  <div key={event.id} className="flex items-start p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="mr-3 mt-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-xs text-gray-500">
                            {format(parseISO(event.event_date), 'd MMMM yyyy', {locale: ru})}
                          </p>
                        </div>
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer bg-green-500 text-white"
                          onClick={() => handleToggleEventCompletion(event)}
                        >
                          <CheckCircle size={14} />
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
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

  // Отображение интерфейса
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 text-gray-800 pt-16">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-xl font-semibold text-primary">
              {protocolData?.title || "Протокол не найден"}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              {protocolData?.status !== 'not_started' && (
                <>
                  <div className="bg-blue-50 rounded-full px-3 py-1 text-sm flex items-center">
                    <Clock size={16} className="mr-1 text-blue-600" />
                    <span>День {day}</span>
                  </div>
                  <div className="bg-green-50 rounded-full px-3 py-1 text-sm flex items-center">
                    <Activity size={16} className="mr-1 text-green-600" />
                    <span>Энергия: {energyLevel}/10</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-10">
          <div className="container mx-auto flex overflow-x-auto no-scrollbar">
            <button 
              className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={18} className="mr-2" />
              Обзор
            </button>
            <button 
              className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === 'supplements' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('supplements')}
            >
              <Calendar size={18} className="mr-2" />
              Добавки
            </button>
            <button 
              className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === 'analytics' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('analytics')}
            >
              <LineChart size={18} className="mr-2" />
              Аналитика
            </button>
            <button 
              className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === 'tests' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('tests')}
            >
              <FileText size={18} className="mr-2" />
              Анализы
            </button>
            <button 
              className={`px-4 py-3 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === 'events' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} className="mr-2" />
              События
            </button>
          </div>
        </nav>

        {/* Main content */}
        <main className="container mx-auto p-4">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'supplements' && renderSupplementsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'tests' && renderTestsTab()}
          {activeTab === 'events' && renderEventsTab()}
        </main>
      </div>
      
      {/* Dialog для создания нового события */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить событие</DialogTitle>
            <DialogDescription>
              Добавьте новое событие для вашего протокола
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-title" className="text-right">
                Название
              </Label>
              <Input 
                id="event-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-type" className="text-right">
                Тип
              </Label>
              <Select 
                value={newEvent.event_type}
                onValueChange={(value) => setNewEvent({...newEvent, event_type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите тип события" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment">Встреча</SelectItem>
                  <SelectItem value="analysis">Анализ</SelectItem>
                  <SelectItem value="reminder">Напоминание</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-date" className="text-right">
                Дата
              </Label>
              <Input 
                id="event-date" 
                type="date"
                value={newEvent.event_date.split('T')[0]}
                onChange={(e) => setNewEvent({
                  ...newEvent, 
                  event_date: `${e.target.value}T00:00:00Z`
                })}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="event-description" className="text-right">
                Описание
              </Label>
              <Textarea
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={!newEvent.title} onClick={handleAddEvent}>
              Добавить событие
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog для загрузки результатов анализов */}
      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Загрузить результаты анализа</DialogTitle>
            <DialogDescription>
              Загрузите файл с результатами анализа для отслеживания
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analysis-title" className="text-right">
                Название
              </Label>
              <Input 
                id="analysis-title" 
                value={newAnalysis.title}
                onChange={(e) => setNewAnalysis({...newAnalysis, title: e.target.value})}
                className="col-span-3" 
                placeholder="Например: Общий анализ крови"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analysis-date" className="text-right">
                Дата анализа
              </Label>
              <Input 
                id="analysis-date" 
                type="date"
                value={newAnalysis.analysis_date.split('T')[0]}
                onChange={(e) => setNewAnalysis({
                  ...newAnalysis, 
                  analysis_date: `${e.target.value}T00:00:00Z`
                })}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analysis-file" className="text-right">
                Файл
              </Label>
              <Input 
                id="analysis-file" 
                type="file"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="col-span-3" 
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analysis-notes" className="text-right">
                Примечания
              </Label>
              <Textarea
                id="analysis-notes"
                value={newAnalysis.notes || ''}
                onChange={(e) => setNewAnalysis({...newAnalysis, notes: e.target.value})}
                className="col-span-3"
                rows={3}
                placeholder="Любые заметки о результатах анализа"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={!newAnalysis.title || !selectedFile} 
              onClick={handleAddAnalysis}
              className="gap-2"
            >
              <Upload size={16} />
              Загрузить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProtocolTracking;
