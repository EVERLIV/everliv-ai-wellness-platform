
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

  // Enhanced Auto-resize textarea with 30% max height constraint
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Get 30% of viewport height as max height
      const maxHeight = Math.min(window.innerHeight * 0.3, 200);
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${Math.max(newHeight, 44)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <div className="border-t-2 border-border bg-card mt-8 pt-8 pb-6 px-6">
      <div className="max-w-full">
        <form onSubmit={onSubmit} className="flex gap-3 items-end">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              placeholder="Задайте вопрос о здоровье..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="w-full min-h-[44px] p-4 resize-none border border-input bg-background text-sm placeholder:text-muted-foreground overflow-hidden"
              style={{ 
                lineHeight: '1.5',
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
            className="h-[52px] px-5 flex-shrink-0"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
