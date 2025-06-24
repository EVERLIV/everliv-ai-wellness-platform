
import React from "react";

const DisclaimerCard: React.FC = () => {
  return (
    <div className="text-xs text-gray-500 bg-gradient-to-r from-gray-50/80 to-blue-50/30 rounded-xl px-4 py-3 border border-gray-200/30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs">β</span>
        </div>
        <p className="text-center sm:text-left">
          Сервис находится в альфа-разработке, спасибо за поддержку! 
          <a 
            href="/contact" 
            className="text-blue-600 hover:text-blue-700 hover:underline font-medium ml-1 transition-colors"
          >
            Сообщить о проблеме
          </a>
        </p>
      </div>
    </div>
  );
};

export default DisclaimerCard;
