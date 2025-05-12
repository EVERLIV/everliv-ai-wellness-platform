
import React from "react";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart, ThumbsUp } from "lucide-react";
import { SuggestedQuestion } from "./types";

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion }) => {
  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: "Как улучшить выносливость?",
      icon: <Activity className="h-4 w-4 text-blue-500" />,
    },
    {
      text: "Рекомендации для улучшения сна",
      icon: <Brain className="h-4 w-4 text-purple-500" />,
    },
    {
      text: "Какие добавки помогут моему сердцу?",
      icon: <Heart className="h-4 w-4 text-red-500" />,
    },
    {
      text: "Как оптимизировать метаболизм?",
      icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
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
            {question.icon}
            <span className="ml-2 truncate">{question.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
