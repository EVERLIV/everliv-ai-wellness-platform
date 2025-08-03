
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./header/Logo";
import UserProfileDropdown from "./header/UserProfileDropdown";
import MobileHeader from "./mobile/MobileHeader";

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Используем мобильный заголовок для мобильных устройств
  if (isMobile) {
    return null; // MobileHeader будет отображаться в MobileLayout
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Right side menu */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                 <div className="hidden md:flex items-center space-x-2">
                   <Link to="/dashboard">
                     <Button variant="outline" size="sm">Панель Управления</Button>
                   </Link>
                 </div>
                <UserProfileDropdown />
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Регистрация</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
