
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Thermometer, 
  Brain, 
  Activity, 
  Pill, 
  Check, 
  X, 
  Play, 
  Pause, 
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';

// Иконки для категорий протоколов
const categoryIcons: Record<string, React.ReactNode> = {
  cold_therapy: <Thermometer className="h-5 w-5" />,
  breathing: <Activity className="h-5 w-5" />,
  oxygen: <Brain className="h-5 w-5" />,
  supplements: <Pill className="h-5 w-5" />
};

// Названия категорий
const categoryNames: Record<string, string> = {
  cold_therapy: "Холодовое воздействие",
  breathing: "Дыхательные практики",
  oxygen: "Кислородная терапия",
  supplements: "Персонализированные добавки"
};

// Статусы протоколов
const protocolStatuses: Record<string, { text: string, color: string, icon: React.ReactNode }> = {
  not_started: { text: "Не начат", color: "bg-gray-200", icon: <X className="h-4 w-4 text-gray-500" /> },
  in_progress: { text: "В процессе", color: "bg-blue-200", icon: <Play className="h-4 w-4 text-blue-500" /> },
  paused: { text: "Приостановлен", color: "bg-yellow-200", icon: <Pause className="h-4 w-4 text-yellow-500" /> },
  completed: { text: "Завершен", color: "bg-green-200", icon: <Check className="h-4 w-4 text-green-500" /> }
};

interface UserProtocol {
  id: string;
  user_id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: string[];
  benefits: string[];
  warnings: string[];
  category: string;
  added_at: string;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  completion_percentage: number;
  started_at?: string | null;
  completed_at?: string | null;
  notes?: string | null;
}

