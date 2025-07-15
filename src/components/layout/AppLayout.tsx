import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppFooter } from "./AppFooter";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Bell, ArrowLeft, Crown, Check } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UserProfileDropdown from "@/components/header/UserProfileDropdown";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { isPremiumActive, isLoading: subscriptionLoading } = useSubscription();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Функция поиска через API
  const performSearch = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search', {
        body: { searchQuery: query }
      });

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Search request failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSelect = (href: string) => {
    setOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(href);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const navigationItems = [
    { label: "Панель управления", href: "/dashboard" },
    { label: "Новости", href: "/news" },
    { label: "Поддержка", href: "/contact" },
    { label: "Еще", href: "/more" },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Полноширинный навбар */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative hidden lg:block">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Поиск по данным здоровья..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Поиск по данным здоровья..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    {isSearching ? (
                      <CommandEmpty>Поиск...</CommandEmpty>
                    ) : searchResults.length > 0 ? (
                      <CommandGroup>
                        {searchResults.map((result: any, index) => (
                          <CommandItem
                            key={`${result.type}-${index}`}
                            onSelect={() => handleSearchSelect(result.href)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{result.title}</span>
                              <span className="text-sm text-muted-foreground">{result.description}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : searchQuery.length >= 2 ? (
                      <CommandEmpty>Ничего не найдено.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        <CommandItem onSelect={() => handleSearchSelect('/dashboard')}>
                          <Check className="mr-2 h-4 w-4" />
                          Панель управления
                        </CommandItem>
                        <CommandItem onSelect={() => handleSearchSelect('/lab-analyses')}>
                          <Check className="mr-2 h-4 w-4" />
                          Анализы крови
                        </CommandItem>
                        <CommandItem onSelect={() => handleSearchSelect('/ai-doctor')}>
                          <Check className="mr-2 h-4 w-4" />
                          ИИ-доктор
                        </CommandItem>
                        <CommandItem onSelect={() => handleSearchSelect('/recommendations')}>
                          <Check className="mr-2 h-4 w-4" />
                          Рекомендации
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {/* Кнопка улучшения подписки только для не-премиум пользователей */}
            {user && !isPremiumActive && !subscriptionLoading && (
              <Link to="/subscription">
                <Button variant="outline" size="sm" className="hidden sm:flex bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0">
                  <Crown className="h-4 w-4 mr-2" />
                  Улучшить
                </Button>
              </Link>
            )}
            
            {/* Уведомления */}
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            </Link>
            
            {user && <UserProfileDropdown />}
          </div>
        </div>
      </header>

      {/* Основной контент с боковым меню с отступом от навбара */}
      <div className="flex flex-1 pt-14 w-full">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          
          <div className="flex flex-1 flex-col min-w-0">
            {/* Кнопка открытия меню */}
            <div className="p-4 border-b bg-background">
              <SidebarTrigger />
            </div>
            
            {/* Основной контент */}
            <main className="flex-1 overflow-auto bg-background">
              <div className="container mx-auto px-2 py-6 max-w-none min-h-full">
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