
import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  userName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible, userName = 'ИИ-доктор' }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 p-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span>{userName} печатает...</span>
    </div>
  );
};

export default TypingIndicator;
