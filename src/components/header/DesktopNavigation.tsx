
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
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DesktopNavigation: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Меню</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/services">
                      <div className="text-sm font-medium leading-none">Услуги</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Комплексные решения для здорового долголетия
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/pricing">
                      <div className="text-sm font-medium leading-none">Цены</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Тарифные планы и стоимость услуг
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/about">
                      <div className="text-sm font-medium leading-none">О нас</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        История, миссия и команда EVERLIV
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/blog">
                      <div className="text-sm font-medium leading-none">Блог</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Статьи о здоровье и долголетии
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/partnership">
                      <div className="text-sm font-medium leading-none">Партнерство</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Сотрудничество с медицинскими организациями
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" to="/contacts">
                      <div className="text-sm font-medium leading-none">Контакты</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Связаться с нами
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      {user && (
        <>
          <Link to="/dashboard">
            <Button variant="outline" size="sm">Панель Управления</Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="default" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Админ-панель
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={handleSignOut}>Выйти</Button>
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
