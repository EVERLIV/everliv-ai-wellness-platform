
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: any;
  isAdmin: boolean;
  handleSignOut: () => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  setIsOpen,
  user,
  isAdmin,
  handleSignOut
}) => {
  if (!isOpen) return null;
  
  return (
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
            <Link to="/dashboard" className="text-primary font-medium">Панель Управления</Link>
            {isAdmin && (
              <Link to="/admin" className="text-primary font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Админ-панель
              </Link>
            )}
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
  );
};

export default MobileMenu;
