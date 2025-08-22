
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Clock, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecureAIDoctor } from '@/hooks/useSecureAIDoctor';

// Функция для удаления HTML тегов из текста
const stripHtml = (html: string): string => {
  if (!html) return '';
  // Удаляем HTML теги и декодируем HTML entities
  return html
    .replace(/<[^>]*>/g, '') // Удаляем все HTML теги
    .replace(/&nbsp;/g, ' ') // Заменяем неразрывные пробелы
    .replace(/&lt;/g, '<')   // Декодируем HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim(); // Убираем лишние пробелы
};

const DashboardChatsList: React.FC = () => {
  const navigate = useNavigate();
  const { chats, isLoading } = useSecureAIDoctor();

  // Получаем последние 3 чата
  const recentChats = chats.slice(0, 3).map(chat => {
    const lastMessage = chat.ai_doctor_messages && chat.ai_doctor_messages.length > 0 
      ? chat.ai_doctor_messages[chat.ai_doctor_messages.length - 1]
      : null;

    // Определяем тип чата на основе содержания
    const getChatType = (title: string, content: string) => {
      const lowerTitle = title.toLowerCase();
      const lowerContent = content.toLowerCase();
      
      if (lowerTitle.includes('питание') || lowerContent.includes('питание') || lowerContent.includes('диета')) {
        return 'nutrition';
      }
      if (lowerTitle.includes('симптом') || lowerContent.includes('симптом') || lowerContent.includes('боль')) {
        return 'symptoms';
      }
      if (lowerTitle.includes('тренировк') || lowerContent.includes('упражнение') || lowerContent.includes('спорт')) {
        return 'fitness';
      }
      return 'general';
    };

    // Создаем более осмысленный заголовок
    const generateSmartTitle = (originalTitle: string, firstUserMessage: string) => {
      // Если заголовок не является базовым - используем его
      if (originalTitle && 
          !originalTitle.includes('Новый чат') && 
          !originalTitle.includes('Новая консультация') &&
          !originalTitle.includes('Консультация')) {
        return originalTitle;
      }

      // Если есть первое сообщение пользователя - создаем заголовок на его основе
      if (firstUserMessage) {
        // Удаляем HTML теги из сообщения
        const cleanMessage = stripHtml(firstUserMessage);
        const truncated = cleanMessage.length > 40 
          ? cleanMessage.substring(0, 40) + '...' 
          : cleanMessage;
        return truncated;
      }

      // Используем дату создания для заголовка
      const date = new Date(chat.created_at);
      return `Консультация ${date.toLocaleDateString('ru-RU')}`;
    };

    // Находим первое сообщение пользователя для создания заголовка
    const firstUserMessage = chat.ai_doctor_messages?.find(msg => msg.role === 'user')?.content || '';
    const smartTitle = generateSmartTitle(chat.title, firstUserMessage);
    
    const chatType = getChatType(smartTitle, lastMessage?.content || '');

    return {
      id: chat.id,
      title: smartTitle,
      lastMessage: lastMessage?.content ? 
        ((() => {
          const cleanContent = stripHtml(lastMessage.content);
          return cleanContent.length > 50 ? 
            cleanContent.substring(0, 50) + '...' : 
            cleanContent;
        })()) : 
        'Чат создан',
      timestamp: formatTimeAgo(new Date(chat.updated_at)),
      type: chatType
    };
  });

  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ч назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU');
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition': return 'bg-green-100 text-green-700';
      case 'symptoms': return 'bg-red-100 text-red-700';
      case 'fitness': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'nutrition': return 'Питание';
      case 'symptoms': return 'Симптомы';
      case 'fitness': return 'Фитнес';
      default: return 'Общее';
    }
  };

  const handleChatClick = (chatId: string) => {
    console.log('Navigating to chat:', chatId);
    navigate(`/ai-doctor/personal?chat=${chatId}`);
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <span className="text-lg font-semibold">Последние чаты</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-gray-100 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-neutral-50/30 to-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-glass"></div>
      <CardHeader className="relative pb-3">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-lg">
            <MessageSquare className="h-4 w-4 text-brand-accent" />
          </div>
          <span className="text-base font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Истории чатов с ИИ
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-3">
        {recentChats.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-brand-accent/60" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Нет чатов с ИИ доктором</h3>
            <p className="text-xs text-muted-foreground mb-4">Начните персональную консультацию с ИИ</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/ai-doctor/personal')}
              className="bg-gradient-to-r from-brand-accent to-brand-accent/80 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-3 w-3 mr-2" />
              Начать консультацию
            </Button>
          </div>
        ) : (
          <>
            {recentChats.map((chat, index) => (
              <div
                key={chat.id}
                className="p-3 bg-gradient-to-r from-white/80 via-brand-accent/5 to-white/80 rounded-xl border border-brand-accent/20 hover:shadow-md hover:border-brand-accent/30 transition-all duration-300 cursor-pointer hover:scale-[1.01] backdrop-blur-sm"
                onClick={() => handleChatClick(chat.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-1.5 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-lg">
                      <Bot className="h-3 w-3 text-brand-accent flex-shrink-0" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {chat.title}
                    </h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getTypeColor(chat.type)} border border-current/20`}>
                    {getTypeLabel(chat.type)}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed pl-7">
                  {chat.lastMessage}
                </p>
                
                <div className="flex items-center justify-between pl-7">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{chat.timestamp}</span>
                  </div>
                  <div className="p-1 bg-brand-accent/10 rounded-full group-hover:bg-brand-accent/20 transition-colors">
                    <ArrowRight className="h-3 w-3 text-brand-accent" />
                  </div>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 hover:border-brand-accent/50 transition-all duration-300 backdrop-blur-sm"
              onClick={() => navigate('/ai-doctor/personal')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Все чаты с ИИ доктором
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChatsList;
