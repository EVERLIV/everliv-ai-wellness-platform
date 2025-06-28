
import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputText, 
  setInputText, 
  isProcessing,
  onSubmit 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full">
      <div className="relative flex items-end w-full min-w-0">
        <div className="relative flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            placeholder="Задайте вопрос о здоровье..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="w-full min-h-[40px] max-h-[120px] py-2.5 px-3 pr-12 sm:pr-14 resize-none rounded-xl sm:rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/20 focus:ring-2 focus:outline-none text-adaptive-sm sm:text-base placeholder:text-gray-500 placeholder:text-adaptive-xs sm:placeholder:text-sm transition-all duration-200 mobile-text-wrap overflow-hidden"
            style={{ 
              lineHeight: '1.4',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            rows={1}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || isProcessing}
            className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-6 w-6 sm:h-7 sm:w-7 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex-shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
