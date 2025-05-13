
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  FileBarChart, 
  Brain, 
  Settings,
  CreditCard 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Панель управления', path: '/dashboard' },
    { icon: FileText, label: 'Мои протоколы', path: '/my-protocols' },
    { icon: FileBarChart, label: 'Анализы крови', path: '/blood-analysis' },
    { icon: Brain, label: 'ИИ Рекомендации', path: '/recommendations' },
    { icon: CreditCard, label: 'Управление подпиской', path: '/subscription' },
    { icon: User, label: 'Личный профиль', path: '/profile' },
    { icon: Settings, label: 'Настройки', path: '/settings' }
  ];

  return (
    <aside className="w-64 border-r border-gray-200 h-full hidden lg:block p-4">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-everliv-50 text-everliv-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
