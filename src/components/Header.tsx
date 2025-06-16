
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Menu, X, Brain, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserProfileDropdown from "./header/UserProfileDropdown";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Главная" },
    { path: "/features", label: "Возможности" },
    { path: "/pricing", label: "Тарифы" },
    { path: "/about", label: "О нас" },
    { path: "/contact", label: "Контакты" },
  ];

  const userNavItems = [
    { path: "/dashboard", label: "Панель управления", icon: Activity },
    { path: "/ai-doctor", label: "AI Доктор", icon: Brain },
    { path: "/blood-test-analysis", label: "Анализ крови" },
    { path: "/medical-knowledge", label: "База знаний" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EverLiv
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                {userNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-blue-600 bg-white/50 shadow-md"
                        : "text-gray-700 hover:text-blue-600 hover:bg-white/30"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-blue-600 bg-white/50 shadow-md"
                        : "text-gray-700 hover:text-blue-600 hover:bg-white/30"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <UserProfileDropdown />
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 hover:bg-white/30">
                    Войти
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] backdrop-blur-md bg-white/90">
              <div className="flex flex-col space-y-4 mt-8">
                {user ? (
                  <>
                    {userNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="pt-4 border-t">
                      <UserProfileDropdown />
                    </div>
                  </>
                ) : (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Войти
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                          Регистрация
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
