
import React from 'react';

const MinimalFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-primary font-semibold">EVERLIV</span>
            <span>© {currentYear}</span>
          </div>
          <div className="text-center sm:text-right">
            <span>Платформа для здоровья на базе ИИ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
