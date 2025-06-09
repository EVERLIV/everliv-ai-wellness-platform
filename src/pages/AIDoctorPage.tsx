
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, MessageSquare, Trash2, Calendar, Crown, Lock } from "lucide-react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const AIDoctorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasPersonalAIDoctorAccess = canUseFeature('personal_ai_doctor');

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_doctor_chats')
        .insert([
          {
            user_id: user.id,
            title: `Новый чат ${new Date().toLocaleDateString('ru-RU')}`
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/ai-doctor/chat/${data.id}`);
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Вы уверены, что хотите удалить этот чат?')) return;

    try {
      const { error } = await supabase
        .from('ai_doctor_chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      
      setChats(chats.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Ошибка удаления чата:', error);
    }
  };

  const openChat = (chatId: string) => {
    navigate(`/ai-doctor/chat/${chatId}`);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Заголовок страницы */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Персональный ИИ-Доктор</h1>
                <p className="text-gray-600">
                  {hasPersonalAIDoctorAccess ? "Неограниченные консультации" : "Ограниченный доступ"}
                </p>
              </div>
            </div>

            {hasPersonalAIDoctorAccess ? (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                <Crown className="h-4 w-4 mr-1" />
                Премиум
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Пробная версия
              </Badge>
            )}
          </div>

          {/* Предупреждение для пользователей без премиума */}
          {!hasPersonalAIDoctorAccess && (
            <Alert className="mb-6 bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200">
              <Crown className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <div>
                  <p className="font-medium text-orange-800 mb-1">Ограниченная версия</p>
                  <p className="text-orange-700 text-sm">
                    В пробной версии доступно 3 сообщения в день. Обновите подписку для неограниченного доступа.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Кнопка создания нового чата */}
          <div className="mb-6">
            {hasPersonalAIDoctorAccess ? (
              <Button onClick={createNewChat} className="gap-2">
                <Plus className="h-4 w-4" />
                Новый чат
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button onClick={createNewChat} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Новый чат (пробная версия)
                </Button>
                <Button onClick={() => navigate("/pricing")} variant="outline" className="gap-2">
                  <Crown className="h-4 w-4" />
                  Обновить подписку
                </Button>
              </div>
            )}
          </div>

          {/* Список чатов */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-2">Загрузка чатов...</p>
            </div>
          ) : chats.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет сохраненных чатов</h3>
                <p className="text-gray-600 mb-6">
                  Создайте первый чат с персональным ИИ-доктором
                </p>
                <Button onClick={createNewChat} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Создать первый чат
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {chats.map((chat) => (
                <Card 
                  key={chat.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openChat(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{chat.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Обновлен: {new Date(chat.updated_at).toLocaleDateString('ru-RU')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Информационная секция */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Возможности персонального ИИ-доктора</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Доступ к истории ваших анализов</li>
                  <li>✓ Персонализированные рекомендации</li>
                  <li>✓ Запоминание контекста разговора</li>
                  <li>✓ Подробная расшифровка результатов</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Безопасность и конфиденциальность</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Шифрование всех данных</li>
                  <li>✓ Соблюдение медицинской тайны</li>
                  <li>✓ Не заменяет врачебную консультацию</li>
                  <li>✓ Рекомендации носят информационный характер</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <MinimalFooter />
    </div>
  );
};

export default AIDoctorPage;
