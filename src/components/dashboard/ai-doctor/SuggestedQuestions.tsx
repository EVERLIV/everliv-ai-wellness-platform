
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, ThumbsUp, Moon, Pill, HeartPulse, Apple, Yoga } from "lucide-react";
import { SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

// Helper function to map string identifiers to Lucide icons
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "sleep":
      return <Moon className="h-4 w-4 text-blue-500" />;
    case "pill":
      return <Pill className="h-4 w-4 text-purple-500" />;
    case "yoga":
      return <Yoga className="h-4 w-4 text-purple-500" />;
    case "heart":
      return <HeartPulse className="h-4 w-4 text-red-500" />;
    case "apple":
      return <Apple className="h-4 w-4 text-green-500" />;
    default:
      return <Activity className="h-4 w-4 text-blue-500" />;
  }
};

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: "Как улучшить выносливость?",
      icon: "activity",
    },
    {
      text: "Рекомендации для улучшения сна",
      icon: "sleep",
    },
    {
      text: "Какие добавки помогут моему сердцу?",
      icon: "heart",
    },
    {
      text: "Как оптимизировать метаболизм?",
      icon: "apple",
    },
  ];

  return (
    <div className="px-4 mb-4">
      <h4 className="text-sm font-medium mb-2">Рекомендуемые вопросы:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestedQuestions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto py-2"
            onClick={() => onSelectQuestion(question.text)}
          >
            {getIconComponent(question.icon)}
            <span className="ml-2 truncate">{question.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
