
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
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
          Популярные вопросы
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Выберите вопрос или задайте свой
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {questions.map((question, index) => {
          const IconComponent = iconMap[question.icon as keyof typeof iconMap] || Sparkles;
          
          return (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onSelectQuestion(question.text)}
              className="h-auto p-3 sm:p-4 text-left justify-start bg-white/60 hover:bg-white/80 border border-gray-100 hover:border-blue-200 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:scale-[1.01] group"
            >
              <div className="flex items-start space-x-2 sm:space-x-3 w-full">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 leading-snug sm:leading-relaxed break-words hyphens-auto">
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
