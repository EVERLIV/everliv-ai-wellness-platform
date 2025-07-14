import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Crown, 
  ArrowLeft,
  Bot,
  History,
  Settings,
  HelpCircle,
  User,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

const AIDoctorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { canUseFeature } = useSubscription();
  
  const hasPremiumAccess = canUseFeature('personal_ai_doctor');

  const menuItems = [
    {
      icon: Bot,
      label: 'ИИ Доктор',
      path: '/ai-doctor',
      active: location.pathname === '/ai-doctor'
    },
    {
      icon: MessageSquare,
      label: 'Базовая консультация',
      path: '/ai-doctor/basic',
      active: location.pathname === '/ai-doctor/basic'
    },
    {
      icon: Crown,
      label: 'Персональная консультация',
      path: '/ai-doctor/personal',
      active: location.pathname === '/ai-doctor/personal',
      premium: true
    },
    {
      icon: History,
      label: 'История чатов',
      path: '/ai-doctor/history',
      active: location.pathname === '/ai-doctor/history',
      premium: true
    }
  ];

  const supportItems = [
    {
      icon: HelpCircle,
      label: 'Центр помощи',
      path: '/support'
    },
    {
      icon: User,
      label: 'Настройки профиля',
      path: '/health-profile'
    },
    {
      icon: Activity,
      label: 'Панель управления',
      path: '/dashboard'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к панели
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">ИИ Доктор</h2>
            <p className="text-xs text-gray-500">Медицинский ассистент</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
            Инструменты
          </p>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => {
                if (item.premium && !hasPremiumAccess) {
                  navigate('/pricing');
                } else {
                  navigate(item.path);
                }
              }}
              className={`
                w-full justify-start text-sm font-normal
                ${item.active 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
                ${item.premium && !hasPremiumAccess ? 'opacity-60' : ''}
              `}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
              {item.premium && !hasPremiumAccess && (
                <Crown className="h-3 w-3 ml-auto text-amber-500" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="p-3 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
          Поддержка
        </p>
        <div className="space-y-1">
          {supportItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className="w-full justify-start text-sm font-normal text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="h-3 w-3" />
          </div>
          <span className="truncate">
            {user?.user_metadata?.full_name || user?.email || 'Пользователь'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AIDoctorSidebar;