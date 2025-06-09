
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelectQuestion: (question: string) => void;
}

const SuggestedQuestions = ({ questions, onSelectQuestion }: SuggestedQuestionsProps) => {
  // Предустановленные быстрые сообщения
  const quickMessages = [
    "Какие лучшие варианты замены никотина для отказа от курения?",
    "Как я могу следить за своим здоровьем во время отказа от курения?"
  ];
  
  return (
    <div className="space-y-2">
      {/* Быстрые сообщения */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {quickMessages.map((message, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-3 text-left justify-between items-start group hover:bg-gray-50 border-gray-200 text-xs sm:text-sm"
            onClick={() => onSelectQuestion(message)}
          >
            <span className="text-gray-700 leading-relaxed pr-2 text-left">
              {message}
            </span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-gray-600 shrink-0 mt-0.5" />
          </Button>
        ))}
      </div>
      
      {/* Обычные предложенные вопросы (если есть) */}
      {questions && questions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {questions.map((question, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => onSelectQuestion(question.text)}
            >
              {question.text}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedQuestions;
