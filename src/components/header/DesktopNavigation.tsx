import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";

interface DesktopNavigationProps {
  user: any;
  isAdmin: boolean;
  handleSignOut: () => Promise<void>;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  user,
  isAdmin,
  handleSignOut
}) => {
  return (
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
            <Link to="/admin/blog">
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
  );
};

export default DesktopNavigation;
