
import React from 'react';

const MinimalFooter = () => {
  const currentYear = new Date().getFullYear();
  const version = "1.0.4"; // Обновленная версия
  
  return (
    <footer className="bg-white border-t border-gray-100 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-1 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-primary font-medium">EVERLIV</span>
            <span>© {currentYear}</span>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span>Платформа для здоровья на базе ИИ</span>
            <span className="text-gray-300">•</span>
            <span className="font-mono text-gray-500">v{version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
