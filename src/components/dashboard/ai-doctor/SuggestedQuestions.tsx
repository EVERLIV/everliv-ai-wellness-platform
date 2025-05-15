
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, ThumbsUp, Moon, Pill, HeartPulse, Apple } from "lucide-react";
import { SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  onSelectQuestion: (question: string) => void;
}

// Helper function to render icon based on icon name string
const renderIcon = (iconName: string) => {
  switch (iconName) {
    case "sleep":
      return <Moon className="h-4 w-4 text-indigo-500" />;
    case "pill":
      return <Pill className="h-4 w-4 text-purple-500" />;
    case "yoga":
      return <Brain className="h-4 w-4 text-purple-500" />; // Changed from Yoga to Brain icon
    case "heart":
      return <HeartPulse className="h-4 w-4 text-red-500" />;
    case "apple":
      return <Apple className="h-4 w-4 text-green-500" />;
    case "activity":
      return <Activity className="h-4 w-4 text-blue-500" />;
    default:
      return <ThumbsUp className="h-4 w-4 text-gray-500" />;
  }
};

const SuggestedQuestions = ({ questions, onSelectQuestion }: SuggestedQuestionsProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <p className="text-sm text-gray-500 mb-2">Рекомендуемые вопросы:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            onClick={() => onSelectQuestion(question.text)}
          >
            {question.icon && renderIcon(question.icon)}
            <span className="text-xs">{question.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
