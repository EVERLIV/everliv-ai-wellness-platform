
import React from "react";
import { Link } from "react-router-dom";
import { Activity, Github, Twitter, Linkedin } from "lucide-react";

const MinimalFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-blue-50/30 backdrop-blur-sm border-t border-white/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EverLiv
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms-of-use" className="text-gray-600 hover:text-blue-600 transition-colors">
              Условия использования
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Контакты
            </Link>
            <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
              Поддержка
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
          <p className="text-sm text-gray-500">
            © 2024 EverLiv. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
