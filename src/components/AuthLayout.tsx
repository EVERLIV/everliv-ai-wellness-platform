
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
      <div className="hidden md:flex md:w-1/2 hero-gradient flex-col justify-between items-start p-10">
        <div>
          <Link to="/" className="flex items-center">
            <span className="text-white font-bold text-2xl">EVER<span className="text-evergreen-300">LIV</span></span>
          </Link>
        </div>
        <div className="max-w-md mb-10">
          <h1 className="text-3xl font-bold text-white mb-4">Платформа для оптимального здоровья и долголетия на базе ИИ</h1>
          <p className="text-white/80 text-lg">
            EVERLIV помогает вам достичь оптимального здоровья через персонализированные рекомендации, основанные на науке и ваших индивидуальных данных.
          </p>
        </div>
      </div>
      
      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
        <Link to="/" className="md:hidden flex items-center mb-8">
          <span className="text-everliv-800 font-bold text-2xl">EVER<span className="text-evergreen-500">LIV</span></span>
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
                <Link to="/signup" className="text-everliv-600 hover:underline font-medium">
                  Зарегистрироваться
                </Link>
              </p>
            )}
            {type === "signup" && (
              <p className="text-gray-600">
                Уже есть аккаунт?{" "}
                <Link to="/login" className="text-everliv-600 hover:underline font-medium">
                  Войти
                </Link>
              </p>
            )}
            {type === "reset" && (
              <p className="text-gray-600">
                Вспомнили пароль?{" "}
                <Link to="/login" className="text-everliv-600 hover:underline font-medium">
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
