
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSecureAIDoctor } from '@/hooks/useSecureAIDoctor';
import { MessageSquare, Plus, Crown } from 'lucide-react';

const DashboardChatsList: React.FC = () => {
  const navigate = useNavigate();
  const { chats, isLoading: chatsLoading } = useSecureAIDoctor();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Мои чаты с доктором
      </h3>
      <div className="space-y-2">
        {chatsLoading ? (
          <div className="text-center py-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : chats && chats.length > 0 ? (
          <>
            {chats.slice(0, 3).map((chat) => (
              <div 
                key={chat.id}
                className="flex items-center justify-between p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => navigate(`/ai-doctor/chat/${chat.id}`)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    {chat.title?.includes('Премиум') && (
                      <Crown className="h-3 w-3 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-gray-700 truncate">{chat.title || 'Консультация'}</span>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {new Date(chat.created_at).toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              </div>
            ))}
            {chats.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs h-6" 
                onClick={() => navigate('/ai-doctor')}
              >
                Показать все ({chats.length})
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <MessageSquare className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 mb-3">
              Нет чатов с доктором
            </p>
            <Button 
              size="sm" 
              onClick={() => navigate('/ai-doctor')}
              className="text-xs px-3 py-1 h-7"
            >
              <Plus className="h-3 w-3 mr-1" />
              Новый чат
            </Button>
          </div>
        )}
        
        {chats && chats.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs h-6" 
            onClick={() => navigate('/ai-doctor')}
          >
            <Plus className="h-3 w-3 mr-1" />
            Новый чат
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardChatsList;
