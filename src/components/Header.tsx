
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-primary font-bold text-2xl font-heading">EVER<span className="text-secondary">LIV</span></span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/about" className={cn(navigationMenuTriggerStyle())}>О нас</Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Возможности</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/features" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Возможности</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Все функции платформы в одном месте</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Как это работает</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Пошаговый процесс использования платформы</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/science" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Научная база</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Исследования и доказательства эффективности</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/community" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Сообщество</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Истории пользователей и челленджи</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/pricing" className={cn(navigationMenuTriggerStyle())}>Тарифы</Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Обучение</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/blog" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Блог</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Статьи о здоровье и долголетии</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/webinars" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Вебинары</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Обучающие сессии с экспертами</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/partnership" className={cn(navigationMenuTriggerStyle())}>Партнерская программа</Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact" className={cn(navigationMenuTriggerStyle())}>Контакты</Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center text-gray-700 hover:text-primary transition-colors duration-300">
                  <User className="h-5 w-5 mr-1" />
                  <span>Профиль</span>
                </Link>
                <Button 
                  variant="secondary" 
                  onClick={() => signOut()}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary">
                    Войти
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button>
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                О нас
              </Link>
              <Link 
                to="/features" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Возможности
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Как это работает
              </Link>
              <Link 
                to="/science" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Научная база
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Тарифы
              </Link>
              <Link 
                to="/blog" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Блог
              </Link>
              <Link 
                to="/community" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Сообщество
              </Link>
              <Link 
                to="/webinars" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Вебинары
              </Link>
              <Link 
                to="/partnership" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Партнерская программа
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-primary transition-colors duration-300 px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Контакты
              </Link>
              
              <div className="flex flex-col space-y-2 pt-2">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" className="w-full flex items-center justify-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>Профиль</span>
                      </Button>
                    </Link>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Выйти
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                      <Button variant="secondary" className="w-full">
                        Войти
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="w-full">
                      <Button className="w-full">
                        Регистрация
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
