
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

  // Enhanced Auto-resize textarea with responsive height constraint
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Get 25% of viewport height as max height for mobile, 30% for desktop
      const isMobile = window.innerWidth < 640;
      const maxHeight = Math.min(window.innerHeight * (isMobile ? 0.25 : 0.3), isMobile ? 120 : 200);
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, isMobile ? 36 : 44)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="bg-card">
      <div className="max-w-full">
        <form onSubmit={onSubmit} className="flex gap-2 sm:gap-3 items-end">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder="Задайте вопрос о здоровье..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full min-h-[36px] sm:min-h-[44px] p-2 sm:p-4 resize-none border border-input bg-background text-xs sm:text-sm placeholder:text-muted-foreground overflow-hidden rounded-md"
              style={{ 
                lineHeight: '1.4',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || isProcessing}
            className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] p-0 flex-shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
