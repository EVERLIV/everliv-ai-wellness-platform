
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  type: "login" | "signup" | "reset";
}

export default function AuthLayout({ children, title, description, type }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-400 via-emerald-300 to-teal-200 flex-col justify-between items-start p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 via-emerald-100/20 to-teal-100/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMkM1NUUiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/50">
              <img src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" alt="EVERLIV Logo" className="h-6 w-auto" />
            </div>
            <span className="text-gray-800 font-bold text-2xl tracking-wide">EVERLIV</span>
          </Link>
        </div>
        
        {/* Main Content */}
        <div className="max-w-lg mb-10 relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                EVERLIV:
              </span>
            </h1>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-green-600">Выглядеть лучше.</span> Действовать лучше, быть умнее, с лучшими когнитивными способностями.
              </p>
              <p>
                <span className="font-semibold text-emerald-600">Лучшие тело и физиология.</span> Быть лучшей биологической версией себя.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="flex space-x-6 opacity-70">
            <div className="w-2 h-16 bg-gradient-to-b from-green-400 to-green-500 rounded-full"></div>
            <div className="w-2 h-12 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full mt-4"></div>
            <div className="w-2 h-20 bg-gradient-to-b from-teal-400 to-teal-500 rounded-full"></div>
          </div>
        </div>
        
        {/* Footer text */}
        <div className="text-gray-600 text-sm relative z-10">
          <p>Платформа для оптимального здоровья и долголетия на базе ИИ</p>
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 bg-white">
        <Link to="/" className="md:hidden flex items-center mb-8 space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
            <img src="/lovable-uploads/1d550229-884d-4912-81bb-d9b77b6f44bf.png" alt="EVERLIV Logo" className="h-5 w-auto" />
          </div>
          <span className="text-gray-800 font-bold text-xl">EVERLIV</span>
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </div>
          
          {children}
          
          {/* Auth Footer Links */}
          <div className="mt-8 text-center">
            {type === "login" && (
              <p className="text-gray-600">
                Нет аккаунта?{" "}
                <Link to="/signup" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Зарегистрироваться
                </Link>
              </p>
            )}
            {type === "signup" && (
              <p className="text-gray-600">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Войти
                </Link>
              </p>
            )}
            {type === "reset" && (
              <p className="text-gray-600">
                Вспомнили пароль?{" "}
                <Link to="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Войти
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