const MyProtocols = () => {
  const [protocols, setProtocols] = useState<UserProtocol[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProtocols = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_protocols')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setProtocols(data as UserProtocol[] || []);
    } catch (error: any) {
      console.error('Ошибка при загрузке протоколов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить ваши протоколы',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProtocols();
    }
  }, [user]);

  const updateProtocolStatus = async (id: string, newStatus: UserProtocol['status']) => {
    try {
      let updates: any = { status: newStatus };
      
      // Обновляем даты и прогресс в зависимости от статуса
      if (newStatus === 'in_progress' && !protocols.find(p => p.id === id)?.started_at) {
        updates.started_at = new Date().toISOString();
      } else if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString();
        updates.completion_percentage = 100;
      }
      
      const { error } = await supabase
        .from('user_protocols')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      // Обновляем локальное состояние
      setProtocols(protocols.map(protocol => 
        protocol.id === id ? { ...protocol, ...updates } : protocol
      ));
      
      toast({
        title: 'Статус обновлен',
        description: `Протокол ${newStatus === 'completed' ? 'завершен' : 'обновлен'}`,
      });
    } catch (error: any) {
      console.error('Ошибка при обновлении статуса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус протокола',
        variant: 'destructive'
      });
    }
  };

  const updateProtocolProgress = async (id: string, percentage: number) => {
    try {
      const { error } = await supabase
        .from('user_protocols')
        .update({ completion_percentage: percentage })
        .eq('id', id);
        
      if (error) throw error;
      
      // Обновляем локальное состояние
      setProtocols(protocols.map(protocol => 
        protocol.id === id ? { ...protocol, completion_percentage: percentage } : protocol
      ));
    } catch (error: any) {
      console.error('Ошибка при обновлении прогресса:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить прогресс протокола',
        variant: 'destructive'
      });
    }
  };

  const deleteProtocol = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_protocols')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Обновляем локальное состояние
      setProtocols(protocols.filter(protocol => protocol.id !== id));
      
      toast({
        title: 'Протокол удален',
        description: 'Протокол успешно удален из вашей программы',
      });
    } catch (error: any) {
      console.error('Ошибка при удалении протокола:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить протокол',
        variant: 'destructive'
      });
    }
  };

  // Фильтрация протоколов по категории или "all" для всех протоколов
  const filteredProtocols = activeTab === 'all' 
    ? protocols 
    : protocols.filter(protocol => protocol.category === activeTab);

  const getProtocolStatusOptions = (protocol: UserProtocol) => {
    switch (protocol.status) {
      case 'not_started':
        return (
          <>
            <Button 
              onClick={() => updateProtocolStatus(protocol.id, 'in_progress')}
              variant="outline" 
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" /> Начать
            </Button>
          </>
        );
      case 'in_progress':
        return (
          <>
            <Button 
              onClick={() => updateProtocolStatus(protocol.id, 'completed')}
              variant="outline" 
              size="sm" 
              className="bg-green-50"
            >
              <Check className="h-4 w-4 mr-1" /> Завершить
            </Button>
            <Button 
              onClick={() => updateProtocolStatus(protocol.id, 'paused')}
              variant="outline" 
              size="sm"
            >
              <Pause className="h-4 w-4 mr-1" /> Приостановить
            </Button>
          </>
        );
      case 'paused':
        return (
          <Button 
            onClick={() => updateProtocolStatus(protocol.id, 'in_progress')}
            variant="outline" 
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" /> Продолжить
          </Button>
        );
      case 'completed':
        return (
          <Button 
            onClick={() => updateProtocolStatus(protocol.id, 'not_started')}
            variant="outline" 
            size="sm"
          >
            <X className="h-4 w-4 mr-1" /> Сбросить
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Мои протоколы</h1>
          <p className="text-gray-600">
            Отслеживайте прогресс выполнения ваших персональных оздоровительных протоколов
          </p>
        </div>
        
        {!user ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="mb-4">Для доступа к вашим протоколам необходимо войти в систему</p>
              <Button onClick={() => navigate('/login')}>Войти</Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList>
                <TabsTrigger value="all">Все протоколы</TabsTrigger>
                <TabsTrigger value="cold_therapy">Холодовое воздействие</TabsTrigger>
                <TabsTrigger value="breathing">Дыхательные практики</TabsTrigger>
                <TabsTrigger value="oxygen">Кислородная терапия</TabsTrigger>
                <TabsTrigger value="supplements">Персонализированные добавки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Все протоколы ({protocols.length})</h2>
                {renderProtocolsList()}
              </TabsContent>
              
              {Object.keys(categoryNames).map(category => (
                <TabsContent key={category} value={category} className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {categoryNames[category]} ({
                      protocols.filter(p => p.category === category).length
                    })
                  </h2>
                  {renderProtocolsList()}
                </TabsContent>
              ))}
            </Tabs>
            
            {filteredProtocols.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">У вас еще нет добавленных протоколов этой категории</p>
                  <Button onClick={() => navigate('/services/cold-therapy')}>
                    Просмотреть доступные протоколы
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
  
  function renderProtocolsList() {
    return (
      <div className="space-y-6">
        {filteredProtocols.map(protocol => (
          <Card key={protocol.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {categoryIcons[protocol.category]}
                  <CardTitle className="ml-2 text-lg">
                    {protocol.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    protocolStatuses[protocol.status].color
                  } flex items-center`}>
                    {protocolStatuses[protocol.status].icon}
                    <span className="ml-1">{protocolStatuses[protocol.status].text}</span>
                  </span>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteProtocol(protocol.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                  {categoryNames[protocol.category]} • {protocol.difficulty === 'beginner' ? 'Начинающий' : protocol.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'} • {protocol.duration}
                </div>
                {protocol.started_at && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 
                    Начат: {new Date(protocol.started_at).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс</span>
                  <span>{protocol.completion_percentage}%</span>
                </div>
                <Progress value={protocol.completion_percentage} className="h-2" />
              </div>
              
              {protocol.status === 'in_progress' && (
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {[0, 25, 50, 75, 100].map(percent => (
                    <Button
                      key={percent}
                      variant={protocol.completion_percentage === percent ? "default" : "outline"}
                      size="sm"
                      className="text-xs py-1"
                      onClick={() => updateProtocolProgress(protocol.id, percent)}
                    >
                      {percent}%
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between">
              <div className="flex space-x-2">
                {getProtocolStatusOptions(protocol)}
              </div>
              
              {protocol.status === 'in_progress' ? (
                <Link to={`/protocols/${protocol.id}`}>
                  <Button variant="link" className="flex items-center">
                    <span className="mr-1">Отслеживание</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="link" 
                  onClick={() => {
                    toast({
                      title: 'Протокол',
                      description: 'Детальный просмотр будет доступен после начала протокола',
                    });
                  }}
                >
                  Подробнее
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
};

export default MyProtocols;
