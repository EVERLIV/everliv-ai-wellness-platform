
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Sparkles } from "lucide-react";

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
    <form onSubmit={onSubmit} className="relative">
      <div className="relative flex items-center">
        <Input
          placeholder="Задайте вопрос о вашем здоровье..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isProcessing}
          className="pr-14 h-12 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-blue-400/20 text-base placeholder:text-gray-500 transition-all duration-200"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!inputText.trim() || isProcessing}
          className="absolute right-2 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
