import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppFooter } from "./AppFooter";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Search, Bell, ArrowLeft, Crown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const navigationItems = [
    { label: "Панель управления", href: "/dashboard" },
    { label: "Новости", href: "/news" },
    { label: "Поддержка", href: "/support" },
    { label: "Еще", href: "/more" },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Полноширинный навбар */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          {/* Левая часть - Кнопка назад и логотип */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="text-lg font-semibold">EverliveAI</div>
            </Link>
          </div>
          
          {/* Центр - навигация */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Правая часть - поиск, статус подписки, уведомления, профиль */}
          <div className="flex items-center gap-3">
            {/* Поиск */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск..."
                className="pl-9 w-64"
              />
            </div>
            
            {/* Статус подписки */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
            
            {/* Уведомления */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            
            {/* Профиль пользователя */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Базовая подписка</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/health-profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Профиль
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Настройки
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Основной контент с боковым меню */}
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            {/* Кнопка открытия меню */}
            <div className="p-4 border-b">
              <SidebarTrigger />
            </div>
            
            {/* Основной контент */}
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-4 max-w-none">
                {children}
              </div>
            </main>
            
            {/* Футер */}
            <AppFooter />
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}