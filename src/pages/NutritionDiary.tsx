
import React from "react";
import Header from "@/components/Header";
import MinimalFooter from "@/components/MinimalFooter";
import NutritionDiary from "@/components/nutrition/NutritionDiary";

const NutritionDiaryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-grow pt-16">
        <NutritionDiary />
      </div>
      <MinimalFooter />
    </div>
  );
};

export default NutritionDiaryPage;
