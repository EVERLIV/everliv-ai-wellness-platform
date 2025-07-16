import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Upload, 
  History, 
  FileText, 
  Stethoscope,
  Plus,
  Brain,
  Shield,
  Heart
} from 'lucide-react';

interface DiagnosticsLayoutProps {
  children: React.ReactNode;
}

const DiagnosticsLayout: React.FC<DiagnosticsLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      path: '/diagnostics',
      label: 'Дашборд',
      icon: Activity,
      exact: true
    },
    {
      path: '/diagnostics/ecg',
      label: 'ЭКГ Анализ',
      icon: Heart,
      badge: 'ИИ'
    },
    {
      path: '/diagnostics/upload',
      label: 'Загрузка файлов',
      icon: Upload
    },
    {
      path: '/diagnostics/history',
      label: 'История',
      icon: History
    },
    {
      path: '/diagnostics/recommendations',
      label: 'Умные рекомендации',
      icon: Brain,
      badge: 'Новое'
    },
    {
      path: '/diagnostics/standards',
      label: 'Медицинские стандарты',
      icon: Shield
    }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Диагностика</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                Модуль в разработке
              </Badge>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Новая диагностика
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <Card className="p-4">
              <nav className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  Навигация
                </h3>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant={active ? "secondary" : "default"} 
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-sm text-muted-foreground mb-3">
                  Быстрая статистика
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Сессии</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ЭКГ записи</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Файлы</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsLayout;