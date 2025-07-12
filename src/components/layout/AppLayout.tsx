import React, { useState } from 'react';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Settings, LogOut, Search, Bell, ArrowLeft, Crown, Check } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
    navigate("/dashboard");
  };

  const navigationItems = [
    { label: "Панель управления", href: "/dashboard" },
    { label: "Новости", href: "/news" },
    { label: "Поддержка", href: "/support" },
    { label: "Еще", href: "/more" },
  ];

  // Поисковые подсказки
  const searchSuggestions = [
    { value: "health-profile", label: "Профиль здоровья", href: "/health-profile" },
    { value: "analytics", label: "Аналитика", href: "/analytics" },
    { value: "ai-doctor", label: "ИИ-Врач", href: "/ai-doctor" },
    { value: "recommendations", label: "Рекомендации", href: "/recommendations" },
    { value: "settings", label: "Настройки", href: "/settings" },
    { value: "notifications", label: "Уведомления", href: "/notifications" },
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSearchSelect = (href: string) => {
    navigate(href);
    setSearchOpen(false);
    setSearchValue("");
  };

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
            <Link to="/dashboard" className="flex items-center gap-2">
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
            {/* Поиск с автоподбором */}
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative hidden lg:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск..."
                    className="pl-9 w-64"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Поиск..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>Ничего не найдено.</CommandEmpty>
                    <CommandGroup>
                      {filteredSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion.value}
                          onSelect={() => handleSearchSelect(suggestion.href)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {suggestion.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Статус подписки */}
            <Link to="/pricing">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </Link>
            
            {/* Уведомления */}
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </Link>
            
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

      {/* Основной контент с боковым меню - исправлено расположение */}
      <div className="flex-1 flex">
        <SidebarProvider>
          <AppSidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            {/* Кнопка открытия меню */}
            <div className="p-4 border-b bg-background">
              <SidebarTrigger />
            </div>
            
            {/* Основной контент с правильными отступами */}
            <main className="flex-1 overflow-auto bg-background">
              <div className="container mx-auto p-4 max-w-none min-h-full">
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