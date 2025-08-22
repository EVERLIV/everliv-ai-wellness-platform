import React from "react";
import { TestTube, Brain, Activity } from "lucide-react";
import AIFeatureCard from "./AIFeatureCard";

const AIFeaturesSection = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">AI Функции для здоровья</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AIFeatureCard
          title="Лабораторные анализы"
          description="Загружайте и анализируйте результаты лабораторных исследований"
          icon={TestTube}
          path="/lab-analyses"
          isDisabled={false}
        />

        <AIFeatureCard
          title="AI анализ здоровья"
          description="Получите комплексную оценку здоровья на основе всех ваших данных"
          icon={Brain}
          path="/analytics"
          isDisabled={false}
        />

        <AIFeatureCard
          title="Мои биомаркеры"
          description="Отслеживайте и анализируйте ваши биомаркеры"
          icon={Activity}
          path="/my-biomarkers"
          isDisabled={false}
        />
      </div>
    </div>
  );
};

export default AIFeaturesSection;