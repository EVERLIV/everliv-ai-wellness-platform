
import { HealthProfileData } from "@/types/healthProfile";

export const labResultsProcessor = {
  updateLabResultsFromAnalysis(
    healthProfile: HealthProfileData | null, 
    analysisData: any,
    onUpdate: (updates: Partial<HealthProfileData>) => void
  ): void {
    if (!healthProfile || !analysisData.biomarkers) return;

    const labUpdates: any = {};
    
    // Маппинг биомаркеров на поля лабораторных данных
    analysisData.biomarkers.forEach((biomarker: any) => {
      const name = biomarker.name.toLowerCase();
      const value = parseFloat(biomarker.value);
      
      if (name.includes('гемоглобин') || name.includes('hemoglobin')) {
        labUpdates.hemoglobin = value;
      } else if (name.includes('эритроциты') || name.includes('erythrocytes')) {
        labUpdates.erythrocytes = value;
      } else if (name.includes('гематокрит') || name.includes('hematocrit')) {
        labUpdates.hematocrit = value;
      } else if (name.includes('mcv')) {
        labUpdates.mcv = value;
      } else if (name.includes('mchc')) {
        labUpdates.mchc = value;
      } else if (name.includes('тромбоциты') || name.includes('platelets')) {
        labUpdates.platelets = value;
      } else if (name.includes('железо') || name.includes('iron')) {
        labUpdates.serumIron = value;
      } else if (name.includes('холестерин') || name.includes('cholesterol')) {
        labUpdates.cholesterol = value;
      } else if (name.includes('глюкоза') || name.includes('glucose') || name.includes('сахар')) {
        labUpdates.bloodSugar = value;
      } else if (name.includes('лдг') || name.includes('ldh')) {
        labUpdates.ldh = value;
      }
    });

    if (Object.keys(labUpdates).length > 0) {
      const updatedLabResults = {
        ...healthProfile.labResults,
        ...labUpdates,
        lastUpdated: new Date().toISOString()
      };
      
      onUpdate({ labResults: updatedLabResults });
      console.log('Lab results updated from analysis:', labUpdates);
    }
  }
};
