
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/components/header/Logo";
import { useAuth } from "@/contexts/AuthContext";

const HomeHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services" className="text-gray-700 hover:text-primary transition-colors">
              Решения
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors">
              Цены
            </Link>
            <Link to="/partnership" className="text-gray-700 hover:text-primary transition-colors">
              Для партнеров
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Панель управления</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Войти</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Зарегистрироваться Бесплатно</Button>
                  </Link>
                </>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link to="/services" className="text-gray-700 hover:text-primary">Решения</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary">Цены</Link>
            <Link to="/partnership" className="text-gray-700 hover:text-primary">Для партнеров</Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full">Панель управления</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="w-full">Войти</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="w-full">Зарегистрироваться Бесплатно</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;
