
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-700 hover:text-primary transition-colors duration-300">О нас</Link>
            <Link to="/features" className="text-gray-700 hover:text-primary transition-colors duration-300">Возможности</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary transition-colors duration-300">Тарифы</Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary transition-colors duration-300">Блог</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors duration-300">Контакты</Link>
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
