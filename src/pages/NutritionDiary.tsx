
import React from "react";
import PageLayoutWithHeader from "@/components/PageLayoutWithHeader";
import NutritionDiary from "@/components/nutrition/NutritionDiary";
import NutritionDiaryHeader from "@/components/nutrition/NutritionDiaryHeader";

const NutritionDiaryPage: React.FC = () => {
  return (
    <PageLayoutWithHeader
      headerComponent={<NutritionDiaryHeader />}
    >
      <NutritionDiary />
    </PageLayoutWithHeader>
  );
};

export default NutritionDiaryPage;
