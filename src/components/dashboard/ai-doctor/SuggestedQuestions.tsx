
import React from "react";
import { Button } from "@/components/ui/button";
import { Microscope, Pill, TrendingUp, BookOpen, Heart, Apple, Sparkles } from "lucide-react";
import { SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelectQuestion: (question: string) => void;
}

const iconMap = {
  microscope: Microscope,
  pill: Pill,
  "trending-up": TrendingUp,
  "book-open": BookOpen,
  heart: Heart,
  apple: Apple,
};

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onSelectQuestion 
}) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="text-center px-2">
        <h3 className="text-adaptive-base sm:text-lg font-semibold text-gray-900 mb-1">
          Популярные вопросы
        </h3>
        <p className="text-adaptive-xs sm:text-sm text-gray-600">
          Выберите вопрос или задайте свой
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-1.5 sm:gap-2 px-1 sm:px-0">
        {questions.map((question, index) => {
          const IconComponent = iconMap[question.icon as keyof typeof iconMap] || Sparkles;
          
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onSelectQuestion(question.text)}
              className="h-auto p-2 sm:p-3 text-left justify-start bg-white/60 hover:bg-white/80 border border-gray-100 hover:border-blue-200 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.01] group w-full min-w-0"
            >
              <div className="flex items-start space-x-2 w-full min-w-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="mobile-text-wrap chat-button-mobile text-adaptive-xs sm:text-sm font-medium text-gray-900 leading-snug text-left pr-1">
                    {question.text}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
