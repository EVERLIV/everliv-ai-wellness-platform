
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Clock, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSecureAIDoctor } from '@/hooks/useSecureAIDoctor';

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

    const chatType = getChatType(chat.title, lastMessage?.content || '');

    return {
      id: chat.id,
      title: chat.title,
      lastMessage: lastMessage?.content ? 
        (lastMessage.content.length > 50 ? 
          lastMessage.content.substring(0, 50) + '...' : 
          lastMessage.content) : 
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
    navigate(`/ai-doctor?chat=${chatId}`);
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
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MessageSquare className="h-4 w-4 text-purple-600" />
          <span className="text-base font-semibold">Истории чатов с ИИ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentChats.length === 0 ? (
          <div className="text-center py-3">
            <MessageSquare className="h-6 w-6 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 mb-2">Чаты с ИИ доктором отсутствуют</p>
            <Button 
              size="sm" 
              onClick={() => navigate('/ai-doctor')}
              className="text-xs h-7"
            >
              <Plus className="h-3 w-3 mr-1" />
              Начать чат
            </Button>
          </div>
        ) : (
          <>
            {recentChats.map((chat) => (
              <div
                key={chat.id}
                className="p-2 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-md border border-gray-200/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Bot className="h-3 w-3 text-purple-600 flex-shrink-0" />
                    <h4 className="font-medium text-gray-900 text-xs truncate">
                      {chat.title}
                    </h4>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-1 ${getTypeColor(chat.type)}`}>
                    {getTypeLabel(chat.type)}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                  {chat.lastMessage}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-2.5 w-2.5" />
                    <span className="text-xs">{chat.timestamp}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50 h-8 text-xs"
              onClick={() => navigate('/ai-doctor')}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Все чаты с ИИ доктором
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardChatsList;
