
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import TrialStatusBanner from "./dashboard/TrialStatusBanner";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  className?: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
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
          <img 
            src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" 
            alt="EVERLIV Logo" 
            className="h-8 w-auto" 
          />
          EVERLIV
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/services" className="hover:text-gray-600">Услуги</Link>
          <Link to="/pricing" className="hover:text-gray-600">Цены</Link>
          <Link to="/webinars" className="hover:text-gray-600">Вебинары</Link>
          <Link to="/science" className="hover:text-gray-600">Наука</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-600">Панель управления</Link>
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
            <Link to="/services" className="hover:text-gray-600">Услуги</Link>
            <Link to="/pricing" className="hover:text-gray-600">Цены</Link>
            <Link to="/webinars" className="hover:text-gray-600">Вебинары</Link>
            <Link to="/science" className="hover:text-gray-600">Наука</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-600">Панель управления</Link>
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
