
import React from "react";
import { TestTube, Clock, Brain, Calendar, Activity } from "lucide-react";
import AIFeatureCard from "./AIFeatureCard";

const AIFeaturesSection = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">AI Функции для здоровья</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AIFeatureCard
          title="Анализ крови с AI"
          description="Получите расшифровку анализа крови и персонализированные рекомендации"
          icon={TestTube}
          path="/blood-analysis"
          isDisabled={false}
        />

        <AIFeatureCard
          title="Биологический возраст"
          description="Определите свой биологический возраст и получите рекомендации"
          icon={Clock}
          path="/biological-age"
          isDisabled={false}
        />

        <AIFeatureCard
          title="AI анализ здоровья"
          description="Получите комплексную оценку здоровья на основе всех ваших данных"
          icon={Brain}
          path="/comprehensive-analysis"
          isDisabled={false}
        />

        <AIFeatureCard
          title="Мои протоколы"
          description="Персональные протоколы здоровья и отслеживание прогресса"
          icon={Calendar}
          path="/my-protocols"
          enabledText="Перейти"
        />

        <AIFeatureCard
          title="Отслеживание протоколов"
          description="Отслеживайте прогресс ваших протоколов и анализируйте результаты"
          icon={Activity}
          path="/protocol-tracking"
          enabledText="Перейти к отслеживанию"
        />
      </div>
    </div>
  );
};

export default AIFeaturesSection;
