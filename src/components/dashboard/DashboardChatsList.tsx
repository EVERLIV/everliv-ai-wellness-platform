
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardChatsList: React.FC = () => {
  const navigate = useNavigate();

  const recentChats = [
    {
      id: 1,
      title: 'Консультация о питании',
      lastMessage: 'Рекомендую увеличить потребление овощей...',
      timestamp: '2 часа назад',
      type: 'nutrition'
    },
    {
      id: 2,
      title: 'Анализ симптомов',
      lastMessage: 'Основываясь на ваших симптомах...',
      timestamp: '1 день назад',
      type: 'symptoms'
    },
    {
      id: 3,
      title: 'План тренировок',
      lastMessage: 'Начните с 3 тренировок в неделю...',
      timestamp: '3 дня назад',
      type: 'fitness'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition': return 'bg-green-100 text-green-700';
      case 'symptoms': return 'bg-red-100 text-red-700';
      case 'fitness': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="shadow-sm border-gray-200/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <span className="text-lg font-semibold">Последние чаты</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentChats.map((chat) => (
          <div
            key={chat.id}
            className="p-3 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-lg border border-gray-200/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/ai-doctor')}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <h4 className="font-medium text-gray-900 text-sm">
                  {chat.title}
                </h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(chat.type)}`}>
                {chat.type === 'nutrition' ? 'Питание' : 
                 chat.type === 'symptoms' ? 'Симптомы' : 'Фитнес'}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {chat.lastMessage}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{chat.timestamp}</span>
              </div>
              <ArrowRight className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-purple-200 text-purple-700 hover:bg-purple-50"
          onClick={() => navigate('/ai-doctor')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Новый чат с ИИ доктором
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardChatsList;
