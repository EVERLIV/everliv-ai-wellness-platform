
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
    <div className="p-2 sm:p-4 border-b border-border">
      <div className="text-center mb-2 sm:mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
          Популярные вопросы
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Выберите вопрос или задайте свой
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {questions.map((question, index) => {
          const IconComponent = iconMap[question.icon as keyof typeof iconMap] || Sparkles;
          
          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => onSelectQuestion(question.text)}
              className="h-auto p-2 sm:p-3 text-left justify-start hover:bg-muted/50 w-full"
            >
              <div className="flex items-start space-x-2 w-full">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground border border-primary flex items-center justify-center flex-shrink-0">
                  <IconComponent className="h-2 w-2 sm:h-3 sm:w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground leading-snug">
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
