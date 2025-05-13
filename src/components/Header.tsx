
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import TrialStatusBanner from "./dashboard/TrialStatusBanner";
import { Menu, X, ChevronDown, Settings } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface HeaderProps {
  className?: string;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <TrialStatusBanner />
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center text-lg font-semibold gap-2">
          <img src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" alt="EVERLIV Logo" className="h-8 w-auto" />
          EVERLIV
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Услуги</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/services">
                          <div className="text-sm font-medium leading-none">Все услуги</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Комплексные решения для здорового долголетия
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/comprehensive-analysis">
                          <div className="text-sm font-medium leading-none">Комплексный анализ</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Полный анализ состояния вашего организма
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/blood-analysis">
                          <div className="text-sm font-medium leading-none">Анализ крови</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Расшифровка и интерпретация анализов крови
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing" className="hover:text-gray-600 px-4 py-2">Цены</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>О нас</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/about">
                          <div className="text-sm font-medium leading-none">О компании</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            История, миссия и команда EVERLIV
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/science">
                          <div className="text-sm font-medium leading-none">Научный подход</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Исследования и разработки в области долголетия
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/ai-medicine">
                          <div className="text-sm font-medium leading-none">ИИ в медицине</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Как мы применяем искусственный интеллект
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/security">
                          <div className="text-sm font-medium leading-none">Безопасность данных</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Как мы защищаем ваши персональные данные
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" className="hover:text-gray-600 px-4 py-2">Блог</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/partnership" className="hover:text-gray-600 px-4 py-2">Партнерство</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contacts" className="hover:text-gray-600 px-4 py-2">Контакты</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Админ-панель
                  </Button>
                </Link>
              )}
              <Link to="/dashboard" className="hover:text-gray-600">
                <Button variant="outline" size="sm">Личный кабинет</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Выйти</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-50 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <div className="py-2 border-b border-gray-200">
              <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                <Link to="/services" className="text-gray-800 font-medium">Услуги</Link>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2 ml-4 space-y-2">
                <Link to="/services" className="block text-gray-600 hover:text-primary">Все услуги</Link>
                <Link to="/services/cold-therapy" className="block text-gray-600 hover:text-primary">Холодовая терапия</Link>
                <Link to="/comprehensive-analysis" className="block text-gray-600 hover:text-primary">Комплексный анализ</Link>
              </div>
            </div>
            
            <Link to="/pricing" className="hover:text-gray-600">Цены</Link>
            
            <div className="py-2 border-b border-gray-200">
              <div className="flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                <Link to="/about" className="text-gray-800 font-medium">О нас</Link>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="mt-2 ml-4 space-y-2">
                <Link to="/about" className="block text-gray-600 hover:text-primary">О компании</Link>
                <Link to="/science" className="block text-gray-600 hover:text-primary">Научный подход</Link>
                <Link to="/ai-medicine" className="block text-gray-600 hover:text-primary">ИИ в медицине</Link>
                <Link to="/security" className="block text-gray-600 hover:text-primary">Безопасность данных</Link>
              </div>
            </div>
            
            <Link to="/blog" className="hover:text-gray-600">Блог</Link>
            <Link to="/partnership" className="hover:text-gray-600">Партнерство</Link>
            <Link to="/contacts" className="hover:text-gray-600">Контакты</Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-primary font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Админ-панель
                  </Link>
                )}
                <Link to="/dashboard" className="hover:text-gray-600">Личный кабинет</Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>Выйти</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Регистрация</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
