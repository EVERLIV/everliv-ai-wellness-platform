
import React from "react";
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
  return (
    <form onSubmit={onSubmit} className="w-full flex gap-2">
      <Input
        placeholder="Введите ваш вопрос..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isProcessing}
        className="flex-grow"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!inputText.trim() || isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;
