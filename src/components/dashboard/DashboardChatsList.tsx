
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
    navigate(`/ai-doctor`);
  };

  if (isLoading) {
    return (
      <Card className="p-2 border-none shadow-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-md flex items-center justify-center">
            <MessageSquare className="h-3 w-3 text-brand-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Истории чатов с ИИ</h3>
        </div>
        <div className="animate-pulse space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-2 bg-gray-100 rounded-lg">
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-2 border-none shadow-none">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 bg-gradient-to-br from-brand-accent/20 to-brand-accent/10 rounded-md flex items-center justify-center">
          <MessageSquare className="h-3 w-3 text-brand-accent" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Истории чатов с ИИ</h3>
      </div>
      
      {recentChats.length === 0 ? (
        <div className="text-center py-3">
          <MessageSquare className="h-5 w-5 text-brand-accent mx-auto mb-1" />
          <p className="text-xs text-neutral-600">Нет чатов</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-1">
          {recentChats.map((chat, index) => (
            <AccordionItem 
              key={chat.id} 
              value={`chat-${index}`}
              className="bg-white/80 rounded-lg border-none shadow-none"
            >
              <AccordionTrigger className="px-2 py-2 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-brand-accent" />
                    <h5 className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                      {chat.title}
                    </h5>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold mr-2 ${getTypeColor(chat.type)}`}>
                    {getTypeLabel(chat.type)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    <strong>Последнее сообщение:</strong> {chat.lastMessage}
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Время:</strong> {chat.timestamp}
                  </p>
                  <div className="mt-2 pt-2">
                    <button 
                      onClick={() => handleChatClick(chat.id)}
                      className="text-xs text-brand-accent font-semibold hover:text-brand-accent-dark transition-colors"
                    >
                      Открыть чат →
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Card>
  );
};

export default DashboardChatsList;
