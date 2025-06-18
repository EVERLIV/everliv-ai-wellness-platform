
import { HealthProfileData } from "@/types/healthProfile";

export const updateHealthProfileFromAnalysis = (
  healthProfile: HealthProfileData | null,
  analysisData: any
): Partial<HealthProfileData> => {
  if (!analysisData?.biomarkers || !Array.isArray(analysisData.biomarkers)) {
    return {};
  }

  const labUpdates: any = {};

  analysisData.biomarkers.forEach((biomarker: any) => {
    if (!biomarker?.name || biomarker.value === undefined) return;

    const name = biomarker.name.toLowerCase();
    const value = parseFloat(biomarker.value);

    if (isNaN(value)) return;

    // Маппинг названий биомаркеров
    if (name.includes('гемоглобин') || name.includes('hemoglobin') || name.includes('hgb')) {
      labUpdates.hemoglobin = value;
    } else if (name.includes('эритроциты') || name.includes('erythrocytes') || name.includes('rbc')) {
      labUpdates.erythrocytes = value;
    } else if (name.includes('гематокрит') || name.includes('hematocrit') || name.includes('hct')) {
      labUpdates.hematocrit = value;
    } else if (name.includes('mcv') || name.includes('средний объем эритроцита')) {
      labUpdates.mcv = value;
    } else if (name.includes('mchc') || name.includes('средняя концентрация гемоглобина')) {
      labUpdates.mchc = value;
    } else if (name.includes('тромбоциты') || name.includes('platelets') || name.includes('plt')) {
      labUpdates.platelets = value;
    } else if (name.includes('железо') || name.includes('iron') || name.includes('fe')) {
      labUpdates.serumIron = value;
    } else if (name.includes('холестерин') || name.includes('cholesterol') || name.includes('chol')) {
      labUpdates.cholesterol = value;
    } else if (name.includes('глюкоза') || name.includes('glucose') || name.includes('сахар') || name.includes('glu')) {
      labUpdates.bloodSugar = value;
    } else if (name.includes('лдг') || name.includes('ldh') || name.includes('лактатдегидрогеназа')) {
      labUpdates.ldh = value;
    }
  });

  if (Object.keys(labUpdates).length === 0) {
    return {};
  }

  const currentLabResults = healthProfile?.labResults || {};
  const updatedLabResults = {
    ...currentLabResults,
    ...labUpdates,
    lastUpdated: new Date().toISOString(),
    testDate: analysisData.testDate || new Date().toISOString().split('T')[0]
  };

  return {
    labResults: updatedLabResults
  };
};

export const getLabResultsStatus = (labResults: any) => {
  if (!labResults) return { total: 0, filled: 0, percentage: 0 };

  const fields = [
    'hemoglobin', 'erythrocytes', 'hematocrit', 'mcv', 'mchc', 
    'platelets', 'serumIron', 'cholesterol', 'bloodSugar', 'ldh'
  ];

  const filled = fields.filter(field => 
    labResults[field] !== undefined && labResults[field] !== null && labResults[field] !== ''
  ).length;

  return {
    total: fields.length,
    filled,
    percentage: Math.round((filled / fields.length) * 100)
  };
};
