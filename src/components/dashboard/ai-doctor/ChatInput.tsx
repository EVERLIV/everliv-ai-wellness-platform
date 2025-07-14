
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
    <div className="border-t border-border bg-card p-4">
      <form onSubmit={onSubmit} className="flex gap-2 items-end">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            placeholder="Задайте вопрос о здоровье..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="w-full min-h-[40px] max-h-[120px] p-3 resize-none border border-input bg-background focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring text-sm placeholder:text-muted-foreground"
            style={{ 
              lineHeight: '1.4',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            rows={1}
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={!inputText.trim() || isProcessing}
          className="h-[46px] px-4"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
